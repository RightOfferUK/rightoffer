// Email Templates
export { generateSellerCodeEmail, type SellerCodeEmailProps } from './SellerCodeEmail';
export { generateBuyerCodeEmail, type BuyerCodeEmailProps } from './BuyerCodeEmail';
export { generateOfferNotificationEmail, type OfferNotificationEmailProps } from './OfferNotificationEmail';
export { generateOfferAcceptedEmail, type OfferAcceptedEmailProps } from './OfferAcceptedEmail';
export { generateOfferRejectedEmail, type OfferRejectedEmailProps } from './OfferRejectedEmail';
export { generateCounterOfferEmail, type CounterOfferEmailProps } from './CounterOfferEmail';
export { generateOfferAcceptedSellerEmail, type OfferAcceptedSellerEmailProps } from './OfferAcceptedSellerEmail';
export { generateCounterOfferRejectedSellerEmail, type CounterOfferRejectedSellerEmailProps } from './CounterOfferRejectedSellerEmail';
export { generateReCounterOfferEmail, type ReCounterOfferEmailProps } from './ReCounterOfferEmail';
export { generateWelcomeEmail, type WelcomeEmailProps } from './WelcomeEmail';
export { generateMagicLinkEmail, type MagicLinkEmailProps } from './MagicLinkEmail';
export { generateContactFormEmail } from './ContactFormEmail';

// Base components
export { createBaseTemplate, emailStyles, colors, type BaseEmailProps } from '../components/BaseTemplate';
