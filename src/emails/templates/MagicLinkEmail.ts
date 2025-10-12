import { createBaseTemplate, emailStyles, colors } from '../components/BaseTemplate';

export interface MagicLinkEmailProps {
  url: string;
  host: string;
  email: string;
  baseUrl?: string;
}

export function generateMagicLinkEmail({
  url,
  host,
  email,
}: MagicLinkEmailProps) {
  const base = createBaseTemplate({
    title: 'Sign in to RightOffer',
    preheader: 'Click the link below to sign in to your account',
    headerGradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`
  });

  const html = `
    ${base.doctype}
    ${base.htmlOpen}
    ${base.head}
    ${base.bodyOpen}
      ${base.header}
      
      <div style="${emailStyles.container}">
        <h2 style="color: ${colors.primary}; margin-top: 0; font-family: 'DM Sans', sans-serif; font-weight: 600;">Sign in to RightOffer</h2>
        <p style="font-family: 'DM Sans', sans-serif; color: ${colors.textPrimary};">Click the button below to sign in to your RightOffer account. This link will expire in 24 hours for security.</p>
        
        <div style="${emailStyles.whiteBox}">
          <p style="${emailStyles.codeLabel}">Signing in as</p>
          <div style="font-family: 'DM Sans', sans-serif; font-size: 18px; font-weight: 600; color: ${colors.primary}; background: linear-gradient(135deg, ${colors.primary}10, ${colors.primaryDark}05); padding: 12px; border-radius: 8px; border: 1px solid ${colors.primary}20;">
            ${email}
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" 
             style="${emailStyles.button} background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%); font-size: 16px; padding: 16px 32px;">
            Sign In to RightOffer
          </a>
        </div>
        
        <div style="${emailStyles.infoBox}">
          <h3 style="margin-top: 0; color: ${colors.primary}; font-family: 'DM Sans', sans-serif; font-weight: 600;">Security Information</h3>
          <p style="margin: 5px 0; font-family: 'DM Sans', sans-serif; color: ${colors.textPrimary}; font-size: 14px;">This sign-in link was requested for <strong>${host}</strong></p>
          <p style="margin: 5px 0; font-family: 'DM Sans', sans-serif; color: ${colors.textPrimary}; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      </div>
      
      <div style="${emailStyles.importantInfo}">
        <h3 style="margin-top: 0; color: ${colors.grayDark}; font-family: 'DM Sans', sans-serif; font-weight: 600;">Important Notes:</h3>
        <ul style="${emailStyles.list}">
          <li>This link expires in 24 hours for your security</li>
          <li>Only use this link if you requested to sign in</li>
          <li>The link can only be used once</li>
          <li>Contact support if you have any issues signing in</li>
        </ul>
      </div>
      
      ${base.footer}
    ${base.bodyClose}
    ${base.htmlClose}
  `;

  const text = `
Sign in to RightOffer

Click the link below to sign in to your RightOffer account:
${url}

Signing in as: ${email}

Security Information:
- This sign-in link was requested for ${host}
- If you didn't request this, you can safely ignore this email
- This link expires in 24 hours for your security
- The link can only be used once

If you have any issues signing in, please contact our support team.

Best regards,
The RightOffer Team
  `;

  return {
    subject: 'Sign in to RightOffer',
    html: html.trim(),
    text: text.trim()
  };
}
