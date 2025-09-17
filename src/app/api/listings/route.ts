import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import { sendSellerCodeEmail } from '@/lib/resend';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    // Import User model for listing limits
    const User = (await import('@/models/User')).default;

    // Check if user can create listings
    const canCreate = await User.canCreateListing(session.user.id);
    if (!canCreate.canCreate) {
      return NextResponse.json(
        { error: canCreate.reason || 'Cannot create listing' }, 
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { address, sellerName, sellerEmail, listedPrice, mainPhoto } = body;

    // Validate required fields
    if (!address || !sellerName || !sellerEmail || !listedPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Create new listing
    const listing = new Listing({
      address,
      sellerName,
      sellerEmail,
      listedPrice,
      mainPhoto: mainPhoto || '',
      agentId: new mongoose.Types.ObjectId(session.user.id),
      status: 'live'
    });

    // Save to database
    await listing.save();

    // Increment the listing count for the user/company
    await User.incrementListingCount(session.user.id);

    // Return listing data (without seller code for agent)
    const listingResponse = {
      id: listing._id,
      address: listing.address,
      sellerName: listing.sellerName,
      sellerEmail: listing.sellerEmail,
      listedPrice: listing.listedPrice,
      mainPhoto: listing.mainPhoto,
      status: listing.status,
      views: listing.views,
      enquiries: listing.enquiries,
      offers: listing.offers,
      createdAt: listing.createdAt
      // Note: sellerCode is intentionally omitted for agent security
    };

    // Send seller code via email to seller
    try {
      await sendSellerCodeEmail(
        listing.sellerName,
        listing.sellerEmail,
        listing.sellerCode,
        listing.address,
        listing._id.toString()
      );
      console.log('Seller code email sent successfully to:', listing.sellerEmail);
    } catch (emailError) {
      console.error('Failed to send seller code email:', emailError);
      // Don't fail the listing creation if email fails
    }

    return NextResponse.json({
      success: true,
      listing: listingResponse,
      message: 'Listing created successfully. Seller code has been sent to the seller\'s email.'
    });

  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' }, 
      { status: 500 }
    );
  }
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

    let listings;

    // Role-based listing access
    switch (session.user.role) {
      case 'admin':
        // Admin can see all listings
        listings = await Listing.find({})
          .select('-sellerCode')
          .sort({ createdAt: -1 });
        break;
      
      case 'real_estate_admin':
        // Real estate admin can see listings from their agents
        const User = (await import('@/models/User')).default;
        const mongoose = (await import('mongoose')).default;
        const agents = await User.find({ 
          realEstateAdminId: new mongoose.Types.ObjectId(session.user.id),
          role: 'agent' 
        });
        const agentIds = agents.map(agent => agent._id.toString());
        
        listings = await Listing.find({ agentId: { $in: agentIds } })
          .select('-sellerCode')
          .sort({ createdAt: -1 });
        break;
      
      case 'agent':
      default:
        // Agent can only see their own listings
        listings = await Listing.find({ agentId: new mongoose.Types.ObjectId(session.user.id) })
          .select('-sellerCode')
          .sort({ createdAt: -1 });
        break;
    }

    return NextResponse.json({ listings });

  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' }, 
      { status: 500 }
    );
  }
}
