import { NextRequest, NextResponse } from 'next/server';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';

// Type for raw listing from MongoDB
interface RawListing {
  offers: Array<{
    amount: string;
    submittedAt: Date;
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

    // Sort offers by submission date (newest first)
    const sortedOffers = listing.offers
      .map(offer => ({
        ...offer,
        submittedAt: new Date(offer.submittedAt).toISOString()
      }))
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return NextResponse.json({ 
      offers: sortedOffers,
      totalOffers: sortedOffers.length,
      highestOffer: sortedOffers.length > 0 
        ? Math.max(...sortedOffers.map(offer => 
            parseInt(offer.amount.replace(/[£,]/g, ''))
          ))
        : 0
    });

  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
