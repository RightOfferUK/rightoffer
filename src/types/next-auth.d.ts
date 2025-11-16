import { UserRole } from "@/models/User";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role?: UserRole;
      companyName?: string;
      maxListings?: number;
      usedListings?: number;
      realEstateAdminId?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role?: UserRole;
    companyName?: string;
    maxListings?: number;
    usedListings?: number;
    realEstateAdminId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    role?: UserRole;
    companyName?: string;
    maxListings?: number;
    usedListings?: number;
    realEstateAdminId?: string;
  }
}

// Offer types
export interface Offer {
  id: string;
  buyerName: string;
  buyerEmail: string;
  amount: number;
  status: 'submitted' | 'accepted' | 'rejected' | 'countered' | 'withdrawn';
  fundingType: 'Cash' | 'Mortgage' | 'Chain';
  chain: boolean;
  aipPresent: boolean;
  submittedAt: string | Date;
  notes?: string;
  counterOffer?: number;
  counterOfferNotes?: string;
  agentNotes?: string;
  statusUpdatedAt?: string | Date;
  updatedBy?: string;
  respondedAt?: string | Date;
  counterOfferBy?: 'seller' | 'agent' | 'buyer';
  offerHistory?: Array<{
    action: string;
    amount: number;
    counterAmount?: number;
    notes?: string;
    timestamp: string | Date;
    updatedBy?: string;
  }>;
}

