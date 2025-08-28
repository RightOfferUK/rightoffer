'use client';

import React from 'react';
import { Building2, Eye, DollarSign } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-navy-gradient min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8 text-white drop-shadow-lg">
              <span className="text-white">Real Estate Offers,</span>
              <br />
              <span className="text-orange-500">Real Transparency.</span>
            </h1>
            
            <p className="text-xl mb-10 text-white/80">
              Connect agents, sellers, and buyers with complete transparency. See all offers in real-time, no hidden deals.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <button className="btn-primary-gradient px-8 py-4 rounded-md font-dm-sans font-semibold text-base flex items-center justify-center group">
              Start listing houses
              <svg 
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            
            <button className="btn-outline-primary px-8 py-4 rounded-md font-dm-sans font-semibold text-base">
              How it works
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {/* Feature 1 - For Agents */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 shadow-2xl hover:shadow-orange-500/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-dm-sans text-lg font-semibold mb-2">
                    For Real Estate Agents
                  </h3>
                  <p className="text-white/70 font-dm-sans text-sm leading-relaxed">
                    List properties and generate unique seller codes. Provide complete transparency to your clients and build trust through our open offer system.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - For Sellers */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 shadow-2xl hover:shadow-blue-500/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-dm-sans text-lg font-semibold mb-2">
                    For Property Sellers
                  </h3>
                  <p className="text-white/70 font-dm-sans text-sm leading-relaxed">
                    Use your unique code to see every offer in real-time. No more wondering if your agent is showing you all offers - complete transparency guaranteed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 - For Buyers */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500 shadow-2xl hover:shadow-green-500/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/25">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-dm-sans text-lg font-semibold mb-2">
                    For Property Buyers
                  </h3>
                  <p className="text-white/70 font-dm-sans text-sm leading-relaxed">
                    Submit competitive offers directly through our platform. See where you stand and make informed decisions in real-time bidding scenarios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
