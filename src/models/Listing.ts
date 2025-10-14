import mongoose from 'mongoose';

// Helper function to generate seller code
function generateSellerCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const ListingSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    trim: true
  },
  sellerName: {
    type: String,
    required: true,
    trim: true
  },
  sellerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  listedPrice: {
    type: Number,
    required: true,
    min: 0
  },
  mainPhoto: {
    type: String,
    required: true
  },
  sellerCode: {
    type: String,
    unique: true,
    default: function() {
      return generateSellerCode();
    }
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['live', 'archive', 'sold'],
    default: 'live'
  },
  offers: [{
    id: String,
    buyerName: String,
    buyerEmail: String,
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['submitted', 'accepted', 'rejected', 'countered', 'withdrawn'],
      default: 'submitted'
    },
    fundingType: {
      type: String,
      enum: ['Cash', 'Mortgage', 'Chain']
    },
    chain: Boolean,
    aipPresent: Boolean,
    submittedAt: {
      type: Date,
      default: Date.now
    },
    notes: String,
    counterOffer: {
      type: Number,
      min: 0
    },
    counterOfferNotes: String,
    agentNotes: String,
    statusUpdatedAt: Date,
    updatedBy: String,
    respondedAt: Date,
    // Track who made the counter offer (seller or agent)
    counterOfferBy: {
      type: String,
      enum: ['seller', 'agent']
    },
    // Track offer history for audit trail
    offerHistory: [{
      action: {
        type: String,
        enum: ['submitted', 'accepted', 'rejected', 'countered', 'withdrawn']
      },
      amount: Number,
      counterAmount: Number,
      notes: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      updatedBy: String
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate seller code before saving (ensure uniqueness)
ListingSchema.pre('save', async function(next) {
  if (this.isNew && !this.sellerCode) {
    // Generate a unique 8-character seller code
    let code: string = generateSellerCode();
    let isUnique = false;
    
    while (!isUnique) {
      // Check if this code already exists
      const existing = await mongoose.models.Listing?.findOne({ sellerCode: code });
      if (!existing) {
        isUnique = true;
      } else {
        code = generateSellerCode();
      }
    }
    
    this.sellerCode = code;
  }
  next();
});

// Indexes for performance (sellerCode already has unique index from schema)
ListingSchema.index({ agentId: 1 });
ListingSchema.index({ status: 1 });
ListingSchema.index({ createdAt: -1 });
ListingSchema.index({ 'offers.buyerEmail': 1, 'offers.status': 1 });

// Method to check if buyer has pending offer
ListingSchema.methods.hasPendingOffer = function(buyerEmail: string): boolean {
  return this.offers.some((offer: { buyerEmail: string; status: string }) => 
    offer.buyerEmail.toLowerCase() === buyerEmail.toLowerCase() && 
    ['submitted', 'countered'].includes(offer.status)
  );
};

// Method to find active offer by buyer
ListingSchema.methods.findActiveOfferByBuyer = function(buyerEmail: string) {
  return this.offers.find((offer: { buyerEmail: string; status: string }) => 
    offer.buyerEmail.toLowerCase() === buyerEmail.toLowerCase() && 
    ['submitted', 'countered'].includes(offer.status)
  );
};

// Method to add offer history entry
ListingSchema.methods.addOfferHistory = function(offerId: string, action: string, amount: number, counterAmount?: number, notes?: string, updatedBy?: string) {
  const offer = this.offers.find((o: { id: string; [key: string]: unknown }) => o.id === offerId);
  if (offer) {
    offer.offerHistory = offer.offerHistory || [];
    offer.offerHistory.push({
      action,
      amount,
      counterAmount,
      notes,
      updatedBy,
      timestamp: new Date()
    });
  }
};

// Method to update offer status with validation
ListingSchema.methods.updateOfferStatus = function(offerId: string, newStatus: string, updatedBy: string, counterAmount?: number, counterNotes?: string) {
  const offer = this.offers.find((o: { id: string; [key: string]: unknown }) => o.id === offerId);
  if (!offer) {
    throw new Error('Offer not found');
  }

  // Validate status transition
  const validTransitions: { [key: string]: string[] } = {
    'submitted': ['accepted', 'rejected', 'countered', 'withdrawn'],
    'countered': ['accepted', 'rejected', 'countered', 'withdrawn'],
    'accepted': [], // Final state
    'rejected': [], // Final state
    'withdrawn': [] // Final state
  };

  if (!validTransitions[offer.status]?.includes(newStatus)) {
    throw new Error(`Invalid status transition from ${offer.status} to ${newStatus}`);
  }

  // Update offer
  const oldStatus = offer.status;
  offer.status = newStatus;
  offer.statusUpdatedAt = new Date();
  offer.updatedBy = updatedBy;
  offer.respondedAt = new Date();

  if (newStatus === 'countered' && counterAmount) {
    offer.counterOffer = counterAmount;
    offer.counterOfferNotes = counterNotes;
  }

  // Add to history
  this.addOfferHistory(offerId, newStatus, offer.amount, counterAmount, counterNotes, updatedBy);

  // If offer is accepted, mark property as sold
  if (newStatus === 'accepted') {
    this.status = 'sold';
  }

  return { oldStatus, newStatus };
};

export default mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
