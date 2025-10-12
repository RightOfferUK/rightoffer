import { Resend } from 'resend';

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
  const subject = 'Your Property Seller Code - RightOffer';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Seller Code</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px;">RightOffer</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Property Seller Code</p>
        </div>
        
        <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
          <h2 style="color: #1e3a8a; margin-top: 0;">Hello ${sellerName},</h2>
          <p>Your property listing has been created successfully! You can now view all offers for your property in real-time.</p>
          
          <div style="background: white; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Seller Code</p>
            <div style="font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #f59e0b; background: #fef3c7; padding: 15px; border-radius: 6px; letter-spacing: 2px;">
              ${sellerCode}
            </div>
          </div>
          
          <div style="background: white; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e3a8a;">Property Details</h3>
            <p style="margin: 5px 0;"><strong>Address:</strong> ${propertyAddress}</p>
          </div>
          
          <p>Use this code to access your property listing and view all offers at:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/listing/${listingId}" 
               style="display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              View My Property
            </a>
          </div>
        </div>
        
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; font-size: 14px; color: #64748b;">
          <h3 style="margin-top: 0; color: #475569;">Important Information:</h3>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Keep this code secure - it gives access to your property listing</li>
            <li>All offers will appear in real-time on your listing page</li>
            <li>You can view offer details, buyer contact information, and more</li>
            <li>Contact your agent if you have any questions</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
          <p>Best regards,<br>The RightOffer Team</p>
          <p style="margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
    </html>
  `;

  const text = `
Hello ${sellerName},

Your property listing has been created successfully! You can now view all offers for your property in real-time.

Your Seller Code: ${sellerCode}

Property Address: ${propertyAddress}

Use this code to access your property listing at: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/listing/${listingId}

Important Information:
- Keep this code secure - it gives access to your property listing
- All offers will appear in real-time on your listing page
- You can view offer details, buyer contact information, and more
- Contact your agent if you have any questions

Best regards,
The RightOffer Team
  `;

  return await sendEmail({
    to: sellerEmail,
    subject,
    html,
    text
  });
}

export async function sendBuyerCodeEmail(
  buyerName: string,
  buyerEmail: string,
  buyerCode: string,
  propertyAddress: string,
  listedPrice: string,
  listingId: string
) {
  const subject = 'Your Buyer Access Code - RightOffer';
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Buyer Code</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 28px;">RightOffer</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Buyer Access Code</p>
        </div>
        
        <div style="background: #f0fdf4; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
          <h2 style="color: #059669; margin-top: 0;">Hello ${buyerName},</h2>
          <p>You have been granted access to make an offer on a property. Use the code below to access the property listing and submit your offer.</p>
          
          <div style="background: white; border: 2px solid #d1fae5; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Buyer Code</p>
            <div style="font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #059669; background: #dcfce7; padding: 15px; border-radius: 6px; letter-spacing: 2px;">
              ${buyerCode}
            </div>
          </div>
          
          <div style="background: white; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #059669;">Property Details</h3>
            <p style="margin: 5px 0;"><strong>Address:</strong> ${propertyAddress}</p>
            <p style="margin: 5px 0;"><strong>Listed Price:</strong> ${listedPrice}</p>
          </div>
          
          <p>Use this code to access the property and make your offer at:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/listing/${listingId}" 
               style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Make An Offer
            </a>
          </div>
        </div>
        
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; font-size: 14px; color: #64748b;">
          <h3 style="margin-top: 0; color: #475569;">Important Information:</h3>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>This code expires in 30 days from the date of issue</li>
            <li>You can submit multiple offers if needed</li>
            <li>All offers are visible to the seller in real-time</li>
            <li>Make sure to include all relevant details in your offer</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
          <p>Best regards,<br>The RightOffer Team</p>
          <p style="margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
    </html>
  `;

  const text = `
Hello ${buyerName},

You have been granted access to make an offer on a property.

Your Buyer Code: ${buyerCode}

Property Details:
- Address: ${propertyAddress}
- Listed Price: ${listedPrice}

Use this code to access the property and make your offer at: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/listing/${listingId}

Important Information:
- This code expires in 30 days from the date of issue
- You can submit multiple offers if needed
- All offers are visible to the seller in real-time
- Make sure to include all relevant details in your offer

Best regards,
The RightOffer Team
  `;

  return await sendEmail({
    to: buyerEmail,
    subject,
    html,
    text
  });
}

export default resend;
