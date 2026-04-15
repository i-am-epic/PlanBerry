import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { ModalProvider } from "@/components/providers/ModalProvider";
import GrainOverlay from "@/components/effects/GrainOverlay";
import Preloader from "@/components/effects/Preloader";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const SITE_URL = "https://planberry.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PlanBerry — Best Event Planners & Organisers in Bangalore",
    template: "%s | PlanBerry Events Bangalore",
  },
  description:
    "PlanBerry is Bangalore's premier event management company. Expert event planners for corporate events, weddings, brand launches, conferences, and private gatherings. 150+ events delivered across Bangalore & Bengaluru. Call now.",
  keywords: [
    "event planner Bangalore",
    "event planner Bengaluru",
    "event management company Bangalore",
    "corporate event planner Bangalore",
    "wedding planner Bangalore",
    "event organiser Bangalore",
    "event planning services Bangalore",
    "luxury event planner Bangalore",
    "best event planner Bangalore",
    "event management Bengaluru",
    "corporate events Bangalore",
    "wedding event management Bangalore",
    "brand launch event Bangalore",
    "conference event management Bangalore",
    "private event planner Bangalore",
    "event decorator Bangalore",
    "event coordinator Bangalore",
    "product launch event Bangalore",
    "gala dinner Bangalore",
    "event management company Bengaluru",
    "top event planners Bangalore",
    "luxury wedding planner Bangalore",
    "PlanBerry",
    "event planner near me Bangalore",
  ],
  authors: [{ name: "PlanBerry Events Pvt. Ltd." }],
  creator: "PlanBerry Events",
  publisher: "PlanBerry Events Pvt. Ltd.",
  category: "Event Management",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "PlanBerry Events",
    title: "PlanBerry — Best Event Planners & Organisers in Bangalore",
    description:
      "Bangalore's premier event management company. Corporate events, weddings, brand launches & private gatherings. 150+ events. Creativity, precision, purpose.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PlanBerry — Premium Event Planners in Bangalore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanBerry — Best Event Planners in Bangalore",
    description:
      "Bangalore's premier event management company. Corporate events, weddings, brand launches & private gatherings. 150+ events delivered.",
    images: ["/og-image.jpg"],
    creator: "@planberry_in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "google-site-verification-token",
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bangalore, Karnataka, India",
    "geo.position": "12.9716;77.5946",
    "ICBM": "12.9716, 77.5946",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": `${SITE_URL}/#business`,
      "name": "PlanBerry Events",
      "alternateName": ["PlanBerry", "PlanBerry Events Pvt Ltd"],
      "description":
        "PlanBerry is Bangalore's premier event management and planning company, specialising in corporate events, weddings, brand launches, conferences, and private gatherings. Known for obsessive attention to detail and world-class production.",
      "url": SITE_URL,
      "telephone": "+91-80-1234-5678",
      "email": "hello@planberry.in",
      "foundingDate": "2018",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`,
      },
      "image": `${SITE_URL}/og-image.jpg`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Level 12, Prestige Trade Tower, Palace Road",
        "addressLocality": "Bangalore",
        "addressRegion": "Karnataka",
        "postalCode": "560001",
        "addressCountry": "IN",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 12.9716,
        "longitude": 77.5946,
      },
      "areaServed": [
        { "@type": "City", "name": "Bangalore" },
        { "@type": "City", "name": "Bengaluru" },
        { "@type": "State", "name": "Karnataka" },
        { "@type": "Country", "name": "India" },
      ],
      "serviceType": [
        "Corporate Event Management",
        "Wedding Planning",
        "Brand Launch Events",
        "Conference Production",
        "Private Event Planning",
        "Gala Dinner Organisation",
        "AV and Stage Production",
        "Event Decoration and Floral Design",
      ],
      "priceRange": "₹₹₹₹",
      "currenciesAccepted": "INR",
      "paymentAccepted": "Cash, Bank Transfer, UPI",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "127",
        "bestRating": "5",
      },
      "sameAs": [
        "https://instagram.com/planberry.in",
        "https://linkedin.com/company/planberry",
        "https://twitter.com/planberry_in",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "PlanBerry Events",
      "description": "Premium event management company in Bangalore",
      "publisher": { "@id": `${SITE_URL}/#business` },
      "potentialAction": {
        "@type": "SearchAction",
        "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Where is PlanBerry located?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "PlanBerry is headquartered at Prestige Trade Tower, Palace Road, Bangalore, Karnataka 560001. We serve clients across Bangalore, Bengaluru, and all of India.",
          },
        },
        {
          "@type": "Question",
          "name": "What types of events does PlanBerry plan in Bangalore?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "PlanBerry plans corporate events, conferences, summits, product launches, brand activations, weddings, private celebrations, gala dinners, and cultural festivals across Bangalore and beyond.",
          },
        },
        {
          "@type": "Question",
          "name": "How many events has PlanBerry delivered?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "PlanBerry has delivered more than 150 events for over 50 trusted clients, hosting over 8,000 guests across corporate, wedding, and cultural celebrations.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://stream.mux.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://stream.mux.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Preloader />
        <GrainOverlay />
        <ScrollProgress />
        <CustomCursor />
        <ModalProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ModalProvider>
      </body>
    </html>
  );
}
