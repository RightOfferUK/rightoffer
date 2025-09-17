'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Building2, Users, TrendingUp, Edit3, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';

interface RealEstateAdmin {
  _id: string;
  email: string;
  name?: string;
  companyName: string;
  maxListings: number;
  usedListings: number;
  isActive: boolean;
  createdAt: string;
  agentCount?: number;
}

export default function RealEstateAdminsTable() {
  const [admins, setAdmins] = useState<RealEstateAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; admin: RealEstateAdmin | null }>({ 
    show: false, 
    admin: null 
  });
  const [quickEdit, setQuickEdit] = useState<{ show: boolean; admin: RealEstateAdmin | null }>({ 
    show: false, 
    admin: null 
  });
  const [deleting, setDeleting] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Listen for refresh events
  useEffect(() => {
    const handleRefresh = () => {
      fetchAdmins();
    };

    window.addEventListener('refreshAdminData', handleRefresh);
    return () => {
      window.removeEventListener('refreshAdminData', handleRefresh);
    };
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admin/real-estate-admins');
      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins);
      }
    } catch (error) {
      console.error('Error fetching real estate admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    setActionLoading(adminId);
    try {
      const response = await fetch(`/api/admin/real-estate-admins/${adminId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        await fetchAdmins(); // Refresh the list
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update company status');
      }
    } catch (error) {
      console.error('Error updating admin status:', error);
      alert('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAdmin = async (admin: RealEstateAdmin) => {
    setDeleting(admin._id);
    try {
      const response = await fetch(`/api/admin/real-estate-admins/${admin._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete company');
      }

      // Remove from local state
      setAdmins(prev => prev.filter(a => a._id !== admin._id));
      setDeleteConfirm({ show: false, admin: null });
    } catch (err) {
      console.error('Error deleting admin:', err);
      alert('Failed to delete company. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70 font-dm-sans">Loading real estate admins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-bold font-dm-sans text-white mb-2">
          Real Estate Companies
        </h2>
        <p className="text-white/70 font-dm-sans text-sm">
          Manage real estate admin accounts and their listing allocations
        </p>
      </div>

      {admins.length === 0 ? (
        <div className="p-8 text-center">
          <Building2 className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/70 font-dm-sans mb-2">No real estate admins yet</p>
          <p className="text-white/50 font-dm-sans text-sm">
            Create your first real estate admin to get started
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left py-4 px-6 text-white/70 font-dm-sans text-sm font-medium">
                  Company
                </th>
                <th className="text-left py-4 px-6 text-white/70 font-dm-sans text-sm font-medium">
                  Contact
                </th>
                <th className="text-left py-4 px-6 text-white/70 font-dm-sans text-sm font-medium">
                  Listings
                </th>
                <th className="text-left py-4 px-6 text-white/70 font-dm-sans text-sm font-medium">
                  Agents
                </th>
                <th className="text-left py-4 px-6 text-white/70 font-dm-sans text-sm font-medium">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-white/70 font-dm-sans text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, index) => (
                <motion.tr
                  key={admin._id}
                  className="border-t border-white/10 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-dm-sans font-medium">
                          {admin.companyName}
                        </p>
                        <p className="text-white/50 font-dm-sans text-sm">
                          Created {new Date(admin.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-white font-dm-sans">
                      {admin.name || 'Not set'}
                    </p>
                    <p className="text-white/70 font-dm-sans text-sm">
                      {admin.email}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-dm-sans text-sm">
                            {admin.usedListings} / {admin.maxListings}
                          </span>
                          <span className="text-white/50 font-dm-sans text-xs">
                            {admin.maxListings > 0 ? Math.round((admin.usedListings / admin.maxListings) * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${admin.maxListings > 0 ? (admin.usedListings / admin.maxListings) * 100 : 0}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-white/50 mr-2" />
                      <span className="text-white font-dm-sans">
                        {admin.agentCount || 0}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-dm-sans ${
                        admin.isActive
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleAdminStatus(admin._id, admin.isActive)}
                        disabled={actionLoading === admin._id}
                        className="text-white/60 hover:text-blue-400 transition-colors disabled:opacity-50"
                        title={admin.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {actionLoading === admin._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : admin.isActive ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => setQuickEdit({ show: true, admin })}
                        className="text-white/60 hover:text-blue-400 transition-colors"
                        title="Quick edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      
                      <button 
                        onClick={() => setDeleteConfirm({ show: true, admin })}
                        disabled={deleting === admin._id}
                        className="text-white/60 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Delete company"
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

      {/* Delete Confirmation Popup */}
      <DeleteConfirmationPopup
        show={deleteConfirm.show}
        admin={deleteConfirm.admin}
        deleting={deleting}
        onCancel={() => setDeleteConfirm({ show: false, admin: null })}
        onConfirm={handleDeleteAdmin}
      />

      {/* Quick Edit Modal */}
      <QuickEditModal
        show={quickEdit.show}
        admin={quickEdit.admin}
        onCancel={() => setQuickEdit({ show: false, admin: null })}
        onSuccess={() => {
          setQuickEdit({ show: false, admin: null });
          fetchAdmins(); // Refresh the list
        }}
      />
    </div>
  );
};

// Delete Confirmation Popup Component
const DeleteConfirmationPopup: React.FC<{
  show: boolean;
  admin: RealEstateAdmin | null;
  deleting: string | null;
  onCancel: () => void;
  onConfirm: (admin: RealEstateAdmin) => void;
}> = ({ show, admin, deleting, onCancel, onConfirm }) => {
  if (!show || !admin) return null;

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
              Delete Company
            </h3>
            <p className="text-white/60 text-sm">This action cannot be undone</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-white/80 mb-2">
            Are you sure you want to delete this company?
          </p>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-white font-medium">{admin.companyName}</p>
            <p className="text-white/60 text-sm">
              Contact: {admin.name || admin.email} • {admin.agentCount || 0} agents
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting === admin._id}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white border border-white/20 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(admin)}
            disabled={deleting === admin._id}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            {deleting === admin._id ? (
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
  admin: RealEstateAdmin | null;
  onCancel: () => void;
  onSuccess: () => void;
}> = ({ show, admin, onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    companyName: '',
    name: '',
    email: '',
    maxListings: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (show && admin) {
      setEditData({
        companyName: admin.companyName,
        name: admin.name || '',
        email: admin.email,
        maxListings: admin.maxListings,
      });
      setError(null);
      setSuccess(null);
    }
  }, [show, admin]);

  if (!show || !admin) return null;

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/real-estate-admins/${admin._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update company');
      }
      
      setSuccess('Company updated successfully!');
      setTimeout(() => onSuccess(), 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to update company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white font-dm-sans">
            Edit Company
          </h3>
          <button
            onClick={onCancel}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-white/80 mb-2">{admin.companyName}</p>
          <p className="text-white/60 text-sm">Currently using {admin.usedListings} / {admin.maxListings} listings</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-300 text-sm">{success}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={editData.companyName}
              onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="Company name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Admin Name
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="Admin name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="admin@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Maximum Listings
            </label>
            <input
              type="number"
              value={editData.maxListings}
              onChange={(e) => setEditData({ ...editData, maxListings: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="10"
              min="1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white border border-white/20 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
