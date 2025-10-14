import { NextRequest, NextResponse } from 'next/server';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import User from '@/models/User';
import { sendEmail } from '@/lib/resend';
import { 
  generateOfferAcceptedEmail, 
  generateOfferRejectedEmail, 
  generateCounterOfferEmail,
  generateOfferAcceptedSellerEmail 
} from '@/emails/templates';

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

    // Validate counter offer amount if action is counter
    if (action === 'counter') {
      if (!counterAmount || counterAmount <= 0) {
        return NextResponse.json({ 
          error: 'Counter offer amount is required and must be greater than 0' 
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
        counterOfferAmount = counterAmount;
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    try {
      listing.updateOfferStatus(
        offerId, 
        newStatus, 
        offer.buyerName,
        counterOfferAmount,
        counterNotes
      );

      await listing.save();

      // Send appropriate email notifications
      try {
        if (action === 'accept') {
          // Email to buyer
          const buyerEmailContent = generateOfferAcceptedEmail({
            recipientName: offer.buyerName,
            propertyAddress: listing.address,
            offerAmount: `£${offer.counterOffer?.toLocaleString() || offer.amount.toLocaleString()}`,
            listingId: listing._id.toString()
          });

          await sendEmail({
            to: offer.buyerEmail,
            subject: buyerEmailContent.subject,
            html: buyerEmailContent.html,
            text: buyerEmailContent.text
          });

          // Email to seller
          const sellerEmail = generateOfferAcceptedSellerEmail({
            recipientName: listing.sellerName,
            propertyAddress: listing.address,
            offerAmount: `£${offer.counterOffer?.toLocaleString() || offer.amount.toLocaleString()}`,
            buyerName: offer.buyerName,
            listingId: listing._id.toString()
          });

          await sendEmail({
            to: listing.sellerEmail,
            subject: sellerEmail.subject,
            html: sellerEmail.html,
            text: sellerEmail.text
          });

          // Email to agent
          const agentEmail = generateOfferAcceptedSellerEmail({
            recipientName: agent.name || agent.email,
            propertyAddress: listing.address,
            offerAmount: `£${offer.counterOffer?.toLocaleString() || offer.amount.toLocaleString()}`,
            buyerName: offer.buyerName,
            listingId: listing._id.toString()
          });

          await sendEmail({
            to: agent.email,
            subject: agentEmail.subject,
            html: agentEmail.html,
            text: agentEmail.text
          });

        } else if (action === 'reject') {
          // Email to seller and agent
          const sellerEmail = generateOfferRejectedEmail({
            recipientName: listing.sellerName,
            propertyAddress: listing.address,
            offerAmount: `£${offer.amount.toLocaleString()}`,
            listingId: listing._id.toString()
          });

          await sendEmail({
            to: listing.sellerEmail,
            subject: sellerEmail.subject,
            html: sellerEmail.html,
            text: sellerEmail.text
          });

          await sendEmail({
            to: agent.email,
            subject: sellerEmail.subject,
            html: sellerEmail.html,
            text: sellerEmail.text
          });

        } else if (action === 'counter') {
          // Email to seller and agent
          const sellerEmail = generateCounterOfferEmail({
            recipientName: listing.sellerName,
            propertyAddress: listing.address,
            originalOfferAmount: `£${offer.counterOffer?.toLocaleString() || offer.amount.toLocaleString()}`,
            counterOfferAmount: `£${counterAmount.toLocaleString()}`,
            counterOfferNotes: counterNotes,
            listingId: listing._id.toString()
          });

          await sendEmail({
            to: listing.sellerEmail,
            subject: sellerEmail.subject,
            html: sellerEmail.html,
            text: sellerEmail.text
          });

          await sendEmail({
            to: agent.email,
            subject: sellerEmail.subject,
            html: sellerEmail.html,
            text: sellerEmail.text
          });
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
