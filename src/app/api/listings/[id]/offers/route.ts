import { NextRequest, NextResponse } from 'next/server';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';

// Type for raw listing from MongoDB
interface RawListing {
  offers: Array<{
    amount: number;
    submittedAt: Date;
    status: string;
    [key: string]: unknown;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Connect to MongoDB
    await cachedMongooseConnection;

    // Find the listing and get its offers
    const listing = await Listing.findById(id)
      .select('offers')
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
    const liveOfferAmounts = liveOffers.map(offer => offer.amount);

    return NextResponse.json({ 
      offers: sortedOffers, // Return all offers for display purposes
      totalOffers: liveOffers.length, // Only count live offers
      highestOffer: liveOfferAmounts.length > 0 
        ? Math.max(...liveOfferAmounts)
        : 0
    });

  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
