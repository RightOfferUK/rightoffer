'use client';

import React from 'react';
import AddAgentForm from './AddAgentForm';

const RightSidebar = () => {
  return (
    <div className="w-1/3 p-6 space-y-6">
      {/* Add Agent Form */}
      <AddAgentForm />
      
    </div>
  );
};

export default RightSidebar;
