import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';
import { generateContactFormEmail } from '@/emails/templates/ContactFormEmail';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address format.' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long.' },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: 'Message is too long. Maximum 5000 characters allowed.' },
        { status: 400 }
      );
    }

    // Generate email content
    const emailContent = generateContactFormEmail({
      name,
      email,
      message
    });

    // Send email to admin
    const result = await sendEmail({
      to: 'admin@rightoffer.co.uk',
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      from: `RightOffer Contact Form <noreply@rightoffer.co.uk>`,
    });

    if (!result.success) {
      console.error('Failed to send contact form email:', result.error);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you soon.'
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

