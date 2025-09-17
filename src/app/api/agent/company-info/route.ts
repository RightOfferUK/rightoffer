import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and agent role
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'agent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    // Find the agent and populate their real estate admin
    const agent = await User.findById(session.user.id)
      .populate('realEstateAdminId', 'companyName');

    if (!agent || !agent.realEstateAdminId) {
      return NextResponse.json({ error: 'Company information not found' }, { status: 404 });
    }

    return NextResponse.json({
      companyName: (agent.realEstateAdminId as any).companyName
    });

  } catch (error) {
    console.error('Error fetching company info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company info' }, 
      { status: 500 }
    );
  }
}

