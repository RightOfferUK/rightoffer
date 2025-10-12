'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar,
  Check,
  AlertCircle,
  Loader2,
  Shield,
  ShieldOff
} from 'lucide-react';

interface Agent {
  _id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

interface AgentEditFormProps {
  agent: Agent;
}

const AgentEditForm: React.FC<AgentEditFormProps> = ({ agent }) => {
  const [formData, setFormData] = useState({
    name: agent.name || '',
    isActive: agent.isActive
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/real-estate-admin/agents/${agent._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update agent');
      }

      setSuccess('Agent updated successfully!');
      
      // Refresh the page after a short delay to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error updating agent:', error);
      setError(error instanceof Error ? error.message : 'Failed to update agent');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Agent Info Card */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white font-dm-sans mb-4">Agent Information</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {agent.name || 'Name not set'}
              </p>
              <p className="text-xs text-white/60">Agent</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-white/50" />
            <div>
              <p className="text-sm text-white">{agent.email}</p>
              <p className="text-xs text-white/60">Email Address</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-white/50" />
            <div>
              <p className="text-sm text-white">{formatDate(agent.createdAt)}</p>
              <p className="text-xs text-white/60">Joined Date</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {agent.isActive ? (
              <Shield className="w-5 h-5 text-green-400" />
            ) : (
              <ShieldOff className="w-5 h-5 text-red-400" />
            )}
            <div>
              <p className={`text-sm ${agent.isActive ? 'text-green-400' : 'text-red-400'}`}>
                {agent.isActive ? 'Active' : 'Inactive'}
              </p>
              <p className="text-xs text-white/60">Account Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white font-dm-sans mb-4">Edit Agent</h3>
        
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

          {/* Agent Name */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Agent Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              placeholder="Enter agent name"
            />
          </div>

          {/* Account Status */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-500/50"
              />
              <span className="text-sm text-white/70">
                Active Account
              </span>
            </label>
            <p className="text-xs text-white/50 mt-1">
              Inactive agents cannot log in or access the system
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 text-white rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Update Agent
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgentEditForm;

