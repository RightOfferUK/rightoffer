'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const DashboardFooter = () => {
  const [showSupport, setShowSupport] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, we'll just open a mailto link
    // You can replace this with an API call to your support system later
    const subject = encodeURIComponent('Support Request');
    const body = encodeURIComponent(message);
    window.location.href = `mailto:support@rightoffer.com?subject=${subject}&body=${body}`;
    
    setMessage('');
    setShowSupport(false);
  };

  return (
    <>
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#0B1221]/80 backdrop-blur-sm border-t border-white/10 py-3 px-6 z-40">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-white/70 text-sm font-dm-sans">
            © 2025 <span className="font-semibold text-white">Right Offer</span>
          </div>
          
          <button
            onClick={() => setShowSupport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-all duration-200 text-sm font-medium"
          >
            <MessageCircle size={16} />
            Support
          </button>
        </div>
      </footer>

      {/* Support Popup */}
      {showSupport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B1221] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500/10 to-transparent border-b border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <MessageCircle className="text-purple-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-dm-sans">Contact Support</h3>
                    <p className="text-white/60 text-sm">We&apos;re here to help you</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSupport(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Body */}
            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                  How can we help you?
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or question..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSupport(false)}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white disabled:bg-purple-500/30 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-white/50 text-xs text-center">
                  Or email us directly at{' '}
                  <a 
                    href="mailto:support@rightoffer.com" 
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    support@rightoffer.com
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardFooter;

