import mongoose, { Schema, Document } from 'mongoose';

export interface IBuyerCode extends Document {
  code: string;
  listingId: mongoose.Types.ObjectId;
  buyerName: string;
  buyerEmail: string;
  agentId: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  lastEmailSent?: Date;
}

const BuyerCodeSchema = new Schema<IBuyerCode>({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  listingId: {
    type: Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  buyerName: {
    type: String,
    required: true,
    trim: true
  },
  buyerEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  agentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  lastEmailSent: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
BuyerCodeSchema.index({ listingId: 1, agentId: 1 });
// Note: code field already has unique index from schema definition
BuyerCodeSchema.index({ buyerEmail: 1, listingId: 1 });
BuyerCodeSchema.index({ expiresAt: 1 });

// Method to check if code is expired
BuyerCodeSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Method to check if code is valid (active and not expired)
BuyerCodeSchema.methods.isValid = function() {
  return this.isActive && !this.isExpired();
};

// Static method to find valid code
BuyerCodeSchema.statics.findValidCode = function(code: string) {
  return this.findOne({
    code,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).populate('listingId');
};

// Static method to find codes for a listing
BuyerCodeSchema.statics.findByListing = function(listingId: string, agentId: string) {
  return this.find({
    listingId,
    agentId,
    isActive: true
  }).sort({ createdAt: -1 });
};

const BuyerCode = mongoose.models.BuyerCode || mongoose.model<IBuyerCode>('BuyerCode', BuyerCodeSchema);

export default BuyerCode;
