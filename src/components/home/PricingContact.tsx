'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Send, User, Mail, MessageSquare, Check, AlertCircle } from 'lucide-react';

const PricingContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (submitStatus.type === 'error') {
      setSubmitStatus({ type: null, message: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitStatus({
        type: 'success',
        message: data.message || 'Message sent successfully!'
      });

      // Clear form on success
      setFormData({
        name: '',
        email: '',
        message: ''
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: '' });
      }, 5000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-32" id="pricing-contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-stretch">
          {/* Left side - Pricing */}
          <motion.div
            className="relative h-full min-h-[400px] sm:min-h-[450px]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Glass background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-2xl sm:rounded-3xl blur-xl"></div>
            
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl h-full flex flex-col">
              <motion.div
                className="text-center flex-1 flex flex-col justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {/* Price */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-baseline justify-center gap-2 mb-3 sm:mb-4">
                    <span className="text-5xl sm:text-6xl md:text-7xl font-black font-dm-sans text-purple-500">£75</span>
                    <span className="text-white/60 font-dm-sans text-base sm:text-lg md:text-xl">per listing</span>
                  </div>
                  <p className="text-white/80 font-dm-sans text-sm sm:text-base">Minimum 15 listings</p>
                </div>
                
                {/* Key Features */}
                <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  <div className="flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-white/90 text-left">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                    <span className="font-dm-sans text-xs sm:text-sm md:text-base font-medium">
                      Confidential – keep all offers between agent and seller.
                    </span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-white/90 text-left">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                    <span className="font-dm-sans text-xs sm:text-sm md:text-base font-medium">
                      Dual visibility – only the agent & seller have access.
                    </span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2.5 sm:gap-3 text-white/90 text-left">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
                    <span className="font-dm-sans text-xs sm:text-sm md:text-base font-medium">
                      Full transparency – every activity is visible to both sides.
                    </span>
                  </div>
                </div>
                <p className="text-center text-white/90 font-dm-sans text-base sm:text-lg font-semibold mt-2">
                  <span>Contact us to get started</span>
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Contact Form */}
          <motion.div
            className="relative h-full min-h-[400px] sm:min-h-[450px]"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Glass background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl sm:rounded-3xl blur-xl"></div>
            
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl h-full flex flex-col">
              <motion.div
                className="flex-1 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl sm:text-2xl font-bold font-dm-sans text-white mb-4 sm:mb-6">Get in Touch</h3>
                
                {/* Status Messages */}
                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl mb-4 ${
                      submitStatus.type === 'success'
                        ? 'bg-green-500/20 border border-green-500/30 text-green-100'
                        : 'bg-red-500/20 border border-red-500/30 text-red-100'
                    }`}
                  >
                    {submitStatus.type === 'success' ? (
                      <Check className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm font-dm-sans">{submitStatus.message}</span>
                  </motion.div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 flex-1 flex flex-col">
                  <div className="relative">
                    <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 font-dm-sans text-sm sm:text-base backdrop-blur-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email"
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 font-dm-sans text-sm sm:text-base backdrop-blur-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="relative flex-1">
                    <MessageSquare className="absolute left-3 sm:left-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your message"
                      className="w-full h-full min-h-[100px] sm:min-h-[120px] pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 font-dm-sans text-sm sm:text-base backdrop-blur-sm focus:outline-none focus:border-purple-500/50 focus:bg-white/20 transition-all duration-300 resize-none"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
                    className="w-full bg-white/20 hover:bg-white/30 border border-white/30 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-dm-sans font-semibold text-sm sm:text-base text-white backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-2 mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Send Message
                      </>
                    )}
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
