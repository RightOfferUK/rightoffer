import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import Resend from "next-auth/providers/resend"
import client, { cachedMongooseConnection } from "./lib/db"
import User from "./models/User"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.EMAIL_FROM || "rightoffer@cromostudios.com",
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify-request",
    error: "/login/error",
  },
  callbacks: {
    async signIn({ user, email }) {
      // Ensure MongoDB connection
      await cachedMongooseConnection;
      
      // Check if user exists in our User model
      const existingUser = await User.findOne({ email: user.email });
      
      if (!existingUser) {
        // Don't allow new user registration - only existing users can sign in
        return false;
      }
      
      // Only check isActive for agents
      if (existingUser.role === 'agent' && !existingUser.isActive) {
        // Don't allow inactive agents to sign in
        return false;
      }
      
      return true;
    },
    async session({ session, token }) {
      if (token?.sub && session?.user) {
        session.user.id = token.sub;
        
        // Add role information to session
        if (token.role) {
          session.user.role = token.role;
          session.user.companyName = token.companyName;
          session.user.maxListings = token.maxListings;
          session.user.usedListings = token.usedListings;
          session.user.realEstateAdminId = token.realEstateAdminId;
        }
      }
      return session;
    },
    async jwt({ token, user, trigger }) {
      // Ensure MongoDB connection
      await cachedMongooseConnection;
      
      if (user) {
        token.sub = user.id;
      }
      
      // Always fetch fresh user data to get current role and limits
      if (token.sub) {
        const dbUser = await User.findById(token.sub);
        if (dbUser) {
          token.role = dbUser.role;
          token.companyName = dbUser.companyName;
          token.maxListings = dbUser.maxListings;
          token.usedListings = dbUser.usedListings;
          token.realEstateAdminId = dbUser.realEstateAdminId?.toString();
        }
      }
      
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
})
