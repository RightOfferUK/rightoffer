'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { 
  LogOut, 
  User,
  Home
} from 'lucide-react';
import Link from 'next/link';

const UserMenu = () => {
  const { data: session } = useSession();
  const [companyName, setCompanyName] = useState<string>('');

  useEffect(() => {
    // Fetch company name if user is an agent
    const fetchCompanyName = async () => {
      if (session?.user?.role === 'agent' && session?.user?.realEstateAdminId) {
        try {
          const response = await fetch(`/api/agent/company-info`);
          if (response.ok) {
            const data = await response.json();
            setCompanyName(data.companyName);
          }
        } catch (error) {
          console.error('Error fetching company info:', error);
        }
      }
    };

    fetchCompanyName();
  }, [session]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (!session?.user) {
    return null;
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-dm-sans text-white">
                  {companyName || 'RightOffer'}
                </h1>
                <p className="text-xs text-purple-400 font-dm-sans">
                  Agent Dashboard
                </p>
              </div>
            </Link>
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
                  Agent
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">

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
};

export default UserMenu;