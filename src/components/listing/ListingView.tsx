'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { uploadImage } from '@/lib/supabase';
import { useRealTimeOffers } from '@/hooks/useRealTimeOffers';
import { formatPrice, formatPriceInput, parsePrice } from '@/lib/priceUtils';
import { 
  Home, 
  PoundSterling, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Users,
  Clock,
  Edit3,
  Save,
  X,
  Mail,
  UserPlus,
  Copy,
  RefreshCw,
  Check,
  XCircle,
  MessageSquare
} from 'lucide-react';

interface Offer {
  _id?: string;
  id: string;
  buyerName: string;
  buyerEmail: string;
  amount: number;
  status: 'submitted' | 'verified' | 'countered' | 'pending verification' | 'accepted' | 'declined';
  fundingType: 'Cash' | 'Mortgage' | 'Chain';
  chain: boolean;
  aipPresent: boolean;
  submittedAt: string;
  notes?: string;
  counterOffer?: number;
  agentNotes?: string;
  statusUpdatedAt?: string;
  updatedBy?: string;
}

interface ListingData {
  _id: string;
  address: string;
  sellerName: string;
  sellerEmail: string;
  listedPrice: number | string; // Support both for backwards compatibility
  mainPhoto: string;
  sellerCode: string;
  status: string;
  offers: Offer[];
  createdAt: string;
  agentId?: string;
}

interface ListingViewProps {
  listing: ListingData;
  canEdit?: boolean;
}

