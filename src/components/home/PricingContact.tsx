'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Send, User, Mail, MessageSquare } from 'lucide-react';

const PricingContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <section className="py-20 lg:py-32" id="pricing-contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left side - Pricing */}
          <motion.div
            className="relative h-full"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Glass background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-3xl blur-xl"></div>
            
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl h-full flex flex-col">
              <motion.div
                className="text-center flex-1 flex flex-col justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-7xl font-black font-dm-sans text-purple-500">£75</span>
                    <span className="text-white/60 font-dm-sans text-xl">per listing</span>
                  </div>
                  <p className="text-white/80 font-dm-sans text-base">Minimum 15 listings</p>
                </div>
                
                {/* Key Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-center gap-3 text-white/90">
                    <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <span className="font-dm-sans text-base">Real-time offers</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-white/90">
                    <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <span className="font-dm-sans text-base">Unlimited submissions</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-white/90">
                    <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    <span className="font-dm-sans text-base">Dashboard access</span>
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  className="btn-primary-gradient w-full px-8 py-4 rounded-xl font-dm-sans font-semibold text-lg"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    window.location.href = '#pricing-contact';
                  }}
                >
                  Get Started
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Contact Form */}
          <motion.div
            className="relative h-full"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Glass background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-xl"></div>
            
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl h-full flex flex-col">
              <motion.div
                className="flex-1 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold font-dm-sans text-white mb-6">Get in Touch</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 font-dm-sans backdrop-blur-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email"
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 font-dm-sans backdrop-blur-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="relative flex-1">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-white/60" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your message"
                      className="w-full h-full min-h-[120px] pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 font-dm-sans backdrop-blur-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition-all duration-300 resize-none"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-white/20 hover:bg-white/30 border border-white/30 px-6 py-3 rounded-xl font-dm-sans font-semibold text-white backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2 mt-auto"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Send className="w-4 h-4" />
                    Send Message
                  </motion.button>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingContact;
