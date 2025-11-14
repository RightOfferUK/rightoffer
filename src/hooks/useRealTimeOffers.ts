'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Offer {
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
  counterOffer?: number;
  counterOfferBy?: 'seller' | 'agent' | 'buyer';
  agentNotes?: string;
  statusUpdatedAt?: string;
  updatedBy?: string;
}

interface OffersData {
  offers: Offer[];
  totalOffers: number;
  highestOffer: number;
  listingStatus?: string;
}

export const useRealTimeOffers = (listingId: string, enabled: boolean = true) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [totalOffers, setTotalOffers] = useState(0);
  const [highestOffer, setHighestOffer] = useState(0);
  const [listingStatus, setListingStatus] = useState<string>('live');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<number>(0);

  const fetchOffers = useCallback(async () => {
    if (!listingId || !enabled) return;

    try {
      const response = await fetch(`/api/listings/${listingId}/offers`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }

      const data: OffersData = await response.json();
      
      // Check if offers or listing status have changed
      const hasChanged = 
        data.offers.length !== totalOffers || 
        data.highestOffer !== highestOffer ||
        data.listingStatus !== listingStatus ||
        Date.now() - lastFetchRef.current > 30000 || // Force update every 30 seconds
        JSON.stringify(data.offers.map(o => ({ id: o.id, status: o.status, counterOffer: o.counterOffer }))) !== 
        JSON.stringify(offers.map(o => ({ id: o.id, status: o.status, counterOffer: o.counterOffer })));

      if (hasChanged) {
        setOffers(data.offers);
        setTotalOffers(data.totalOffers);
        setHighestOffer(data.highestOffer);
        if (data.listingStatus) {
          setListingStatus(data.listingStatus);
        }
        lastFetchRef.current = Date.now();
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  }, [listingId, enabled, totalOffers, highestOffer, listingStatus, offers]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchOffers();
    }
  }, [fetchOffers, enabled]);

  // Set up polling for real-time updates
  useEffect(() => {
    if (!enabled) return;

    // Poll every 5 seconds for real-time updates
    intervalRef.current = setInterval(fetchOffers, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchOffers, enabled]);

  // Manual refresh function
  const refreshOffers = useCallback(() => {
    setLoading(true);
    lastFetchRef.current = 0; // Reset to force update on next fetch
    return fetchOffers();
  }, [fetchOffers]);

  // Add new offer optimistically (for immediate UI update)
  const addOfferOptimistically = useCallback((newOffer: Offer) => {
    setOffers(prev => [newOffer, ...prev]);
    setTotalOffers(prev => prev + 1);
    
    const offerAmount = newOffer.amount;
    if (offerAmount > highestOffer) {
      setHighestOffer(offerAmount);
    }
  }, [highestOffer]);

  return {
    offers,
    totalOffers,
    highestOffer,
    listingStatus,
    loading,
    error,
    refreshOffers,
    addOfferOptimistically
  };
};
