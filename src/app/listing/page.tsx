'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Search, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ListingEntryPage = () => {
  const [propertyId, setPropertyId] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!propertyId.trim()) {
      setError('Please enter a property ID');
      return;
    }

    setIsValidating(true);

    try {
      // Check if the listing exists
      const response = await fetch(`/api/listings/${propertyId.trim()}`);
      
      if (response.ok) {
        // Listing exists, redirect to it
        router.push(`/listing/${propertyId.trim()}`);
      } else if (response.status === 404) {
        setError('Property not found. Please check your property ID and try again.');
      } else {
        setError('Unable to verify property ID. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsValidating(false);
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
            <p className="text-white/70 mb-2">
              Enter your property ID to access seller or buyer codes
            </p>
            <p className="text-white/50 text-sm">
              This ID was sent to you via email when the property was listed
            </p>
          </div>

          {/* Property ID Entry Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Property ID
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                  placeholder="Enter property ID"
                  required
                  autoFocus
                />
              </div>
              <p className="text-white/50 text-xs mt-2">
                Example: 507f1f77bcf86cd799439011
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
              >
                <p className="text-red-300 text-sm">{error}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isValidating}
              className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Property...
                </>
              ) : (
                <>
                  Access Property
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-white font-medium mb-3 text-sm">Need help?</h3>
            <div className="space-y-2 text-xs text-white/60">
              <p>• Check your email for the property ID</p>
              <p>• Property IDs are usually 24 characters long</p>
              <p>• Contact your agent if you can&apos;t find your ID</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ListingEntryPage;
