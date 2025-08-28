'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Clock, 
  PoundSterling, 
  Users, 
  FileCheck, 
  Filter,
  Search,
  X,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';

type StatusType = 'submitted' | 'verified' | 'countered' | 'pending verification';
type FundingType = 'Cash' | 'Mortgage' | 'Chain';

interface Offer {
  id: string;
  property: string;
  buyerName: string;
  amount: string;
  status: StatusType;
  fundingType: FundingType;
  chain: boolean;
  aipPresent: boolean;
  submittedAt: string;
  lastActivity: string;
}

const mockOffers: Offer[] = [
  {
    id: '1',
    property: '123 Oak Street, London SW1A 1AA',
    buyerName: 'Alice Thompson',
    amount: '£450,000',
    status: 'submitted',
    fundingType: 'Mortgage',
    chain: false,
    aipPresent: true,
    submittedAt: '2024-01-15T10:30:00Z',
    lastActivity: '2 hours ago'
  },
  {
    id: '2',
    property: '45 Maple Avenue, Manchester M1 2AB',
    buyerName: 'Robert Chen',
    amount: '£325,000',
    status: 'verified',
    fundingType: 'Cash',
    chain: false,
    aipPresent: false,
    submittedAt: '2024-01-14T14:15:00Z',
    lastActivity: '1 day ago'
  },
  {
    id: '3',
    property: '12 Elm Gardens, Liverpool L1 5GH',
    buyerName: 'Sophie Williams',
    amount: '£380,000',
    status: 'countered',
    fundingType: 'Mortgage',
    chain: true,
    aipPresent: true,
    submittedAt: '2024-01-13T09:45:00Z',
    lastActivity: '3 hours ago'
  },
  {
    id: '4',
    property: '67 Pine Road, Birmingham B1 3CD',
    buyerName: 'James Miller',
    amount: '£295,000',
    status: 'submitted',
    fundingType: 'Chain',
    chain: true,
    aipPresent: false,
    submittedAt: '2024-01-12T16:20:00Z',
    lastActivity: '4 hours ago'
  },
  {
    id: '5',
    property: '89 Cedar Close, Leeds LS1 4EF',
    buyerName: 'Emma Davis',
    amount: '£410,000',
    status: 'pending verification',
    fundingType: 'Mortgage',
    chain: false,
    aipPresent: true,
    submittedAt: '2024-01-11T11:30:00Z',
    lastActivity: '6 hours ago'
  }
];

const OffersInbox = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusType | 'all'>('all');
  const [fundingFilter, setFundingFilter] = useState<FundingType | 'all'>('all');
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'submitted':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'verified':
        return 'text-green-400 bg-green-500/20';
      case 'countered':
        return 'text-blue-400 bg-blue-500/20';
      case 'pending verification':
        return 'text-orange-400 bg-orange-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredOffers = mockOffers.filter(offer => {
    const matchesSearch = offer.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.buyerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
    const matchesFunding = fundingFilter === 'all' || offer.fundingType === fundingFilter;
    
    return matchesSearch && matchesStatus && matchesFunding;
  });

  return (
    <>
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white font-dm-sans">Offers Inbox</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search offers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white/80 hover:bg-white/20 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-white/10 pt-4 mt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as StatusType | 'all')}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      <option value="all">All Statuses</option>
                      <option value="submitted">Submitted</option>
                      <option value="verified">Verified</option>
                      <option value="countered">Countered</option>
                      <option value="pending verification">Pending Verification</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Funding Type</label>
                    <select
                      value={fundingFilter}
                      onChange={(e) => setFundingFilter(e.target.value as FundingType | 'all')}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      <option value="all">All Types</option>
                      <option value="Cash">Cash</option>
                      <option value="Mortgage">Mortgage</option>
                      <option value="Chain">Chain</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setStatusFilter('all');
                        setFundingFilter('all');
                        setSearchTerm('');
                      }}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white/80 hover:bg-white/20 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Offers List */}
        <div className="divide-y divide-white/10">
          {filteredOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setSelectedOffer(offer)}
              className="px-6 py-4 hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Home className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <h3 className="text-sm font-medium text-white truncate">
                      {offer.property}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(offer.status)}`}>
                      {offer.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-white/70">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {offer.buyerName}
                    </div>
                    <div className="flex items-center gap-1 font-medium text-green-400">
                      <PoundSterling className="w-3 h-3" />
                      {offer.amount}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${offer.fundingType === 'Cash' ? 'bg-green-500' : offer.fundingType === 'Mortgage' ? 'bg-blue-500' : 'bg-orange-500'}`}></span>
                      {offer.fundingType}
                    </div>
                    {offer.chain && (
                      <div className="flex items-center gap-1 text-orange-400">
                        <AlertCircle className="w-3 h-3" />
                        Chain
                      </div>
                    )}
                    {offer.aipPresent && (
                      <div className="flex items-center gap-1 text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        AIP
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <Clock className="w-3 h-3" />
                  {offer.lastActivity}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredOffers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-white/60 font-dm-sans">No offers found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Offer Drawer */}
      <AnimatePresence>
        {selectedOffer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOffer(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-96 bg-slate-800/95 backdrop-blur-xl border-l border-white/20 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Offer Details</h3>
                  <button
                    onClick={() => setSelectedOffer(null)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Property</label>
                    <p className="text-white">{selectedOffer.property}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Buyer</label>
                      <p className="text-white">{selectedOffer.buyerName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Amount</label>
                      <p className="text-green-400 font-medium">{selectedOffer.amount}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOffer.status)}`}>
                        {selectedOffer.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Funding</label>
                      <p className="text-white">{selectedOffer.fundingType}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">Chain</label>
                      <p className={selectedOffer.chain ? 'text-orange-400' : 'text-green-400'}>
                        {selectedOffer.chain ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">AIP Present</label>
                      <p className={selectedOffer.aipPresent ? 'text-green-400' : 'text-red-400'}>
                        {selectedOffer.aipPresent ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Submitted</label>
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedOffer.submittedAt).toLocaleDateString()} at {new Date(selectedOffer.submittedAt).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex gap-3">
                      <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                        Verify Offer
                      </button>
                      <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        Delete Offer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default OffersInbox;
