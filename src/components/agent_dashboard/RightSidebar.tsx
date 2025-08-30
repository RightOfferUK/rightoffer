'use client';

import React from 'react';
import AddListingForm from './AddListingForm';

const RightSidebar = () => {
  return (
    <div className="w-1/3 p-6 space-y-6">
      {/* Add Listing Form */}
      <AddListingForm />
      
    </div>
  );
};

export default RightSidebar;
