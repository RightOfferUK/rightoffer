'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Eye, DollarSign } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-white min-h-screen flex items-center relative overflow-hidden">
      {/* Minimal Grid Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" 
             style={{
               backgroundImage: `
                 linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
               `,
               backgroundSize: '30px 30px'
             }}>
        </div>
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-50/30 to-purple-100/20"></div>
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-tight sm:leading-none mb-6 sm:mb-8 text-gray-800 drop-shadow-sm px-2 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span 
                className="text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Real Estate Offers,
              </motion.span>
              <br />
              <motion.span 
                className="text-purple-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                Real Transparency.
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl mb-8 sm:mb-10 text-gray-600 px-2 sm:px-0 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              Connect agents, sellers, and buyers with complete transparency. See all offers in real-time, no hidden deals.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8 sm:mt-10 px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.button className="btn-primary-gradient px-6 sm:px-8 py-3 sm:py-4 rounded-md font-dm-sans font-semibold text-sm sm:text-base flex items-center justify-center group w-full sm:w-auto">
            Coming Soon
            </motion.button>
            

          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 lg:mt-20 px-2 sm:px-0"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          {[
            {
              title: "For Real Estate Agents",
              description: "List properties and generate unique seller codes. Provide complete transparency to your clients and build trust through our open offer system.",
              icon: Building2,
              gradient: "from-purple-500 to-purple-600",
              glowColor: "from-purple-500/20 to-purple-600/20",
              shadowColor: "shadow-purple-500/25",
              hoverShadow: "hover:shadow-purple-500/10"
            },
            {
              title: "For Property Sellers",
              description: "Use your unique code to see every offer in real-time. No more wondering if your agent is showing you all offers - complete transparency guaranteed.",
              icon: Eye,
              gradient: "from-purple-600 to-purple-700",
              glowColor: "from-purple-600/20 to-purple-700/20",
              shadowColor: "shadow-purple-600/25",
              hoverShadow: "hover:shadow-purple-600/10"
            },
            {
              title: "For Property Buyers",
              description: "Submit competitive offers directly through our platform. See where you stand and make informed decisions in real-time bidding scenarios.",
              icon: DollarSign,
              gradient: "from-purple-700 to-purple-800",
              glowColor: "from-purple-700/20 to-purple-800/20",
              shadowColor: "shadow-purple-700/25",
              hoverShadow: "hover:shadow-purple-700/10"
            }
          ].map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div 
                key={card.title}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 + index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${card.glowColor} rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
                <div className={`relative backdrop-blur-sm bg-white/80 border border-gray-200 rounded-2xl p-4 sm:p-6 hover:bg-white/90 hover:border-purple-200 transition-all duration-500 shadow-lg hover:shadow-xl ${card.hoverShadow}`}>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <motion.div 
                      className="flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                       <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg ${card.shadowColor}`}>
                         <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-gray-800 font-dm-sans text-base sm:text-lg font-semibold mb-2">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 font-dm-sans text-xs sm:text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

       
      </div>
    </section>
  );
};

export default Hero;
