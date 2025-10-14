import { createBaseTemplate, emailStyles } from '../components/BaseTemplate';

export interface OfferAcceptedSellerEmailProps {
  recipientName: string;
  propertyAddress: string;
  offerAmount: string;
  buyerName: string;
  listingId: string;
  baseUrl?: string;
}

export function generateOfferAcceptedSellerEmail({
  recipientName,
  propertyAddress,
  offerAmount,
  buyerName,
  listingId,
  baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
}: OfferAcceptedSellerEmailProps) {
  const base = createBaseTemplate({
    title: 'Offer Accepted by Buyer',
    preheader: `The buyer has accepted your counter offer of ${offerAmount} for ${propertyAddress}`,
    headerGradient: `linear-gradient(135deg, #059669 0%, #10b981 100%)`
  });

  const html = `
    ${base.doctype}
    ${base.htmlOpen}
    ${base.head}
    ${base.bodyOpen}
      ${base.header}
      
      <div style="${emailStyles.container}">
        <h2 style="color: #059669; margin-top: 0;">Great news ${recipientName}!</h2>
        <p>The buyer has accepted your counter offer. The property is now under contract!</p>
        
        <div style="${emailStyles.whiteBox}">
          <p style="${emailStyles.codeLabel}">Accepted Offer Amount</p>
          <div style="font-size: 32px; font-weight: bold; color: #059669; margin: 10px 0;">
            ${offerAmount}
          </div>
        </div>
        
        <div style="${emailStyles.infoBox} border-left-color: #059669;">
          <h3 style="margin-top: 0; color: #059669;">Sale Details</h3>
          <p style="margin: 5px 0;"><strong>Property:</strong> ${propertyAddress}</p>
          <p style="margin: 5px 0;"><strong>Buyer:</strong> ${buyerName}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> Under Contract</p>
        </div>
        
        <p>Your estate agent will now coordinate the next steps with the buyer and their solicitor.</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${baseUrl}/listing/${listingId}" 
             style="${emailStyles.button} background: #059669;">
            View Sale Details
          </a>
        </div>
      </div>
      
      <div style="${emailStyles.importantInfo}">
        <h3 style="margin-top: 0; color: #475569;">What happens next?</h3>
        <ul style="${emailStyles.list}">
          <li>Your estate agent will contact you to arrange next steps</li>
          <li>Legal processes will begin (conveyancing, surveys, etc.)</li>
          <li>You'll work with your solicitor to complete the sale</li>
          <li>Keep all communication channels open for updates</li>
        </ul>
        <p style="margin-top: 15px; font-size: 14px; color: #6b7280;">
          The property listing has been marked as "Sold" and is no longer accepting new offers.
        </p>
      </div>
      
      ${base.footer}
    ${base.bodyClose}
    ${base.htmlClose}
  `;

  const text = `
Great news ${recipientName}!

The buyer has accepted your counter offer. The property is now under contract!

Sale Details:
- Property: ${propertyAddress}
- Accepted Offer Amount: ${offerAmount}
- Buyer: ${buyerName}
- Status: Under Contract

Your estate agent will now coordinate the next steps with the buyer and their solicitor.

View sale details at: ${baseUrl}/listing/${listingId}

What happens next?
- Your estate agent will contact you to arrange next steps
- Legal processes will begin (conveyancing, surveys, etc.)
- You'll work with your solicitor to complete the sale
- Keep all communication channels open for updates

The property listing has been marked as "Sold" and is no longer accepting new offers.

Best regards,
The RightOffer Team
  `;

  return {
    subject: `🎉 Offer Accepted - ${offerAmount} for ${propertyAddress}`,
    html: html.trim(),
    text: text.trim()
  };
}
