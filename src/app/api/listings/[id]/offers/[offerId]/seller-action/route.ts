import { NextRequest, NextResponse } from 'next/server';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import { 
  sendCounterOfferEmailToBuyer,
  sendOfferAcceptedEmailToBuyer,
  sendOfferAcceptedEmailToSeller,
  sendOfferRejectedEmailToBuyer
} from '@/lib/resend';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; offerId: string }> }
) {
  try {
    const { id, offerId } = await params;

    // Connect to MongoDB
    await cachedMongooseConnection;

    // Parse the request body
    const body = await request.json();
    const { status, counterOffer, notes, sellerCode } = body;

    // Debug logging
    console.log('Seller Action - Received counterOffer:', counterOffer, 'Type:', typeof counterOffer);

    // Validate seller code is provided
    if (!sellerCode) {
      return NextResponse.json({ error: 'Seller code is required' }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['submitted', 'accepted', 'rejected', 'countered', 'withdrawn'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      }, { status: 400 });
    }

    // Ensure counterOffer is a number if provided
    let counterOfferAmount: number | undefined;
    if (counterOffer) {
      console.log('Seller Action - Received counterOffer:', counterOffer, 'Type:', typeof counterOffer);
      
      // Handle both string and number inputs
      if (typeof counterOffer === 'string') {
        // Remove any formatting (£, commas, spaces)
        const cleaned = counterOffer.replace(/[£,\s]/g, '');
        console.log('Seller Action - Cleaned string:', cleaned);
        counterOfferAmount = parseInt(cleaned, 10);
      } else {
        counterOfferAmount = Number(counterOffer);
      }
      
      console.log('Seller Action - Parsed counterOfferAmount:', counterOfferAmount);
      
      // Validate it's a valid number
      if (isNaN(counterOfferAmount) || counterOfferAmount <= 0) {
        return NextResponse.json({ 
          error: 'Invalid counter offer amount' 
        }, { status: 400 });
      }
    }

    // Find the listing
    const listing = await Listing.findById(id);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Verify seller code
    if (listing.sellerCode.toUpperCase() !== sellerCode.toUpperCase()) {
      return NextResponse.json({ error: 'Invalid seller code' }, { status: 403 });
    }

    // Find the offer
    const offerIndex = listing.offers.findIndex((offer: { id: string }) => offer.id === offerId);
    if (offerIndex === -1) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Store previous counterOffer for history
    const offer = listing.offers[offerIndex];
    const previousCounterOffer = offer.counterOffer;

    // Update the offer
    offer.status = status;
    
    if (counterOfferAmount) {
      offer.counterOffer = counterOfferAmount;
      // Track that seller made this counter offer
      offer.counterOfferBy = 'seller';
    }
    
    if (notes) {
      offer.agentNotes = notes;
    }

    // Add timestamp for status change
    offer.statusUpdatedAt = new Date();
    offer.updatedBy = listing.sellerEmail;

    // Add to offer history
    if (!offer.offerHistory) {
      offer.offerHistory = [];
    }
    
    // For accepted/rejected, include the previousCounterOffer if it exists
    // This ensures the status badge shows on the right offer
    const historyCounterAmount = counterOfferAmount || (status === 'accepted' || status === 'rejected' ? previousCounterOffer : undefined);
    
    offer.offerHistory.push({
      action: status,
      amount: offer.amount,
      counterAmount: historyCounterAmount,
      notes: notes,
      timestamp: new Date(),
      updatedBy: listing.sellerEmail
    });

    // If offer is accepted, update listing status and reject all other offers
    if (status === 'accepted') {
      listing.status = 'sold';
      
      // Reject all other offers that are not this one and not already rejected/withdrawn
      listing.offers.forEach((offer: { id: string; status: string }, index: number) => {
        if (index !== offerIndex && (offer.status === 'submitted' || offer.status === 'countered')) {
          listing.offers[index].status = 'rejected';
          listing.offers[index].statusUpdatedAt = new Date();
          listing.offers[index].updatedBy = listing.sellerEmail;
          listing.offers[index].agentNotes = 'Automatically rejected - another offer was accepted';
        }
      });
    }

    await listing.save();

    // Send appropriate email notifications
    try {
      if (status === 'countered' && counterOfferAmount) {
        // Seller countered the offer - notify buyer
        await sendCounterOfferEmailToBuyer(
          offer.buyerName,
          offer.buyerEmail,
          listing.address,
          `£${offer.amount.toLocaleString()}`,
          `£${counterOfferAmount.toLocaleString()}`,
          notes,
          listing._id.toString()
        );
      } else if (status === 'rejected') {
        // Seller rejected the offer - notify buyer
        const rejectedAmount = offer.counterOffer || offer.amount;
        await sendOfferRejectedEmailToBuyer(
          offer.buyerName,
          offer.buyerEmail,
          listing.address,
          `£${rejectedAmount.toLocaleString()}`,
          listing._id.toString()
        );
      } else if (status === 'accepted') {
        // Seller accepted the offer - notify buyer and seller
        const acceptedAmount = offer.counterOffer || offer.amount;
        
        await sendOfferAcceptedEmailToBuyer(
          offer.buyerName,
          offer.buyerEmail,
          listing.address,
          `£${acceptedAmount.toLocaleString()}`,
          listing._id.toString()
        );

        await sendOfferAcceptedEmailToSeller(
          listing.sellerName,
          listing.sellerEmail,
          listing.address,
          `£${acceptedAmount.toLocaleString()}`,
          offer.buyerName,
          listing._id.toString()
        );
      }
    } catch (emailError) {
      console.error('Error sending offer update emails:', emailError);
      // Don't fail the action if email fails
    }

    return NextResponse.json({ 
      message: 'Offer status updated successfully',
      offer: listing.offers[offerIndex]
    });

  } catch {
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

