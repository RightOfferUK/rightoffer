'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, PoundSterling, Home, Loader2 } from 'lucide-react';

interface BuyerDetails {
  buyerName: string;
  buyerEmail: string;
  code: string;
}

interface AccessControlProps {
  sellerCode: string;
  onSellerAccess: () => void;
  onBuyerAccess: (buyerDetails: BuyerDetails) => void;
  propertyAddress: string;
}

const AccessControl: React.FC<AccessControlProps> = ({ 
  sellerCode, 
  onSellerAccess, 
  onBuyerAccess,
  propertyAddress 
}) => {
  const [enteredCode, setEnteredCode] = useState('');
  const [accessType, setAccessType] = useState<'seller' | 'buyer' | null>(null);
  const [error, setError] = useState('');
  const [validatingBuyerCode, setValidatingBuyerCode] = useState(false);

  const validateBuyerCode = async (code: string) => {
    setValidatingBuyerCode(true);
    setError('');

    try {
      const response = await fetch(`/api/buyer-codes/${code.trim()}`);
      const data = await response.json();

      if (data.valid) {
        // Pass buyer details to parent component
        onBuyerAccess({
          buyerName: data.buyerCode.buyerName,
          buyerEmail: data.buyerCode.buyerEmail,
          code: data.buyerCode.code
        });
      } else {
        setError(data.error || 'Invalid or expired buyer code. Please check your code and try again.');
      }
    } catch {
      setError('Failed to validate buyer code. Please try again.');
    } finally {
      setValidatingBuyerCode(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (accessType === 'seller') {
      if (enteredCode.toUpperCase() === sellerCode.toUpperCase()) {
        onSellerAccess();
      } else {
        setError('Invalid seller code. Please check your code and try again.');
      }
    } else if (accessType === 'buyer') {
      if (enteredCode.trim().length >= 4) {
        validateBuyerCode(enteredCode.trim());
      } else {
        setError('Please enter a valid buyer code.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-navy-gradient flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Home className="w-8 h-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white font-dm-sans">
                Property Access
              </h1>
            </div>
            <p className="text-white/70 mb-2">{propertyAddress}</p>
            <p className="text-white/50 text-sm">
              Enter your access code to view property details
            </p>
          </div>

          {!accessType ? (
            /* Access Type Selection */
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white text-center mb-6">
                I am a...
              </h2>
              
              <button
                onClick={() => setAccessType('seller')}
                className="w-full p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-blue-400" />
                  <div className="text-left">
                    <h3 className="text-white font-semibold">Property Seller</h3>
                    <p className="text-white/60 text-sm">View all offers on my property</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setAccessType('buyer')}
                className="w-full p-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <PoundSterling className="w-6 h-6 text-green-400" />
                  <div className="text-left">
                    <h3 className="text-white font-semibold">Potential Buyer</h3>
                    <p className="text-white/60 text-sm">Make an offer on this property</p>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            /* Code Entry Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
                  {accessType === 'seller' ? (
                    <>
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 font-medium">Seller Access</span>
                    </>
                  ) : (
                    <>
                      <PoundSterling className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium">Buyer Access</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  {accessType === 'seller' ? 'Seller Code' : 'Buyer Reference Code'}
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                    placeholder={accessType === 'seller' ? 'Enter your seller code' : 'Enter your buyer code'}
                    required
                  />
                </div>
                {accessType === 'seller' && (
                  <p className="text-white/50 text-xs mt-2">
                    This was provided to you when the listing was created
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAccessType(null);
                    setEnteredCode('');
                    setError('');
                  }}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={validatingBuyerCode}
                  className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {validatingBuyerCode && accessType === 'buyer' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    'Access Property'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AccessControl;
