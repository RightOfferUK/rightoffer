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

    // Check if the current user is the agent who owns this listing
    if (listing.agentId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only view your own listing buyer codes' }, { status: 403 });
    }

    // Get all active buyer codes for this listing
    const buyerCodes = await BuyerCode.findByListing(id, session.user.id);

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
