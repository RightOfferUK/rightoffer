import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import BuyerCode from '@/models/BuyerCode';
import mongoose from 'mongoose';
import Listing from '@/models/Listing';

// PATCH - Update buyer code (name)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ codeId: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    const { codeId } = await params;

    // Get the buyer code
    const buyerCode = await BuyerCode.findById(codeId);
    if (!buyerCode) {
      return NextResponse.json({ error: 'Buyer code not found' }, { status: 404 });
    }

    // Check if the current user is the agent who owns this buyer code
    if (buyerCode.agentId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only edit your own buyer codes' }, { status: 403 });
    }

    // Parse the request body
    const body = await request.json();
    const { buyerName } = body;

    // Validate required fields
    if (!buyerName || !buyerName.trim()) {
      return NextResponse.json({ 
        error: 'Buyer name is required' 
      }, { status: 400 });
    }

    // Update the buyer code
    buyerCode.buyerName = buyerName.trim();
    buyerCode.updatedAt = new Date();
    await buyerCode.save();

    return NextResponse.json({ 
      message: 'Buyer name updated successfully',
      buyerCode: {
        _id: buyerCode._id.toString(),
        code: buyerCode.code,
        buyerName: buyerCode.buyerName,
        buyerEmail: buyerCode.buyerEmail,
        updatedAt: buyerCode.updatedAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Error updating buyer code:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// DELETE - Deactivate buyer code
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ codeId: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    const { codeId } = await params;

    // Get the buyer code
    const buyerCode = await BuyerCode.findById(codeId);
    if (!buyerCode) {
      return NextResponse.json({ error: 'Buyer code not found' }, { status: 404 });
    }

    // Check if the current user is the agent who owns this buyer code
    if (buyerCode.agentId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: You can only deactivate your own buyer codes' }, { status: 403 });
    }

    // Deactivate the buyer code (don't delete, just mark as inactive)
    buyerCode.isActive = false;
    buyerCode.updatedAt = new Date();
    await buyerCode.save();

    return NextResponse.json({ 
      message: 'Buyer code deactivated successfully'
    });

  } catch (error) {
    console.error('Error deactivating buyer code:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
