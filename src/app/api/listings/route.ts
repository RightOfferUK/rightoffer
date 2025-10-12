import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import { sendSellerCodeEmail } from '@/lib/resend';
import { parsePrice } from '@/lib/priceUtils';
import mongoose from 'mongoose';

// Type for raw offer from MongoDB
interface RawOffer {
  _id?: mongoose.Types.ObjectId;
  submittedAt?: Date;
  statusUpdatedAt?: Date;
  [key: string]: unknown;
}

// Type for raw listing from MongoDB
interface RawListing {
  _id: mongoose.Types.ObjectId;
  agentId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  offers?: RawOffer[];
  [key: string]: unknown;
}

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
    const { default: User } = await import('@/models/User');

    // Check if user can create listings
    const canCreate = await (User as unknown as { canCreateListing: (userId: string) => Promise<{ canCreate: boolean; reason?: string }> }).canCreateListing(session.user.id);
    if (!canCreate.canCreate) {
      return NextResponse.json(
        { error: canCreate.reason || 'Cannot create listing' }, 
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { address, sellerName, sellerEmail, listedPrice, mainPhoto } = body;

    // Convert price to number if it's a string
    const priceNumber = typeof listedPrice === 'string' ? parsePrice(listedPrice) : listedPrice;

    // Validate required fields
    if (!address || !sellerName || !sellerEmail || !priceNumber || priceNumber <= 0 || !mainPhoto) {
      return NextResponse.json(
        { error: 'Missing required fields: address, sellerName, sellerEmail, listedPrice (must be > 0), and mainPhoto are all required' }, 
        { status: 400 }
      );
    }

    // Create new listing
    const listing = new Listing({
      address,
      sellerName,
      sellerEmail,
      listedPrice: priceNumber,
      mainPhoto: mainPhoto,
      agentId: new mongoose.Types.ObjectId(session.user.id),
      status: 'live'
    });

    // Save to database
    await listing.save();

    // Increment the listing count for the user/company
    await (User as unknown as { incrementListingCount: (userId: string) => Promise<void> }).incrementListingCount(session.user.id);

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

export async function GET() {
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
          .sort({ createdAt: -1 })
          .lean();
        break;
      
      case 'real_estate_admin':
        // Real estate admin can see listings from their agents
        const { default: User } = await import('@/models/User');
        const agents = await User.find({ 
          realEstateAdminId: new mongoose.Types.ObjectId(session.user.id),
          role: 'agent' 
        });
        const agentIds = agents.map(agent => agent._id.toString());
        
        listings = await Listing.find({ agentId: { $in: agentIds } })
          .select('-sellerCode')
          .sort({ createdAt: -1 })
          .lean();
        break;
      
      case 'agent':
      default:
        // Agent can only see their own listings
        listings = await Listing.find({ agentId: new mongoose.Types.ObjectId(session.user.id) })
          .select('-sellerCode')
          .sort({ createdAt: -1 })
          .lean();
        break;
    }

    // Serialize listings for client components
    const serializedListings = (listings as unknown as RawListing[]).map((listing: RawListing) => ({
      ...listing,
      _id: listing._id.toString(),
      agentId: listing.agentId.toString(),
      createdAt: new Date(listing.createdAt).toISOString(),
      updatedAt: new Date(listing.updatedAt).toISOString(),
      offers: listing.offers?.map((offer: RawOffer) => ({
        ...offer,
        _id: offer._id?.toString(),
        submittedAt: offer.submittedAt ? new Date(offer.submittedAt).toISOString() : undefined,
        statusUpdatedAt: offer.statusUpdatedAt ? new Date(offer.statusUpdatedAt).toISOString() : undefined
      })) || [],
      __v: undefined
    }));

    return NextResponse.json({ listings: serializedListings });

  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' }, 
      { status: 500 }
    );
  }
}
