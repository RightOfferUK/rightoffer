import { NextRequest, NextResponse } from 'next/server';
import { cachedMongooseConnection } from '@/lib/db';
import BuyerCode from '@/models/BuyerCode';
import Listing from '@/models/Listing';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Connect to MongoDB
    await cachedMongooseConnection;

    // Find valid buyer code
    const buyerCode = await BuyerCode.findOne({ 
      code, 
      isActive: true, 
      expiresAt: { $gt: new Date() } 
    });

    if (!buyerCode) {
      return NextResponse.json({ error: 'Invalid or expired buyer code' }, { status: 404 });
    }

    // Find all listings and filter offers by buyer email
    const listings = await Listing.find({}).lean();
    
    const buyerOffers: Array<{
      id: string;
      listingId: string;
      listingAddress: string;
      listedPrice: string;
      sellerName: string;
      mainPhoto: string;
      amount: string;
      status: string;
      fundingType: string;
      chain: boolean;
      aipPresent: boolean;
      submittedAt: string;
      notes?: string;
      counterOffer?: string;
      agentNotes?: string;
    }> = [];

    listings.forEach(listing => {
      const listingOffers = listing.offers.filter((offer: { buyerEmail: string }) => 
        offer.buyerEmail.toLowerCase() === buyerCode.buyerEmail.toLowerCase()
      );

      listingOffers.forEach((offer: { 
        id: string;
        amount: string;
        status: string;
        fundingType: string;
        chain: boolean;
        aipPresent: boolean;
        submittedAt: Date;
        notes?: string;
        counterOffer?: string;
        agentNotes?: string;
      }) => {
        buyerOffers.push({
          ...offer,
          listingId: listing._id.toString(),
          listingAddress: listing.address,
          listedPrice: listing.listedPrice,
          sellerName: listing.sellerName,
          mainPhoto: listing.mainPhoto || '',
          submittedAt: new Date(offer.submittedAt).toISOString()
        });
      });
    });

    // Sort by submission date (newest first)
    buyerOffers.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return NextResponse.json({ 
      offers: buyerOffers,
      buyerName: buyerCode.buyerName,
      buyerEmail: buyerCode.buyerEmail,
      totalOffers: buyerOffers.length
    });

  } catch (error) {
    console.error('Error fetching buyer offers:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
