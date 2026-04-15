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
    badge: "PRIMARY FOCUS",
    title: "Corporate",
    italic: "Events",
    tagline: "Strategy meets seamless execution.",
    description:
      "High-impact corporate experiences engineered to meet business objectives — from intimate board offsites to flagship product launches.",
    capabilities: [
      "Corporate Meetings & Conferences",
      "Product Launches & Brand Activations",
      "Annual Days & Award Ceremonies",
      "Team-Building Events & Offsites",
      "Corporate Parties & Client Engagement",
      "AV, Stage & Technical Production",
    ],
  },
  {
    id: "social",
    badge: "CELEBRATIONS",
    title: "Social &",
    italic: "Seasonal",
    tagline: "Every moment, beautifully orchestrated.",
    description:
      "Thoughtfully curated personal celebrations — from the quiet rituals of a house warming to the full scale of a wedding week.",
    capabilities: [
      "Weddings & Sangeet Ceremonies",
      "Engagements & Receptions",
      "House Warming Ceremonies",
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
    title: "Audio-Visual Production",
    summary:
      "Cutting-edge AV solutions that keep every guest engaged and every message crystal-clear.",
    items: [
      "High-definition LED walls & projection systems",
      "Professional sound systems & microphones",
      "Live video mixing and switching",
      "Event recording and highlight videos",
    ],
  },
  {
    id: "stage",
    title: "Stage & Technical Production",
    summary:
      "A production team that handles every technical detail with precision — so the room looks effortless.",
    items: [
      "Stage design & fabrication",
      "Lighting design (ambient, intelligent, effect)",
      "Rigging and trussing systems",
      "Power backup and technical support",
    ],
  },
  {
    id: "photo",
    title: "Photography & Videography",
    summary:
      "Expert visual storytelling that captures the tone, the faces, and the story of the day.",
    items: [
      "Event photography (corporate, weddings, concerts)",
      "Cinematic videography",
      "Drone shoots (where permitted)",
      "Post-production editing and reels",
    ],
  },
  {
    id: "entertainment",
    title: "Entertainment Production",
    summary:
      "Curated entertainment and atmosphere — the moments your guests will actually remember.",
    items: [
      "DJ setups and live music production",
      "Artist management and technical riders",
      "Special effects — fog, lasers, confetti, pyrotechnics",
    ],
  },
];
