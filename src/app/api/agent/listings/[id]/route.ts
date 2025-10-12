import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import { parsePrice } from '@/lib/priceUtils';


// PATCH - Update listing details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    const { id } = await params;

    // Get the listing to check ownership
    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Check if the current user is the agent who owns this listing
    if (listing.agentId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only edit your own listings' }, { status: 403 });
    }

    // Parse the request body
    const body = await request.json();
    const { address, listedPrice } = body;

    // Convert price to number if it's a string
    const priceNumber = typeof listedPrice === 'string' ? parsePrice(listedPrice) : listedPrice;

    // Validate required fields
    if (!address || !priceNumber || priceNumber <= 0) {
      return NextResponse.json({ 
        error: 'Missing required fields: address, listedPrice (must be > 0)' 
      }, { status: 400 });
    }

    // Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      {
        address: address.trim(),
        listedPrice: priceNumber,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedListing) {
      return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Listing updated successfully',
      listing: {
        _id: updatedListing._id.toString(),
        address: updatedListing.address,
        listedPrice: updatedListing.listedPrice,
        updatedAt: updatedListing.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
