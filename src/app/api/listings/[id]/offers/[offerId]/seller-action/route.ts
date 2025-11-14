import { NextRequest, NextResponse } from 'next/server';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import { 
  sendCounterOfferEmailToBuyer,
  sendOfferAcceptedEmailToBuyer,
  sendOfferAcceptedEmailToSeller
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

    // Update the offer
    listing.offers[offerIndex].status = status;
    
    if (counterOffer) {
      listing.offers[offerIndex].counterOffer = counterOffer;
      // Track that seller made this counter offer
      listing.offers[offerIndex].counterOfferBy = 'seller';
    }
    
    if (notes) {
      listing.offers[offerIndex].agentNotes = notes;
    }

    // Add timestamp for status change
    listing.offers[offerIndex].statusUpdatedAt = new Date();
    listing.offers[offerIndex].updatedBy = listing.sellerEmail;

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
      const offer = listing.offers[offerIndex];
      
      if (status === 'countered') {
        // Seller countered the offer - notify buyer
        await sendCounterOfferEmailToBuyer(
          offer.buyerName,
          offer.buyerEmail,
          listing.address,
          `£${offer.amount.toLocaleString()}`,
          `£${counterOffer.toLocaleString()}`,
          notes,
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

