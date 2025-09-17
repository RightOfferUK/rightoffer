'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Upload, Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react';
import { uploadImage } from '@/lib/supabase';

interface ListingFormData {
  address: string;
  sellerName: string;
  sellerEmail: string;
  listedPrice: string;
  mainPhoto?: string;
}

const AddListingForm = () => {
  const [formData, setFormData] = useState<ListingFormData>({
    address: '',
    sellerName: '',
    sellerEmail: '',
    listedPrice: '',
    mainPhoto: ''
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('Image must be less than 2MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      let photoUrl = '';
      
      // Upload image if selected
      if (imageFile) {
        setIsUploading(true);
        const uploadResult = await uploadImage(imageFile, 'listings');
        photoUrl = uploadResult.publicUrl;
        setIsUploading(false);
      }

      // Submit form data
      const listingData = {
        ...formData,
        mainPhoto: photoUrl
      };

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(listingData),
      });

      const result = await response.json();

      if (result.success) {
        // Reset form
        setFormData({
          address: '',
          sellerName: '',
          sellerEmail: '',
          listedPrice: '',
          mainPhoto: ''
        });
        setImageFile(null);
        setImagePreview('');
        setSuccess('Listing created successfully! Seller code has been sent to the seller\'s email.');
        
        // Dispatch events to refresh both listings table and agents table
        window.dispatchEvent(new CustomEvent('refreshListings'));
        window.dispatchEvent(new CustomEvent('refreshAgentData'));
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      } else {
        throw new Error(result.error || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      setError(error instanceof Error ? error.message : 'Failed to create listing');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white font-dm-sans mb-4">Add New Listing</h3>
      
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

        {/* Property Address */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Property Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            placeholder="123 Oak Street, London, SW1A 1AA"
          />
        </div>

        {/* Seller Name */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Seller Name *
          </label>
          <input
            type="text"
            name="sellerName"
            value={formData.sellerName}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            placeholder="John Smith"
          />
        </div>

        {/* Seller Email */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Seller Email *
          </label>
          <input
            type="email"
            name="sellerEmail"
            value={formData.sellerEmail}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            placeholder="john@example.com"
          />
        </div>

        {/* Listed Price */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Listed Price *
          </label>
          <input
            type="text"
            name="listedPrice"
            value={formData.listedPrice}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            placeholder="£450,000"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Property Photo (Optional)
          </label>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="relative flex items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/30 transition-colors bg-white/5 overflow-hidden"
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 text-white/40 mx-auto mb-2" />
                  <p className="text-white/60 text-sm">Click to upload photo</p>
                  <p className="text-white/40 text-xs">Max 2MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          {isSubmitting || isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isUploading ? 'Uploading...' : 'Creating...'}
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Create Listing
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddListingForm;
