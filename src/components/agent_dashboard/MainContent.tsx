'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ListingsTable from './ListingsTable';
import OffersInbox from './OffersInbox';

type ActiveTab = 'listings' | 'offers';

const MainContent = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('listings');

  return (
    <div className="w-2/3 p-6">
      <div className="mb-6">
        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'listings'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Listings
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'offers'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            Offers Inbox
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'listings' ? <ListingsTable /> : <OffersInbox />}
      </motion.div>
    </div>
  );
};

export default MainContent;
