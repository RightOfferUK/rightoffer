import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import BuyerCode from '@/models/BuyerCode';
import { sendBuyerCodeEmail } from '@/lib/resend';
import mongoose from 'mongoose';

// Helper function to generate buyer code
function generateBuyerCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'BUY-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(
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
      return NextResponse.json({ error: 'Forbidden: You can only manage your own listings' }, { status: 403 });
    }

    // Parse the request body
    const body = await request.json();
    const { buyerName, buyerEmail, name, email } = body;
    
    // Support both field name formats for backwards compatibility
    const buyerNameValue = buyerName || name;
    const buyerEmailValue = buyerEmail || email;

    // Validate required fields
    if (!buyerNameValue || !buyerEmailValue) {
      return NextResponse.json({ 
        error: 'Missing required fields: buyerName, buyerEmail' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyerEmailValue)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    // Check if buyer already has an active code for this listing
    const existingCode = await BuyerCode.findOne({
      listingId: id,
      buyerEmail: buyerEmailValue.trim().toLowerCase(),
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    let buyerCode;
    let savedBuyerCode;

    if (existingCode) {
      // Use existing code and update buyer name if different
      buyerCode = existingCode.code;
      if (existingCode.buyerName !== buyerNameValue.trim()) {
        existingCode.buyerName = buyerNameValue.trim();
        await existingCode.save();
      }
      savedBuyerCode = existingCode;
    } else {
      // Generate unique buyer code
      let attempts = 0;
      do {
        buyerCode = generateBuyerCode();
        attempts++;
        if (attempts > 10) {
          throw new Error('Failed to generate unique buyer code');
        }
      } while (await BuyerCode.findOne({ code: buyerCode }));

      // Store buyer code in database
      savedBuyerCode = await BuyerCode.create({
        code: buyerCode,
        listingId: id,
        buyerName: buyerNameValue.trim(),
        buyerEmail: buyerEmailValue.trim().toLowerCase(),
        agentId: new mongoose.Types.ObjectId(session.user.id),
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });
    }
    
    // Send buyer code via email
    try {
      const emailResult = await sendBuyerCodeEmail(
        buyerNameValue.trim(),
        buyerEmailValue.trim().toLowerCase(),
        buyerCode,
        listing.address,
        listing.listedPrice,
        listing._id.toString()
      );

      if (!emailResult.success) {
        throw new Error('Failed to send email');
      }

      // Update last email sent timestamp
      savedBuyerCode.lastEmailSent = new Date();
      await savedBuyerCode.save();

      console.log(`Buyer code email sent successfully to: ${buyerEmailValue}`);
    } catch (emailError) {
      console.error('Failed to send buyer code email:', emailError);
      return NextResponse.json({ 
        error: 'Failed to send buyer code email. Please try again.' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Buyer code generated and sent successfully',
      buyerCode,
      buyerEmail: buyerEmailValue,
      buyerName: buyerNameValue
    });

  } catch (error) {
    console.error('Error generating buyer code:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
