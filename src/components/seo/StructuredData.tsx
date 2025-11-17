'use client';

import React from 'react';

const StructuredData = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RightOffer",
    "url": "https://rightoffer.co.uk",
    "logo": "https://rightoffer.co.uk/logo.webp",
    "description": "Revolutionary real estate platform connecting agents, sellers, and buyers with complete transparency.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "GB"
    },
    "sameAs": [
      "https://twitter.com/rightoffer",
      "https://linkedin.com/company/rightoffer"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "RightOffer",
    "url": "https://rightoffer.co.uk",
    "description": "Transparent real estate offers platform for agents, sellers, and buyers",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://rightoffer.co.uk/listing?id={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Real Estate Platform",
    "provider": {
      "@type": "Organization",
      "name": "RightOffer"
    },
    "areaServed": "GB",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Real Estate Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Offer Management",
            "description": "Real-time property offer tracking and management for sellers and agents"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Negotiation Platform",
            "description": "Streamlined negotiation process between buyers, sellers, and agents"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Transparent Offer Visibility",
            "description": "Complete transparency for all parties in the property transaction"
          }
        }
      ]
    }
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "RightOffer",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "GBP",
      "description": "Free for buyers and sellers. Agents pay per property listing."
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "150"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://rightoffer.co.uk"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does RightOffer work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RightOffer connects agents, sellers, and buyers with complete transparency. Property sellers can view all offers in real-time, compare them side-by-side, and manage negotiations efficiently without constant phone calls."
        }
      },
      {
        "@type": "Question",
        "name": "Is RightOffer free for buyers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, RightOffer is completely free for property buyers. They can submit offers, participate in negotiations, and track their offer status at no cost."
        }
      },
      {
        "@type": "Question",
        "name": "How much does RightOffer cost for sellers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RightOffer is completely free for property sellers. There are no fees for sellers to view offers, manage negotiations, or use any of the platform features. Only estate agents pay a fee per property listing."
        }
      },
      {
        "@type": "Question",
        "name": "What does RightOffer cost for estate agents?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Estate agents pay £75 per property listing to use RightOffer. This gives them and their clients access to all features including real-time offer management, negotiation tools, and complete transparency throughout the sales process."
        }
      },
      {
        "@type": "Question",
        "name": "Can estate agents use RightOffer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, estate agents can manage multiple properties, view all offers across their portfolio, and streamline the negotiation process for their clients."
        }
      },
      {
        "@type": "Question",
        "name": "Is my property information secure on RightOffer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, RightOffer uses secure access codes for sellers and buyers. Only authorized parties can view and submit offers on each property."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
};

export default StructuredData;

