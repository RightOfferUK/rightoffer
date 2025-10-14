import { createBaseTemplate, emailStyles } from '../components/BaseTemplate';

export interface OfferRejectedEmailProps {
  recipientName: string;
  propertyAddress: string;
  offerAmount: string;
  listingId: string;
  baseUrl?: string;
}

export function generateOfferRejectedEmail({
  recipientName,
  propertyAddress,
  offerAmount,
  listingId,
  baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
}: OfferRejectedEmailProps) {
  const base = createBaseTemplate({
    title: 'Offer Update',
    preheader: `Your offer of ${offerAmount} for ${propertyAddress} was not accepted`,
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
        <p>We wanted to let you know that your offer for this property was not accepted.</p>
        
        <div style="${emailStyles.whiteBox}">
          <p style="${emailStyles.codeLabel}">Your Offer Amount</p>
          <div style="font-size: 28px; font-weight: bold; color: #dc2626; margin: 10px 0;">
            ${offerAmount}
          </div>
        </div>
        
        <div style="${emailStyles.infoBox} border-left-color: #dc2626;">
          <h3 style="margin-top: 0; color: #dc2626;">Property Details</h3>
          <p style="margin: 5px 0;"><strong>Address:</strong> ${propertyAddress}</p>
        </div>
        
        <p>Don't worry - this is a normal part of the property buying process. You can make a new offer if you'd like to try again.</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${baseUrl}/listing/${listingId}" 
             style="${emailStyles.button} background: #dc2626;">
            Make New Offer
          </a>
        </div>
      </div>
      
      <div style="${emailStyles.importantInfo}">
        <h3 style="margin-top: 0; color: #475569;">What you can do next:</h3>
        <ul style="${emailStyles.list}">
          <li>Make a new offer with a different amount</li>
          <li>Consider adjusting your offer terms (funding type, timeline, etc.)</li>
          <li>Look at other properties that might be a better fit</li>
          <li>Contact the estate agent directly to discuss the property</li>
        </ul>
      </div>
      
      ${base.footer}
    ${base.bodyClose}
    ${base.htmlClose}
  `;

  const text = `
Hello ${recipientName},

We wanted to let you know that your offer for this property was not accepted.

Property Details:
- Address: ${propertyAddress}
- Your Offer Amount: ${offerAmount}

Don't worry - this is a normal part of the property buying process. You can make a new offer if you'd like to try again.

Make a new offer at: ${baseUrl}/listing/${listingId}

What you can do next:
- Make a new offer with a different amount
- Consider adjusting your offer terms (funding type, timeline, etc.)
- Look at other properties that might be a better fit
- Contact the estate agent directly to discuss the property

Best regards,
The RightOffer Team
  `;

  return {
    subject: `Offer Update - ${propertyAddress}`,
    html: html.trim(),
    text: text.trim()
  };
}
