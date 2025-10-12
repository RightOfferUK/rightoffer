import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RightOffer - Transparent Real Estate Offers",
  description: "Connect agents, sellers, and buyers with complete transparency. See all real estate offers in real-time, no hidden deals.",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="rightoffer">
      <body
        className={`${dmSans.variable} font-dm-sans antialiased bg-white text-gray-800`}
      >
          {children}
      </body>
    </html>
  );
}
