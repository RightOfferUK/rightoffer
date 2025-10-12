'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Mail } from 'lucide-react';
import { useSession } from 'next-auth/react';

const ListingUsageAlert = () => {
  const { data: session } = useSession();

  // Don't render if no session or not real estate admin
  if (!session?.user || session.user.role !== 'real_estate_admin') {
    return null;
  }

  const { maxListings = 0, usedListings = 0 } = session.user;

  // Don't show anything if maxListings is 0 or unlimited
  if (maxListings === 0) {
    return null;
  }

  // Only show alert if all listings are used up
  if (usedListings < maxListings) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-red-300 font-semibold font-dm-sans mb-1">
            All Listings Used Up
          </h3>
          <p className="text-red-200/80 text-sm mb-3">
            You have used all {maxListings} of your allocated property listings. 
            To get more listings, please contact the RightOffer admin team.
          </p>
          <div className="flex items-center gap-2 text-red-200/70 text-xs">
            <Mail className="w-4 h-4" />
            <span>Contact: admin@rightoffer.com</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ListingUsageAlert;
