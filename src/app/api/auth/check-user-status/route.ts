import { NextRequest, NextResponse } from 'next/server';
import { cachedMongooseConnection } from '@/lib/db';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await cachedMongooseConnection;

    // Parse request body
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' }, 
        { status: 400 }
      );
    }

    // Check if user exists in our User model
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json({
        status: 'not_found',
        message: 'No account found with this email address. Please contact your administrator.'
      });
    }

    // Only check isActive for agents
    if (user.role === 'agent' && !user.isActive) {
      return NextResponse.json({
        status: 'inactive',
        message: 'Your account is inactive. Please get in touch with your admin to activate your account again.',
        role: user.role
      });
    }

    return NextResponse.json({
      status: 'active',
      message: 'Account is active',
      role: user.role
    });

  } catch (error) {
    console.error('Error checking user status:', error);
    return NextResponse.json(
      { error: 'Failed to check user status' }, 
      { status: 500 }
    );
  }
}
