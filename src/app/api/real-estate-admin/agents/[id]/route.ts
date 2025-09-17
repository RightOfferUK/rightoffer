import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and real estate admin role
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'real_estate_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    const { id } = await params;

    // Parse request body
    const body = await request.json();
    const { isActive, name } = body;

    // Find the agent and verify ownership
    const agent = await User.findOne({
      _id: id,
      role: 'agent',
      realEstateAdminId: new mongoose.Types.ObjectId(session.user.id)
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Update fields
    const updateData: any = {};
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (name !== undefined) updateData.name = name;

    const updatedAgent = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return NextResponse.json({ 
      message: 'Agent updated successfully',
      agent: updatedAgent
    });

  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: 'Failed to update agent' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and real estate admin role
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'real_estate_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    const { id } = await params;

    // Find the agent and verify ownership
    const agent = await User.findOne({
      _id: id,
      role: 'agent',
      realEstateAdminId: new mongoose.Types.ObjectId(session.user.id)
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Check if they have any active listings
    const { default: Listing } = await import('@/models/Listing');
    const listingCount = await Listing.countDocuments({ 
      agentId: new mongoose.Types.ObjectId(id)
    });

    if (listingCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete agent with active listings. Please reassign or remove listings first.' 
      }, { status: 409 });
    }

    // Delete the agent
    await User.findByIdAndDelete(id);

    return NextResponse.json({ 
      message: 'Agent deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent' }, 
      { status: 500 }
    );
  }
}

