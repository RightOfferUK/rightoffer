'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
  PoundSterling, 
  User, 
  Mail, 
  CreditCard, 
  Home, 
  Send, 
  Loader2, 
  Check, 
  History,
  Calendar,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface BuyerDetails {
  buyerName: string;
  buyerEmail: string;
  code: string;
}

interface BuyerOfferFormProps {
  listing: {
    _id: string;
    address: string;
    listedPrice: string;
    sellerName: string;
    mainPhoto: string;
  };
  buyerDetails: BuyerDetails | null;
  onSubmit: (offerData: OfferFormData) => Promise<void>;
}

interface OfferFormData {
  buyerName: string;
  buyerEmail: string;
  amount: string;
  fundingType: 'Cash' | 'Mortgage' | 'Chain';
  chain: boolean;
  aipPresent: boolean;
  notes: string;
}

interface BuyerOffer {
  id: string;
  listingId: string;
  listingAddress: string;
  listedPrice: string;
  sellerName: string;
  mainPhoto: string;
  amount: string;
  status: 'submitted' | 'verified' | 'countered' | 'pending verification' | 'accepted' | 'declined';
  fundingType: 'Cash' | 'Mortgage' | 'Chain';
  chain: boolean;
  aipPresent: boolean;
  submittedAt: string;
  notes?: string;
  counterOffer?: string;
  agentNotes?: string;
}

