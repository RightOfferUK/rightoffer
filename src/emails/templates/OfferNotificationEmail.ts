import { createBaseTemplate, emailStyles } from '../components/BaseTemplate';

export interface OfferNotificationEmailProps {
  recipientName: string;
  propertyAddress: string;
  offerAmount: string;
  buyerName: string;
  fundingType: string;
  listingId: string;
  baseUrl?: string;
}

export function generateOfferNotificationEmail({
  recipientName,
  propertyAddress,
  offerAmount,
  buyerName,
  fundingType,
  listingId,
  baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
}: OfferNotificationEmailProps) {
  const base = createBaseTemplate({
    title: 'New Offer Received',
    preheader: `New offer of ${offerAmount} received for ${propertyAddress}`,
    headerGradient: `linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)`
  });

  const html = `
    ${base.doctype}
    ${base.htmlOpen}
    ${base.head}
    ${base.bodyOpen}
      ${base.header}
      
      <div style="${emailStyles.container}">
        <h2 style="color: #7c3aed; margin-top: 0;">Hello ${recipientName},</h2>
        <p>Great news! A new offer has been submitted for your property.</p>
        
        <div style="${emailStyles.whiteBox}">
          <p style="${emailStyles.codeLabel}">Offer Amount</p>
          <div style="font-size: 32px; font-weight: bold; color: #059669; margin: 10px 0;">
            ${offerAmount}
          </div>
        </div>
        
        <div style="${emailStyles.infoBox} border-left-color: #7c3aed;">
          <h3 style="margin-top: 0; color: #7c3aed;">Offer Details</h3>
          <p style="margin: 5px 0;"><strong>Property:</strong> ${propertyAddress}</p>
          <p style="margin: 5px 0;"><strong>Buyer:</strong> ${buyerName}</p>
          <p style="margin: 5px 0;"><strong>Funding Type:</strong> ${fundingType}</p>
        </div>
        
        <p>View the full offer details and manage your listing:</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${baseUrl}/listing/${listingId}" 
             style="${emailStyles.button} background: #7c3aed;">
            View Offer Details
          </a>
        </div>
      </div>
      
      <div style="${emailStyles.importantInfo}">
        <h3 style="margin-top: 0; color: #475569;">Next Steps:</h3>
        <ul style="${emailStyles.list}">
          <li>Review the full offer details on your listing page</li>
          <li>Check buyer information and funding details</li>
          <li>Discuss with your agent about the offer</li>
          <li>You can accept, decline, or counter the offer</li>
        </ul>
      </div>
      
      ${base.footer}
    ${base.bodyClose}
    ${base.htmlClose}
  `;

  const text = `
Hello ${recipientName},

Great news! A new offer has been submitted for your property.

Offer Details:
- Property: ${propertyAddress}
- Offer Amount: ${offerAmount}
- Buyer: ${buyerName}
- Funding Type: ${fundingType}

View the full offer details at: ${baseUrl}/listing/${listingId}

Next Steps:
- Review the full offer details on your listing page
- Check buyer information and funding details
- Discuss with your agent about the offer
- You can accept, decline, or counter the offer

Best regards,
The RightOffer Team
  `;

  return {
    subject: `New Offer Received - ${offerAmount} for ${propertyAddress}`,
    html: html.trim(),
    text: text.trim()
  };
}
