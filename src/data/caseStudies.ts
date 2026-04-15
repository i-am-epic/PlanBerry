export type CaseStudy = {
  slug: string;
  client: string;
  title: string;
  category: "Corporate" | "Wedding" | "Launch" | "Celebration";
  year: string;
  location: string;
  image: string;
  summary: string;
  metrics: { label: string; value: string }[];
  quote: { text: string; author: string; role: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "helix-annual-2025",
    client: "Helix Technologies",
    title: "A 1,200-guest annual day that felt intimate.",
    category: "Corporate",
    year: "2025",
    location: "Taj West End, Bangalore",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80&auto=format&fit=crop",
    summary:
      "End-to-end production for Helix's flagship annual day — 1,200 guests, hybrid livestream, 12 vendor partners, one unified run-of-show.",
    metrics: [
      { label: "Guests", value: "1,200" },
      { label: "Vendors orchestrated", value: "12" },
      { label: "Livestream viewers", value: "3.2K" },
    ],
    quote: {
      text: "Planberry turned a logistical nightmare into the smoothest annual day we've ever run.",
      author: "Priya Menon",
      role: "Head of People, Helix Technologies",
    },
  },
  {
    slug: "northwind-launch-2025",
    client: "Northwind",
    title: "Product launch that broke their press record.",
    category: "Launch",
    year: "2025",
    location: "Ritz-Carlton, Bangalore",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=80&auto=format&fit=crop",
    summary:
      "Concept-to-stage production for Northwind's flagship launch — a 45-minute keynote, 8-camera multicam, and a bespoke LED stage.",
    metrics: [
      { label: "Press attendees", value: "180" },
      { label: "Camera angles", value: "8" },
      { label: "Earned media", value: "42 outlets" },
    ],
    quote: {
      text: "We've done 12 launches. This was the one we'll be measuring against.",
      author: "Arjun Rao",
      role: "VP Marketing, Northwind",
    },
  },
  {
    slug: "kapoor-wedding-2025",
    client: "The Kapoors",
    title: "A three-day wedding that flowed like one story.",
    category: "Wedding",
    year: "2025",
    location: "The Leela Palace, Bangalore",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80&auto=format&fit=crop",
    summary:
      "A 3-day celebration — sangeet, mehendi, reception — coordinated across 3 venues with a single creative thread running through every moment.",
    metrics: [
      { label: "Days", value: "3" },
      { label: "Venues", value: "3" },
      { label: "Guest experiences", value: "500+" },
    ],
    quote: {
      text: "They understood what mattered to our family. Not one thing felt generic.",
      author: "Meera Kapoor",
      role: "Bride",
    },
  },
  {
    slug: "lumen-summit-2024",
    client: "Lumen",
    title: "A leadership summit with a film-set finish.",
    category: "Corporate",
    year: "2024",
    location: "ITC Gardenia, Bangalore",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&q=80&auto=format&fit=crop",
    summary:
      "Two-day leadership summit for Lumen's global leaders — custom stage, eight sessions, surprise dinner reveal on the closing night.",
    metrics: [
      { label: "Executives", value: "220" },
      { label: "Sessions", value: "8" },
      { label: "NPS", value: "74" },
    ],
    quote: {
      text: "Every detail looked considered. Our leaders noticed, which almost never happens.",
      author: "Ravi Desai",
      role: "COO, Lumen",
    },
  },
  {
    slug: "aurora-gala-2024",
    client: "Aurora Foundation",
    title: "A fundraising gala that doubled its target.",
    category: "Celebration",
    year: "2024",
    location: "The Oberoi, Bangalore",
    image:
      "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=1600&q=80&auto=format&fit=crop",
    summary:
      "Black-tie gala for 320 patrons — a live auction, string quartet, and a closing performance that took the room to its feet.",
    metrics: [
      { label: "Patrons", value: "320" },
      { label: "Raised", value: "₹4.1 Cr" },
      { label: "Auction lots", value: "22" },
    ],
    quote: {
      text: "We set a target. Planberry quietly built an evening that blew past it.",
      author: "Anjali Prasad",
      role: "Director, Aurora Foundation",
    },
  },
  {
    slug: "veda-conference-2024",
    client: "Veda Health",
    title: "A 3-day med-tech conference, zero downtime.",
    category: "Corporate",
    year: "2024",
    location: "Sheraton Grand, Bangalore",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1600&q=80&auto=format&fit=crop",
    summary:
      "Three parallel tracks, 42 speakers, 900 delegates — a full-stack conference production from keynotes to breakouts to closing reception.",
    metrics: [
      { label: "Delegates", value: "900" },
      { label: "Speakers", value: "42" },
      { label: "Tracks", value: "3" },
    ],
    quote: {
      text: "Three days without a single hiccup. Our speakers noticed before our guests did.",
      author: "Dr. Kavya Iyer",
      role: "Chief of Events, Veda Health",
    },
  },
  {
    slug: "saanvi-sangeet-2025",
    client: "The Saanvi Family",
    title: "A sangeet night that felt like a Broadway opener.",
    category: "Wedding",
    year: "2025",
    location: "Four Seasons, Bangalore",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600&q=80&auto=format&fit=crop",
    summary:
      "Choreographed open to a 450-guest sangeet — custom thrust stage, four performance acts, and a fireworks finale synced to the final beat.",
    metrics: [
      { label: "Guests", value: "450" },
      { label: "Performance acts", value: "4" },
      { label: "Rehearsal days", value: "6" },
    ],
    quote: {
      text: "The opening number had people in tears before dinner even started.",
      author: "Saanvi Rao",
      role: "Bride",
    },
  },
];
