'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  TrendingUp, 
  User, 
  MoreHorizontal,
  Search
} from 'lucide-react';

type FilterType = 'All' | 'Live' | 'STC' | 'Draft' | 'With offers' | 'Needs docs';
type StatusType = 'Live' | 'STC' | 'Draft' | 'Under Review';

interface Listing {
  id: string;
  address: string;
  status: StatusType;
  views: number;
  enquiries: number;
  offers: number;
  topOffer: string;
  lastActivity: string;
  owner: string;
}

const mockListings: Listing[] = [
  {
    id: '1',
    address: '123 Oak Street, London SW1A 1AA',
    status: 'Live',
    views: 247,
    enquiries: 12,
    offers: 3,
    topOffer: '£450,000',
    lastActivity: '2 hours ago',
    owner: 'John Smith'
  },
  {
    id: '2',
    address: '45 Maple Avenue, Manchester M1 2AB',
    status: 'STC',
    views: 189,
    enquiries: 8,
    offers: 1,
    topOffer: '£325,000',
    lastActivity: '1 day ago',
    owner: 'Sarah Johnson'
  },
  {
    id: '3',
    address: '67 Pine Road, Birmingham B1 3CD',
    status: 'Live',
    views: 156,
    enquiries: 6,
    offers: 0,
    topOffer: '-',
    lastActivity: '3 hours ago',
    owner: 'Mike Wilson'
  },
  {
    id: '4',
    address: '89 Cedar Close, Leeds LS1 4EF',
    status: 'Draft',
    views: 0,
    enquiries: 0,
    offers: 0,
    topOffer: '-',
    lastActivity: '1 week ago',
    owner: 'Emma Davis'
  },
  {
    id: '5',
    address: '12 Elm Gardens, Liverpool L1 5GH',
    status: 'Live',
    views: 298,
    enquiries: 15,
    offers: 5,
    topOffer: '£380,000',
    lastActivity: '30 minutes ago',
    owner: 'David Brown'
  }
];

const ListingsTable = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filters: FilterType[] = ['All', 'Live', 'STC', 'Draft', 'With offers', 'Needs docs'];

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'Live':
        return 'text-green-400 bg-green-500/20';
      case 'STC':
        return 'text-orange-400 bg-orange-500/20';
      case 'Draft':
        return 'text-gray-400 bg-gray-500/20';
      case 'Under Review':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredListings = mockListings.filter(listing => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'With offers') return listing.offers > 0;
    if (activeFilter === 'Needs docs') return false; // Mock condition
    return listing.status === activeFilter;
  }).filter(listing => 
    listing.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white font-dm-sans mb-4">Listings</h2>

        {/* Search and Quick Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  activeFilter === filter
                    ? 'bg-orange-500 text-white'
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
              className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
            />
          </div>
        </div>
      </div>

      {/* Table */}
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
                Enquiries
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Offers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Top Offer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filteredListings.map((listing, index) => (
              <motion.tr
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-white/5 transition-colors cursor-pointer"
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
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <MessageCircle className="w-4 h-4 text-green-400" />
                    {listing.enquiries}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <TrendingUp className="w-4 h-4 text-orange-400" />
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
                <td className="px-6 py-4">
                  <button className="text-white/60 hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredListings.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-white/60 font-dm-sans">No listings found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ListingsTable;