const BuyerOfferForm: React.FC<BuyerOfferFormProps> = ({ listing, buyerDetails, onSubmit }) => {
  const [formData, setFormData] = useState<OfferFormData>({
    buyerName: buyerDetails?.buyerName || '',
    buyerEmail: buyerDetails?.buyerEmail || '',
    amount: '',
    fundingType: 'Mortgage',
    chain: false,
    aipPresent: false,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Offer history state
  const [offers, setOffers] = useState<BuyerOffer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [offersError, setOffersError] = useState<string | null>(null);

  // Fetch buyer's offer history
  const fetchOffers = useCallback(async () => {
    if (!buyerDetails) return;
    
    try {
      setLoadingOffers(true);
      const response = await fetch(`/api/buyer-codes/${buyerDetails.code}/offers`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }

      const data = await response.json();
      setOffers(data.offers || []);
      setOffersError(null);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setOffersError(err instanceof Error ? err.message : 'Failed to fetch offers');
    } finally {
      setLoadingOffers(false);
    }
  }, [buyerDetails]);

  // Fetch offers when component mounts and buyer details are available
  useEffect(() => {
    if (buyerDetails) {
      fetchOffers();
    }
  }, [buyerDetails, fetchOffers]);

  // Helper functions for offer history
  const getStatusColor = (status: BuyerOffer['status']) => {
    switch (status) {
      case 'submitted':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'verified':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'countered':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'pending verification':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'accepted':
        return 'text-green-500 bg-green-500/30 border-green-500/40';
      case 'declined':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(formData);
      setSuccess(true);
      // Reset form
      setFormData({
        buyerName: buyerDetails?.buyerName || '',
        buyerEmail: buyerDetails?.buyerEmail || '',
        amount: '',
        fundingType: 'Mortgage',
        chain: false,
        aipPresent: false,
        notes: ''
      });
      // Refresh offer history after successful submission
      if (buyerDetails) {
        fetchOffers();
      }
    } catch (error) {
      console.error('Error submitting offer:', error);
      setError('Failed to submit offer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  if (success) {
    return (
      <div className="min-h-screen bg-navy-gradient flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white font-dm-sans mb-4">
              Offer Submitted!
            </h2>
            <p className="text-white/70 mb-6">
              Your offer has been successfully submitted to the seller. They will review it and respond shortly.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
            >
              Submit Another Offer
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-gradient">
      {/* Header */}
      <div className="bg-navy-gradient border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6 text-orange-400" />
              <div>
                <h1 className="text-2xl font-bold text-white font-dm-sans">
                  Make an Offer
                </h1>
                {buyerDetails && (
                  <p className="text-white/70 text-sm">Welcome back, {buyerDetails.buyerName}</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Details - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 top-8">
              <h2 className="text-xl font-semibold text-white mb-4 font-dm-sans">
                Property Details
              </h2>
              
              {/* Property Image */}
              <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                <Image
                  src={listing.mainPhoto || '/placeholder-house.jpg'}
                  alt={listing.address}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Property Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {listing.address}
                  </h3>
                  <div className="flex items-center gap-2 text-green-400 text-xl font-bold">
                    <PoundSterling className="w-5 h-5" />
                    <span>{listing.listedPrice}</span>
                  </div>
                  <p className="text-white/70 text-sm mt-1">Listed Price</p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-white/70 text-sm">
                    <span className="font-medium text-white">Seller:</span> {listing.sellerName}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-white/60 text-sm">
                    Submit your best offer below. The seller will review and respond to your proposal.
                  </p>
                </div>
              </div>
            </div>

            {/* Offer History Section */}
            {buyerDetails && (
              <div className="mt-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Your Previous Offers</h3>
                  <button
                    onClick={fetchOffers}
                    disabled={loadingOffers}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/70 hover:text-white transition-colors text-sm"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingOffers ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                {/* Error State */}
                {offersError && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p className="text-red-300 text-sm">{offersError}</p>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loadingOffers ? (
                  <div className="text-center py-6">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mb-2"></div>
                    <p className="text-white/70 text-sm">Loading your offers...</p>
                  </div>
                ) : offers.length === 0 ? (
                  /* Empty State */
                  <div className="text-center py-6">
                    <History className="w-10 h-10 text-white/30 mx-auto mb-3" />
                    <p className="text-white/50 text-sm">No previous offers yet</p>
                  </div>
                ) : (
                  /* Offers List */
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {offers.slice(0, 3).map((offer, index) => (
                      <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm truncate">
                              {offer.listingAddress}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1">
                                <PoundSterling className="w-3 h-3 text-green-400" />
                                <span className="text-green-400 font-semibold text-sm">
                                  {offer.amount}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-white/50" />
                                <span className="text-white/50 text-xs">
                                  {formatDate(offer.submittedAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(offer.status)}`}>
                            {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                          </span>
                        </div>

                        {/* Additional Info */}
                        <div className="flex items-center gap-3 text-xs text-white/60">
                          <div className={`w-2 h-2 rounded-full ${
                            offer.fundingType === 'Cash' ? 'bg-green-500' : 
                            offer.fundingType === 'Mortgage' ? 'bg-blue-500' : 'bg-orange-500'
                          }`}></div>
                          <span>{offer.fundingType}</span>
                          {offer.chain && (
                            <div className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-orange-400" />
                              <span>Chain</span>
                            </div>
                          )}
                          {offer.aipPresent && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              <span>AIP</span>
                            </div>
                          )}
                        </div>

                        {/* Counter Offer */}
                        {offer.counterOffer && (
                          <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded">
                            <div className="flex items-center gap-1 mb-1">
                              <MessageSquare className="w-3 h-3 text-blue-400" />
                              <span className="text-blue-400 font-medium text-xs">Counter Offer</span>
                            </div>
                            <p className="text-white text-sm font-semibold">{offer.counterOffer}</p>
                            {offer.agentNotes && (
                              <p className="text-white/70 text-xs mt-1">{offer.agentNotes}</p>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    {offers.length > 3 && (
                      <div className="text-center pt-2">
                        <p className="text-white/50 text-xs">
                          Showing 3 of {offers.length} offers
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Offer Form - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-8">
              <h2 className="text-xl font-semibold text-white mb-6 font-dm-sans">
                Your Offer Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    <User className="inline w-4 h-4 mr-2" />
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="buyerName"
                    value={formData.buyerName}
                    onChange={handleInputChange}
                    required
                    disabled={!!buyerDetails}
                    className={`w-full px-4 py-3 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 ${
                      buyerDetails 
                        ? 'bg-white/5 border-green-500/30 cursor-not-allowed' 
                        : 'bg-white/10 border-white/20'
                    }`}
                    placeholder="John Smith"
                  />
                  {buyerDetails && (
                    <p className="text-green-400/70 text-xs mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Pre-filled from your buyer code
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    <Mail className="inline w-4 h-4 mr-2" />
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="buyerEmail"
                    value={formData.buyerEmail}
                    onChange={handleInputChange}
                    required
                    disabled={!!buyerDetails}
                    className={`w-full px-4 py-3 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 ${
                      buyerDetails 
                        ? 'bg-white/5 border-green-500/30 cursor-not-allowed' 
                        : 'bg-white/10 border-white/20'
                    }`}
                    placeholder="john@example.com"
                  />
                  {buyerDetails && (
                    <p className="text-green-400/70 text-xs mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Pre-filled from your buyer code
                    </p>
                  )}
                </div>
              </div>

              {/* Offer Amount */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  <PoundSterling className="inline w-4 h-4 mr-2" />
                  Offer Amount *
                </label>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                  placeholder="£450,000"
                />
              </div>

              {/* Funding Type */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  <CreditCard className="inline w-4 h-4 mr-2" />
                  Funding Type *
                </label>
                <select
                  name="fundingType"
                  value={formData.fundingType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                >
                  <option value="Cash" className="bg-gray-800">Cash</option>
                  <option value="Mortgage" className="bg-gray-800">Mortgage</option>
                  <option value="Chain" className="bg-gray-800">Chain</option>
                </select>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="chain"
                    checked={formData.chain}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500/50"
                  />
                  <label className="ml-3 text-white/70">
                    I have a property to sell (chain)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="aipPresent"
                    checked={formData.aipPresent}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-orange-500 bg-white/10 border-white/20 rounded focus:ring-orange-500/50"
                  />
                  <label className="ml-3 text-white/70">
                    I have an Agreement in Principle (AIP)
                  </label>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none"
                  placeholder="Any additional information about your offer..."
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Offer...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Offer
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-4">
                <p className="text-white/50 text-sm">
                  Your offer will be sent directly to the seller for review
                </p>
              </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BuyerOfferForm;
