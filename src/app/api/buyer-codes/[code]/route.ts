import { NextRequest, NextResponse } from 'next/server';
import { cachedMongooseConnection } from '@/lib/db';
import BuyerCode from '@/models/BuyerCode';

// GET - Validate buyer code and return buyer details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    // Connect to MongoDB
    await cachedMongooseConnection;

    const { code } = await params;
    
    // Get listing ID from query parameter
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');

    // If listing ID is provided, validate that the code belongs to that listing
    const query: {
      code: string;
      isActive: boolean;
      expiresAt: { $gt: Date };
      listingId?: string;
    } = {
      code,
      isActive: true,
      expiresAt: { $gt: new Date() }
    };

    // CRITICAL SECURITY: If listingId is provided, ensure the code is only valid for that listing
    if (listingId) {
      query.listingId = listingId;
    }

    // Find valid buyer code (without populate to avoid schema dependency)
    const buyerCode = await BuyerCode.findOne(query);
    
    if (!buyerCode) {
      return NextResponse.json({ 
        error: listingId 
          ? 'This buyer code is not valid for this property' 
          : 'Invalid or expired buyer code',
        valid: false 
      }, { status: 404 });
    }

    // Return buyer details
    return NextResponse.json({ 
      valid: true,
      buyerCode: {
        _id: buyerCode._id.toString(),
        code: buyerCode.code,
        buyerName: buyerCode.buyerName,
        buyerEmail: buyerCode.buyerEmail,
        listingId: buyerCode.listingId.toString(),
        expiresAt: buyerCode.expiresAt.toISOString(),
        daysUntilExpiry: Math.ceil((buyerCode.expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      }
    });

  } catch (error) {
    console.error('Error validating buyer code:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      valid: false 
    }, { status: 500 });
  }
}
