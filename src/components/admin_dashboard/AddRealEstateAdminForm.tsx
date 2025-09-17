'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Loader2, Check, AlertCircle } from 'lucide-react';

interface CompanyFormData {
  email: string;
  name: string;
  companyName: string;
  maxListings: number;
}

const AddRealEstateAdminForm = () => {
  const [formData, setFormData] = useState<CompanyFormData>({
    email: '',
    name: '',
    companyName: '',
    maxListings: 10,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxListings' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/real-estate-admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Company created successfully!');
        setFormData({ email: '', name: '', companyName: '', maxListings: 10 });
        
        // Trigger table refresh
        window.dispatchEvent(new CustomEvent('refreshAdminData'));
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create company');
      }
    } catch (error) {
      console.error('Error creating company:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white font-dm-sans mb-4">Add New Company</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
            <p className="text-green-300 text-sm">{success}</p>
          </motion.div>
        )}

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            placeholder="ABC Real Estate Ltd"
          />
        </div>

        {/* Admin Email */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Admin Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            placeholder="admin@company.com"
          />
        </div>

        {/* Admin Name */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Admin Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            placeholder="John Doe"
          />
        </div>

        {/* Maximum Listings */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Maximum Listings *
          </label>
          <input
            type="number"
            name="maxListings"
            value={formData.maxListings}
            onChange={handleInputChange}
            required
            min="1"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            placeholder="10"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Building2 className="w-4 h-4" />
              Create Company
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddRealEstateAdminForm;