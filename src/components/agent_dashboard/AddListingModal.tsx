'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/supabase';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (listing: ListingFormData) => void;
}

interface ListingFormData {
  address: string;
  sellerName: string;
  sellerEmail: string;
  listedPrice: string;
  mainPhoto?: string;
}

const AddListingModal: React.FC<AddListingModalProps> = ({ isOpen, onClose, onSubmit }) => {
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
        setError('File size must be less than 2MB. Please choose a smaller image.');
        e.target.value = ''; // Reset file input
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

      await onSubmit(listingData);
      
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
      
      // Trigger refresh of listings table
      window.dispatchEvent(new CustomEvent('refreshListings'));
      
      // Close modal after short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error submitting listing:', error);
      setError('Error creating listing. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      address: '',
      sellerName: '',
      sellerEmail: '',
      listedPrice: '',
      mainPhoto: ''
    });
    setImageFile(null);
    setImagePreview('');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white font-dm-sans">Add New Listing</h2>
                <button
                  onClick={handleClose}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <p className="text-green-300 text-sm">{success}</p>
                  </div>
                )}
                {/* Address */}
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
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                    placeholder="123 Main Street, London SW1A 1AA"
                  />
                </div>

                {/* Main Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Main Photo
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-4 hover:border-white/30 transition-colors">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center py-4">
                        <ImageIcon className="w-8 h-8 text-white/40 mb-2" />
                        <span className="text-sm text-white/60">Click to upload photo</span>
                        <span className="text-xs text-white/40 mt-1">PNG, JPG up to 2MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
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
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
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
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
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
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                    placeholder="£450,000"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting || isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isUploading ? 'Uploading...' : 'Creating...'}
                      </>
                    ) : (
                      'Create Listing'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddListingModal;
