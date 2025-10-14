import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; offerId: string }> }
) {
  try {
    const { id, offerId } = await params;
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    // Parse the request body
    const body = await request.json();
    const { status, counterOffer, notes } = body;

    // Validate status
    const validStatuses = ['submitted', 'accepted', 'rejected', 'countered', 'withdrawn'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      }, { status: 400 });
    }

    // Find the listing
    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Check if the current user can manage offers for this listing
    let canManageOffers = false;
    
    // User is the agent who owns this listing
    if (listing.agentId.toString() === session.user.id) {
      canManageOffers = true;
    }
    // User is a real estate admin who manages the agent who owns this listing
    else if (session.user.role === 'real_estate_admin') {
      const agent = await User.findOne({
        _id: listing.agentId,
        role: 'agent',
        realEstateAdminId: new mongoose.Types.ObjectId(session.user.id)
      });
      canManageOffers = !!agent;
    }
    // User is a super admin
    else if (session.user.role === 'admin') {
      canManageOffers = true;
    }
    
    if (!canManageOffers) {
      return NextResponse.json({ error: 'Unauthorized: You can only manage offers for your own listings or listings from agents you manage' }, { status: 403 });
    }

    // Find the offer
    const offerIndex = listing.offers.findIndex((offer: { id: string }) => offer.id === offerId);
    if (offerIndex === -1) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Update the offer
    listing.offers[offerIndex].status = status;
    
    if (counterOffer) {
      listing.offers[offerIndex].counterOffer = counterOffer;
    }
    
    if (notes) {
      listing.offers[offerIndex].agentNotes = notes;
    }

    // Add timestamp for status change
    listing.offers[offerIndex].statusUpdatedAt = new Date();
    listing.offers[offerIndex].updatedBy = session.user?.email;

    // If offer is accepted, update listing status
    if (status === 'accepted') {
      listing.status = 'sold';
    }

    await listing.save();

    return NextResponse.json({ 
      message: 'Offer status updated successfully',
      offer: listing.offers[offerIndex]
    });

  } catch {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; offerId: string }> }
) {
  try {
    const { id, offerId } = await params;
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    // Find the listing
    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Check if the current user can manage offers for this listing
    let canManageOffers = false;
    
    // User is the agent who owns this listing
    if (listing.agentId.toString() === session.user.id) {
      canManageOffers = true;
    }
    // User is a real estate admin who manages the agent who owns this listing
    else if (session.user.role === 'real_estate_admin') {
      const agent = await User.findOne({
        _id: listing.agentId,
        role: 'agent',
        realEstateAdminId: new mongoose.Types.ObjectId(session.user.id)
      });
      canManageOffers = !!agent;
    }
    // User is a super admin
    else if (session.user.role === 'admin') {
      canManageOffers = true;
    }
    
    if (!canManageOffers) {
      return NextResponse.json({ error: 'Unauthorized: You can only manage offers for your own listings or listings from agents you manage' }, { status: 403 });
    }

    // Remove the offer
    const initialLength = listing.offers.length;
    listing.offers = listing.offers.filter((offer: { id: string }) => offer.id !== offerId);
    
    if (listing.offers.length === initialLength) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    await listing.save();

    return NextResponse.json({ 
      message: 'Offer deleted successfully'
    });

  } catch {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