const ListingView: React.FC<ListingViewProps> = ({ listing, canEdit = false }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'offers'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [editedListing, setEditedListing] = useState<ListingData>(listing);
  const [editPriceInput, setEditPriceInput] = useState(
    typeof listing.listedPrice === 'number' 
      ? listing.listedPrice.toLocaleString('en-GB')
      : parsePrice(listing.listedPrice.toString()).toLocaleString('en-GB')
  );
  const [isSaving, setIsSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  
  // Real-time offers hook
  const { 
    offers: liveOffers, 
    totalOffers, 
    highestOffer, 
    loading: offersLoading, 
    error: offersError,
    refreshOffers 
  } = useRealTimeOffers(listing._id, activeTab === 'offers');
  
  // Admin functionality state
  const [sendingSellerCode, setSendingSellerCode] = useState(false);
  const [showBuyerCodeModal, setShowBuyerCodeModal] = useState(false);
  const [buyerCodes, setBuyerCodes] = useState<BuyerCode[]>([]);

  interface BuyerCode {
    _id: string;
    code: string;
    buyerName: string;
    buyerEmail: string;
    isValid: boolean;
    daysUntilExpiry: number;
    lastEmailSent?: string;
  }
  const [loadingBuyerCodes, setLoadingBuyerCodes] = useState(false);
  const [newBuyerName, setNewBuyerName] = useState('');
  const [newBuyerEmail, setNewBuyerEmail] = useState('');
  const [generatingBuyerCode, setGeneratingBuyerCode] = useState(false);

  const getStatusColor = (status: Offer['status']) => {
    switch (status) {
      case 'submitted':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'verified':
        return 'text-green-400 bg-green-500/20';
      case 'countered':
        return 'text-blue-400 bg-blue-500/20';
      case 'pending verification':
        return 'text-purple-400 bg-purple-500/20';
      case 'accepted':
        return 'text-green-500 bg-green-500/30';
      case 'declined':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    
    try {
      const response = await fetch(`/api/listings/${listing._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: editedListing.address,
          sellerName: editedListing.sellerName,
          sellerEmail: editedListing.sellerEmail,
          listedPrice: editedListing.listedPrice,
          mainPhoto: editedListing.mainPhoto,
          status: editedListing.status,
        }),
      });

      if (response.ok) {
        setSaveSuccess('Listing updated successfully!');
        setIsEditing(false);
        // Refresh the page to get updated data after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorData = await response.json();
        setSaveError(errorData.error || 'Failed to update listing');
      }
    } catch (error) {
      console.error('Error updating listing:', error);
      setSaveError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedListing(listing);
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (2MB limit)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 2MB. Please choose a smaller image.');
      return;
    }

    setImageUploading(true);
    try {
      const uploadResult = await uploadImage(file, 'listings');
      setEditedListing({
        ...editedListing,
        mainPhoto: uploadResult.publicUrl
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };


  const handleResendSellerCode = async () => {
    setSendingSellerCode(true);
    try {
      const response = await fetch(`/api/agent/listings/${listing._id}/resend-seller-code`, {
        method: 'POST',
      });

      if (response.ok) {
        alert('Seller code sent successfully!');
      } else {
        console.error('Failed to send seller code');
        alert('Failed to send seller code. Please try again.');
      }
    } catch (error) {
      console.error('Error sending seller code:', error);
      alert('Error sending seller code. Please try again.');
    } finally {
      setSendingSellerCode(false);
    }
  };

  const fetchBuyerCodes = async () => {
    setLoadingBuyerCodes(true);
    try {
      const response = await fetch(`/api/agent/listings/${listing._id}/buyer-codes`);
      if (response.ok) {
        const data = await response.json();
        setBuyerCodes(data.buyerCodes || []);
      } else {
        console.error('Failed to fetch buyer codes');
      }
    } catch (error) {
      console.error('Error fetching buyer codes:', error);
    } finally {
      setLoadingBuyerCodes(false);
    }
  };

  const handleGenerateBuyerCode = async () => {
    if (!newBuyerName.trim() || !newBuyerEmail.trim()) {
      alert('Please enter both buyer name and email');
      return;
    }

    setGeneratingBuyerCode(true);
    try {
      const response = await fetch(`/api/agent/listings/${listing._id}/generate-buyer-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerName: newBuyerName.trim(),
          buyerEmail: newBuyerEmail.trim(),
        }),
      });

      if (response.ok) {
        alert('Buyer code generated and sent successfully!');
        setNewBuyerName('');
        setNewBuyerEmail('');
        fetchBuyerCodes(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to generate buyer code');
      }
    } catch (error) {
      console.error('Error generating buyer code:', error);
      alert('Error generating buyer code. Please try again.');
    } finally {
      setGeneratingBuyerCode(false);
    }
  };

  const copySellerCode = () => {
    navigator.clipboard.writeText(listing.sellerCode);
    alert('Seller code copied to clipboard!');
  };

  const copyListingUrl = () => {
    const url = `${window.location.origin}/listing/${listing._id}`;
    navigator.clipboard.writeText(url);
    alert('Listing URL copied to clipboard!');
  };

  // Offer management functions
  const handleOfferStatusUpdate = async (offerId: string, status: string, counterOffer?: string, notes?: string) => {
    try {
      const response = await fetch(`/api/listings/${listing._id}/offers/${offerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          counterOffer,
          notes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update offer status');
      }

      // Refresh offers to get updated data
      await refreshOffers();
      alert(`Offer ${status} successfully!`);
    } catch (error) {
      console.error('Error updating offer status:', error);
      alert('Failed to update offer status. Please try again.');
    }
  };

  const handleAcceptOffer = (offerId: string) => {
    if (confirm('Are you sure you want to accept this offer? This will mark the property as under offer.')) {
      handleOfferStatusUpdate(offerId, 'accepted');
    }
  };

  const handleDeclineOffer = (offerId: string) => {
    if (confirm('Are you sure you want to decline this offer?')) {
      handleOfferStatusUpdate(offerId, 'declined');
    }
  };

  const handleCounterOffer = (offerId: string) => {
    const counterAmountStr = prompt('Enter your counter offer amount (e.g., £450,000):');
    if (counterAmountStr) {
      const counterAmount = parsePrice(counterAmountStr);
      if (counterAmount > 0) {
        const notes = prompt('Add any notes for the buyer (optional):');
        handleOfferStatusUpdate(offerId, 'countered', counterAmount.toString(), notes ?? undefined);
      } else {
        alert('Please enter a valid offer amount.');
      }
    }
  };

  // Use real-time offers if available, otherwise fall back to listing offers
  const displayOffers: Offer[] = liveOffers.length > 0 ? liveOffers as Offer[] : listing.offers;
  const sortedOffers: Offer[] = [...displayOffers].sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  const displayHighestOffer = highestOffer > 0 ? highestOffer : (
    listing.offers.length > 0 
      ? Math.max(...listing.offers.map(offer => offer.amount))
      : 0
  );

  return (
    <div className="min-h-screen bg-navy-gradient">
      {/* Header */}
      <div className="bg-navy-gradient border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white font-dm-sans">
                {listing.address}
              </h1>
            </div>
            
            {canEdit && (
              <div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white rounded-lg transition-colors font-medium"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-500/50 text-white rounded-lg transition-colors font-medium"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Listing
                      </button>
                    </>
                  )}
                </div>
                
                {/* Error and Success Messages */}
                {saveError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-red-300 text-sm">{saveError}</p>
                  </motion.div>
                )}
                
                {saveSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <p className="text-green-300 text-sm">{saveSuccess}</p>
                  </motion.div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <PoundSterling className="w-4 h-4 text-green-400" />
              <span>Listed: {formatPrice(listing.listedPrice)}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Highest Offer: {highestOffer > 0 ? `£${highestOffer.toLocaleString()}` : 'None yet'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Seller: {listing.sellerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                listing.status === 'live' ? 'bg-green-500/20 text-green-400' :
                listing.status === 'archive' ? 'bg-gray-500/20 text-gray-400' :
                listing.status === 'sold' ? 'bg-blue-500/20 text-blue-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {listing.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Image */}
            {listing.mainPhoto && (
              <div className="mb-8">
                <Image
                  src={listing.mainPhoto}
                  alt={listing.address}
                  width={800}
                  height={400}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Tabs */}
            <div className="mb-6">
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg w-fit">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'details'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Property Details
                </button>
                <button
                  onClick={() => setActiveTab('offers')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'offers'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Live Offers ({totalOffers || listing.offers.length})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'details' && (
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white font-dm-sans mb-4">
                    Property Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Property Address
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedListing.address}
                          onChange={(e) => setEditedListing({...editedListing, address: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <p className="text-white">{listing.address}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Listed Price
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editPriceInput}
                          onChange={(e) => {
                            const formatted = formatPriceInput(e.target.value);
                            setEditPriceInput(formatted);
                            setEditedListing({...editedListing, listedPrice: parsePrice(formatted)});
                          }}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="500,000"
                        />
                      ) : (
                        <p className="text-green-400 font-semibold text-lg">{formatPrice(listing.listedPrice)}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Seller Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedListing.sellerName}
                          onChange={(e) => setEditedListing({...editedListing, sellerName: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <p className="text-white">{listing.sellerName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Seller Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedListing.sellerEmail}
                          onChange={(e) => setEditedListing({...editedListing, sellerEmail: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="seller@example.com"
                        />
                      ) : (
                        <p className="text-white">{listing.sellerEmail}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Status
                      </label>
                      {isEditing ? (
                        <select
                          value={editedListing.status}
                          onChange={(e) => setEditedListing({...editedListing, status: e.target.value})}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="live" className="bg-gray-800">Live</option>
                          <option value="archive" className="bg-gray-800">Archive</option>
                          <option value="sold" className="bg-gray-800">Sold</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                          listing.status === 'live' ? 'bg-green-500/20 text-green-400' :
                          listing.status === 'archive' ? 'bg-gray-500/20 text-gray-400' :
                          listing.status === 'sold' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {listing.status}
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Main Photo
                      </label>
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-purple-500 file:text-white file:cursor-pointer hover:file:bg-purple-600"
                          />
                          {imageUploading && (
                            <p className="text-purple-400 text-sm">Uploading image...</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-white/80 text-sm">{listing.mainPhoto ? 'Photo uploaded' : 'No photo set'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Total Offers
                      </label>
                      <p className="text-blue-400 font-semibold text-lg">{listing.offers.length}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Top Offer
                      </label>
                      <p className="text-purple-400 font-semibold text-lg">
                        {highestOffer > 0 ? `£${highestOffer.toLocaleString()}` : 'None yet'}
                      </p>
                    </div>
                  </div>


                </div>
              )}
              {activeTab === 'offers' && (
                <div className="space-y-4">
                  {/* Offers Header with Refresh Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold text-white">
                        All Offers ({totalOffers || listing.offers.length})
                      </h3>
                      {displayHighestOffer > 0 && (
                        <div className="flex items-center gap-2 text-green-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Highest: £{displayHighestOffer.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={refreshOffers}
                      disabled={offersLoading}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/70 hover:text-white transition-colors text-sm"
                    >
                      <RefreshCw className={`w-4 h-4 ${offersLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>

                  {/* Error State */}
                  {offersError && (
                    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-300 text-sm">{offersError}</p>
                    </div>
                  )}

                  {sortedOffers.length === 0 ? (
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-8 text-center">
                      <TrendingUp className="w-12 h-12 text-white/40 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white/70 mb-2">No offers yet</h3>
                      <p className="text-white/50">Be the first to make an offer on this property!</p>
                    </div>
                  ) : (
                    sortedOffers.map((offer, index) => (
                      <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Users className="w-5 h-5 text-blue-400" />
                              <h3 className="text-lg font-medium text-white">
                                {offer.buyerName}
                              </h3>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(offer.status)}`}>
                                {offer.status}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-white/70 mb-3">
                              <div className="flex items-center gap-2">
                                <PoundSterling className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 font-semibold text-lg">
                                  {formatPrice(offer.amount)}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  offer.fundingType === 'Cash' ? 'bg-green-500' : 
                                  offer.fundingType === 'Mortgage' ? 'bg-blue-500' : 'bg-purple-500'
                                }`}></div>
                                <span>{offer.fundingType}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(offer.submittedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm">
                              {offer.chain && (
                                <div className="flex items-center gap-1 text-purple-400">
                                  <AlertCircle className="w-4 h-4" />
                                  <span>Chain</span>
                                </div>
                              )}
                              {offer.aipPresent && (
                                <div className="flex items-center gap-1 text-green-400">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>AIP Present</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {offer.notes && (
                          <div className="mt-4 p-3 bg-white/5 rounded-lg">
                            <p className="text-white/80 text-sm">{offer.notes}</p>
                          </div>
                        )}

                        {/* Counter Offer Display */}
                        {offer.counterOffer && (
                          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400 font-medium text-sm">Counter Offer</span>
                            </div>
                            <p className="text-white font-semibold">{offer.counterOffer}</p>
                            {offer.agentNotes && (
                              <p className="text-white/70 text-sm mt-1">{offer.agentNotes}</p>
                            )}
                          </div>
                        )}

                        {/* Agent Actions */}
                        {canEdit && offer.status === 'submitted' && (
                          <div className="mt-4 flex items-center gap-2">
                            <button
                              onClick={() => handleAcceptOffer(offer.id)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                            >
                              <Check className="w-4 h-4" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleDeclineOffer(offer.id)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                            >
                              <XCircle className="w-4 h-4" />
                              Decline
                            </button>
                            <button
                              onClick={() => handleCounterOffer(offer.id)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                            >
                              <MessageSquare className="w-4 h-4" />
                              Counter
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Admin Actions Sidebar */}
          {canEdit && (
            <div className="lg:col-span-1">
              <div className="space-y-4 sticky top-6">
                <h3 className="text-lg font-semibold text-white font-dm-sans mb-4">
                  Admin Actions
                </h3>
                
                {/* Resend Seller Code */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <h4 className="font-medium text-white">Seller Communication</h4>
                  </div>
                  <p className="text-white/70 text-sm mb-3">
                    Resend the seller access code via email
                  </p>
                  <button
                    onClick={handleResendSellerCode}
                    disabled={sendingSellerCode}
                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium"
                  >
                    {sendingSellerCode ? 'Sending...' : 'Resend Seller Code'}
                  </button>
                </div>

                {/* Buyer Code Management */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <UserPlus className="w-5 h-5 text-green-400" />
                    <h4 className="font-medium text-white">Buyer Management</h4>
                  </div>
                  <p className="text-white/70 text-sm mb-3">
                    Generate and manage buyer access codes
                  </p>
                  <button
                    onClick={() => {
                      setShowBuyerCodeModal(true);
                      fetchBuyerCodes();
                    }}
                    className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                  >
                    Manage Buyer Codes
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Copy className="w-5 h-5 text-purple-400" />
                    <h4 className="font-medium text-white">Quick Actions</h4>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={copySellerCode}
                      className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Seller Code
                    </button>
                    <button
                      onClick={copyListingUrl}
                      className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Listing URL
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>


      {/* Buyer Code Modal */}
      {showBuyerCodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-6 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Manage Buyer Codes</h3>
              <button
                onClick={() => setShowBuyerCodeModal(false)}
                className="p-2 text-white/70 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Generate New Code */}
            <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
              <h4 className="font-medium text-white mb-3">Generate New Buyer Code</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={newBuyerName}
                  onChange={(e) => setNewBuyerName(e.target.value)}
                  placeholder="Buyer Name"
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="email"
                  value={newBuyerEmail}
                  onChange={(e) => setNewBuyerEmail(e.target.value)}
                  placeholder="buyer@example.com"
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                onClick={handleGenerateBuyerCode}
                disabled={generatingBuyerCode || !newBuyerName.trim() || !newBuyerEmail.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white rounded-lg transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                {generatingBuyerCode ? 'Generating...' : 'Generate & Send Code'}
              </button>
            </div>

            {/* Buyer Codes List */}
            <div>
              <h4 className="font-medium text-white mb-3">Active Buyer Codes</h4>
              {loadingBuyerCodes ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  <p className="text-white/70 mt-2">Loading...</p>
                </div>
              ) : buyerCodes.length === 0 ? (
                <p className="text-white/50 text-center py-8">No buyer codes generated yet</p>
              ) : (
                <div className="space-y-3">
                  {buyerCodes.map((buyerCode) => (
                    <div key={buyerCode._id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-purple-400 font-medium">
                              {buyerCode.code}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              buyerCode.isValid 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {buyerCode.isValid ? 'Active' : 'Expired'}
                            </span>
                          </div>
                          <div className="text-white font-medium">{buyerCode.buyerName}</div>
                          <div className="text-white/70 text-sm">{buyerCode.buyerEmail}</div>
                          <div className="text-white/50 text-xs mt-1">
                            Expires in {buyerCode.daysUntilExpiry} days
                          </div>
                        </div>
                        <button
                          onClick={() => navigator.clipboard.writeText(buyerCode.code)}
                          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Copy code"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ListingView;
