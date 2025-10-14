'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ListingsTable from '../agent_dashboard/ListingsTable';
import AgentEditForm from './AgentEditForm';

interface Agent {
  _id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

interface AgentManagementClientProps {
  agent: Agent;
}

const AgentManagementClient: React.FC<AgentManagementClientProps> = ({ agent }) => {
  return (
    <div className="min-h-screen bg-navy-gradient">
      {/* Header - Similar to UserMenu */}
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-xl font-bold text-white font-dm-sans">
                  Manage Agent: {agent.name || agent.email}
                </h1>
                <p className="text-white/60 text-sm">
                  View and manage listings for this agent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Match dashboard layout */}
      <div className="flex">
        {/* Left Side - Listings Table */}
        <div className="w-2/3 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white font-dm-sans">
              {agent.name || agent.email}&apos;s Listings
            </h2>
            <p className="text-white/70 mt-1">View and manage all listings for this agent</p>
          </div>
          
          <ListingsTable agentId={agent._id} agentName={agent.name || agent.email} hideHeader={true} isAdminView={true} />
        </div>

        {/* Right Side - Agent Edit Form */}
        <div className="w-1/3 p-6 space-y-6">
          <AgentEditForm agent={agent} />
        </div>
      </div>
    </div>
  );
};

export default AgentManagementClient;
