import { createBaseTemplate, emailStyles } from '../components/BaseTemplate';

export interface ReCounterOfferEmailProps {
  recipientName: string;
  propertyAddress: string;
  yourCounterOfferAmount: string;
  buyerCounterOfferAmount: string;
  buyerName: string;
  buyerNotes?: string;
  listingId: string;
  baseUrl?: string;
}

export function generateReCounterOfferEmail({
  recipientName,
  propertyAddress,
  yourCounterOfferAmount,
  buyerCounterOfferAmount,
  buyerName,
  buyerNotes,
  listingId,
  baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
}: ReCounterOfferEmailProps) {
  const base = createBaseTemplate({
    title: 'Re-Counter Offer Received',
    preheader: `${buyerName} has made a counter offer of ${buyerCounterOfferAmount} for ${propertyAddress}`,
    headerGradient: `linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)`
  });

  const html = `
    ${base.doctype}
    ${base.htmlOpen}
    ${base.head}
    ${base.bodyOpen}
      ${base.header}
      
      <div style="${emailStyles.container}">
        <h2 style="color: #f59e0b; margin-top: 0;">Hello ${recipientName},</h2>
        <p>The buyer has responded to your counter offer with their own counter proposal.</p>
        
        <div style="display: flex; gap: 15px; margin: 20px 0;">
          <div style="${emailStyles.whiteBox} flex: 1;">
            <p style="${emailStyles.codeLabel}">Your Counter Offer</p>
            <div style="font-size: 24px; font-weight: bold; color: #6b7280; margin: 10px 0;">
              ${yourCounterOfferAmount}
            </div>
          </div>
          <div style="${emailStyles.whiteBox} flex: 1; border-color: #f59e0b;">
            <p style="${emailStyles.codeLabel}">Buyer's Counter</p>
            <div style="font-size: 24px; font-weight: bold; color: #f59e0b; margin: 10px 0;">
              ${buyerCounterOfferAmount}
            </div>
          </div>
        </div>
        
        <div style="${emailStyles.infoBox} border-left-color: #f59e0b;">
          <h3 style="margin-top: 0; color: #f59e0b;">Negotiation Details</h3>
          <p style="margin: 5px 0;"><strong>Property:</strong> ${propertyAddress}</p>
          <p style="margin: 5px 0;"><strong>Buyer:</strong> ${buyerName}</p>
          ${buyerNotes ? `<p style="margin: 5px 0;"><strong>Buyer's Message:</strong> ${buyerNotes}</p>` : ''}
        </div>
        
        <p>The buyer is still interested and wants to negotiate further. You can now review their counter offer and decide how to proceed.</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${baseUrl}/listing/${listingId}" 
             style="${emailStyles.button} background: #f59e0b;">
            Respond to Counter Offer
          </a>
        </div>
      </div>
      
      <div style="${emailStyles.importantInfo}">
        <h3 style="margin-top: 0; color: #475569;">Your options:</h3>
        <ul style="${emailStyles.list}">
          <li><strong>Accept:</strong> Agree to the buyer's counter offer amount and close the deal</li>
          <li><strong>Counter:</strong> Make another counter offer to continue negotiations</li>
          <li><strong>Decline:</strong> Reject this counter offer and end negotiations with this buyer</li>
        </ul>
        <p style="margin-top: 15px; font-size: 14px; color: #6b7280;">
          The buyer is actively negotiating, which is a positive sign! Take your time to review the offer and consider your options. Your estate agent can provide guidance.
        </p>
      </div>
      
      ${base.footer}
    ${base.bodyClose}
    ${base.htmlClose}
  `;

  const text = `
Hello ${recipientName},

The buyer has responded to your counter offer with their own counter proposal.

Negotiation Details:
- Property: ${propertyAddress}
- Your Counter Offer: ${yourCounterOfferAmount}
- Buyer's Counter Offer: ${buyerCounterOfferAmount}
- Buyer: ${buyerName}
${buyerNotes ? `- Buyer's Message: ${buyerNotes}` : ''}

The buyer is still interested and wants to negotiate further. You can now review their counter offer and decide how to proceed.

Respond to the counter offer at: ${baseUrl}/listing/${listingId}

Your options:
- Accept: Agree to the buyer's counter offer amount and close the deal
- Counter: Make another counter offer to continue negotiations
- Decline: Reject this counter offer and end negotiations with this buyer

The buyer is actively negotiating, which is a positive sign! Take your time to review the offer and consider your options. Your estate agent can provide guidance.

Best regards,
The RightOffer Team
  `;

  return {
    subject: `Re-Counter Offer Received - ${buyerCounterOfferAmount} for ${propertyAddress}`,
    html: html.trim(),
    text: text.trim()
  };
}


