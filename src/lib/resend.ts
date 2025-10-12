import { Resend } from 'resend';
import { generateSellerCodeEmail, generateBuyerCodeEmail, generateWelcomeEmail, generateMagicLinkEmail } from '@/emails/templates';

if (!process.env.AUTH_RESEND_KEY) {
  throw new Error('AUTH_RESEND_KEY is not set in environment variables');
}

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export interface SendEmailParams {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = process.env.EMAIL_FROM || 'rightoffer@cromostudios.com'
}: SendEmailParams) {
  try {
    const emailOptions: Record<string, unknown> = {
      from,
      to,
      subject,
    };

    if (html !== undefined) {
      emailOptions.html = html;
    }
    if (text !== undefined) {
      emailOptions.text = text;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await resend.emails.send(emailOptions as any);

    console.log('Email sent successfully:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export async function sendSellerCodeEmail(
  sellerName: string,
  sellerEmail: string,
  sellerCode: string,
  propertyAddress: string,
  listingId: string
) {
  const emailContent = generateSellerCodeEmail({
    sellerName,
    sellerCode,
    propertyAddress,
    listingId
  });

  return await sendEmail({
    to: sellerEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text
  });
}

export async function sendBuyerCodeEmail(
  buyerName: string,
  buyerEmail: string,
  buyerCode: string,
  propertyAddress: string,
  listedPrice: string | number,
  listingId: string
) {
  // Format price for email display
  const formattedPrice = typeof listedPrice === 'number' 
    ? `£${listedPrice.toLocaleString('en-GB')}`
    : listedPrice;
    
  const emailContent = generateBuyerCodeEmail({
    buyerName,
    buyerCode,
    propertyAddress,
    listedPrice: formattedPrice,
    listingId
  });

  return await sendEmail({
    to: buyerEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text
  });
}

export async function sendWelcomeEmail(
  userName: string,
  userEmail: string,
  userRole: 'agent' | 'real_estate_admin' | 'admin',
  companyName?: string
) {
  const emailContent = generateWelcomeEmail({
    userName,
    userRole,
    companyName
  });

  return await sendEmail({
    to: userEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text
  });
}

export async function sendMagicLinkEmail(
  email: string,
  url: string,
  host: string
) {
  const emailContent = generateMagicLinkEmail({
    email,
    url,
    host
  });

  return await sendEmail({
    to: email,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text
  });
}

export default resend;
