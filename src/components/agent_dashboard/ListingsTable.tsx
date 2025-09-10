'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  User, 
  Search,
  Loader2,
  ExternalLink,
  RefreshCw,
  Trash2,
  Edit3,
  Mail,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';

type FilterType = 'All' | 'Live' | 'STC' | 'Draft' | 'With offers' | 'Needs docs';
type StatusType = 'Live' | 'STC' | 'Draft' | 'Under Review';

interface Listing {
  _id: string;
  address: string;
  status: StatusType;
  offers: number;
  topOffer: string;
  lastActivity: string;
  owner: string;
  sellerCode: string;
  listedPrice: string;
  createdAt: string;
}

const ListingsTable = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; listing: Listing | null }>({ 
    show: false, 
    listing: null 
  });
  const [quickEdit, setQuickEdit] = useState<{ show: boolean; listing: Listing | null }>({ 
    show: false, 
    listing: null 
  });
  const [deleting, setDeleting] = useState<string | null>(null);

  const filters: FilterType[] = ['All', 'Live', 'STC', 'Draft', 'With offers', 'Needs docs'];

  // Fetch listings from API
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (activeFilter !== 'All') {
        params.append('status', activeFilter);
      }
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const response = await fetch(`/api/agent/listings?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }

      const data = await response.json();
      setListings(data.listings || []);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeFilter, searchTerm]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchListings();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchListings]);

  // Listen for custom refresh events (e.g., after listing creation)
  useEffect(() => {
    const handleRefresh = () => {
      fetchListings();
    };

    window.addEventListener('refreshListings', handleRefresh);
    return () => window.removeEventListener('refreshListings', handleRefresh);
  }, [fetchListings]);

  // Note: fetchListings already depends on activeFilter and searchTerm via useCallback

  // Delete listing
  const handleDeleteListing = async (listing: Listing) => {
    setDeleting(listing._id);
    try {
      const response = await fetch(`/api/agent/listings/${listing._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }

      // Remove from local state
      setListings(prev => prev.filter(l => l._id !== listing._id));
      setDeleteConfirm({ show: false, listing: null });
    } catch (err) {
      console.error('Error deleting listing:', err);
      setError('Failed to delete listing. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  };

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'Live':
        return 'text-green-400 bg-green-500/20';
      case 'STC':
        return 'text-purple-400 bg-purple-500/20';
      case 'Draft':
        return 'text-gray-400 bg-gray-500/20';
      case 'Under Review':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  // Data is already filtered on the server side, so we just use the listings as-is
  const filteredListings = listings;

  return (
    <>
      {/* Delete Confirmation Popup */}
      <DeleteConfirmationPopup
        show={deleteConfirm.show}
        listing={deleteConfirm.listing}
        deleting={deleting}
        onCancel={() => setDeleteConfirm({ show: false, listing: null })}
        onConfirm={handleDeleteListing}
      />

      {/* Quick Edit Modal */}
      <QuickEditModal
        show={quickEdit.show}
        listing={quickEdit.listing}
        onCancel={() => setQuickEdit({ show: false, listing: null })}
        onSuccess={() => {
          setQuickEdit({ show: false, listing: null });
          fetchListings(); // Refresh the list
        }}
      />

      {/* Main Table Component */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white font-dm-sans">Listings</h2>
          <button
            onClick={fetchListings}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Search and Quick Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeFilter === filter
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
          <span className="ml-2 text-white/70">Loading listings...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="px-6 py-12 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchListings}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Listed Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Offers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Top Offer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredListings.map((listing, index) => (
                <motion.tr
                  key={listing._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm text-white font-medium">
                      {listing.address}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(listing.status)}`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/80 font-medium">
                    {listing.listedPrice}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      {listing.offers}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/80 font-medium">
                    {listing.topOffer}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <User className="w-4 h-4" />
                      {listing.owner}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">
                    {formatRelativeTime(listing.lastActivity)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/listing/${listing._id}`}
                        className="text-white/60 hover:text-white transition-colors"
                        title="View listing"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setQuickEdit({ show: true, listing })}
                        className="text-white/60 hover:text-blue-400 transition-colors"
                        title="Quick edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm({ show: true, listing })}
                        disabled={deleting === listing._id}
                        className="text-white/60 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && filteredListings.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-white/60 font-dm-sans mb-4">
            {searchTerm || activeFilter !== 'All' 
              ? 'No listings found matching your criteria.' 
              : 'No listings yet. Create your first listing to get started!'
            }
          </p>
          {searchTerm || activeFilter !== 'All' ? (
            <button 
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('All');
              }}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          ) : null}
        </div>
      )}
      </div>
    </>
  );
};

