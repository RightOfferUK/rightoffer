import { createBaseTemplate, emailStyles } from '../components/BaseTemplate';

export interface CounterOfferEmailProps {
  recipientName: string;
  propertyAddress: string;
  originalOfferAmount: string;
  counterOfferAmount: string;
  counterOfferNotes?: string;
  listingId: string;
  baseUrl?: string;
}

export function generateCounterOfferEmail({
  recipientName,
  propertyAddress,
  originalOfferAmount,
  counterOfferAmount,
  counterOfferNotes,
  listingId,
  baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
}: CounterOfferEmailProps) {
  const base = createBaseTemplate({
    title: 'Counter Offer Received',
    preheader: `Counter offer of ${counterOfferAmount} received for ${propertyAddress}`,
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
        <p>The seller has made a counter offer to your original offer. Here are the details:</p>
        
        <div style="display: flex; gap: 15px; margin: 20px 0;">
          <div style="${emailStyles.whiteBox} flex: 1;">
            <p style="${emailStyles.codeLabel}">Your Original Offer</p>
            <div style="font-size: 24px; font-weight: bold; color: #6b7280; margin: 10px 0;">
              ${originalOfferAmount}
            </div>
          </div>
          <div style="${emailStyles.whiteBox} flex: 1; border-color: #7c3aed;">
            <p style="${emailStyles.codeLabel}">Counter Offer</p>
            <div style="font-size: 24px; font-weight: bold; color: #7c3aed; margin: 10px 0;">
              ${counterOfferAmount}
            </div>
          </div>
        </div>
        
        <div style="${emailStyles.infoBox} border-left-color: #7c3aed;">
          <h3 style="margin-top: 0; color: #7c3aed;">Property Details</h3>
          <p style="margin: 5px 0;"><strong>Address:</strong> ${propertyAddress}</p>
          ${counterOfferNotes ? `<p style="margin: 5px 0;"><strong>Seller's Notes:</strong> ${counterOfferNotes}</p>` : ''}
        </div>
        
        <p>You can now accept this counter offer, make your own counter offer, or decline it.</p>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${baseUrl}/listing/${listingId}" 
             style="${emailStyles.button} background: #7c3aed;">
            Respond to Counter Offer
          </a>
        </div>
      </div>
      
      <div style="${emailStyles.importantInfo}">
        <h3 style="margin-top: 0; color: #475569;">Your options:</h3>
        <ul style="${emailStyles.list}">
          <li><strong>Accept:</strong> Agree to the counter offer amount</li>
          <li><strong>Counter:</strong> Make your own counter offer with a different amount</li>
          <li><strong>Decline:</strong> Reject the counter offer and end negotiations</li>
        </ul>
        <p style="margin-top: 15px; font-size: 14px; color: #6b7280;">
          You have time to consider your response. The estate agent will be in touch if you have any questions.
        </p>
      </div>
      
      ${base.footer}
    ${base.bodyClose}
    ${base.htmlClose}
  `;

  const text = `
Hello ${recipientName},

The seller has made a counter offer to your original offer. Here are the details:

Property Details:
- Address: ${propertyAddress}
- Your Original Offer: ${originalOfferAmount}
- Counter Offer Amount: ${counterOfferAmount}
${counterOfferNotes ? `- Seller's Notes: ${counterOfferNotes}` : ''}

You can now accept this counter offer, make your own counter offer, or decline it.

Respond to the counter offer at: ${baseUrl}/listing/${listingId}

Your options:
- Accept: Agree to the counter offer amount
- Counter: Make your own counter offer with a different amount
- Decline: Reject the counter offer and end negotiations

You have time to consider your response. The estate agent will be in touch if you have any questions.

Best regards,
The RightOffer Team
  `;

  return {
    subject: `Counter Offer Received - ${counterOfferAmount} for ${propertyAddress}`,
    html: html.trim(),
    text: text.trim()
  };
}
