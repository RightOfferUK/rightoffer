import { createBaseTemplate, emailStyles } from '../components/BaseTemplate';

export interface CounterOfferRejectedSellerEmailProps {
  recipientName: string;
  propertyAddress: string;
  counterOfferAmount: string;
  buyerName: string;
  listingId: string;
  baseUrl?: string;
}

export function generateCounterOfferRejectedSellerEmail({
  recipientName,
  propertyAddress,
  counterOfferAmount,
  buyerName,
  listingId,
  baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
}: CounterOfferRejectedSellerEmailProps) {
  const base = createBaseTemplate({
    title: 'Counter Offer Rejected',
    preheader: `${buyerName} has rejected your counter offer of ${counterOfferAmount} for ${propertyAddress}`,
    headerGradient: `linear-gradient(135deg, #dc2626 0%, #ef4444 100%)`
  });

  const html = `
    ${base.doctype}
    ${base.htmlOpen}
    ${base.head}
    ${base.bodyOpen}
      ${base.header}
      
      <div style="${emailStyles.container}">
        <h2 style="color: #dc2626; margin-top: 0;">Hello ${recipientName},</h2>
        <p>The buyer has rejected your counter offer for the property.</p>
        
        <div style="${emailStyles.whiteBox}">
          <p style="${emailStyles.codeLabel}">Rejected Counter Offer</p>
          <div style="font-size: 28px; font-weight: bold; color: #dc2626; margin: 10px 0;">
            ${counterOfferAmount}
          </div>
        </div>
        
        <div style="${emailStyles.infoBox} border-left-color: #dc2626;">
          <h3 style="margin-top: 0; color: #dc2626;">Negotiation Details</h3>
          <p style="margin: 5px 0;"><strong>Property:</strong> ${propertyAddress}</p>
          <p style="margin: 5px 0;"><strong>Buyer:</strong> ${buyerName}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> Negotiations Ended</p>
        </div>
        
        <p>The buyer has declined to continue negotiations at this price. You may wish to consider making another counter offer or waiting for other buyers.</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${baseUrl}/listing/${listingId}" 
             style="${emailStyles.button} background: #dc2626;">
            View Property & Offers
          </a>
        </div>
      </div>
      
      <div style="${emailStyles.importantInfo}">
        <h3 style="margin-top: 0; color: #475569;">Your options:</h3>
        <ul style="${emailStyles.list}">
          <li><strong>Make another counter offer</strong> with a different amount if you want to continue negotiations</li>
          <li><strong>Wait for other buyers</strong> - your property is still live and accepting new offers</li>
          <li><strong>Review other offers</strong> - check if there are any other buyers interested</li>
          <li><strong>Contact your agent</strong> for advice on the best next steps</li>
        </ul>
        <p style="margin-top: 15px; font-size: 14px; color: #6b7280;">
          Don't be discouraged - negotiations are a normal part of property sales. Your agent can help you strategize the best approach.
        </p>
      </div>
      
      ${base.footer}
    ${base.bodyClose}
    ${base.htmlClose}
  `;

  const text = `
Hello ${recipientName},

The buyer has rejected your counter offer for the property.

Negotiation Details:
- Property: ${propertyAddress}
- Rejected Counter Offer: ${counterOfferAmount}
- Buyer: ${buyerName}
- Status: Negotiations Ended

The buyer has declined to continue negotiations at this price. You may wish to consider making another counter offer or waiting for other buyers.

View property & offers at: ${baseUrl}/listing/${listingId}

Your options:
- Make another counter offer with a different amount if you want to continue negotiations
- Wait for other buyers - your property is still live and accepting new offers
- Review other offers - check if there are any other buyers interested
- Contact your agent for advice on the best next steps

Don't be discouraged - negotiations are a normal part of property sales. Your agent can help you strategize the best approach.

Best regards,
The RightOffer Team
  `;

  return {
    subject: `Counter Offer Rejected - ${propertyAddress}`,
    html: html.trim(),
    text: text.trim()
  };
}

