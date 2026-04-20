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

const SITE_URL = "https://planberryevents.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Planberry Events — Corporate & Wedding Event Management in Bangalore",
    template: "%s | Planberry Events Bangalore",
  },
  description:
    "Planberry Events is a full-service event management company in Bangalore, specializing in corporate experiences and wedding celebrations. Crafting experiences. Delivering moments.",
  keywords: [
    "Planberry Events",
    "event management Bangalore",
    "corporate event planner Bangalore",
    "wedding planner Bangalore",
    "wedding event management Bangalore",
    "sangeet planner Bangalore",
    "product launch event Bangalore",
    "brand activation Bangalore",
    "conference planner Bangalore",
    "event planner Kalyan Nagar",
    "event coordinator Bangalore",
    "housewarming planner Bangalore",
    "stage and AV production Bangalore",
  ],
  authors: [{ name: "Planberry Events" }],
  creator: "Planberry Events",
  publisher: "Planberry Events",
  category: "Event Management",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Planberry Events",
    title: "Planberry Events — Corporate & Wedding Event Management in Bangalore",
    description:
      "Crafting experiences. Delivering moments. Full-service event management for corporate experiences and wedding celebrations.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Planberry Events — Corporate & Wedding Event Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Planberry Events — Corporate & Wedding Event Management in Bangalore",
    description:
      "Crafting experiences. Delivering moments. Corporate and wedding event management in Bangalore.",
    images: ["/og-image.jpg"],
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
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bangalore, Karnataka, India",
    "geo.position": "13.0205;77.6492",
    "ICBM": "13.0205, 77.6492",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "ProfessionalService"],
      "@id": `${SITE_URL}/#business`,
      "name": "Planberry Events",
      "alternateName": ["Planberry"],
      "description":
        "Planberry Events is a full-service event management company in Bangalore specializing in corporate experiences and wedding celebrations.",
      "url": SITE_URL,
      "telephone": ["+91-88676-59549", "+91-97317-37771"],
      "email": "contact@planberryevents.com",
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo.png` },
      "image": `${SITE_URL}/og-image.jpg`,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "#211, 4th C Cross, HRBR 3rd Block, Kalyan Nagar",
        "addressLocality": "Bangalore",
        "addressRegion": "Karnataka",
        "postalCode": "560043",
        "addressCountry": "IN",
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
        "Sangeet & Reception Planning",
        "Product Launches & Brand Activations",
        "Annual Days & Award Ceremonies",
        "Team-Building Events & Offsites",
        "Stage & Technical Production",
        "Audio-Visual Production",
        "Photography & Videography",
        "Entertainment Solutions",
      ],
      "priceRange": "₹₹₹",
      "currenciesAccepted": "INR",
      "paymentAccepted": "Cash, Bank Transfer, UPI",
      "sameAs": ["https://instagram.com/planberryevents"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "Planberry Events",
      "description": "Corporate & wedding event management in Bangalore",
      "publisher": { "@id": `${SITE_URL}/#business` },
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
        <link rel="preconnect" href="https://storage.googleapis.com" />
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
