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
  amount?: string;
  status?: string;
  fundingType?: string;
  chain?: boolean;
  aipPresent?: boolean;
  submittedAt?: Date;
  statusUpdatedAt?: Date;
  notes?: string;
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

    // Check if current user is the agent who owns this listing
    const canEdit = session?.user?.id === listing.agentId.toString();

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
        statusUpdatedAt: offer.statusUpdatedAt ? new Date(offer.statusUpdatedAt).toISOString() : undefined
      })) as Array<{
        _id?: string;
        id: string;
        buyerName: string;
        buyerEmail: string;
        amount: string;
        status: 'submitted' | 'verified' | 'countered' | 'pending verification' | 'accepted' | 'declined';
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
