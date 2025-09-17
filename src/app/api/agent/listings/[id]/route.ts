import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import mongoose from 'mongoose';

// DELETE - Delete a listing
export async function DELETE(
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
      return NextResponse.json({ error: 'Forbidden: You can only delete your own listings' }, { status: 403 });
    }

    // Delete the listing
    await Listing.findByIdAndDelete(id);

    // Decrement the listing count for the user
    const User = (await import('@/models/User')).default;
    await User.decrementListingCount(session.user.id);

    return NextResponse.json({ 
      message: 'Listing deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

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

    // Validate required fields
    if (!address || !listedPrice) {
      return NextResponse.json({ 
        error: 'Missing required fields: address, listedPrice' 
      }, { status: 400 });
    }

    // Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      {
        address: address.trim(),
        listedPrice: listedPrice.trim(),
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
