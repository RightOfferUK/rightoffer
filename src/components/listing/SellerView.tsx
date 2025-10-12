'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRealTimeOffers } from '@/hooks/useRealTimeOffers';
import { formatPrice } from '@/lib/priceUtils';
import { 
  Home, 
  PoundSterling, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Users,
  Clock,
  Eye,
  RefreshCw
} from 'lucide-react';

interface Offer {
  _id?: string;
  id: string;
  buyerName: string;
  buyerEmail: string;
  amount: number;
  status: 'submitted' | 'verified' | 'countered' | 'pending verification' | 'accepted' | 'declined';
  fundingType: 'Cash' | 'Mortgage' | 'Chain';
  chain: boolean;
  aipPresent: boolean;
  submittedAt: string;
  notes?: string;
  counterOffer?: number;
  agentNotes?: string;
  statusUpdatedAt?: string;
  updatedBy?: string;
}

interface SellerViewProps {
  listing: {
    _id: string;
    address: string;
    sellerName: string;
    listedPrice: number | string; // Support both for backwards compatibility
    mainPhoto: string;
    status: string;
    offers: Offer[];
    createdAt: string;
  };
}

const SellerView: React.FC<SellerViewProps> = ({ listing }) => {
  // Real-time offers hook
  const { 
    offers: liveOffers, 
    totalOffers, 
    highestOffer: liveHighestOffer, 
    loading: offersLoading, 
    error: offersError,
    refreshOffers 
  } = useRealTimeOffers(listing._id, true);

  const getStatusColor = (status: Offer['status']) => {
    switch (status) {
      case 'submitted':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'verified':
        return 'text-green-400 bg-green-500/20';
      case 'countered':
        return 'text-blue-400 bg-blue-500/20';
      case 'pending verification':
        return 'text-purple-400 bg-purple-500/20';
      case 'accepted':
        return 'text-green-500 bg-green-500/30';
      case 'declined':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  // Use real-time offers if available, otherwise fall back to listing offers
  const displayOffers = liveOffers.length > 0 ? liveOffers : listing.offers;
  const sortedOffers = [...displayOffers].sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  const highestOffer = liveHighestOffer > 0 ? liveHighestOffer : (
    listing.offers.length > 0 
      ? Math.max(...listing.offers.map(offer => offer.amount))
      : 0
  );

  return (
    <div className="min-h-screen bg-navy-gradient">
      {/* Header */}
      <div className="bg-navy-gradient border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Home className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white font-dm-sans">
              Your Property
            </h1>
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl text-white font-semibold">{listing.address}</h2>
            <p className="text-white/70">Hello {listing.sellerName}</p>
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <PoundSterling className="w-4 h-4 text-green-400" />
              <span>Listed: {formatPrice(listing.listedPrice)}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Highest Offer: {highestOffer > 0 ? `£${highestOffer.toLocaleString()}` : 'None yet'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-400" />
              <span>{totalOffers || listing.offers.length} offers received</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                listing.status === 'live' ? 'bg-green-500/20 text-green-400' :
                listing.status === 'archive' ? 'bg-gray-500/20 text-gray-400' :
                listing.status === 'sold' ? 'bg-blue-500/20 text-blue-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {listing.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Offers */}
          <div className="lg:col-span-3">
            {/* Property Image */}
            {listing.mainPhoto && (
              <div className="mb-8">
                <Image
                  src={listing.mainPhoto}
                  alt={listing.address}
                  width={800}
                  height={400}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                  priority
                />
              </div>
            )}

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white font-dm-sans">
                  Offers on Your Property ({totalOffers || listing.offers.length})
                </h2>
                <button
                  onClick={refreshOffers}
                  disabled={offersLoading}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/70 hover:text-white transition-colors text-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${offersLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {/* Error State */}
              {offersError && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
                  <p className="text-red-300 text-sm">{offersError}</p>
                </div>
              )}
              
              <div className="space-y-4">
                {sortedOffers.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white/70 mb-2">No offers yet</h3>
                    <p className="text-white/50">Offers will appear here as they are submitted by potential buyers.</p>
                  </div>
                ) : (
                  sortedOffers.map((offer, index) => (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-medium text-white">
                              {offer.buyerName}
                            </h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(offer.status)}`}>
                              {offer.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-white/70 mb-3">
                            <div className="flex items-center gap-2">
                              <PoundSterling className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 font-semibold text-xl">
                                {formatPrice(offer.amount)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                offer.fundingType === 'Cash' ? 'bg-green-500' : 
                                offer.fundingType === 'Mortgage' ? 'bg-blue-500' : 'bg-purple-500'
                              }`}></div>
                              <span>{offer.fundingType}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(offer.submittedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm">
                            {offer.chain && (
                              <div className="flex items-center gap-1 text-purple-400">
                                <AlertCircle className="w-4 h-4" />
                                <span>Has chain</span>
                              </div>
                            )}
                            {offer.aipPresent && (
                              <div className="flex items-center gap-1 text-green-400">
                                <CheckCircle className="w-4 h-4" />
                                <span>AIP Present</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3 text-white/60 text-sm">
                            <strong>Contact:</strong> {offer.buyerEmail}
                          </div>
                        </div>
                      </div>
                      
                      {offer.notes && (
                        <div className="mt-4 p-3 bg-white/5 rounded-lg">
                          <h4 className="text-white/80 font-medium text-sm mb-2">Buyer&apos;s Message:</h4>
                          <p className="text-white/80 text-sm">{offer.notes}</p>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-white font-dm-sans mb-4">
                Property Summary
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h4 className="text-green-300 font-semibold mb-2">Listed Price</h4>
                  <p className="text-white text-xl font-bold">{formatPrice(listing.listedPrice)}</p>
                </div>
                
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <h4 className="text-purple-300 font-semibold mb-2">Highest Offer</h4>
                  <p className="text-white text-xl font-bold">
                    {highestOffer > 0 ? `£${highestOffer.toLocaleString()}` : 'None yet'}
                  </p>
                </div>
                
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="text-blue-300 font-semibold mb-2">Total Offers</h4>
                  <p className="text-white text-xl font-bold">{totalOffers || listing.offers.length}</p>
                </div>
                
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <h4 className="text-purple-300 font-semibold mb-2">Status</h4>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    listing.status === 'live' ? 'bg-green-500/20 text-green-400' :
                    listing.status === 'archive' ? 'bg-gray-500/20 text-gray-400' :
                    listing.status === 'sold' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {listing.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-300 text-sm">
                  <strong>Need help?</strong> Contact your agent to discuss any offers or questions about your property listing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerView;
