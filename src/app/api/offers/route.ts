import { NextRequest, NextResponse } from 'next/server';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import User from '@/models/User';
import { v4 as uuidv4 } from 'uuid';
import { parsePrice } from '@/lib/priceUtils';
import { sendEmail } from '@/lib/resend';
import { generateOfferNotificationEmail } from '@/emails/templates';

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

    // Check if property is still available
    if (listing.status === 'sold') {
      return NextResponse.json({ error: 'This property has already been sold' }, { status: 400 });
    }

    // Check if buyer already has a pending offer
    if (listing.hasPendingOffer(buyerEmail)) {
      return NextResponse.json({ 
        error: 'You already have a pending offer for this property. You can only make a new offer if your previous offer has been rejected.' 
      }, { status: 400 });
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

    // Add to offer history
    listing.addOfferHistory(newOffer.id, 'submitted', numericAmount, undefined, notes?.trim() || '', 'buyer');

    // Get agent and seller details for email notifications
    const agent = await User.findById(listing.agentId);
    if (!agent) {
      console.error('Agent not found for listing:', listingId);
    }

    // Send email notifications
    try {
      // Email to seller
      const sellerEmail = generateOfferNotificationEmail({
        recipientName: listing.sellerName,
        propertyAddress: listing.address,
        offerAmount: `£${numericAmount.toLocaleString()}`,
        buyerName: buyerName.trim(),
        fundingType,
        listingId: listing._id.toString()
      });

      await sendEmail({
        to: listing.sellerEmail,
        subject: sellerEmail.subject,
        html: sellerEmail.html,
        text: sellerEmail.text
      });

      // Email to agent
      if (agent) {
        const agentEmail = generateOfferNotificationEmail({
          recipientName: agent.name || agent.email,
          propertyAddress: listing.address,
          offerAmount: `£${numericAmount.toLocaleString()}`,
          buyerName: buyerName.trim(),
          fundingType,
          listingId: listing._id.toString()
        });

        await sendEmail({
          to: agent.email,
          subject: agentEmail.subject,
          html: agentEmail.html,
          text: agentEmail.text
        });
      }
    } catch (emailError) {
      console.error('Error sending offer notification emails:', emailError);
      // Don't fail the offer creation if email fails
    }
    
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
