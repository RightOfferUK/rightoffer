'use client';

import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-white font-dm-sans text-xl font-bold">rightoffer</span>
          </div>

          {/* Copyright */}
          <div className="text-white/60 font-dm-sans text-sm text-center">
            © 2024 RightOffer. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
