'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone } from 'lucide-react';
import Link from 'next/link';

interface MobileRestrictionProps {
  children: React.ReactNode;
  showHomeButton?: boolean;
}

const MobileRestriction: React.FC<MobileRestrictionProps> = ({ 
  children, 
  showHomeButton = true 
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      // Consider devices with width less than 768px as mobile
      setIsMobile(window.innerWidth < 768);
      setIsLoading(false);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Show loading state briefly to prevent flash
  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-gradient flex items-center justify-center px-4">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 font-dm-sans">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Show restriction message on mobile
  if (isMobile) {
    return (
      <div className="min-h-screen bg-navy-gradient flex items-center justify-center px-4 py-8">
        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
            {/* Icon */}
            <motion.div
              className="relative mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <Monitor className="w-10 h-10 text-white" />
                </div>
                <motion.div
                  className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center border-2 border-navy-900"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Smartphone className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1 
              className="text-2xl sm:text-3xl font-bold font-dm-sans text-white mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Desktop Required
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              className="text-white/70 font-dm-sans mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Please visit this page on a larger device to get the best experience. 
              This dashboard is optimized for desktop and tablet screens.
            </motion.p>

            {/* Additional info */}
            <motion.div
              className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <p className="text-white/60 font-dm-sans text-sm">
                <strong className="text-white/80">Minimum screen width:</strong> 768px
              </p>
              <p className="text-white/60 font-dm-sans text-sm mt-1">
                <strong className="text-white/80">Your current width:</strong> {typeof window !== 'undefined' ? window.innerWidth : 0}px
              </p>
            </motion.div>

            {/* Home button */}
            {showHomeButton && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Link href="/">
                  <motion.button
                    className="btn-primary-gradient px-6 py-3 rounded-lg font-dm-sans font-semibold text-base w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Return to Home
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Show normal content on desktop
  return <>{children}</>;
};

export default MobileRestriction;

