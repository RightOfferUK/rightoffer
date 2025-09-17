import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import BuyerCode from '@/models/BuyerCode';
import Listing from '@/models/Listing';
import { sendBuyerCodeEmail } from '@/lib/resend';
import mongoose from 'mongoose';

// POST - Resend buyer code email
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ codeId: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    const { codeId } = await params;

    // Get the buyer code with listing details
    const buyerCode = await BuyerCode.findById(codeId).populate('listingId');
    if (!buyerCode) {
      return NextResponse.json({ error: 'Buyer code not found' }, { status: 404 });
    }

    // Check if the current user is the agent who owns this buyer code
    if (buyerCode.agentId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only resend your own buyer codes' }, { status: 403 });
    }

    // Check if buyer code is still valid
    if (!buyerCode.isValid()) {
      return NextResponse.json({ 
        error: 'Cannot resend email for expired or inactive buyer code' 
      }, { status: 400 });
    }

    const listing = buyerCode.listingId as { _id: string; address: string; listedPrice: string }; // Type assertion for populated field

    // Send buyer code via email
    try {
      const emailResult = await sendBuyerCodeEmail(
        buyerCode.buyerName,
        buyerCode.buyerEmail,
        buyerCode.code,
        listing.address,
        listing.listedPrice,
        listing._id.toString()
      );

      if (!emailResult.success) {
        throw new Error('Failed to send email');
      }

      // Update last email sent timestamp
      buyerCode.lastEmailSent = new Date();
      await buyerCode.save();

      console.log(`Buyer code email resent successfully to: ${buyerCode.buyerEmail}`);
    } catch (emailError) {
      console.error('Failed to resend buyer code email:', emailError);
      return NextResponse.json({ 
        error: 'Failed to resend buyer code email. Please try again.' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Buyer code email resent successfully',
      buyerEmail: buyerCode.buyerEmail,
      lastEmailSent: buyerCode.lastEmailSent.toISOString()
    });

  } catch (error) {
    console.error('Error resending buyer code email:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
