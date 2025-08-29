'use client';

import React, { useState } from 'react';
import AddListingModal from './AddListingModal';

const RightSidebar = () => {
  const [isAddListingModalOpen, setIsAddListingModalOpen] = useState(false);

  const handleAddListing = async (listingData: any) => {
    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Listing created successfully:', result.listing);
        // The success message will be shown in the modal
        // TODO: Refresh listings table or update state
      } else {
        throw new Error(result.error || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error; // Re-throw so the modal can handle it
    }
  };

  return (
    <>
      <div className="w-1/3 p-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white font-dm-sans mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setIsAddListingModalOpen(true)}
              className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
            >
              Add New Listing
            </button>
            <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors">
              Generate Seller Code
            </button>
 
          </div>
        
        <div className="mt-8">
          <h4 className="text-md font-medium text-white/80 font-dm-sans mb-4">Recent Activity</h4>
          <div className="space-y-3 text-sm text-white/60">
            <div className="p-3 bg-white/5 rounded-lg">
              <p>New offer received on Oak Street</p>
              <p className="text-xs text-white/40 mt-1">2 hours ago</p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <p>Listing views increased 15% this week</p>
              <p className="text-xs text-white/40 mt-1">1 day ago</p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <p>Document verification completed</p>
              <p className="text-xs text-white/40 mt-1">2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Add Listing Modal */}
    <AddListingModal
      isOpen={isAddListingModalOpen}
      onClose={() => setIsAddListingModalOpen(false)}
      onSubmit={handleAddListing}
    />
  </>
  );
};

export default RightSidebar;
