import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';

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
    const validStatuses = ['submitted', 'verified', 'countered', 'pending verification', 'accepted', 'declined'];
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

    // Check if user is authorized (must be the agent who owns the listing)
    if (listing.agentId !== session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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

  } catch (error) {
    console.error('Error updating offer status:', error);
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

    // Check if user is authorized (must be the agent who owns the listing)
    if (listing.agentId !== session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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

  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
