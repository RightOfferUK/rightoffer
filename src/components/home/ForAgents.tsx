'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, Shield, PhoneOff } from 'lucide-react';

const ForAgents = () => {
  const benefits = [

    {
      icon: Users,
      text: "Generate unique seller & buyer codes for real-time offer visibility"
    },
    {
      icon: TrendingUp,
      text: "Close deals faster with transparent offers process"
    },
    {
      icon: Shield,
      text: "Protect your reputation with honest, open transactions"
    },
    // Added as per instruction
    {
      icon: PhoneOff,
      text: "No more lengthy phone calls — focus on more sales"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <section className="bg-navy-gradient py-12 sm:py-16 md:py-20 lg:py-32" id="for-agents">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Left side - Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-dm-sans text-white mb-4 sm:mb-6 leading-tight"
              variants={itemVariants}
            >
              Built for 
              <span className="text-purple-500"> Estate Agents</span>
            </motion.h2>
            
            <motion.p
              className="text-base sm:text-lg md:text-xl text-white/80 font-dm-sans mb-6 sm:mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Build lasting trust with your clients — no more constant calls for updates, just clarity at every step.
            </motion.p>

            <motion.div
              className="space-y-3 sm:space-y-4"
              variants={containerVariants}
            >
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 sm:gap-4"
                  >

                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                      </div>
                      <p className="text-white/90 font-dm-sans text-sm sm:text-base md:text-lg leading-relaxed">
                        {benefit.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            <motion.div
              className="mt-6 sm:mt-8"
              variants={itemVariants}
            >
              <motion.button
                className="btn-primary-gradient w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-dm-sans font-semibold text-sm sm:text-base"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  window.location.href = '/login';
                }}
              >
                Start Listing Properties
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right side - Images */}
          <motion.div
            className="relative flex flex-col items-center space-y-4 sm:space-y-6 mt-8 lg:mt-0"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl flex items-center justify-center w-full">
              <img
                src="/agentView.webp"
                alt="Agent Dashboard Preview - Real-time Offer Management"
                className="block max-w-full h-auto rounded-xl sm:rounded-2xl"
                style={{ display: 'block' }}
                loading="lazy"
              />
              {/* Glass overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-xl sm:rounded-2xl"></div>
            </div>
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl flex items-center justify-center w-full">
              <img
                src="/agentView2.webp"
                alt="Agent Dashboard Alternate Preview"
                className="block max-w-full h-auto rounded-xl sm:rounded-2xl"
                style={{ display: 'block' }}
                loading="lazy"
              />
              {/* Glass overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-xl sm:rounded-2xl"></div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-purple-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 rounded-full blur-xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ForAgents;