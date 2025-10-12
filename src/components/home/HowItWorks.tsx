'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Home, Eye, DollarSign, CheckCircle2 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Agent Lists Property",
      description: "Real estate agents create a listing and generate a unique transparency code for the seller.",
      icon: Home,
      details: ["Upload property details", "Set asking price", "Generate seller code", "Share with all parties"],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      number: "02", 
      title: "Sellers Get Full Visibility",
      description: "Property owners use their code to see every single offer in real-time - no more wondering what you're missing.",
      icon: Eye,
      details: ["Access real-time dashboard", "See all incoming offers", "Compare offer details", "Track offer history"],
      color: "from-purple-600 to-purple-700",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      number: "03",
      title: "Buyers Submit Offers",
      description: "Potential buyers can submit competitive offers directly through the platform with complete transparency.",
      icon: DollarSign,
      details: ["Browse available properties", "Submit competitive offers", "See market positioning", "Get instant feedback"],
      color: "from-purple-700 to-purple-800",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
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
    <section className="bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.span 
            className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold font-dm-sans mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.span>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-black font-dm-sans text-gray-900 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Real Estate Transparency
            <span className="text-purple-500"> Made Simple</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 font-dm-sans leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Three simple steps to revolutionize how real estate deals are made. 
            No more hidden agendas, no more wondering if you&apos;re getting the best deal.
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="relative h-full"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                  <div className="card-body p-8">
                    {/* Step Number & Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <motion.span 
                        className="text-6xl font-black font-dm-sans text-gray-200"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        {step.number}
                      </motion.span>
                      
                      <motion.div 
                        className={`w-16 h-16 rounded-2xl ${step.bgColor} flex items-center justify-center`}
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <IconComponent className={`w-8 h-8 ${step.textColor}`} />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <motion.h3 
                      className="card-title text-2xl font-bold font-dm-sans text-gray-900 mb-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {step.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-gray-600 font-dm-sans mb-6 leading-relaxed"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {step.description}
                    </motion.p>

                    {/* Details List */}
                    <motion.ul 
                      className="space-y-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {step.details.map((detail, detailIndex) => (
                        <motion.li 
                          key={detailIndex}
                          className="flex items-center text-sm text-gray-500 font-dm-sans"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.8 + index * 0.1 + detailIndex * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <CheckCircle2 className={`w-4 h-4 mr-2 ${step.textColor}`} />
                          {detail}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 lg:p-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left side - Heading and Description */}
            <div className="flex-1 text-center lg:text-left">
              <motion.h3 
                className="text-2xl lg:text-3xl font-bold font-dm-sans text-white mb-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Ready to experience <span className="text-purple-500">transparent real estate</span>?
              </motion.h3>
              <motion.p 
                className="text-gray-300 font-dm-sans text-base lg:text-lg"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Join the revolution and see every offer in real-time.
              </motion.p>
            </div>

            {/* Right side - CTA Button */}
            <motion.div 
              className="flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.button 
                className="btn-primary-gradient px-8 py-3 rounded-xl font-dm-sans font-semibold text-base"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  const element = document.querySelector('#pricing-contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Get Started
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
