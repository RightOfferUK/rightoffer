import { NextRequest, NextResponse } from 'next/server';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';

// Type for raw listing from MongoDB
interface RawListing {
  offers: Array<{
    amount: number;
    status: string;
    counterOffer?: number;
    submittedAt: Date;
    [key: string]: unknown;
  }>;
  status: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Connect to MongoDB
    await cachedMongooseConnection;

    // Find the listing and get its offers and status
    const listing = await Listing.findById(id)
      .select('offers status')
      .lean() as unknown as RawListing | null;

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Sort offers by submission date (newest first) and serialize ObjectIds
    const sortedOffers = listing.offers
      .map(offer => ({
        ...offer,
        submittedAt: new Date(offer.submittedAt).toISOString(),
        // Convert offerHistory ObjectIds to strings
        offerHistory: Array.isArray(offer.offerHistory) ? offer.offerHistory.map((history: { _id?: unknown; timestamp?: Date; [key: string]: unknown }) => ({
          ...history,
          _id: history._id?.toString(),
          timestamp: history.timestamp ? new Date(history.timestamp).toISOString() : new Date().toISOString()
        })) : []
      }))
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    // Filter out withdrawn offers for live offer calculations
    const liveOffers = sortedOffers.filter(offer => offer.status !== 'withdrawn');
    
    // Calculate highest offer/sold price properly
    // If an offer is accepted with a counter offer, use the counter offer amount
    let highestOffer = 0;
    if (liveOffers.length > 0) {
      const acceptedOffer = liveOffers.find(offer => offer.status === 'accepted');
      
      if (acceptedOffer) {
        // If there's an accepted offer, that's the sold price (counter offer or original amount)
        highestOffer = acceptedOffer.counterOffer || acceptedOffer.amount;
      } else {
        // Otherwise, show the highest offer amount (considering counter offers)
        highestOffer = Math.max(...liveOffers.map(offer => {
          // For countered offers, show the counter amount
          if (offer.status === 'countered' && offer.counterOffer) {
            return offer.counterOffer;
          }
          return offer.amount;
        }));
      }
    }

    return NextResponse.json({ 
      offers: sortedOffers, // Return all offers for display purposes
      totalOffers: liveOffers.length, // Only count live offers
      highestOffer,
      listingStatus: listing.status // Include listing status so frontend can update it
    });

  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
