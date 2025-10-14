'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { formatPrice, formatPriceInput, parsePrice } from '@/lib/priceUtils';
import { useCustomAlert } from '@/components/ui/CustomAlert';
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
  RefreshCw,
  Clock,
  XCircle
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
    listedPrice: string | number;
    sellerName: string;
    mainPhoto: string;
  };
  buyerDetails: BuyerDetails | null;
  onSubmit: (offerData: OfferFormData) => Promise<void>;
}

interface OfferFormData {
  buyerName: string;
  buyerEmail: string;
  amount: number;
  fundingType: 'Cash' | 'Mortgage' | 'Chain';
  chain: boolean;
  aipPresent: boolean;
  notes: string;
}

interface BuyerOffer {
  id: string;
  listingId: string;
  listingAddress: string;
  listedPrice: string | number;
  sellerName: string;
  mainPhoto: string;
  amount: number;
  status: 'submitted' | 'verified' | 'countered' | 'pending verification' | 'accepted' | 'declined';
  fundingType: 'Cash' | 'Mortgage' | 'Chain';
  chain: boolean;
  aipPresent: boolean;
  submittedAt: string;
  notes?: string;
  counterOffer?: number;
  agentNotes?: string;
}

const BuyerOfferForm: React.FC<BuyerOfferFormProps> = ({ listing, buyerDetails, onSubmit }) => {
  const [formData, setFormData] = useState<OfferFormData>({
    buyerName: buyerDetails?.buyerName || '',
    buyerEmail: buyerDetails?.buyerEmail || '',
    amount: 0,
    fundingType: 'Mortgage',
    chain: false,
    aipPresent: false,
    notes: ''
  });
  const { showAlert, AlertComponent } = useCustomAlert();

  const [amountInput, setAmountInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Offer history state
  const [offers, setOffers] = useState<BuyerOffer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [offersError, setOffersError] = useState<string | null>(null);

  // Counter offer response state
  const [selectedOffer, setSelectedOffer] = useState<BuyerOffer | null>(null);
  const [counterAction, setCounterAction] = useState<'accept' | 'reject' | 'counter'>('accept');
  const [counterAmount, setCounterAmount] = useState('');
  const [counterNotes, setCounterNotes] = useState('');
  const [isResponding, setIsResponding] = useState(false);

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
        return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
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
    } else if (name === 'amount') {
      const formatted = formatPriceInput(value);
      setAmountInput(formatted);
      const numericValue = parsePrice(formatted);
      setFormData(prev => ({
        ...prev,
        amount: numericValue
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
        amount: 0,
        fundingType: 'Mortgage',
        chain: false,
        aipPresent: false,
        notes: ''
      });
      setAmountInput('');
      // Refresh offer history after successful submission
      if (buyerDetails) {
        fetchOffers();
      }
    } catch (error: unknown) {
      console.error('Error submitting offer:', error);
      // Display the specific error message from the API if available
      const errorMessage = (error as { message?: string; error?: string })?.message || (error as { message?: string; error?: string })?.error || 'Failed to submit offer. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle offer withdrawal
  const handleWithdrawOffer = async (offerId: string) => {
    try {
      const response = await fetch(`/api/offers/${offerId}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerEmail: buyerDetails?.buyerEmail
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to withdraw offer');
      }

      // Refresh offers after successful withdrawal
      await fetchOffers();
      showAlert({
        title: 'Success',
        message: 'Offer withdrawn successfully',
        type: 'success',
        autoClose: true
      });
    } catch (error: unknown) {
      console.error('Error withdrawing offer:', error);
      showAlert({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to withdraw offer. Please try again.',
        type: 'error'
      });
    }
  };

  // Handle counter offer response
  const handleCounterOfferResponse = async () => {
    if (!selectedOffer) return;

    setIsResponding(true);
    try {
      const actionData: Record<string, unknown> = {};
      
      if (counterAction === 'counter') {
        if (!counterAmount || parseFloat(counterAmount) <= 0) {
          showAlert({
            title: 'Invalid Amount',
            message: 'Please enter a valid counter offer amount',
            type: 'warning'
          });
          return;
        }
        actionData.counterAmount = parseFloat(counterAmount);
        actionData.counterNotes = counterNotes;
      }

      const response = await fetch(`/api/offers/${selectedOffer.id}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: counterAction,
          buyerEmail: buyerDetails?.buyerEmail,
          ...actionData
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to respond to counter offer');
      }

      // Refresh offers after successful response
      await fetchOffers();
      
      // Reset modal state
      setSelectedOffer(null);
      setCounterAmount('');
      setCounterNotes('');
      setCounterAction('accept');
    } catch (error: unknown) {
      console.error('Error responding to counter offer:', error);
      showAlert({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to respond to counter offer. Please try again.',
        type: 'error'
      });
    } finally {
      setIsResponding(false);
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
              Your offer has been successfully submitted to the seller. They will review it and respond shortly. You will receive an email notification when they respond.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
            >
              View Offer Status
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Check if there's a pending offer
  const pendingOffer = offers.find(offer => 
    offer.status === 'submitted' || offer.status === 'countered'
  );

  return (
    <div className="min-h-screen bg-navy-gradient">
      <AlertComponent />
      {/* Header */}
      <div className="bg-navy-gradient border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6 text-purple-400" />
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
            className="flex flex-col"
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
                    <span>{formatPrice(listing.listedPrice)}</span>
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
              <div className="mt-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6 flex-1 flex flex-col">
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
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mb-2"></div>
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
                  <div className="space-y-4 flex-1 overflow-y-auto">
                    {offers.map((offer, index) => (
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
                                  {offer.amount.toLocaleString()}
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
                            offer.fundingType === 'Mortgage' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}></div>
                          <span>{offer.fundingType}</span>
                          {offer.chain && (
                            <div className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-purple-400" />
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
                            <p className="text-white text-sm font-semibold">{formatPrice(offer.counterOffer)}</p>
                            {offer.agentNotes && (
                              <p className="text-white/70 text-xs mt-1">{offer.agentNotes}</p>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-3 flex items-center gap-2">
                          {/* Withdraw Button - for submitted or countered offers */}
                          {(offer.status === 'submitted' || offer.status === 'countered') && (
                            <button
                              onClick={() => {
                                showAlert({
                                  title: 'Confirm Withdrawal',
                                  message: 'Are you sure you want to withdraw this offer?',
                                  type: 'warning',
                                  showCancel: true,
                                  confirmText: 'Withdraw',
                                  cancelText: 'Cancel',
                                  onConfirm: () => handleWithdrawOffer(offer.id)
                                });
                              }}
                              className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-300 rounded text-xs transition-colors"
                            >
                              <XCircle className="w-3 h-3" />
                              Withdraw
                            </button>
                          )}

                          {/* Counter Offer Response Button - for countered offers */}
                          {offer.status === 'countered' && (
                            <button
                              onClick={() => setSelectedOffer(offer)}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded text-xs transition-colors"
                            >
                              <MessageSquare className="w-3 h-3" />
                              Respond
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
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
                    className={`w-full px-4 py-3 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 ${
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
                    className={`w-full px-4 py-3 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 ${
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
                  value={amountInput}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
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
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
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
                    className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500/50"
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
                    className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500/50"
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
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none"
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
                  disabled={isSubmitting || !!pendingOffer}
                  className="w-full px-6 py-4 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Offer...
                    </>
                  ) : pendingOffer ? (
                    <>
                      <Clock className="w-5 h-5" />
                      Offer Pending
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Offer
                    </>
                  )}
                </button>
              </div>

              {/* Warning message for pending offers */}
              {pendingOffer && (
                <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-200 text-sm font-medium mb-1">
                        You have a pending offer for this property
                      </p>
                      <p className="text-yellow-200/80 text-sm">
                        Your current offer: £{pendingOffer.amount.toLocaleString()} ({pendingOffer.status})
                      </p>
                      <p className="text-yellow-200/80 text-sm mt-1">
                        A new offer can only be made if your previous offer is rejected or withdrawn.
                      </p>
                    </div>
                  </div>
                </div>
              )}

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

      {/* Counter Offer Response Modal */}
      <AnimatePresence>
        {selectedOffer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Respond to Counter Offer
                </h3>
                <p className="text-white/80 text-sm">
                  Review the counter offer and choose your response
                </p>
              </div>

              {/* Offer Details */}
              <div className="mb-6 p-4 bg-white/10 border border-white/20 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/70 text-sm">Your Original Offer:</span>
                  <span className="text-white font-semibold">{formatPrice(selectedOffer.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-300 text-sm font-medium">Counter Offer:</span>
                  <span className="text-blue-300 font-bold text-lg">{formatPrice(selectedOffer.counterOffer || 0)}</span>
                </div>
              </div>

              {/* Response Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-3">
                  Your Response
                </label>
                <select
                  value={counterAction}
                  onChange={(e) => setCounterAction(e.target.value as 'accept' | 'reject' | 'counter')}
                  className="w-full px-4 py-3 bg-white/20 border border-white/40 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-200 backdrop-blur-sm"
                >
                  <option value="accept" className="bg-gray-800 text-white">Accept Counter Offer</option>
                  <option value="reject" className="bg-gray-800 text-white">Reject Counter Offer</option>
                  <option value="counter" className="bg-gray-800 text-white">Make New Counter Offer</option>
                </select>
              </div>

              {/* Counter Offer Form */}
              {counterAction === 'counter' && (
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">
                      Your Counter Offer Amount
                    </label>
                    <input
                      type="text"
                      value={counterAmount}
                      onChange={(e) => setCounterAmount(formatPriceInput(e.target.value))}
                      placeholder="e.g., 450000"
                      className="w-full px-4 py-3 bg-white/20 border border-white/40 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">
                      Counter Offer Notes (Optional)
                    </label>
                    <textarea
                      value={counterNotes}
                      onChange={(e) => setCounterNotes(e.target.value)}
                      placeholder="Add any notes for the seller..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/20 border border-white/40 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-200 backdrop-blur-sm resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setSelectedOffer(null);
                    setCounterAmount('');
                    setCounterNotes('');
                    setCounterAction('accept');
                  }}
                  className="flex-1 px-6 py-3 border border-white/30 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 text-sm font-medium backdrop-blur-sm"
                  disabled={isResponding}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCounterOfferResponse}
                  disabled={isResponding}
                  className={`flex-1 px-6 py-3 text-white rounded-xl transition-all duration-200 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    counterAction === 'accept' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700' :
                    counterAction === 'reject' ? 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700' :
                    'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                  } disabled:opacity-50 disabled:transform-none`}
                >
                  {isResponding ? 'Processing...' : 
                   counterAction === 'accept' ? 'Accept Counter Offer' :
                   counterAction === 'reject' ? 'Reject Counter Offer' :
                   'Send Counter Offer'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuyerOfferForm;
