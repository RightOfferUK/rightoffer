import { NextRequest, NextResponse } from 'next/server';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import { v4 as uuidv4 } from 'uuid';
import { parsePrice } from '@/lib/priceUtils';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await cachedMongooseConnection;

    // Parse the request body
    const body = await request.json();
    const {
      listingId,
      buyerName,
      buyerEmail,
      amount,
      fundingType,
      chain,
      aipPresent,
      notes
    } = body;

    // Validate required fields
    if (!listingId || !buyerName || !buyerEmail || amount === undefined || amount === null || !fundingType) {
      return NextResponse.json({ 
        error: 'Missing required fields: listingId, buyerName, buyerEmail, amount, fundingType' 
      }, { status: 400 });
    }

    // Validate and parse amount
    const numericAmount = typeof amount === 'number' ? amount : parsePrice(amount.toString());
    if (!numericAmount || numericAmount <= 0) {
      return NextResponse.json({ 
        error: 'Invalid offer amount. Must be a positive number.' 
      }, { status: 400 });
    }

    // Validate fundingType
    const validFundingTypes = ['Cash', 'Mortgage', 'Chain'];
    if (!validFundingTypes.includes(fundingType)) {
      return NextResponse.json({ 
        error: 'Invalid funding type. Must be one of: ' + validFundingTypes.join(', ')
      }, { status: 400 });
    }

    // Find the listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Create new offer
    const newOffer = {
      id: uuidv4(),
      buyerName: buyerName.trim(),
      buyerEmail: buyerEmail.trim().toLowerCase(),
      amount: numericAmount,
      status: 'submitted',
      fundingType,
      chain: Boolean(chain),
      aipPresent: Boolean(aipPresent),
      submittedAt: new Date(),
      notes: notes?.trim() || ''
    };

    // Add offer to listing
    listing.offers.push(newOffer);
    await listing.save();

    // Trigger real-time update event
    // This could be enhanced with WebSocket or Server-Sent Events in the future
    // For now, we'll rely on polling from the frontend
    
    return NextResponse.json({ 
      message: 'Offer submitted successfully',
      offerId: newOffer.id,
      offer: newOffer
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting offer:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
