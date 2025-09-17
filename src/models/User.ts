import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'admin' | 'real_estate_admin' | 'agent';

export interface IUser extends Document {
  email: string;
  name?: string;
  role: UserRole;
  isActive: boolean;
  
  // For real_estate_admin - property limits and company info
  companyName?: string;
  maxListings?: number;
  usedListings: number;
  
  // For agent - reference to their real estate admin
  realEstateAdminId?: mongoose.Types.ObjectId;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy?: mongoose.Types.ObjectId; // Who created this user (admin or real_estate_admin)
}

export interface IUserModel extends mongoose.Model<IUser> {
  canCreateListing(userId: string): Promise<{ canCreate: boolean; reason?: string }>;
  incrementListingCount(userId: string): Promise<void>;
  decrementListingCount(userId: string): Promise<void>;
  updateRealEstateAdminUsedListings(realEstateAdminId: string): Promise<void>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'real_estate_admin', 'agent'],
    required: true,
    default: 'agent'
  },
  isActive: {
    type: Boolean,
    default: function() {
      return this.role === 'agent';
    }
  },
  
  // Real estate admin specific fields
  companyName: {
    type: String,
    trim: true,
    required: function() {
      return this.role === 'real_estate_admin';
    }
  },
  maxListings: {
    type: Number,
    default: 0,
    min: 0,
    required: function() {
      return this.role === 'real_estate_admin';
    }
  },
  usedListings: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Agent specific fields
  realEstateAdminId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.role === 'agent';
    },
    validate: {
      validator: async function(value: mongoose.Types.ObjectId) {
        if (this.role !== 'agent') return true;
        
        const admin = await mongoose.models.User.findById(value);
        return admin && admin.role === 'real_estate_admin';
      },
      message: 'Invalid real estate admin reference'
    }
  },
  
  // Metadata
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
UserSchema.index({ role: 1, isActive: 1 });
UserSchema.index({ realEstateAdminId: 1 }); // For agents under a real estate admin
UserSchema.index({ createdBy: 1 }); // For tracking who created users

// Middleware to validate role-specific requirements
UserSchema.pre('save', function(next) {
  // Ensure admin role doesn't have real estate admin specific fields
  if (this.role === 'admin') {
    this.companyName = undefined;
    this.maxListings = undefined;
    this.usedListings = 0;
    this.realEstateAdminId = undefined;
  }
  
  // Ensure agents don't have real estate admin specific fields
  if (this.role === 'agent') {
    this.companyName = undefined;
    this.maxListings = undefined;
    this.usedListings = 0;
  }
  
  // Ensure real estate admins don't have agent specific fields
  if (this.role === 'real_estate_admin') {
    this.realEstateAdminId = undefined;
  }
  
  next();
});

// Static method to check if user can create listings
UserSchema.statics.canCreateListing = async function(userId: string): Promise<{ canCreate: boolean; reason?: string }> {
  const user = await this.findById(userId);
  
  if (!user) {
    return { canCreate: false, reason: 'User not found' };
  }
  
  // Only check isActive for agents
  if (user.role === 'agent' && !user.isActive) {
    return { canCreate: false, reason: 'Agent account is inactive' };
  }
  
  if (user.role === 'admin') {
    return { canCreate: true };
  }
  
  if (user.role === 'agent') {
    // Check if their real estate admin has available listings
    const admin = await this.findById(user.realEstateAdminId);
    if (!admin) {
      return { canCreate: false, reason: 'Real estate admin not found' };
    }
    
    if (admin.usedListings >= admin.maxListings) {
      return { canCreate: false, reason: 'Real estate admin has reached listing limit' };
    }
    
    return { canCreate: true };
  }
  
  if (user.role === 'real_estate_admin') {
    if (user.usedListings >= (user.maxListings || 0)) {
      return { canCreate: false, reason: 'Listing limit reached' };
    }
    
    return { canCreate: true };
  }
  
  return { canCreate: false, reason: 'Invalid user role' };
};

// Static method to increment listing count
UserSchema.statics.incrementListingCount = async function(userId: string): Promise<void> {
  const user = await this.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.role === 'agent') {
    // Increment the agent's count
    await this.findByIdAndUpdate(
      userId,
      { $inc: { usedListings: 1 } }
    );
    
    // Update the real estate admin's total
    await (this as IUserModel).updateRealEstateAdminUsedListings(user.realEstateAdminId);
  } else if (user.role === 'real_estate_admin') {
    // Increment their own count
    await this.findByIdAndUpdate(
      userId,
      { $inc: { usedListings: 1 } }
    );
  }
  // Admin role doesn't have listing limits
};

// Static method to decrement listing count
UserSchema.statics.decrementListingCount = async function(userId: string): Promise<void> {
  const user = await this.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.role === 'agent') {
    // Decrement the agent's count
    const currentUsedListings = user.usedListings || 0;
    await this.findByIdAndUpdate(
      userId,
      { $set: { usedListings: Math.max(0, currentUsedListings - 1) } }
    );
    // Update the real estate admin's total
    await (this as IUserModel).updateRealEstateAdminUsedListings(user.realEstateAdminId);
  } else if (user.role === 'real_estate_admin') {
    // Decrement their own count
    const currentUsedListings = user.usedListings || 0;
    await this.findByIdAndUpdate(
      userId,
      { $set: { usedListings: Math.max(0, currentUsedListings - 1) } }
    );
  }
  // Admin role doesn't have listing limits
};

// Static method to update real estate admin's usedListings based on agents
UserSchema.statics.updateRealEstateAdminUsedListings = async function(realEstateAdminId: string): Promise<void> {
  const agents = await this.find({ 
    realEstateAdminId: new mongoose.Types.ObjectId(realEstateAdminId),
    role: 'agent' 
  });
  
  const totalUsedListings = agents.reduce((sum: number, agent: any) => sum + (agent.usedListings || 0), 0);
  
  await this.findByIdAndUpdate(
    realEstateAdminId,
    { usedListings: totalUsedListings }
  );
};


const User = mongoose.models.User || mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;

