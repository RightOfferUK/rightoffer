import { NextRequest, NextResponse } from 'next/server';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  try {
    const { offerId } = await params;

    // Connect to MongoDB
    await cachedMongooseConnection;

    // Parse the request body
    const body = await request.json();
    const { buyerEmail } = body;

    // Validate buyer email
    if (!buyerEmail) {
      return NextResponse.json({ 
        error: 'Buyer email is required' 
      }, { status: 400 });
    }

    // Find the listing with the offer
    const listing = await Listing.findOne({ 'offers.id': offerId });
    if (!listing) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Find the specific offer
    const offer = listing.offers.find((o: { id: string; [key: string]: unknown }) => o.id === offerId);
    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Verify buyer email matches
    if (offer.buyerEmail.toLowerCase() !== buyerEmail.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if offer can be withdrawn (only submitted or countered offers)
    if (!['submitted', 'countered'].includes(offer.status)) {
      return NextResponse.json({ 
        error: 'This offer cannot be withdrawn. Current status: ' + offer.status 
      }, { status: 400 });
    }

    // Update offer status to withdrawn directly
    try {
      
      // Find the offer index
      const offerIndex = listing.offers.findIndex((o: { id: string; [key: string]: unknown }) => o.id === offerId);
      if (offerIndex === -1) {
        return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
      }

      // Update the offer directly
      listing.offers[offerIndex].status = 'withdrawn';
      listing.offers[offerIndex].statusUpdatedAt = new Date();
      listing.offers[offerIndex].updatedBy = offer.buyerName;
      listing.offers[offerIndex].respondedAt = new Date();

      // Add to offer history
      if (!listing.offers[offerIndex].offerHistory) {
        listing.offers[offerIndex].offerHistory = [];
      }
      listing.offers[offerIndex].offerHistory.push({
        action: 'withdrawn',
        amount: offer.amount,
        timestamp: new Date(),
        updatedBy: offer.buyerName
      });

      await listing.save();

      return NextResponse.json({ 
        message: 'Offer withdrawn successfully',
        offer: offer,
        listingStatus: listing.status
      }, { status: 200 });

    } catch (updateError: unknown) {
      return NextResponse.json({ 
        error: updateError instanceof Error ? updateError.message : 'Failed to withdraw offer' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error withdrawing offer:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
