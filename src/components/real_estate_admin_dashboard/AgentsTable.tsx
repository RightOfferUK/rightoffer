'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Search,
  Loader2,
  RefreshCw,
  Trash2,
  Edit3,
  Mail,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';

type FilterType = 'All' | 'Active' | 'Inactive';

interface Agent {
  _id: string;
  email: string;
  name?: string;
  isActive: boolean;
  createdAt: string;
  listingCount?: number;
  usedListings?: number;
}

const AgentsTable = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; agent: Agent | null }>({ 
    show: false, 
    agent: null 
  });
  const [quickEdit, setQuickEdit] = useState<{ show: boolean; agent: Agent | null }>({ 
    show: false, 
    agent: null 
  });
  const [deleting, setDeleting] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filters: FilterType[] = ['All', 'Active', 'Inactive'];

  // Fetch agents from API
  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (activeFilter !== 'All') {
        params.append('status', activeFilter.toLowerCase());
      }
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const response = await fetch(`/api/real-estate-admin/agents?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }

      const data = await response.json();
      setAgents(data.agents || []);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError('Failed to load agents. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [activeFilter, searchTerm]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAgents();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchAgents]);

  // Listen for custom refresh events (e.g., after listing creation)
  useEffect(() => {
    const handleRefresh = () => {
      fetchAgents();
    };

    window.addEventListener('refreshListings', handleRefresh);
    return () => window.removeEventListener('refreshListings', handleRefresh);
  }, [fetchAgents]);

  // Listen for custom refresh events (e.g., after agent creation)
  useEffect(() => {
    const handleRefresh = () => {
      fetchAgents();
    };

    window.addEventListener('refreshAgentData', handleRefresh);
    return () => window.removeEventListener('refreshAgentData', handleRefresh);
  }, [fetchAgents]);

  const toggleAgentStatus = async (agentId: string, currentStatus: boolean) => {
    setActionLoading(agentId);
    try {
      const response = await fetch(`/api/real-estate-admin/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update agent status');
      }

      await fetchAgents(); // Refresh the list
    } catch (err) {
      console.error('Error updating agent status:', err);
      alert('Failed to update agent status. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAgent = async (agent: Agent) => {
    setDeleting(agent._id);
    try {
      const response = await fetch(`/api/real-estate-admin/agents/${agent._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete agent');
      }

      // Remove from local state
      setAgents(prev => prev.filter(a => a._id !== agent._id));
      setDeleteConfirm({ show: false, agent: null });
    } catch (err) {
      console.error('Error deleting agent:', err);
      alert('Failed to delete agent. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  // Filter agents based on current filter and search
  const filteredAgents = agents.filter(agent => {
    const matchesFilter = activeFilter === 'All' || 
      (activeFilter === 'Active' && agent.isActive) ||
      (activeFilter === 'Inactive' && !agent.isActive);
    
    const matchesSearch = !searchTerm.trim() || 
      agent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      {/* Delete Confirmation Popup */}
      <DeleteConfirmationPopup
        show={deleteConfirm.show}
        agent={deleteConfirm.agent}
        deleting={deleting}
        onCancel={() => setDeleteConfirm({ show: false, agent: null })}
        onConfirm={handleDeleteAgent}
      />

      {/* Quick Edit Modal */}
      <QuickEditModal
        show={quickEdit.show}
        agent={quickEdit.agent}
        onCancel={() => setQuickEdit({ show: false, agent: null })}
        onSuccess={() => {
          setQuickEdit({ show: false, agent: null });
          fetchAgents(); // Refresh the list
        }}
      />

      {/* Main Table Component */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white font-dm-sans">Agents</h2>
          <button
            onClick={fetchAgents}
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
              placeholder="Search agents..."
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
          <span className="ml-2 text-white/70">Loading agents...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="px-6 py-12 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchAgents}
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
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Listings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredAgents.map((agent, index) => (
                <motion.tr
                  key={agent._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-white/5"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {agent.name || 'Not set'}
                        </p>
                        <p className="text-xs text-white/60">Agent</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-white/80">
                      <Mail className="w-4 h-4 text-white/50 mr-2" />
                      {agent.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {agent.usedListings || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        agent.isActive
                          ? 'bg-green-100/10 text-green-400'
                          : 'bg-red-100/10 text-red-400'
                      }`}
                    >
                      {agent.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-white/70">
                      <Calendar className="w-4 h-4 text-white/50 mr-2" />
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleAgentStatus(agent._id, agent.isActive)}
                        disabled={actionLoading === agent._id}
                        className="text-white/60 hover:text-blue-400 transition-colors disabled:opacity-50"
                        title={agent.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {actionLoading === agent._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : agent.isActive ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => setQuickEdit({ show: true, agent })}
                        className="text-white/60 hover:text-blue-400 transition-colors"
                        title="Quick edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      
                      <button 
                        onClick={() => setDeleteConfirm({ show: true, agent })}
                        disabled={deleting === agent._id}
                        className="text-white/60 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Delete agent"
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

      {!loading && !error && filteredAgents.length === 0 && (
        <div className="px-6 py-12 text-center">
          <User className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <p className="text-white/70 mb-2">No agents found</p>
          <p className="text-white/50 text-sm">
            {searchTerm || activeFilter !== 'All' 
              ? 'Try adjusting your search or filters' 
              : 'Add your first agent to get started'
            }
          </p>
        </div>
      )}
      </div>
    </>
  );
};

// Delete Confirmation Popup Component
const DeleteConfirmationPopup: React.FC<{
  show: boolean;
  agent: Agent | null;
  deleting: string | null;
  onCancel: () => void;
  onConfirm: (agent: Agent) => void;
}> = ({ show, agent, deleting, onCancel, onConfirm }) => {
  if (!show || !agent) return null;

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
              Delete Agent
            </h3>
            <p className="text-white/60 text-sm">This action cannot be undone</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-white/80 mb-2">
            Are you sure you want to delete this agent?
          </p>
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-white font-medium">{agent.name || agent.email}</p>
            <p className="text-white/60 text-sm">
              Email: {agent.email} • {agent.usedListings || 0} listings
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting === agent._id}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white border border-white/20 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(agent)}
            disabled={deleting === agent._id}
            className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            {deleting === agent._id ? (
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
  agent: Agent | null;
  onCancel: () => void;
  onSuccess: () => void;
}> = ({ show, agent, onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (show && agent) {
      setEditData({
        name: agent.name || '',
        email: agent.email,
      });
      setError(null);
      setSuccess(null);
    }
  }, [show, agent]);

  if (!show || !agent) return null;

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/real-estate-admin/agents/${agent._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update agent');
      }
      
      setSuccess('Agent updated successfully!');
      setTimeout(() => onSuccess(), 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to update agent. Please try again.');
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
            Edit Agent
          </h3>
          <button
            onClick={onCancel}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-white/80 mb-2">{agent.name || agent.email}</p>
          <p className="text-white/60 text-sm">Currently has {agent.usedListings || 0} listings</p>
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
              Agent Name
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="Agent name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="agent@company.com"
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

export default AgentsTable;
