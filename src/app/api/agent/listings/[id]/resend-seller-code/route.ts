import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import { sendSellerCodeEmail } from '@/lib/resend';

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
    if (listing.agentId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only manage your own listings' }, { status: 403 });
    }

    // Send seller code via email
    try {
      const emailResult = await sendSellerCodeEmail(
        listing.sellerName,
        listing.sellerEmail,
        listing.sellerCode,
        listing.address,
        listing._id.toString()
      );

      if (!emailResult.success) {
        throw new Error('Failed to send email');
      }

      console.log('Seller code email sent successfully to:', listing.sellerEmail);
    } catch (emailError) {
      console.error('Failed to send seller code email:', emailError);
      return NextResponse.json({ 
        error: 'Failed to send seller code email. Please try again.' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Seller code sent successfully',
      sellerEmail: listing.sellerEmail
    });

  } catch (error) {
    console.error('Error sending seller code:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