// Delete Confirmation Popup Component
const DeleteConfirmationPopup: React.FC<{
  show: boolean;
  listing: Listing | null;
  deleting: string | null;
  onCancel: () => void;
  onConfirm: (listing: Listing) => void;
}> = ({ show, listing, deleting, onCancel, onConfirm }) => {
  if (!show || !listing) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-lg p-6 max-w-md w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-dm-sans">
              Delete Listing
            </h3>
            <p className="text-white/60 text-sm">This action cannot be undone</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-white/80 mb-2">
            Are you sure you want to delete this listing?
          </p>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-white font-medium">{listing.address}</p>
            <p className="text-white/60 text-sm">
              Seller: {listing.owner} • {listing.offers} offers
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting === listing._id}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white border border-white/20 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(listing)}
            disabled={deleting === listing._id}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            {deleting === listing._id ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

// Quick Edit Modal Component
const QuickEditModal: React.FC<{
  show: boolean;
  listing: Listing | null;
  onCancel: () => void;
  onSuccess: () => void;
}> = ({ show, listing, onCancel, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'seller' | 'buyer'>('edit');
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({ address: '', listedPrice: '' });
  const [buyerData, setBuyerData] = useState({ name: '', email: '' });
  const [buyerCodes, setBuyerCodes] = useState<{
    _id: string;
    code: string;
    buyerName: string;
    buyerEmail: string;
    isValid: boolean;
    daysUntilExpiry: number;
    lastEmailSent?: string;
  }[]>([]);
  const [loadingBuyerCodes, setLoadingBuyerCodes] = useState(false);
  const [editingBuyerCode, setEditingBuyerCode] = useState<string | null>(null);
  const [editBuyerName, setEditBuyerName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch buyer codes for this listing
  const fetchBuyerCodes = useCallback(async () => {
    if (!listing) return;
    
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
  }, [listing]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (show && listing) {
      setEditData({ address: listing.address, listedPrice: listing.listedPrice });
      setBuyerData({ name: '', email: '' });
      setBuyerCodes([]);
      setEditingBuyerCode(null);
      setEditBuyerName('');
      setError(null);
      setSuccess(null);
      setActiveTab('edit');
      fetchBuyerCodes();
    }
  }, [show, listing, fetchBuyerCodes]);

  if (!show || !listing) return null;

  const handleEditSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/agent/listings/${listing._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: editData.address,
          listedPrice: editData.listedPrice,
        }),
      });

      if (!response.ok) throw new Error('Failed to update listing');
      
      setSuccess('Listing updated successfully!');
      setTimeout(() => onSuccess(), 1000);
    } catch {
      setError('Failed to update listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendSellerCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/agent/listings/${listing._id}/resend-seller-code`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to resend seller code');
      
      setSuccess('Seller code sent successfully!');
    } catch {
      setError('Failed to send seller code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBuyerCode = async () => {
    if (!buyerData.name || !buyerData.email) {
      setError('Please enter buyer name and email');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/agent/listings/${listing._id}/generate-buyer-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buyerData),
      });

      if (!response.ok) throw new Error('Failed to generate buyer code');
      
      setSuccess('Buyer code generated and sent successfully!');
      setBuyerData({ name: '', email: '' });
      // Refresh buyer codes list
      await fetchBuyerCodes();
    } catch {
      setError('Failed to generate buyer code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle editing buyer name
  const handleEditBuyerName = async (codeId: string) => {
    if (!editBuyerName.trim()) {
      setError('Buyer name cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/agent/buyer-codes/${codeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerName: editBuyerName.trim() }),
      });

      if (!response.ok) throw new Error('Failed to update buyer name');
      
      setSuccess('Buyer name updated successfully!');
      setEditingBuyerCode(null);
      setEditBuyerName('');
      // Refresh buyer codes list
      await fetchBuyerCodes();
    } catch {
      setError('Failed to update buyer name. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle resending buyer code email
  const handleResendBuyerCode = async (codeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/agent/buyer-codes/${codeId}/resend`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to resend buyer code');
      
      setSuccess('Buyer code email resent successfully!');
      // Refresh buyer codes list to update lastEmailSent
      await fetchBuyerCodes();
    } catch {
      setError('Failed to resend buyer code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle deactivating buyer code
  const handleDeactivateBuyerCode = async (codeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/agent/buyer-codes/${codeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to deactivate buyer code');
      
      setSuccess('Buyer code deactivated successfully!');
      // Refresh buyer codes list
      await fetchBuyerCodes();
    } catch {
      setError('Failed to deactivate buyer code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white font-dm-sans">
            Quick Actions
          </h3>
          <button
            onClick={onCancel}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-white/80 mb-2">{listing.address}</p>
          <p className="text-white/60 text-sm">Seller: {listing.owner}</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'edit'
                ? 'bg-purple-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Edit3 className="w-4 h-4 inline mr-2" />
            Edit Details
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'seller'
                ? 'bg-purple-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Seller Code
          </button>
          <button
            onClick={() => setActiveTab('buyer')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'buyer'
                ? 'bg-purple-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Buyer Code
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[200px]">
          {activeTab === 'edit' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Property Address
                </label>
                <input
                  type="text"
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Listed Price
                </label>
                <input
                  type="text"
                  value={editData.listedPrice}
                  onChange={(e) => setEditData({ ...editData, listedPrice: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="£450,000"
                />
              </div>
              <button
                onClick={handleEditSave}
                disabled={loading}
                className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit3 className="w-4 h-4" />}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {activeTab === 'seller' && (
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-white font-medium mb-2">Current Seller Code</h4>
                <code className="text-purple-400 font-mono text-lg">{listing.sellerCode}</code>
              </div>
              <p className="text-white/70 text-sm">
                Resend the seller code to the property owner&apos;s email address so they can access their listing.
              </p>
              <button
                onClick={handleResendSellerCode}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                {loading ? 'Sending...' : 'Resend Seller Code'}
              </button>
            </div>
          )}

          {activeTab === 'buyer' && (
            <div className="space-y-6">
              {/* Generate New Buyer Code Section */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Generate New Buyer Code</h4>
                <p className="text-white/70 text-sm">
                  Generate a buyer code to give potential buyers access to make offers on this property.
                </p>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Buyer Name
                  </label>
                  <input
                    type="text"
                    value={buyerData.name}
                    onChange={(e) => setBuyerData({ ...buyerData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Buyer Email
                  </label>
                  <input
                    type="email"
                    value={buyerData.email}
                    onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="john@example.com"
                  />
                </div>
                <button
                  onClick={handleGenerateBuyerCode}
                  disabled={loading || !buyerData.name || !buyerData.email}
                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  {loading ? 'Generating...' : 'Generate Buyer Code'}
                </button>
              </div>

              {/* Existing Buyer Codes Section */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">Active Buyer Codes</h4>
                  {loadingBuyerCodes && <Loader2 className="w-4 h-4 animate-spin text-white/60" />}
                </div>
                
                {buyerCodes.length === 0 ? (
                  <p className="text-white/60 text-sm italic">No buyer codes generated yet.</p>
                ) : (
                  <div className="space-y-3">
                    {buyerCodes.map((code) => (
                      <div key={code._id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <code className="text-green-400 font-mono text-sm bg-green-500/10 px-2 py-1 rounded">
                                {code.code}
                              </code>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                code.isValid 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {code.isValid ? 'Active' : code.isExpired ? 'Expired' : 'Inactive'}
                              </span>
                              {code.daysUntilExpiry > 0 && (
                                <span className="text-xs text-white/60">
                                  {code.daysUntilExpiry} days left
                                </span>
                              )}
                            </div>
                            
                            <div className="space-y-1">
                              {editingBuyerCode === code._id ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={editBuyerName}
                                    onChange={(e) => setEditBuyerName(e.target.value)}
                                    className="flex-1 px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
                                    placeholder="Buyer name"
                                  />
                                  <button
                                    onClick={() => handleEditBuyerName(code._id)}
                                    disabled={loading}
                                    className="px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white text-xs rounded"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingBuyerCode(null);
                                      setEditBuyerName('');
                                    }}
                                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium">{code.buyerName}</span>
                                  <button
                                    onClick={() => {
                                      setEditingBuyerCode(code._id);
                                      setEditBuyerName(code.buyerName);
                                    }}
                                    className="text-white/60 hover:text-blue-400 transition-colors"
                                    title="Edit name"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                              
                              <p className="text-white/60 text-sm">{code.buyerEmail}</p>
                              
                              {code.lastEmailSent && (
                                <p className="text-white/50 text-xs">
                                  Last email sent: {new Date(code.lastEmailSent).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            {code.isValid && (
                              <button
                                onClick={() => handleResendBuyerCode(code._id)}
                                disabled={loading}
                                className="p-2 text-white/60 hover:text-blue-400 transition-colors"
                                title="Resend email"
                              >
                                <Mail className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeactivateBuyerCode(code._id)}
                              disabled={loading}
                              className="p-2 text-white/60 hover:text-red-400 transition-colors"
                              title="Deactivate code"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-300 text-sm">{success}</p>
          </div>
        )}
      </motion.div>
    </div>,
    document.body
  );
};

export default ListingsTable;
