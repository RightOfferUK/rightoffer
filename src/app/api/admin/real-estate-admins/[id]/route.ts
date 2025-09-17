import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import User from '@/models/User';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    const { id } = await params;

    // Parse request body
    const body = await request.json();
    const { isActive, maxListings, companyName, name, email } = body;

    // Find the real estate admin
    const admin = await User.findById(id);
    if (!admin || admin.role !== 'real_estate_admin') {
      return NextResponse.json({ error: 'Real estate admin not found' }, { status: 404 });
    }

    // Update fields
    const updateData: any = {};
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (maxListings !== undefined) updateData.maxListings = parseInt(maxListings);
    if (companyName !== undefined) updateData.companyName = companyName;
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) {
      // Check if email is already in use by another user
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: id }
      });
      if (existingUser) {
        return NextResponse.json({ 
          error: 'Email is already in use by another user' 
        }, { status: 409 });
      }
      updateData.email = email.toLowerCase();
    }

    const updatedAdmin = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return NextResponse.json({ 
      message: 'Real estate admin updated successfully',
      admin: updatedAdmin
    });

  } catch (error) {
    console.error('Error updating real estate admin:', error);
    return NextResponse.json(
      { error: 'Failed to update real estate admin' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    const { id } = await params;

    // Find the real estate admin
    const admin = await User.findById(id);
    if (!admin || admin.role !== 'real_estate_admin') {
      return NextResponse.json({ error: 'Real estate admin not found' }, { status: 404 });
    }

    // Check if they have any agents
    const agentCount = await User.countDocuments({ 
      realEstateAdminId: id,
      role: 'agent' 
    });

    if (agentCount > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete real estate admin with active agents. Please reassign or remove agents first.' 
      }, { status: 409 });
    }

    // Delete the admin
    await User.findByIdAndDelete(id);

    return NextResponse.json({ 
      message: 'Real estate admin deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting real estate admin:', error);
    return NextResponse.json(
      { error: 'Failed to delete real estate admin' }, 
      { status: 500 }
    );
  }
}
