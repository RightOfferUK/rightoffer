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

    // Find valid buyer code (without populate to avoid schema dependency)
    const buyerCode = await BuyerCode.findOne({
      code,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });
    
    if (!buyerCode) {
      return NextResponse.json({ 
        error: 'Invalid or expired buyer code',
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
