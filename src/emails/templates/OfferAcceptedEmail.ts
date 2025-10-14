import { createBaseTemplate, emailStyles } from '../components/BaseTemplate';

export interface OfferAcceptedEmailProps {
  recipientName: string;
  propertyAddress: string;
  offerAmount: string;
  listingId: string;
  baseUrl?: string;
}

export function generateOfferAcceptedEmail({
  recipientName,
  propertyAddress,
  offerAmount,
  listingId,
  baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
}: OfferAcceptedEmailProps) {
  const base = createBaseTemplate({
    title: 'Offer Accepted!',
    preheader: `Congratulations! Your offer of ${offerAmount} has been accepted for ${propertyAddress}`,
    headerGradient: `linear-gradient(135deg, #059669 0%, #10b981 100%)`
  });

  const html = `
    ${base.doctype}
    ${base.htmlOpen}
    ${base.head}
    ${base.bodyOpen}
      ${base.header}
      
      <div style="${emailStyles.container}">
        <h2 style="color: #059669; margin-top: 0;">Congratulations ${recipientName}!</h2>
        <p>Great news! Your offer has been accepted for the property.</p>
        
        <div style="${emailStyles.whiteBox}">
          <p style="${emailStyles.codeLabel}">Accepted Offer Amount</p>
          <div style="font-size: 32px; font-weight: bold; color: #059669; margin: 10px 0;">
            ${offerAmount}
          </div>
        </div>
        
        <div style="${emailStyles.infoBox} border-left-color: #059669;">
          <h3 style="margin-top: 0; color: #059669;">Property Details</h3>
          <p style="margin: 5px 0;"><strong>Address:</strong> ${propertyAddress}</p>
        </div>
        
        <p>Next steps will be coordinated by the estate agent. They will contact you shortly to proceed with the sale.</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${baseUrl}/listing/${listingId}" 
             style="${emailStyles.button} background: #059669;">
            View Property Details
          </a>
        </div>
      </div>
      
      <div style="${emailStyles.importantInfo}">
        <h3 style="margin-top: 0; color: #475569;">What happens next?</h3>
        <ul style="${emailStyles.list}">
          <li>The estate agent will contact you to arrange next steps</li>
          <li>Legal processes will begin (conveyancing, surveys, etc.)</li>
          <li>You'll work with your solicitor to complete the purchase</li>
          <li>Keep all communication channels open for updates</li>
        </ul>
      </div>
      
      ${base.footer}
    ${base.bodyClose}
    ${base.htmlClose}
  `;

  const text = `
Congratulations ${recipientName}!

Great news! Your offer has been accepted for the property.

Property Details:
- Address: ${propertyAddress}
- Accepted Offer Amount: ${offerAmount}

Next steps will be coordinated by the estate agent. They will contact you shortly to proceed with the sale.

View property details at: ${baseUrl}/listing/${listingId}

What happens next?
- The estate agent will contact you to arrange next steps
- Legal processes will begin (conveyancing, surveys, etc.)
- You'll work with your solicitor to complete the purchase
- Keep all communication channels open for updates

Best regards,
The RightOffer Team
  `;

  return {
    subject: `🎉 Offer Accepted - ${offerAmount} for ${propertyAddress}`,
    html: html.trim(),
    text: text.trim()
  };
}
