import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cachedMongooseConnection } from '@/lib/db';
import User from '@/models/User';
import { sendWelcomeEmail } from '@/lib/resend';

export async function GET() {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    // Get all real estate admins with their agent counts
    const admins = await User.aggregate([
      { $match: { role: 'real_estate_admin' } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'realEstateAdminId',
          as: 'agents'
        }
      },
      {
        $addFields: {
          agentCount: { $size: '$agents' }
        }
      },
      {
        $project: {
          email: 1,
          name: 1,
          companyName: 1,
          maxListings: 1,
          usedListings: 1,
          createdAt: 1,
          agentCount: 1
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    return NextResponse.json({ admins });

  } catch (error) {
    console.error('Error fetching real estate admins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch real estate admins' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to MongoDB
    await cachedMongooseConnection;

    // Parse request body
    const body = await request.json();
    const { email, name, companyName, maxListings } = body;

    // Validate required fields
    if (!email || !companyName || !maxListings) {
      return NextResponse.json(
        { error: 'Missing required fields: email, companyName, maxListings' }, 
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

    // Create new real estate admin
    const newAdmin = new User({
      email,
      name,
      role: 'real_estate_admin',
      companyName,
      maxListings: parseInt(maxListings),
      usedListings: 0,
      createdBy: session.user.id,
    });

    await newAdmin.save();

    // Send welcome email to the new real estate admin
    try {
      await sendWelcomeEmail(
        newAdmin.name || newAdmin.email,
        newAdmin.email,
        'real_estate_admin',
        newAdmin.companyName
      );
      console.log('Welcome email sent successfully to:', newAdmin.email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the admin creation if email fails
    }

    return NextResponse.json({ 
      message: 'Real estate admin created successfully. Welcome email has been sent.',
      admin: {
        _id: newAdmin._id,
        email: newAdmin.email,
        name: newAdmin.name,
        companyName: newAdmin.companyName,
        maxListings: newAdmin.maxListings,
        usedListings: newAdmin.usedListings,
        createdAt: newAdmin.createdAt,
      }
    });

  } catch (error) {
    console.error('Error creating real estate admin:', error);
    return NextResponse.json(
      { error: 'Failed to create real estate admin' }, 
      { status: 500 }
    );
  }
}

