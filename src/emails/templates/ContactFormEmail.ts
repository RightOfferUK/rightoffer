import { createBaseTemplate, emailStyles, colors } from '../components/BaseTemplate';

export interface ContactFormEmailParams {
  name: string;
  email: string;
  message: string;
}

export function generateContactFormEmail({
  name,
  email,
  message
}: ContactFormEmailParams) {
  const subject = `New Contact Form Submission from ${name}`;
  
  const base = createBaseTemplate({
    title: 'New Contact Form Message',
    preheader: `Contact form submission from ${name} (${email})`,
    headerGradient: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.secondaryDark} 100%)`
  });

  const html = `
    ${base.doctype}
    ${base.htmlOpen}
    ${base.head}
    ${base.bodyOpen}
      ${base.header}
      
      <div style="${emailStyles.container}">
        <h2 style="color: ${colors.secondary}; margin-top: 0;">📬 You've received a new contact form submission</h2>
        
        <div style="${emailStyles.infoBox}">
          <h3 style="margin-top: 0; color: ${colors.secondary};">Sender Details</h3>
          <p style="margin: 8px 0;"><strong style="color: ${colors.textSecondary};">Name:</strong> <span style="color: ${colors.textPrimary};">${name}</span></p>
          <p style="margin: 8px 0;"><strong style="color: ${colors.textSecondary};">Email:</strong> <a href="mailto:${email}" style="color: ${colors.secondary}; text-decoration: none;">${email}</a></p>
        </div>
        
        <div style="${emailStyles.whiteBox}; text-align: left; background: ${colors.grayLight};">
          <h3 style="margin-top: 0; color: ${colors.textSecondary}; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Message:</h3>
          <p style="color: ${colors.textPrimary}; line-height: 1.6; white-space: pre-wrap; margin: 12px 0 0 0;">
${message}
          </p>
        </div>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="mailto:${email}" 
             style="${emailStyles.button} background: ${colors.secondary};">
            Reply to ${name}
          </a>
        </div>
      </div>
      
      <div style="${emailStyles.importantInfo}">
        <p style="margin: 0; color: ${colors.textSecondary};">
          <strong>💡 Quick Tip:</strong> You can reply directly to ${email} to respond to their inquiry.
        </p>
      </div>
      
      ${base.footer}
    ${base.bodyClose}
    ${base.htmlClose}
  `;

  const text = `
New Contact Form Submission

From: ${name}
Email: ${email}

Message:
${message}

---
Reply to this email to respond to ${name}.

Best regards,
The RightOffer Team
  `;

  return {
    subject,
    html: html.trim(),
    text: text.trim()
  };
}

