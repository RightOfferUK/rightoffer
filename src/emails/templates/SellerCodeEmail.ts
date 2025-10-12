import { createBaseTemplate, emailStyles, colors } from '../components/BaseTemplate';

export interface SellerCodeEmailProps {
  sellerName: string;
  sellerCode: string;
  propertyAddress: string;
  listingId: string;
  baseUrl?: string;
}

export function generateSellerCodeEmail({
  sellerName,
  sellerCode,
  propertyAddress,
  listingId,
  baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
}: SellerCodeEmailProps) {
  const base = createBaseTemplate({
    title: 'Your Property Seller Code',
    preheader: `Your seller code is ${sellerCode}`,
    headerGradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`
  });

  const html = `
    ${base.doctype}
    ${base.htmlOpen}
    ${base.head}
    ${base.bodyOpen}
      ${base.header}
      
      <div style="${emailStyles.container}">
        <h2 style="color: ${colors.primary}; margin-top: 0; font-family: 'DM Sans', sans-serif; font-weight: 600;">Hello ${sellerName},</h2>
        <p style="font-family: 'DM Sans', sans-serif; color: ${colors.textPrimary};">Your property listing has been created successfully! You can now view all offers for your property in real-time.</p>
        
        <div style="${emailStyles.whiteBox}">
          <p style="${emailStyles.codeLabel}">Your Seller Code</p>
          <div style="font-family: 'DM Sans', monospace; font-size: 24px; font-weight: 700; color: ${colors.primary}; background: linear-gradient(135deg, ${colors.accent}20, ${colors.primary}10); padding: 15px; border-radius: 8px; letter-spacing: 2px; border: 2px solid ${colors.primary}20;">
            ${sellerCode}
          </div>
        </div>
        
        <div style="${emailStyles.infoBox}">
          <h3 style="margin-top: 0; color: ${colors.primary}; font-family: 'DM Sans', sans-serif; font-weight: 600;">Property Details</h3>
          <p style="margin: 5px 0; font-family: 'DM Sans', sans-serif; color: ${colors.textPrimary};"><strong>Property ID:</strong> ${listingId}</p>
          <p style="margin: 5px 0; font-family: 'DM Sans', sans-serif; color: ${colors.textPrimary};"><strong>Address:</strong> ${propertyAddress}</p>
        </div>
        
        <p style="font-family: 'DM Sans', sans-serif; color: ${colors.textPrimary};">Use this code to access your property listing and view all offers at:</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${baseUrl}/listing/${listingId}" 
             style="${emailStyles.button} background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);">
            View My Property
          </a>
        </div>
      </div>
      
      <div style="${emailStyles.importantInfo}">
        <h3 style="margin-top: 0; color: #475569;">Important Information:</h3>
        <ul style="${emailStyles.list}">
          <li>Keep this code secure - it gives access to your property listing</li>
          <li>All offers will appear in real-time on your listing page</li>
          <li>You can view offer details, buyer contact information, and more</li>
          <li>Contact your agent if you have any questions</li>
        </ul>
      </div>
      
      ${base.footer}
    ${base.bodyClose}
    ${base.htmlClose}
  `;

  const text = `
Hello ${sellerName},

Your property listing has been created successfully! You can now view all offers for your property in real-time.

Your Seller Code: ${sellerCode}

Property ID: ${listingId}
Property Address: ${propertyAddress}

Use this code to access your property listing at: ${baseUrl}/listing/${listingId}

Important Information:
- Keep this code secure - it gives access to your property listing
- All offers will appear in real-time on your listing page
- You can view offer details, buyer contact information, and more
- Contact your agent if you have any questions

Best regards,
The RightOffer Team
  `;

  return {
    subject: 'Your Property Seller Code - RightOffer',
    html: html.trim(),
    text: text.trim()
  };
}
