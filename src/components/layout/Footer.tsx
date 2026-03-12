'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="border-t border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-white font-dm-sans text-xl font-bold">rightoffer</span>
          </div>

          {/* Address & Legal Links */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-white/60 font-dm-sans text-sm text-center">
            <span>
            167-169 Great Portland Street, 5th Floor, London, England, W1W 5PF            </span>
            <span className="hidden md:inline">|</span>
            {/* Legal links */}
            <Link
              href="/privacy-policy"
              className="hover:text-purple-400 transition-colors underline"
            >
              Privacy Policy
            </Link>
            <span className="hidden md:inline">|</span>
            <Link
              href="/terms-and-conditions"
              className="hover:text-purple-400 transition-colors underline"
            >
              Terms &amp; Conditions
            </Link>
          </div>

          {/* Copyright and Company Number */}
          <div className="flex flex-col items-center text-white/60 font-dm-sans text-sm">
            <span>© 2025 Transparency UK Limited.</span>
            <span className="mt-1">Company No. 16769713</span>
          </div>
        </div>

        {/* Regulation section */}
        <div className="mt-6 flex flex-col items-center gap-2 text-center font-dm-sans text-sm text-white/60">
          <span className="uppercase tracking-wide text-xs text-white/70">
            Regulation
          </span>
          <div className="flex flex-col items-center gap-3">
            <div className="border border-white/40 rounded-md px-3 py-2 bg-white">
              <Image
                src="/TPO-Logo.jpeg"
                alt="The Property Ombudsman"
                width={236}
                height={78}
                className="h-12 w-auto object-contain"
              />
            </div>
            <span>Member of The Property Ombudsman Scheme</span>
            <span>Transparency UK Limited t/a RightOffer</span>
            <span>Membership No: T13903</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
