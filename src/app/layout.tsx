import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://rightoffer.co.uk'),
  title: {
    default: "RightOffer - Transparent Real Estate Offers | See All Property Offers in Real-Time",
    template: "%s | RightOffer"
  },
  description: "Real estate platform connecting agents, sellers, and buyers with complete transparency. View all property offers in real-time, manage negotiations, and close deals faster. No hidden offers, no constant phone calls.",
  keywords: [
    "free property platform",
    "free property offers",
    "free property selling",
    "real estate offers",
    "property offers",
    "rightoffer",
    "transparent property buying",
    "real estate transparency",
    "property negotiation platform",
    "real estate agent tools",
    "property selling platform",
    "real-time property offers",
    "estate agent software",
    "property management",
    "UK property offers",
    "house offers",
    "real estate technology",
    "property offer management",
    "transparent estate agents",
    "property bidding platform",
    "real estate negotiation",
    "property seller platform",
    "buyer offer platform",
    "real estate marketplace",
    "free for sellers",
    "free for buyers"
  ],
  authors: [{ name: "RightOffer" }],
  creator: "RightOffer",
  publisher: "RightOffer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://rightoffer.co.uk',
    title: 'RightOffer | Real Estate Transparency',
    description: 'Connect agents, sellers, and buyers with complete transparency. See all offers in real-time, no more constant phone calls.',
    siteName: 'RightOffer',
    images: [
      {
        url: '/openGL.png',
        width: 1200,
        height: 630,
        alt: 'RightOffer - Transparent Real Estate Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RightOffer | Real Estate Transparency',
    description: 'Connect agents, sellers, and buyers with complete transparency. See all offers in real-time, no more constant phone calls.',
    images: ['/openGL.png'],
    creator: '@rightoffer',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here once you get them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" data-theme="rightoffer">
      <head>
        <link rel="canonical" href="https://rightoffer.co.uk" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${dmSans.variable} font-dm-sans antialiased bg-white text-gray-800`}
      >
        <SessionProvider>
          {children}
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
