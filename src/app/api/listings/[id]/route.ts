import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import mongoose from 'mongoose';

// Type for the minimal listing data we need
interface MinimalListing {
  _id: mongoose.Types.ObjectId;
  address: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to MongoDB
    await cachedMongooseConnection;

    const { id } = await params;

    // Find listing by ID (minimal data for existence check)
    const listing = await Listing.findById(id)
      .select('_id address')
      .lean() as MinimalListing | null;

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      exists: true,
      id: listing._id.toString(),
      address: listing.address
    });

  } catch (error) {
    console.error('Error checking listing:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function PUT(
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

    // Check if the current user can edit this listing
    let canEdit = false;
    
    // User is the agent who owns this listing
    if (listing.agentId.toString() === session.user.id) {
      canEdit = true;
    }
    // User is a real estate admin who manages the agent who owns this listing
    else if (session.user.role === 'real_estate_admin') {
      const { default: User } = await import('@/models/User');
      const agent = await User.findOne({
        _id: listing.agentId,
        role: 'agent',
        realEstateAdminId: new mongoose.Types.ObjectId(session.user.id)
      });
      canEdit = !!agent;
    }
    // User is a super admin
    else if (session.user.role === 'admin') {
      canEdit = true;
    }
    
    if (!canEdit) {
      return NextResponse.json({ error: 'Forbidden: You can only edit your own listings or listings from agents you manage' }, { status: 403 });
    }

    // Parse the request body
    const body = await request.json();
    const {
      address,
      sellerName,
      sellerEmail,
      listedPrice,
      mainPhoto,
      status
    } = body;

    // Validate required fields
    if (!address?.trim() || !sellerName?.trim() || !sellerEmail?.trim() || !listedPrice) {
      return NextResponse.json({ 
        error: 'Missing required fields: address, sellerName, sellerEmail, listedPrice' 
      }, { status: 400 });
    }

    // Ensure mainPhoto has a default value if not provided
    const photoUrl = mainPhoto?.trim() || listing.mainPhoto || '';

    // Validate status
    const validStatuses = ['live', 'archive', 'sold'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      }, { status: 400 });
    }

    // Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      {
        address: address.trim(),
        sellerName: sellerName.trim(),
        sellerEmail: sellerEmail.trim().toLowerCase(),
        listedPrice: typeof listedPrice === 'string' ? listedPrice.trim() : listedPrice.toString(),
        mainPhoto: photoUrl,
        status: status || listing.status,
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
        sellerName: updatedListing.sellerName,
        sellerEmail: updatedListing.sellerEmail,
        listedPrice: updatedListing.listedPrice,
        mainPhoto: updatedListing.mainPhoto,
        status: updatedListing.status,
        sellerCode: updatedListing.sellerCode,
        updatedAt: updatedListing.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating listing:', error);
    
    // Handle validation errors specifically
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ 
        error: 'Validation failed: ' + error.message 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
