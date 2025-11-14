import { NextRequest, NextResponse } from 'next/server';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; offerId: string }> }
) {
  try {
    const { id, offerId } = await params;

    // Connect to MongoDB
    await cachedMongooseConnection;

    // Parse the request body
    const body = await request.json();
    const { status, counterOffer, notes, sellerCode } = body;

    // Validate seller code is provided
    if (!sellerCode) {
      return NextResponse.json({ error: 'Seller code is required' }, { status: 400 });
    }

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

    // Verify seller code
    if (listing.sellerCode.toUpperCase() !== sellerCode.toUpperCase()) {
      return NextResponse.json({ error: 'Invalid seller code' }, { status: 403 });
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
    listing.offers[offerIndex].updatedBy = listing.sellerEmail;

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

