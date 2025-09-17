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

