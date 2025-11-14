'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, XCircle, MessageSquare, PoundSterling, AlertCircle } from 'lucide-react';
import { formatPriceInput, parsePrice, formatPrice } from '@/lib/priceUtils';

interface Offer {
  id: string;
  _id?: string;
  buyerName: string;
  amount: number;
  status: 'submitted' | 'accepted' | 'rejected' | 'countered' | 'withdrawn';
  counterOffer?: number;
}

interface OfferActionsProps {
  offer: Offer;
  listingId: string;
  onActionComplete: () => void | Promise<void>;
  showActions?: boolean;
  isSeller?: boolean;
  sellerCode?: string;
}

type ConfirmAction = 'accept' | 'decline' | 'counter' | null;

const OfferActions: React.FC<OfferActionsProps> = ({ 
  offer, 
  listingId, 
  onActionComplete,
  showActions = true,
  isSeller = false,
  sellerCode 
}) => {
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [counterAmount, setCounterAmount] = useState('');
  const [counterNotes, setCounterNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Only show actions for submitted offers
  if (!showActions || offer.status !== 'submitted') {
    return null;
  }

  const handleOfferStatusUpdate = async (
    offerId: string, 
    status: string, 
    counterOffer?: string, 
    notes?: string
  ) => {
    try {
      setIsSubmitting(true);
      setError('');

      // Use different endpoint based on user type
      const endpoint = isSeller 
        ? `/api/listings/${listingId}/offers/${offerId}/seller-action`
        : `/api/listings/${listingId}/offers/${offerId}`;

      const requestBody: Record<string, unknown> = {
        status,
        counterOffer,
        notes
      };

      // Add seller code if it's a seller action
      if (isSeller && sellerCode) {
        requestBody.sellerCode = sellerCode;
      }

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update offer status');
      }

      // Reset state
      setConfirmAction(null);
      setCounterAmount('');
      setCounterNotes('');
      
      // Small delay to ensure database has updated
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Call the callback to refresh offers and wait for it
      await onActionComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update offer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAction = () => {
    if (confirmAction === 'accept') {
      handleOfferStatusUpdate(offer.id, 'accepted');
    } else if (confirmAction === 'decline') {
      handleOfferStatusUpdate(offer.id, 'rejected');
    } else if (confirmAction === 'counter') {
      const counterAmountValue = parsePrice(counterAmount);
      if (counterAmountValue > 0) {
        handleOfferStatusUpdate(
          offer.id, 
          'countered', 
          counterAmountValue.toString(), 
          counterNotes || undefined
        );
      } else {
        setError('Please enter a valid counter offer amount.');
      }
    }
  };

  const handleCancel = () => {
    setConfirmAction(null);
    setCounterAmount('');
    setCounterNotes('');
    setError('');
  };

  return (
    <>
      {/* Action Buttons */}
      {!confirmAction && (
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setConfirmAction('accept')}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
          >
            <Check className="w-4 h-4" />
            Accept
          </button>
          <button
            onClick={() => setConfirmAction('decline')}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
          >
            <XCircle className="w-4 h-4" />
            Decline
          </button>
          <button
            onClick={() => setConfirmAction('counter')}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Counter
          </button>
        </div>
      )}

      {/* Inline Confirmation Box */}
      <AnimatePresence>
        {confirmAction && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 overflow-hidden"
          >
            <div className="bg-white/5 border border-white/20 rounded-lg p-4">
              {/* Confirmation Header */}
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <h4 className="text-white font-semibold">
                  {confirmAction === 'accept' && 'Accept Offer'}
                  {confirmAction === 'decline' && 'Decline Offer'}
                  {confirmAction === 'counter' && 'Counter Offer'}
                </h4>
              </div>

              {/* Offer Details */}
              <div className="mb-4 p-3 bg-white/5 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/70">Buyer:</span>
                  <span className="text-white font-medium">{offer.buyerName}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-white/70">Offer Amount:</span>
                  <span className="text-green-400 font-semibold">{formatPrice(offer.amount)}</span>
                </div>
              </div>

              {/* Confirmation Message */}
              {confirmAction === 'accept' && (
                <p className="text-white/80 text-sm mb-4">
                  Are you sure you want to accept this offer? This will mark the property as under offer.
                </p>
              )}
              {confirmAction === 'decline' && (
                <p className="text-white/80 text-sm mb-4">
                  Are you sure you want to decline this offer?
                </p>
              )}

              {/* Counter Offer Inputs */}
              {confirmAction === 'counter' && (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">
                      <PoundSterling className="inline w-3 h-3 mr-1" />
                      Your Counter Offer Amount
                    </label>
                    <input
                      type="text"
                      value={counterAmount}
                      onChange={(e) => setCounterAmount(formatPriceInput(e.target.value))}
                      placeholder="e.g., £450,000"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={counterNotes}
                      onChange={(e) => setCounterNotes(e.target.value)}
                      placeholder="Add any notes..."
                      rows={2}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-white/30 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                    confirmAction === 'accept' 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : confirmAction === 'decline'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isSubmitting ? 'Processing...' : (
                    <>
                      {confirmAction === 'accept' && 'Confirm Accept'}
                      {confirmAction === 'decline' && 'Confirm Decline'}
                      {confirmAction === 'counter' && 'Send Counter Offer'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OfferActions;

