'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen flex items-center relative overflow-hidden">
      {/* Minimal Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
               `,
               backgroundSize: '40px 40px'
             }}>
        </div>
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-50/30 to-purple-100/20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* 404 Number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-8xl sm:text-9xl md:text-[180px] font-black tracking-tighter leading-none text-purple-500 drop-shadow-sm">
              404
            </h1>
          </motion.div>

          {/* Main Message */}
          <motion.div 
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-gray-800">
              Page Not Found
            </h2>
            
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-gray-600 px-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
            </motion.p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link href="/">
              <motion.button 
                className="btn-primary-gradient px-6 sm:px-8 py-3 sm:py-4 rounded-md font-dm-sans font-semibold text-sm sm:text-base flex items-center justify-center group w-full sm:w-auto"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Home className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Back to Home
              </motion.button>
            </Link>
            
            <motion.button 
              className="btn-outline-primary px-6 sm:px-8 py-3 sm:py-4 rounded-md font-dm-sans font-semibold text-sm sm:text-base flex items-center justify-center w-full sm:w-auto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              Go Back
            </motion.button>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="mt-12 sm:mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <p className="text-sm text-gray-500 mb-4 sm:mb-6">Or try one of these popular pages:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {[
                {
                  title: "List a Property",
                  description: "Start listing houses",
                  icon: Search,
                  href: "/#pricing-contact",
                  gradient: "from-purple-500 to-purple-600",
                  glowColor: "from-purple-500/20 to-purple-600/20"
                },
                {
                  title: "How it Works",
                  description: "Learn about our platform",
                  icon: HelpCircle,
                  href: "/#how-it-works",
                  gradient: "from-purple-600 to-purple-700",
                  glowColor: "from-purple-600/20 to-purple-700/20"
                },
                {
                  title: "Login",
                  description: "Access your account",
                  icon: ArrowLeft,
                  href: "/login",
                  gradient: "from-purple-700 to-purple-800",
                  glowColor: "from-purple-700/20 to-purple-800/20"
                }
              ].map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <Link key={card.title} href={card.href}>
                    <motion.div 
                      className="group relative h-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${card.glowColor} rounded-xl blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
                      <div className="relative backdrop-blur-sm bg-white/80 border border-gray-200 rounded-xl p-4 hover:bg-white/90 hover:border-purple-200 transition-all duration-500 shadow-lg hover:shadow-xl h-full">
                        <div className="flex flex-col items-center text-center gap-3">
                          <motion.div 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className={`w-10 h-10 bg-gradient-to-br ${card.gradient} rounded-lg flex items-center justify-center shadow-lg`}>
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                          </motion.div>
                          <div>
                            <h3 className="text-gray-800 font-dm-sans text-sm font-semibold mb-1">
                              {card.title}
                            </h3>
                            <p className="text-gray-600 font-dm-sans text-xs">
                              {card.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Additional Help */}
          <motion.div 
            className="mt-10 sm:mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <p className="text-sm text-gray-500">
              Need help? <Link href="/#pricing-contact" className="text-purple-600 font-medium underline hover:text-purple-800 transition-colors">Contact us</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

