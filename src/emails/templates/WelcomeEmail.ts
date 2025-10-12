import { createBaseTemplate, emailStyles, colors } from '../components/BaseTemplate';

export interface WelcomeEmailProps {
  userName: string;
  userRole: 'agent' | 'real_estate_admin' | 'admin';
  companyName?: string;
  baseUrl?: string;
}

export function generateWelcomeEmail({
  userName,
  userRole,
  companyName,
  baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
}: WelcomeEmailProps) {
  const roleDisplayName = {
    agent: 'Real Estate Agent',
    real_estate_admin: 'Real Estate Administrator',
    admin: 'System Administrator'
  }[userRole];

  const base = createBaseTemplate({
    title: 'Welcome to RightOffer',
    preheader: `Welcome to RightOffer, ${userName}!`,
    headerGradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`
  });

  const html = `
    ${base.doctype}
    ${base.htmlOpen}
    ${base.head}
    ${base.bodyOpen}
      ${base.header}
      
      <div style="${emailStyles.container}">
        <h2 style="color: ${colors.primary}; margin-top: 0;">Welcome ${userName}!</h2>
        <p>We're excited to have you join RightOffer as a ${roleDisplayName}${companyName ? ` at ${companyName}` : ''}.</p>
        
        <div style="${emailStyles.infoBox}">
          <h3 style="margin-top: 0; color: ${colors.primary};">Your Account Details</h3>
          <p style="margin: 5px 0;"><strong>Role:</strong> ${roleDisplayName}</p>
          ${companyName ? `<p style="margin: 5px 0;"><strong>Company:</strong> ${companyName}</p>` : ''}
        </div>
        
        <p>RightOffer brings complete transparency to real estate transactions.</p>
      
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${baseUrl}/dashboard" 
             style="${emailStyles.button} background: ${colors.primary};">
            Access Your Dashboard
          </a>
        </div>
      </div>
      
      <div style="${emailStyles.importantInfo}">
        <h3 style="margin-top: 0; color: #475569;">Getting Started:</h3>
        <ul style="${emailStyles.list}">
          <li>Log in to your dashboard using the link above</li>
          <li>Complete your profile setup</li>
          <li>Explore the platform features</li>
          <li>Contact support through support@rightoffer.co.uk if you need any assistance</li>
        </ul>
      </div>
      
      ${base.footer}
    ${base.bodyClose}
    ${base.htmlClose}
  `;

  const text = `
Welcome ${userName}!

We're excited to have you join RightOffer as a ${roleDisplayName}${companyName ? ` at ${companyName}` : ''}.

Your Account Details:
- Role: ${roleDisplayName}
${companyName ? `- Company: ${companyName}` : ''}

Access your dashboard at: ${baseUrl}/dashboard

Getting Started:
- Log in to your dashboard using the link above
- Complete your profile setup
- Explore the platform features
- Contact support if you need any assistance

Best regards,
The RightOffer Team
  `;

  return {
    subject: 'Welcome to RightOffer - Your Account is Ready',
    html: html.trim(),
    text: text.trim()
  };
}
