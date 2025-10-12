import { createBaseTemplate, emailStyles, colors } from '../components/BaseTemplate';

export interface BuyerCodeEmailProps {
  buyerName: string;
  buyerCode: string;
  propertyAddress: string;
  listedPrice: string;
  listingId: string;
  baseUrl?: string;
}

export function generateBuyerCodeEmail({
  buyerName,
  buyerCode,
  propertyAddress,
  listedPrice,
  listingId,
  baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
}: BuyerCodeEmailProps) {
  const base = createBaseTemplate({
    title: 'Your Buyer Access Code',
    preheader: `Your buyer code is ${buyerCode}`,
    headerGradient: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryDark} 100%)`
  });

  const html = `
    ${base.doctype}
    ${base.htmlOpen}
    ${base.head}
    ${base.bodyOpen}
      ${base.header}
      
      <div style="${emailStyles.container}">
        <h2 style="color: ${colors.secondary}; margin-top: 0; font-family: 'DM Sans', sans-serif; font-weight: 600;">Hello ${buyerName},</h2>
        <p style="font-family: 'DM Sans', sans-serif; color: ${colors.textPrimary};">You have been granted access to make an offer on a property. Use the code below to access the property listing and submit your offer.</p>
        
        <div style="${emailStyles.whiteBox}">
          <p style="${emailStyles.codeLabel}">Your Buyer Code</p>
          <div style="font-family: 'DM Sans', monospace; font-size: 24px; font-weight: 700; color: ${colors.secondary}; background: linear-gradient(135deg, ${colors.secondary}20, ${colors.secondaryDark}10); padding: 15px; border-radius: 8px; letter-spacing: 2px; border: 2px solid ${colors.secondary}20;">
            ${buyerCode}
          </div>
        </div>
        
        <div style="background: white; border-left: 4px solid ${colors.secondary}; padding: 15px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
          <h3 style="margin-top: 0; color: ${colors.secondary}; font-family: 'DM Sans', sans-serif; font-weight: 600;">Property Details</h3>
          <p style="margin: 5px 0; font-family: 'DM Sans', sans-serif; color: ${colors.textPrimary};"><strong>Property ID:</strong> ${listingId}</p>
          <p style="margin: 5px 0; font-family: 'DM Sans', sans-serif; color: ${colors.textPrimary};"><strong>Address:</strong> ${propertyAddress}</p>
          <p style="margin: 5px 0; font-family: 'DM Sans', sans-serif; color: ${colors.textPrimary};"><strong>Listed Price:</strong> ${listedPrice}</p>
        </div>
        
        <p style="font-family: 'DM Sans', sans-serif; color: ${colors.textPrimary};">Use this code to access the property and make your offer at:</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${baseUrl}/listing/${listingId}" 
             style="${emailStyles.button} background: linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryDark} 100%);">
            Make An Offer
          </a>
        </div>
      </div>
      
      <div style="${emailStyles.importantInfo}">
        <h3 style="margin-top: 0; color: #475569;">Important Information:</h3>
        <ul style="${emailStyles.list}">
          <li>This code expires in 30 days from the date of issue</li>
          <li>You can submit multiple offers if needed</li>
          <li>All offers are visible to the seller in real-time</li>
          <li>Make sure to include all relevant details in your offer</li>
        </ul>
      </div>
      
      ${base.footer}
    ${base.bodyClose}
    ${base.htmlClose}
  `;

  const text = `
Hello ${buyerName},

You have been granted access to make an offer on a property.

Your Buyer Code: ${buyerCode}

Property Details:
- Property ID: ${listingId}
- Address: ${propertyAddress}
- Listed Price: ${listedPrice}

Use this code to access the property and make your offer at: ${baseUrl}/listing/${listingId}

Important Information:
- This code expires in 30 days from the date of issue
- You can submit multiple offers if needed
- All offers are visible to the seller in real-time
- Make sure to include all relevant details in your offer

Best regards,
The RightOffer Team
  `;

  return {
    subject: 'Your Buyer Access Code - RightOffer',
    html: html.trim(),
    text: text.trim()
  };
}
