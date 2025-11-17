// import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';
import AgentManagementClient from '@/components/real_estate_admin_dashboard/AgentManagementClient';
import MobileRestriction from '@/components/layout/MobileRestriction';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getAgent(id: string, realEstateAdminId: string) {
  await cachedMongooseConnection;
  
  const agent = await User.findOne({
    _id: id,
    role: 'agent',
    realEstateAdminId: new mongoose.Types.ObjectId(realEstateAdminId)
  });

  if (!agent) {
    return null;
  }

  return {
    _id: agent._id.toString(),
    email: agent.email,
    name: agent.name || '',
    isActive: agent.isActive,
    createdAt: agent.createdAt.toISOString()
  };
}

export default async function AgentPage({ params }: PageProps) {
  const session = await auth();
  
  if (!session?.user?.id || session.user.role !== 'real_estate_admin') {
    return (
      <div className="min-h-screen bg-navy-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Unauthorized</h1>
          <p className="text-white/70">You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const { id } = await params;
  const agent = await getAgent(id, session.user.id);

  if (!agent) {
    return (
      <div className="min-h-screen bg-navy-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Agent Not Found</h1>
          <p className="text-white/70">The agent you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.</p>
        </div>
      </div>
    );
  }

  return (
    <MobileRestriction showHomeButton={false}>
      <AgentManagementClient agent={agent} />
    </MobileRestriction>
  );
}