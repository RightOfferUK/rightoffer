import { notFound } from 'next/navigation';
import { cachedMongooseConnection } from '@/lib/db';
import Listing from '@/models/Listing';
import ListingPageClient from '@/components/listing/ListingPageClient';
import { auth } from '@/auth';

// Type for the raw listing from MongoDB
interface RawListing {
  _id: any;
  address: string;
  sellerName: string;
  sellerEmail: string;
  listedPrice: string;
  mainPhoto: string;
  sellerCode: string;
  status: string;
  agentId: string;
  offers: any[];
  createdAt: Date;
  updatedAt: Date;
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
    const canEdit = session?.user?.id === listing.agentId;

    // Convert MongoDB ObjectId to string for client components
    const listingData = {
      ...listing,
      _id: listing._id.toString(),
      agentId: listing.agentId, // Include for edit permission check
      createdAt: listing.createdAt.toISOString(),
      offers: listing.offers.map((offer: any) => ({
        ...offer,
        _id: offer._id?.toString()
      }))
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

    const listing = rawListing as any;

    return {
      title: `${listing.address} - £${listing.listedPrice} | RightOffer`,
      description: `View real-time offers for ${listing.address}. Listed at ${listing.listedPrice}. See all offers and property details.`,
      openGraph: {
        title: `${listing.address} - ${listing.listedPrice}`,
        description: `View real-time offers for this property`,
        images: listing.mainPhoto ? [listing.mainPhoto] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Property Listing | RightOffer',
    };
  }
}
