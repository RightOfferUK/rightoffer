import { NextRequest, NextResponse } from 'next/server';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import User from '@/models/User';
import { 
  sendOfferAcceptedEmailToBuyer,
  sendOfferAcceptedEmailToSeller,
  sendCounterOfferRejectedEmailToSeller,
  sendReCounterOfferEmailToSeller
} from '@/lib/resend';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ offerId: string }> }
) {
  try {
    const { offerId } = await params;

    // Connect to MongoDB
    await cachedMongooseConnection;

    // Parse the request body
    const body = await request.json();
    const { action, buyerEmail, counterAmount, counterNotes } = body;

    // Debug logging
    console.log('Buyer Response - Received counterAmount:', counterAmount, 'Type:', typeof counterAmount);

    // Validate action
    const validActions = ['accept', 'reject', 'counter'];
    if (!validActions.includes(action)) {
      return NextResponse.json({ 
        error: 'Invalid action. Must be one of: ' + validActions.join(', ')
      }, { status: 400 });
    }

    // Validate buyer email
    if (!buyerEmail) {
      return NextResponse.json({ 
        error: 'Buyer email is required' 
      }, { status: 400 });
    }

    // Parse and validate counter offer amount if action is counter
    let parsedCounterAmount: number | undefined;
    if (action === 'counter') {
      if (!counterAmount) {
        return NextResponse.json({ 
          error: 'Counter offer amount is required' 
        }, { status: 400 });
      }
      
      console.log('=== BUYER COUNTER OFFER DEBUG ===');
      console.log('Buyer Response - Received counterAmount:', counterAmount);
      console.log('Buyer Response - Type:', typeof counterAmount);
      console.log('Buyer Response - Raw value:', JSON.stringify(counterAmount));
      
      // Handle both string and number inputs
      if (typeof counterAmount === 'string') {
        // Remove any formatting (£, commas, spaces)
        const cleaned = counterAmount.replace(/[£,\s]/g, '');
        console.log('Buyer Response - Cleaned string:', cleaned);
        parsedCounterAmount = parseInt(cleaned, 10);
      } else {
        console.log('Buyer Response - Converting number:', counterAmount);
        parsedCounterAmount = Number(counterAmount);
      }
      
      console.log('Buyer Response - Final parsed amount:', parsedCounterAmount);
      console.log('=== END DEBUG ===');
      
      // Validate it's a valid number
      if (isNaN(parsedCounterAmount) || parsedCounterAmount <= 0) {
        return NextResponse.json({ 
          error: 'Invalid counter offer amount' 
        }, { status: 400 });
      }
    }

    // Find the listing with the offer
    const listing = await Listing.findOne({ 'offers.id': offerId });
    if (!listing) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Find the specific offer
    const offer = listing.offers.find((o: { id: string; [key: string]: unknown }) => o.id === offerId);
    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Verify buyer email matches
    if (offer.buyerEmail.toLowerCase() !== buyerEmail.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if offer is in countered status
    if (offer.status !== 'countered') {
      return NextResponse.json({ 
        error: 'This offer is not in a countered state. Current status: ' + offer.status 
      }, { status: 400 });
    }

    // Get agent details
    const agent = await User.findById(listing.agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Update offer status using the model method
    let newStatus: string;
    let counterOfferAmount: number | undefined;

    switch (action) {
      case 'accept':
        newStatus = 'accepted';
        break;
      case 'reject':
        newStatus = 'rejected';
        break;
      case 'counter':
        newStatus = 'countered';
        counterOfferAmount = parsedCounterAmount;
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    try {
      listing.updateOfferStatus(
        offerId, 
        newStatus, 
        offer.buyerEmail,
        counterOfferAmount,
        counterNotes
      );

      // If buyer countered, track that they made this counter
      if (action === 'counter') {
        const offerIndex = listing.offers.findIndex((o: { id: string }) => o.id === offerId);
        if (offerIndex !== -1) {
          listing.offers[offerIndex].counterOfferBy = 'buyer';
        }
      }

      await listing.save();

      // Send appropriate email notifications
      try {
        const acceptedAmount = offer.counterOffer || offer.amount;
        
        if (action === 'accept') {
          // Buyer accepted seller's counter offer
          // Email to buyer
          await sendOfferAcceptedEmailToBuyer(
            offer.buyerName,
            offer.buyerEmail,
            listing.address,
            `£${acceptedAmount.toLocaleString()}`,
            listing._id.toString()
          );

          // Email to seller
          await sendOfferAcceptedEmailToSeller(
            listing.sellerName,
            listing.sellerEmail,
            listing.address,
            `£${acceptedAmount.toLocaleString()}`,
            offer.buyerName,
            listing._id.toString()
          );

          // Email to agent
          await sendOfferAcceptedEmailToSeller(
            agent.name || agent.email,
            agent.email,
            listing.address,
            `£${acceptedAmount.toLocaleString()}`,
            offer.buyerName,
            listing._id.toString()
          );

        } else if (action === 'reject') {
          // Buyer rejected seller's counter offer
          await sendCounterOfferRejectedEmailToSeller(
            listing.sellerName,
            listing.sellerEmail,
            listing.address,
            `£${offer.counterOffer?.toLocaleString() || offer.amount.toLocaleString()}`,
            offer.buyerName,
            listing._id.toString()
          );

          // Also notify agent
          await sendCounterOfferRejectedEmailToSeller(
            agent.name || agent.email,
            agent.email,
            listing.address,
            `£${offer.counterOffer?.toLocaleString() || offer.amount.toLocaleString()}`,
            offer.buyerName,
            listing._id.toString()
          );

        } else if (action === 'counter') {
          // Buyer made a re-counter to seller's counter
          await sendReCounterOfferEmailToSeller(
            listing.sellerName,
            listing.sellerEmail,
            listing.address,
            `£${offer.counterOffer?.toLocaleString() || offer.amount.toLocaleString()}`,
            `£${parsedCounterAmount!.toLocaleString()}`,
            offer.buyerName,
            counterNotes,
            listing._id.toString()
          );

          // Also notify agent
          await sendReCounterOfferEmailToSeller(
            agent.name || agent.email,
            agent.email,
            listing.address,
            `£${offer.counterOffer?.toLocaleString() || offer.amount.toLocaleString()}`,
            `£${parsedCounterAmount!.toLocaleString()}`,
            offer.buyerName,
            counterNotes,
            listing._id.toString()
          );
        }
      } catch (emailError) {
        console.error('Error sending offer response emails:', emailError);
        // Don't fail the action if email fails
      }

      return NextResponse.json({ 
        message: `Counter offer ${action}ed successfully`,
        offer: offer,
        listingStatus: listing.status
      }, { status: 200 });

    } catch (updateError: unknown) {
      return NextResponse.json({ 
        error: updateError instanceof Error ? updateError.message : 'Failed to update offer status' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing offer response:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
