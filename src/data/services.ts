export type ServiceCategory = {
  id: string;
  badge: string;
  title: string;
  italic?: string;
  tagline: string;
  description: string;
  capabilities: string[];
};

export const coreServices: ServiceCategory[] = [
  {
    id: "corporate",
    badge: "OUR EXPERTISE",
    title: "Corporate",
    italic: "Events",
    tagline: "Strategy meets seamless execution.",
    description:
      "High-impact corporate experiences engineered to meet business objectives — from boardroom conferences and product launches to team offsites and award nights.",
    capabilities: [
      "Corporate Meetings & Conferences",
      "Product Launches & Brand Activations",
      "Annual Days & Award Ceremonies",
      "Team-Building Events & Offsites",
      "Corporate Parties & Client Engagements",
      "AV, Stage & Technical Production",
    ],
  },
  {
    id: "social",
    badge: "CELEBRATIONS",
    title: "Weddings &",
    italic: "Celebrations",
    tagline: "Every moment, beautifully orchestrated.",
    description:
      "Thoughtfully curated personal celebrations — from sangeet nights and grand receptions to intimate housewarmings and festive gatherings.",
    capabilities: [
      "Weddings & Sangeet Ceremonies",
      "Engagements & Receptions",
      "Housewarming Celebrations",
      "Festive & Cultural Events",
      "Photography & Videography",
      "Entertainment & Special Effects",
    ],
  },
];

export type MediaPillar = {
  id: string;
  title: string;
  summary: string;
  items: string[];
};

export const mediaProduction: MediaPillar[] = [
  {
    id: "av",
    title: "Audio-Visual Excellence",
    summary:
      "AV solutions that keep every guest engaged and every message crystal-clear.",
    items: [
      "LED walls & projection systems",
      "Professional sound & microphone setups",
      "Live video mixing & event recording",
      "Highlight reels & recap videos",
    ],
  },
  {
    id: "stage",
    title: "Stage & Technical Production",
    summary:
      "A production team that handles every technical detail with precision — so the room looks effortless.",
    items: [
      "Stage design & fabrication",
      "Lighting design & effects",
      "Rigging, trussing & power solutions",
      "On-site technical support",
    ],
  },
  {
    id: "photo",
    title: "Photography & Videography",
    summary:
      "Visual storytelling that captures the tone, the faces, and the story of the day.",
    items: [
      "Professional event photography",
      "Cinematic videos & drone shoots",
      "Highlight reels & post-production",
      "Same-day edits on request",
    ],
  },
  {
    id: "entertainment",
    title: "Entertainment Solutions",
    summary:
      "Curated entertainment and atmosphere — the moments your guests will actually remember.",
    items: [
      "DJs & live music",
      "Artist management",
      "Special effects — confetti, lasers, fog, pyrotechnics",
      "Custom performance acts",
    ],
  },
];
