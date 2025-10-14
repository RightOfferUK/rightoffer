import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import BuyerCode from '@/models/BuyerCode';
import mongoose from 'mongoose';

// GET - Get all buyer codes for a listing
export async function GET(
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

    // Check if the current user can access this listing's buyer codes
    let canAccess = false;
    
    // User is the agent who owns this listing
    if (listing.agentId.toString() === session.user.id) {
      canAccess = true;
    }
    // User is a real estate admin who manages the agent who owns this listing
    else if (session.user.role === 'real_estate_admin') {
      const { default: User } = await import('@/models/User');
      const agent = await User.findOne({
        _id: listing.agentId,
        role: 'agent',
        realEstateAdminId: new mongoose.Types.ObjectId(session.user.id)
      });
      canAccess = !!agent;
    }
    // User is a super admin
    else if (session.user.role === 'admin') {
      canAccess = true;
    }
    
    if (!canAccess) {
      return NextResponse.json({ error: 'Forbidden: You can only view buyer codes for your own listings or listings from agents you manage' }, { status: 403 });
    }

    // Get all active buyer codes for this listing
    const buyerCodes = await (BuyerCode as unknown as { findByListing: (listingId: string, agentId: string) => Promise<Array<{
      _id: { toString: () => string };
      code: string;
      buyerName: string;
      buyerEmail: string;
      isActive: boolean;
      isExpired: () => boolean;
      isValid: () => boolean;
      expiresAt: Date;
      createdAt: Date;
      lastEmailSent?: Date;
    }>> }).findByListing(id, session.user.id);

    // Transform the data for the frontend
    const transformedCodes = buyerCodes.map(code => ({
      _id: code._id.toString(),
      code: code.code,
      buyerName: code.buyerName,
      buyerEmail: code.buyerEmail,
      isActive: code.isActive,
      isExpired: code.isExpired(),
      isValid: code.isValid(),
      expiresAt: code.expiresAt.toISOString(),
      createdAt: code.createdAt.toISOString(),
      lastEmailSent: code.lastEmailSent?.toISOString() || null,
      daysUntilExpiry: Math.ceil((code.expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    }));

    return NextResponse.json({ 
      success: true,
      buyerCodes: transformedCodes,
      total: transformedCodes.length
    });

  } catch (error) {
    console.error('Error fetching buyer codes:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
