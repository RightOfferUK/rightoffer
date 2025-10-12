/**
 * Email utility functions for RightOffer
 */

export function formatPrice(price: string): string {
  // Remove any existing currency symbols and format consistently
  const cleanPrice = price.replace(/[£$,]/g, '');
  const numPrice = parseFloat(cleanPrice);
  
  if (isNaN(numPrice)) {
    return price; // Return original if can't parse
  }
  
  return `£${numPrice.toLocaleString('en-GB')}`;
}

export function formatAddress(address: string): string {
  // Capitalize each word in the address
  return address
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function generatePreheader(content: string, maxLength: number = 100): string {
  // Create a preheader text that's optimized for email clients
  if (content.length <= maxLength) {
    return content;
  }
  
  return content.substring(0, maxLength - 3) + '...';
}

export function createEmailId(): string {
  // Generate a unique email ID for tracking
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization for email content
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function createTrackingPixel(emailId: string, baseUrl?: string): string {
  const url = baseUrl || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return `<img src="${url}/api/email/track/${emailId}" width="1" height="1" style="display:none;" alt="">`;
}

export const emailConstants = {
  maxSubjectLength: 78,
  maxPreheaderLength: 100,
  defaultFromName: 'RightOffer',
  defaultFromEmail: process.env.EMAIL_FROM || 'rightoffer@cromostudios.com',
  supportEmail: 'support@rightoffer.com',
  noReplyEmail: 'noreply@rightoffer.com'
};
