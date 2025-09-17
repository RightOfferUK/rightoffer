'use client';

import React from 'react';
import AddRealEstateAdminForm from './AddRealEstateAdminForm';

const RightSidebar = () => {
  return (
    <div className="w-1/3 p-6 space-y-6">
      {/* Add Real Estate Company Form */}
      <AddRealEstateAdminForm />
      
    </div>
  );
};

export default RightSidebar;
