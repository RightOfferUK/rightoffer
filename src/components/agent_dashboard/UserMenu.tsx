'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { 
  Settings, 
  CreditCard, 
  User, 
  LogOut, 
  ChevronDown,
  Bell,
  Building2
} from 'lucide-react';

const UserMenu = () => {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [companyName, setCompanyName] = useState<string>('');

  const userInitials = session?.user?.email?.charAt(0).toUpperCase() || "U";

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = async () => {
    await signOut({ redirectTo: "/" });
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border-b border-white/10 px-6 py-4 relative z-50">
      <div className="flex items-center justify-between">
        {/* Left Side - Logo and Agency Name */}
        <div className="flex items-center space-x-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold font-dm-sans text-white">rightoffer</h1>
          </div>
          
          {/* Divider */}
          <div className="h-6 w-px bg-white/20"></div>
          
          {/* Company Name */}
          {companyName && (
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-white/70" />
              <span className="text-lg font-semibold font-dm-sans text-white/90">
                {companyName}
              </span>
            </div>
          )}
        </div>

        {/* Right Side - Actions and User Menu */}
        <div className="flex items-center space-x-4">



          {/* User Dropdown */}
          <div className="relative z-[101]">
            <motion.button
              onClick={toggleDropdown}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* User Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold font-dm-sans">
                  {userInitials}
                </span>
              </div>
              
              {/* User Info */}
              <div className="text-left">
                <div className="text-sm font-medium font-dm-sans text-white">
                  {session?.user?.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-xs text-white/60 font-dm-sans">
                  Agent
                </div>
              </div>
              
              {/* Dropdown Arrow */}
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-white/70" />
              </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 backdrop-blur-xl bg-slate-800/90 rounded-lg shadow-2xl border border-white/30 overflow-hidden z-[9999]"
                >

                  <motion.button
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-white hover:bg-white/20 transition-colors first:rounded-t-lg"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="font-dm-sans font-medium">Account Settings</span>
                  </motion.button>
                  
                  <div className="border-t border-white/30"></div>
                  
                  <motion.button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-300 hover:bg-red-500/30 hover:text-red-200 transition-colors last:rounded-b-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-dm-sans font-medium">Sign Out</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
