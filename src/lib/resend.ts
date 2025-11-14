import { Resend } from 'resend';
import { 
  generateSellerCodeEmail, 
  generateBuyerCodeEmail, 
  generateWelcomeEmail, 
  generateMagicLinkEmail,
  generateCounterOfferEmail,
  generateOfferAcceptedEmail,
  generateOfferAcceptedSellerEmail,
  generateCounterOfferRejectedSellerEmail,
  generateReCounterOfferEmail
} from '@/emails/templates';

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
  from = process.env.EMAIL_FROM || 'noreply@rightoffer.co.uk'
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

// Send counter offer email to buyer (when seller/agent counters)
export async function sendCounterOfferEmailToBuyer(
  buyerName: string,
  buyerEmail: string,
  propertyAddress: string,
  originalOfferAmount: string,
  counterOfferAmount: string,
  counterOfferNotes: string | undefined,
  listingId: string
) {
  const emailContent = generateCounterOfferEmail({
    recipientName: buyerName,
    propertyAddress,
    originalOfferAmount,
    counterOfferAmount,
    counterOfferNotes,
    listingId
  });

  return await sendEmail({
    to: buyerEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text
  });
}

// Send offer accepted email to buyer (when buyer's offer/counter is accepted)
export async function sendOfferAcceptedEmailToBuyer(
  buyerName: string,
  buyerEmail: string,
  propertyAddress: string,
  offerAmount: string,
  listingId: string
) {
  const emailContent = generateOfferAcceptedEmail({
    recipientName: buyerName,
    propertyAddress,
    offerAmount,
    listingId
  });

  return await sendEmail({
    to: buyerEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text
  });
}

// Send offer accepted email to seller (when buyer accepts seller's counter)
export async function sendOfferAcceptedEmailToSeller(
  sellerName: string,
  sellerEmail: string,
  propertyAddress: string,
  offerAmount: string,
  buyerName: string,
  listingId: string
) {
  const emailContent = generateOfferAcceptedSellerEmail({
    recipientName: sellerName,
    propertyAddress,
    offerAmount,
    buyerName,
    listingId
  });

  return await sendEmail({
    to: sellerEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text
  });
}

// Send counter offer rejected email to seller (when buyer rejects seller's counter)
export async function sendCounterOfferRejectedEmailToSeller(
  sellerName: string,
  sellerEmail: string,
  propertyAddress: string,
  counterOfferAmount: string,
  buyerName: string,
  listingId: string
) {
  const emailContent = generateCounterOfferRejectedSellerEmail({
    recipientName: sellerName,
    propertyAddress,
    counterOfferAmount,
    buyerName,
    listingId
  });

  return await sendEmail({
    to: sellerEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text
  });
}

// Send re-counter offer email to seller (when buyer makes a counter to seller's counter)
export async function sendReCounterOfferEmailToSeller(
  sellerName: string,
  sellerEmail: string,
  propertyAddress: string,
  yourCounterOfferAmount: string,
  buyerCounterOfferAmount: string,
  buyerName: string,
  buyerNotes: string | undefined,
  listingId: string
) {
  const emailContent = generateReCounterOfferEmail({
    recipientName: sellerName,
    propertyAddress,
    yourCounterOfferAmount,
    buyerCounterOfferAmount,
    buyerName,
    buyerNotes,
    listingId
  });

  return await sendEmail({
    to: sellerEmail,
    subject: emailContent.subject,
    html: emailContent.html,
    text: emailContent.text
  });
}

export default resend;
