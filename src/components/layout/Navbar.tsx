'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center">
              <Image
                src="/logo.webp"
                alt="RightOffer Logo"
                width={480}
                height={120}
                className="h-16 w-auto"
                priority
              />
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:block"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="ml-10 flex items-baseline space-x-8">
              {[
                { name: 'How it works', href: '#how-it-works' },
                { name: 'For Agents', href: '#for-agents' },
                { name: 'For Sellers', href: '#for-sellers' },
                { name: 'Pricing', href: '#pricing-contact' },
                { name: 'Contact', href: '#pricing-contact' }
              ].map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium font-dm-sans transition-colors"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(item.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="hidden md:flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link href="/listing">
              <motion.button
                className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium font-dm-sans transition-colors"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                Seller code or buyer code?
              </motion.button>
            </Link>
            {session ? (
              <Link href="/dashboard">
                <motion.button 
                  className="btn-primary-gradient px-6 py-2 rounded-md text-sm font-medium font-dm-sans font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Dashboard
                </motion.button>
              </Link>
            ) : (
              <Link href="/login">
                <motion.button 
                  className="btn-primary-gradient px-6 py-2 rounded-md text-sm font-medium font-dm-sans font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign in
                </motion.button>
              </Link>
            )}
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-purple-600 focus:outline-none focus:text-purple-600"
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
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border border-gray-200 rounded-lg mt-2 shadow-lg"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {[
                  { name: 'How it works', href: '#how-it-works' },
                  { name: 'For Agents', href: '#for-agents' },
                  { name: 'For Sellers', href: '#for-sellers' },
                  { name: 'Pricing', href: '#pricing-contact' },
                  { name: 'Contact', href: '#pricing-contact' }
                ].map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-purple-600 block px-3 py-2 text-base font-medium font-dm-sans transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector(item.href);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </motion.a>
                ))}
                <Link href="/listing">
                  <motion.button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-600 hover:text-purple-600 block px-3 py-2 text-base font-medium font-dm-sans transition-colors border-t border-gray-200 mt-4 pt-4 w-full text-left"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  >
                    Seller code or buyer code?
                  </motion.button>
                </Link>
                {session ? (
                  <Link href="/dashboard">
                    <motion.button 
                      className="btn-primary-gradient w-full mt-4 px-6 py-2 rounded-md text-sm font-medium font-dm-sans font-semibold"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Dashboard
                    </motion.button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <motion.button 
                      className="btn-primary-gradient w-full mt-4 px-6 py-2 rounded-md text-sm font-medium font-dm-sans font-semibold"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign in
                    </motion.button>
                  </Link>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
