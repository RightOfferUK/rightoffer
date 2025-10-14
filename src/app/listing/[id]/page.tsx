import { notFound } from 'next/navigation';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import ListingPageClient from '@/components/listing/ListingPageClient';
import { auth } from '@/auth';
import mongoose from 'mongoose';

// Type for offers in the listing (from MongoDB)
interface RawOffer {
  _id?: mongoose.Types.ObjectId;
  id?: string;
  buyerName?: string;
  buyerEmail?: string;
  amount?: number;
  status?: string;
  fundingType?: string;
  chain?: boolean;
  aipPresent?: boolean;
  submittedAt?: Date;
  statusUpdatedAt?: Date;
  notes?: string;
  offerHistory?: Array<{
    _id?: mongoose.Types.ObjectId;
    action?: string;
    amount?: number;
    counterAmount?: number;
    notes?: string;
    updatedBy?: string;
    timestamp?: Date;
  }>;
  [key: string]: unknown;
}

// Type for the raw listing from MongoDB
interface RawListing {
  _id: mongoose.Types.ObjectId;
  address: string;
  sellerName: string;
  sellerEmail: string;
  listedPrice: string;
  mainPhoto: string;
  sellerCode: string;
  status: string;
  agentId: mongoose.Types.ObjectId;
  offers: RawOffer[];
  createdAt: Date;
  updatedAt: Date;
  __v?: number; // Mongoose version field
}

interface ListingPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;

  try {
    // Connect to MongoDB
    await cachedMongooseConnection;
    
    // Get current session
    const session = await auth();

    // Find listing by ID (include agentId for permission check)
    const rawListing = await Listing.findById(id)
      .lean();

    if (!rawListing) {
      notFound();
    }

    // Type assertion for the raw listing
    const listing = rawListing as RawListing;

    // Check if current user can edit this listing
    let canEdit = false;
    
    if (session?.user?.id) {
      // User is the agent who owns this listing
      if (session.user.id === listing.agentId.toString()) {
        canEdit = true;
      }
      // User is a real estate admin who manages the agent who owns this listing
      else if (session.user.role === 'real_estate_admin') {
        const { default: User } = await import('@/models/User');
        const agent = await User.findOne({
          _id: listing.agentId,
          role: 'agent',
          realEstateAdminId: new mongoose.Types.ObjectId(session.user.id)
        });
        canEdit = !!agent;
      }
      // User is a super admin
      else if (session.user.role === 'admin') {
        canEdit = true;
      }
    }

    // Convert MongoDB ObjectId to string for client components
    const listingData = {
      ...listing,
      _id: listing._id.toString(),
      agentId: listing.agentId.toString(), // Convert ObjectId to string
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
      offers: listing.offers.map((offer: RawOffer) => ({
        ...offer,
        _id: offer._id?.toString(),
        submittedAt: offer.submittedAt ? new Date(offer.submittedAt).toISOString() : undefined,
        statusUpdatedAt: offer.statusUpdatedAt ? new Date(offer.statusUpdatedAt).toISOString() : undefined,
        // Convert offerHistory ObjectIds to strings
        offerHistory: Array.isArray(offer.offerHistory) ? offer.offerHistory.map((history: { _id?: mongoose.Types.ObjectId; timestamp?: Date; [key: string]: unknown }) => ({
          ...history,
          _id: history._id?.toString(),
          timestamp: history.timestamp ? new Date(history.timestamp).toISOString() : new Date().toISOString()
        })) : []
      })) as Array<{
        _id?: string;
        id: string;
        buyerName: string;
        buyerEmail: string;
        amount: number;
        status: 'submitted' | 'accepted' | 'rejected' | 'countered' | 'withdrawn';
        fundingType: 'Cash' | 'Mortgage' | 'Chain';
        chain: boolean;
        aipPresent: boolean;
        submittedAt: string;
        notes?: string;
      }>,
      // Remove Mongoose internal fields
      __v: undefined
    };

    return <ListingPageClient listing={listingData} canEdit={canEdit} />;

  } catch (error) {
    console.error('Error fetching listing:', error);
    notFound();
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ListingPageProps) {
  try {
    await cachedMongooseConnection;
    const { id } = await params;
    const rawListing = await Listing.findById(id)
      .select('address listedPrice mainPhoto')
      .lean();

    if (!rawListing) {
      return {
        title: 'Listing Not Found',
      };
    }

    const listing = rawListing as unknown as { address: string; listedPrice: string; mainPhoto: string };

    return {
      title: `${listing.address} - £${listing.listedPrice} | RightOffer`,
      description: `View real-time offers for ${listing.address}. Listed at ${listing.listedPrice}. See all offers and property details.`,
      openGraph: {
        title: `${listing.address} - ${listing.listedPrice}`,
        description: `View real-time offers for this property`,
        images: listing.mainPhoto ? [listing.mainPhoto] : [],
      },
    };
  } catch {
    return {
      title: 'Property Listing | RightOffer',
    };
  }
}
