import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
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
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    // Parse the request body
    const body = await request.json();
    const { action, counterAmount, counterNotes } = body;

    // Validate action
    const validActions = ['accept', 'reject', 'counter'];
    if (!validActions.includes(action)) {
      return NextResponse.json({ 
        error: 'Invalid action. Must be one of: ' + validActions.join(', ')
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

    // Check authorization - must be the agent who owns the listing
    if (listing.agentId.toString() !== session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
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
        agent.name || agent.email,
        counterOfferAmount,
        counterNotes
      );

      await listing.save();

      // Send appropriate email notifications
      try {
        if (action === 'accept') {
          // Email to buyer
          const buyerEmail = generateOfferAcceptedEmail({
            recipientName: offer.buyerName,
            propertyAddress: listing.address,
            offerAmount: `£${offer.amount.toLocaleString()}`,
            listingId: listing._id.toString()
          });

          await sendEmail({
            to: offer.buyerEmail,
            subject: buyerEmail.subject,
            html: buyerEmail.html,
            text: buyerEmail.text
          });

          // Email to seller
          const sellerEmail = generateOfferAcceptedSellerEmail({
            recipientName: listing.sellerName,
            propertyAddress: listing.address,
            offerAmount: `£${offer.amount.toLocaleString()}`,
            buyerName: offer.buyerName,
            listingId: listing._id.toString()
          });

          await sendEmail({
            to: listing.sellerEmail,
            subject: sellerEmail.subject,
            html: sellerEmail.html,
            text: sellerEmail.text
          });

        } else if (action === 'reject') {
          // Email to buyer
          const buyerEmail = generateOfferRejectedEmail({
            recipientName: offer.buyerName,
            propertyAddress: listing.address,
            offerAmount: `£${offer.amount.toLocaleString()}`,
            listingId: listing._id.toString()
          });

          await sendEmail({
            to: offer.buyerEmail,
            subject: buyerEmail.subject,
            html: buyerEmail.html,
            text: buyerEmail.text
          });

        } else if (action === 'counter') {
          // Email to buyer
          const buyerEmail = generateCounterOfferEmail({
            recipientName: offer.buyerName,
            propertyAddress: listing.address,
            originalOfferAmount: `£${offer.amount.toLocaleString()}`,
            counterOfferAmount: `£${counterAmount.toLocaleString()}`,
            counterOfferNotes: counterNotes,
            listingId: listing._id.toString()
          });

          await sendEmail({
            to: offer.buyerEmail,
            subject: buyerEmail.subject,
            html: buyerEmail.html,
            text: buyerEmail.text
          });
        }
      } catch (emailError) {
        console.error('Error sending offer action emails:', emailError);
        // Don't fail the action if email fails
      }

      return NextResponse.json({ 
        message: `Offer ${action}ed successfully`,
        offer: offer,
        listingStatus: listing.status
      }, { status: 200 });

    } catch (updateError: unknown) {
      return NextResponse.json({ 
        error: updateError instanceof Error ? updateError.message : 'Failed to update offer status' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing offer action:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
