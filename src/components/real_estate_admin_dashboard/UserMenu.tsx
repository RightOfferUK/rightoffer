'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User, LogOut, Settings, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function UserMenu() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-dm-sans text-white">
                  {session.user.companyName || 'RightOffer'}
                </h1>
                <p className="text-xs text-blue-400 font-dm-sans">
                  Real Estate Admin
                </p>
              </div>
            </Link>
          </div>

          {/* Listing Usage */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <p className="text-white font-dm-sans font-medium">
                {session.user.usedListings || 0} / {session.user.maxListings || 0}
              </p>
              <p className="text-xs text-white/60 font-dm-sans">
                Listings Used
              </p>
            </div>
            <div className="w-32">
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    session.user.maxListings && session.user.usedListings && 
                    session.user.usedListings >= session.user.maxListings
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : session.user.maxListings && session.user.usedListings && 
                        (session.user.usedListings / session.user.maxListings) >= 0.8
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600'
                  }`}
                  style={{
                    width: `${session.user.maxListings && session.user.maxListings > 0 
                      ? ((session.user.usedListings || 0) / session.user.maxListings) * 100 
                      : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-white font-dm-sans font-medium">
                  {session.user.name || session.user.email}
                </p>
                <p className="text-xs text-white/60 font-dm-sans capitalize">
                  Real Estate Admin
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <motion.button
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </motion.button>

              <motion.button
                onClick={handleSignOut}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

