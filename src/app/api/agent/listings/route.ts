import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import mongoose from 'mongoose';

// Type for raw listing from MongoDB
interface RawListing {
  _id: mongoose.Types.ObjectId;
  address: string;
  sellerName: string;
  sellerEmail: string;
  listedPrice: number;
  status: string;
  offers?: Array<{ amount: number; [key: string]: unknown }>;
  createdAt: Date;
  updatedAt: Date;
  sellerCode: string;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build query
    const query: Record<string, unknown> = { agentId: new mongoose.Types.ObjectId(session.user.id) };
    
    if (status && status !== 'All') {
      if (status === 'With offers') {
        query['offers.0'] = { $exists: true }; // Has at least one offer
      } else {
        query.status = status.toLowerCase();
      }
    }

    // Find listings
    let listings = await Listing.find(query)
      .select('address sellerName sellerEmail listedPrice status offers createdAt updatedAt sellerCode')
      .sort({ updatedAt: -1 })
      .lean() as unknown as RawListing[];

    // Apply search filter if provided
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase();
      listings = listings.filter((listing: RawListing) => 
        listing.address.toLowerCase().includes(searchTerm) ||
        listing.sellerName.toLowerCase().includes(searchTerm)
      );
    }

    // Transform data for frontend
    const transformedListings = listings.map((listing: RawListing) => {
      const offersCount = listing.offers?.length || 0;
      const topOffer = offersCount > 0 
        ? Math.max(...(listing.offers || []).map((offer: { amount: number }) => offer.amount))
        : 0;

      return {
        _id: listing._id.toString(),
        address: listing.address,
        status: listing.status.charAt(0).toUpperCase() + listing.status.slice(1),
        offers: offersCount,
        topOffer: topOffer > 0 ? `£${topOffer.toLocaleString()}` : '-',
        owner: listing.sellerName,
        sellerCode: listing.sellerCode,
        listedPrice: listing.listedPrice,
        createdAt: new Date(listing.createdAt).toISOString()
      };
    });

    return NextResponse.json({ listings: transformedListings });

  } catch (error) {
    console.error('Error fetching agent listings:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
