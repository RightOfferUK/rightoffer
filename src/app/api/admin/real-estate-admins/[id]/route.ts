import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    const { id } = await params;

    // Parse request body
    const body = await request.json();
    const { maxListings, companyName, name, email } = body;

    // Find the real estate admin
    const admin = await User.findById(id);
    if (!admin || admin.role !== 'real_estate_admin') {
      return NextResponse.json({ error: 'Real estate admin not found' }, { status: 404 });
    }

    // Update fields
    const updateData: Record<string, string | number> = {};
    if (maxListings !== undefined) updateData.maxListings = parseInt(maxListings);
    if (companyName !== undefined) updateData.companyName = companyName;
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) {
      // Check if email is already in use by another user
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: id }
      });
      if (existingUser) {
        return NextResponse.json({ 
          error: 'Email is already in use by another user' 
        }, { status: 409 });
      }
      updateData.email = email.toLowerCase();
    }

    const updatedAdmin = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return NextResponse.json({ 
      message: 'Real estate admin updated successfully',
      admin: updatedAdmin
    });

  } catch (error) {
    console.error('Error updating real estate admin:', error);
    return NextResponse.json(
      { error: 'Failed to update real estate admin' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    const { id } = await params;

    // Find the real estate admin
    const admin = await User.findById(id);
    if (!admin || admin.role !== 'real_estate_admin') {
      return NextResponse.json({ error: 'Real estate admin not found' }, { status: 404 });
    }

    // Get all agents under this real estate admin
    const agents = await User.find({ 
      realEstateAdminId: new mongoose.Types.ObjectId(id),
      role: 'agent' 
    });

    // Get all listings created by these agents
    const agentIds = agents.map(agent => agent._id);
    const Listing = (await import('@/models/Listing')).default;
    const listings = await Listing.find({ agentId: { $in: agentIds } });

    // Get all buyer codes for these listings
    const BuyerCode = (await import('@/models/BuyerCode')).default;
    const listingIds = listings.map(listing => listing._id);
    const buyerCodes = await BuyerCode.find({ listingId: { $in: listingIds } });

    // Note: Offer model doesn't exist yet, so we'll skip offer deletion for now
    // This can be added later when the Offer model is created
    
    if (buyerCodes.length > 0) {
      await BuyerCode.deleteMany({ listingId: { $in: listingIds } });
    }
    
    if (listings.length > 0) {
      await Listing.deleteMany({ agentId: { $in: agentIds } });
    }
    
    if (agents.length > 0) {
      await User.deleteMany({ realEstateAdminId: new mongoose.Types.ObjectId(id), role: 'agent' });
    }

    // Finally, delete the real estate admin
    await User.findByIdAndDelete(id);

    return NextResponse.json({ 
      message: `Real estate admin deleted successfully. Removed ${agents.length} agents, ${listings.length} listings, and ${buyerCodes.length} buyer codes.`
    });

  } catch (error) {
    console.error('Error deleting real estate admin:', error);
    return NextResponse.json(
      { error: 'Failed to delete real estate admin' }, 
      { status: 500 }
    );
  }
}
