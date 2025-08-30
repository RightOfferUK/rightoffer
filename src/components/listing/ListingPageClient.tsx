'use client';

import React, { useState } from 'react';
import ListingView from './ListingView';
import AccessControl from './AccessControl';
import SellerView from './SellerView';
import BuyerOfferForm from './BuyerOfferForm';

interface Offer {
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
}

interface ListingData {
  _id: string;
  address: string;
  sellerName: string;
  sellerEmail: string;
  listedPrice: string;
  mainPhoto: string;
  sellerCode: string;
  status: string;
  offers: Offer[];
  createdAt: string;
  agentId?: string;
}

interface ListingPageClientProps {
  listing: ListingData;
  canEdit?: boolean;
}

interface BuyerDetails {
  buyerName: string;
  buyerEmail: string;
  code: string;
}

type UserRole = 'agent' | 'seller' | 'buyer' | 'public';

const ListingPageClient: React.FC<ListingPageClientProps> = ({ listing, canEdit = false }) => {
  const [userRole, setUserRole] = useState<UserRole>(canEdit ? 'agent' : 'public');
  const [buyerDetails, setBuyerDetails] = useState<BuyerDetails | null>(null);

  const handleSellerAccess = () => {
    setUserRole('seller');
  };

  const handleBuyerAccess = (buyerData: BuyerDetails) => {
    setBuyerDetails(buyerData);
    setUserRole('buyer');
  };

  const handleOfferSubmit = async (offerData: {
    buyerName: string;
    buyerEmail: string;
    amount: string;
    fundingType: 'Cash' | 'Mortgage' | 'Chain';
    chain: boolean;
    aipPresent: boolean;
    notes: string;
  }) => {
    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: listing._id,
          ...offerData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit offer');
      }

      const result = await response.json();
      console.log('Offer submitted successfully:', result);
      
      // Trigger a custom event to notify other components of the new offer
      window.dispatchEvent(new CustomEvent('newOfferSubmitted', { 
        detail: { 
          listingId: listing._id, 
          offer: result.offer 
        } 
      }));
      
      // The BuyerOfferForm component will handle the success state
    } catch (error) {
      console.error('Error submitting offer:', error);
      throw error;
    }
  };

  // Agent view - full editing capabilities
  if (userRole === 'agent') {
    return <ListingView listing={listing} canEdit={true} />;
  }

  // Seller view - can see all offers
  if (userRole === 'seller') {
    return <SellerView listing={listing} />;
  }

  // Buyer view - can make offers
  if (userRole === 'buyer') {
    return (
      <BuyerOfferForm 
        listing={{
          _id: listing._id,
          address: listing.address,
          listedPrice: listing.listedPrice,
          sellerName: listing.sellerName,
          mainPhoto: listing.mainPhoto
        }}
        buyerDetails={buyerDetails}
        onSubmit={handleOfferSubmit}
      />
    );
  }

  // Public view - access control screen
  return (
    <AccessControl
      sellerCode={listing.sellerCode}
      onSellerAccess={handleSellerAccess}
      onBuyerAccess={handleBuyerAccess}
      propertyAddress={listing.address}
    />
  );
};

export default ListingPageClient;
