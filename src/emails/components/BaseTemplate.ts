export interface BaseEmailProps {
  title: string;
  preheader?: string;
  headerColor?: string;
  headerGradient?: string;
}

export function createBaseTemplate({
  title,
  preheader = '',
  headerGradient = 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)'
}: BaseEmailProps) {
  return {
    doctype: '<!DOCTYPE html>',
    htmlOpen: '<html>',
    head: `
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        ${preheader ? `<meta name="description" content="${preheader}">` : ''}
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
      </head>`,
    bodyOpen: '<body style="font-family: \'DM Sans\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">',
    header: `
      <div style="background: ${headerGradient}; color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; box-shadow: 0 10px 25px rgba(168, 85, 247, 0.15);">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700; font-family: 'DM Sans', sans-serif;">RightOffer</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9; font-weight: 500;">${title}</p>
      </div>`,
    footer: `
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; font-family: 'DM Sans', sans-serif;">
        <p style="font-weight: 500;">Best regards,<br>The RightOffer Team</p>
        <p style="margin-top: 15px;">This is an automated message. Please do not reply to this email.</p>
      </div>`,
    bodyClose: '</body>',
    htmlClose: '</html>'
  };
}

export const emailStyles = {
  container: 'background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px; font-family: \'DM Sans\', sans-serif;',
  whiteBox: 'background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);',
  codeLabel: 'margin: 0 0 10px 0; color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; font-family: \'DM Sans\', sans-serif;',
  infoBox: 'background: white; border-left: 4px solid #a855f7; padding: 15px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);',
  button: 'display: inline-block; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-family: \'DM Sans\', sans-serif; box-shadow: 0 4px 14px rgba(168, 85, 247, 0.25); transition: all 0.3s ease;',
  importantInfo: 'background: #f1f5f9; padding: 20px; border-radius: 12px; font-size: 14px; color: #64748b; border: 1px solid #e2e8f0;',
  list: 'margin: 10px 0; padding-left: 20px; font-family: \'DM Sans\', sans-serif;'
};

export const colors = {
  // RightOffer Brand Colors
  primary: '#a855f7',        // Purple 500
  primaryDark: '#9333ea',    // Purple 600
  primaryDarker: '#7c3aed',  // Purple 700
  secondary: '#0ea5e9',      // Blue 500
  secondaryDark: '#0284c7',  // Blue 600
  accent: '#c084fc',         // Purple 400
  
  // Navy backgrounds
  navy: '#0f172a',
  navyLight: '#1e293b',
  
  // Success/Warning colors
  success: '#10b981',
  successLight: '#34d399',
  successBg: '#f0fdf4',
  successBorder: '#d1fae5',
  successCode: '#dcfce7',
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  warningBg: '#fef3c7',
  
  // Gray scale
  gray: '#64748b',
  grayLight: '#f1f5f9',
  grayBorder: '#e2e8f0',
  grayDark: '#334155',
  
  // Text colors
  textPrimary: '#334155',
  textSecondary: '#64748b',
  textLight: '#94a3b8'
};
