'use client';

import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-navy-gradient border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <span className="text-white font-dm-sans text-xl font-bold">rightoffer</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#how-it-works" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium font-dm-sans">
                How it works
              </a>

              <div className="relative group">
                <button className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium font-dm-sans flex items-center">
                  For Agents
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              <div className="relative group">
                <button className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium font-dm-sans flex items-center">
                  For Sellers
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <div className="relative group">
                <button className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium font-dm-sans flex items-center">
                  For Buyers
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <a href="#pricing" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium font-dm-sans">
                Pricing
              </a>

              <a href="#contact" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium font-dm-sans">
                Contact
              </a>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button className="btn-primary-gradient px-6 py-2 rounded-md text-sm font-medium font-dm-sans font-semibold">
              List your house
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-navy-light rounded-lg mt-2">
              <a href="#how-it-works" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium font-dm-sans">
                How it works
              </a>
              <a href="#agents" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium font-dm-sans">
                For Agents
              </a>
              <a href="#sellers" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium font-dm-sans">
                For Sellers
              </a>
              <a href="#buyers" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium font-dm-sans">
                For Buyers
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium font-dm-sans">
                Pricing
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white block px-3 py-2 text-base font-medium font-dm-sans">
                Contact
              </a>
              <button className="btn-primary-gradient w-full mt-4 px-6 py-2 rounded-md text-sm font-medium font-dm-sans font-semibold">
                List your house
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
