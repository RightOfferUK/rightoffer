'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Clock, Shield, BarChart3 } from 'lucide-react';
import Image from 'next/image';

const ForSellers = () => {
  const benefits = [
    {
      icon: Eye,
      text: "See every single offer in real-time with your unique seller code"
    },
    {
      icon: BarChart3,
      text: "Compare all offers and responses with detailed breakdowns"
    },
    {
      icon: Clock,
      text: "Get instant notifications when new offers come in"
    },
    {
      icon: Shield,
      text: "No more phone calls — just clarity at every step"
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
    <section className="bg-gradient-to-br from-gray-50 to-white py-12 sm:py-16 md:py-20 lg:py-32" id="for-sellers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Left side - Image */}
          <motion.div
            className="relative order-2 lg:order-1 mt-8 lg:mt-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl">
              <div className="aspect-[4/3] bg-white flex items-center justify-center">
                <Image
                  src="/sellerView.webp"
                  alt="Seller Dashboard Preview - Real-time Offer Tracking"
                  className="object-cover w-full h-full"
                  loading="lazy"
                  width={700}
                  height={400}
                  sizes="(max-width: 640px) 100vw, 700px"
                  priority={false}
                />
              </div>
              
              {/* Glass overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/20 rounded-full blur-xl"></div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            className="order-1 lg:order-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-dm-sans text-gray-900 mb-4 sm:mb-6 leading-tight"
              variants={itemVariants}
            >
              Complete Control for 
              <span className="text-purple-500"> Property Sellers</span>
            </motion.h2>
            
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-600 font-dm-sans mb-6 sm:mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Take control of your property sale with unprecedented transparency and real-time offer visibility.
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
                      <p className="text-gray-700 font-dm-sans text-sm sm:text-base md:text-lg leading-relaxed">
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
              <motion.a
                href="/listing"
                className="btn-primary-gradient w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-dm-sans font-semibold text-sm sm:text-base inline-block text-center"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Have a Seller Code?
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ForSellers;
