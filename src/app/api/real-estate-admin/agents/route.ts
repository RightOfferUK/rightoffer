import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';
import { sendWelcomeEmail } from '@/lib/resend';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and real estate admin role
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'real_estate_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build match criteria
    const matchCriteria: {
      realEstateAdminId: mongoose.Types.ObjectId;
      role: string;
      isActive?: boolean;
      $or?: Array<{ email?: RegExp; name?: RegExp }>;
    } = {
      realEstateAdminId: new mongoose.Types.ObjectId(session.user.id),
      role: 'agent'
    };

    // Add status filter
    if (status === 'active') {
      matchCriteria.isActive = true;
    } else if (status === 'inactive') {
      matchCriteria.isActive = false;
    }

    // Add search filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      matchCriteria.$or = [
        { email: searchRegex },
        { name: searchRegex }
      ];
    }

    // Get all agents under this real estate admin with their listing counts
    const agents = await User.aggregate([
      { $match: matchCriteria },
      {
        $lookup: {
          from: 'listings',
          localField: '_id',
          foreignField: 'agentId',
          as: 'listings'
        }
      },
      {
        $addFields: {
          listingCount: { $size: '$listings' }
        }
      },
      {
        $project: {
          email: 1,
          name: 1,
          isActive: 1,
          createdAt: 1,
          listingCount: 1,
          usedListings: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return NextResponse.json({ agents });

  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and real estate admin role
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'real_estate_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    // Parse request body
    const body = await request.json();
    const { email, name } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' }, 
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' }, 
        { status: 409 }
      );
    }

    // Create new agent
    const newAgent = new User({
      email,
      name,
      role: 'agent',
      realEstateAdminId: new mongoose.Types.ObjectId(session.user.id),
      isActive: true,
      createdBy: new mongoose.Types.ObjectId(session.user.id),
    });

    await newAgent.save();

    // Get the real estate admin's company name for the welcome email
    const realEstateAdmin = await User.findById(session.user.id);
    const companyName = realEstateAdmin?.companyName;

    // Send welcome email to the new agent
    try {
      await sendWelcomeEmail(
        newAgent.name || newAgent.email,
        newAgent.email,
        'agent',
        companyName
      );
      console.log('Welcome email sent successfully to:', newAgent.email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the agent creation if email fails
    }

    return NextResponse.json({ 
      message: 'Agent created successfully. Welcome email has been sent.',
      agent: {
        _id: newAgent._id,
        email: newAgent.email,
        name: newAgent.name,
        isActive: newAgent.isActive,
        createdAt: newAgent.createdAt,
      }
    });

  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' }, 
      { status: 500 }
    );
  }
}

