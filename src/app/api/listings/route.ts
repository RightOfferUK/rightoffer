import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import { sendSellerCodeEmail } from '@/lib/resend';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

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
      agentId: session.user.id,
      status: 'live'
    });

    // Save to database
    await listing.save();

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

    // Get agent's listings
    const listings = await Listing.find({ agentId: session.user.id })
      .select('-sellerCode') // Exclude seller code from agent view
      .sort({ createdAt: -1 });

    return NextResponse.json({ listings });

  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' }, 
      { status: 500 }
    );
  }
}
