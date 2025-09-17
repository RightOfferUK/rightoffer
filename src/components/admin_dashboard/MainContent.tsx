'use client';

import React from 'react';
import RealEstateAdminsTable from './RealEstateAdminsTable';

const MainContent = () => {
  return (
    <div className="w-2/3 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white font-dm-sans">Real Estate Companies</h2>
        <p className="text-white/70 mt-1">Manage and track all real estate companies</p>
      </div>

      <RealEstateAdminsTable />
    </div>
  );
};

export default MainContent;
