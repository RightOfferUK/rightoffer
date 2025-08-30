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
    type: String,
    required: true
  },
  mainPhoto: {
    type: String,
    default: ''
  },
  sellerCode: {
    type: String,
    unique: true,
    default: function() {
      return generateSellerCode();
    }
  },
  agentId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'live', 'under-offer', 'sold', 'withdrawn'],
    default: 'live'
  },
  offers: [{
    id: String,
    buyerName: String,
    buyerEmail: String,
    amount: String,
    status: {
      type: String,
      enum: ['submitted', 'verified', 'countered', 'pending verification', 'accepted', 'declined'],
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
    counterOffer: String,
    agentNotes: String,
    statusUpdatedAt: Date,
    updatedBy: String
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
    let code;
    let isUnique = false;
    
    while (!isUnique) {
      code = generateSellerCode();
      // Check if this code already exists
      const existing = await mongoose.models.Listing?.findOne({ sellerCode: code });
      if (!existing) {
        isUnique = true;
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

export default mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
