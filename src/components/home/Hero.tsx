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
               backgroundSize: '40px 40px'
             }}>
        </div>
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-50/30 to-purple-100/20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8 text-gray-800 drop-shadow-sm"
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
              className="text-xl mb-10 text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              Connect agents, sellers, and buyers with complete transparency. See all offers in real-time, no hidden deals.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.button 
              className="btn-primary-gradient px-8 py-4 rounded-md font-dm-sans font-semibold text-base flex items-center justify-center group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                window.location.href = '#pricing-contact';
              }}
            >
              Start listing houses
              <motion.svg 
                className="ml-2 w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </motion.button>
            
            <motion.button 
              className="btn-outline-primary px-8 py-4 rounded-md font-dm-sans font-semibold text-base"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                const element = document.querySelector('#how-it-works');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              How it works
            </motion.button>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
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
                <div className={`relative backdrop-blur-sm bg-white/80 border border-gray-200 rounded-2xl p-6 hover:bg-white/90 hover:border-purple-200 transition-all duration-500 shadow-lg hover:shadow-xl ${card.hoverShadow}`}>
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg ${card.shadowColor}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-gray-800 font-dm-sans text-lg font-semibold mb-2">
                        {card.title}
                      </h3>
                      <p className="text-gray-600 font-dm-sans text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Partnership Section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          <motion.p 
            className="text-sm text-gray-500 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 2.0 }}
          >
            <span className="text-purple-600 font-medium">Mortgage brokers</span> and <span className="text-purple-600 font-medium">conveyancers/solicitors</span> - want to advertise here? <span className="text-purple-600 font-medium">Contact us</span>.
          </motion.p>

          {/* Mortgage Brokers */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 2.1 }}
          >
            <h3 className="text-sm font-medium text-gray-600 mb-3">Mortgage Brokers</h3>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <motion.div
                  key={`broker-${index}`}
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="w-20 h-12 bg-gray-50 rounded flex items-center justify-center border border-gray-200 group-hover:border-purple-300 group-hover:bg-purple-50 transition-all duration-200">
                    <span className="text-gray-400 text-xs group-hover:text-purple-600 transition-colors duration-200">
                      {index}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Conveyancers/Solicitors */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 2.2 }}
          >
            <h3 className="text-sm font-medium text-gray-600 mb-3">Conveyancers & Solicitors</h3>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {[1, 2, 3, 4, 5].map((index) => (
                <motion.div
                  key={`solicitor-${index}`}
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="w-20 h-12 bg-gray-50 rounded flex items-center justify-center border border-gray-200 group-hover:border-purple-300 group-hover:bg-purple-50 transition-all duration-200">
                    <span className="text-gray-400 text-xs group-hover:text-purple-600 transition-colors duration-200">
                      {index}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
