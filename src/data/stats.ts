export type Stat = {
  value: number;
  suffix: string;
  label: string;
  badge: string;
};

export const stats: Stat[] = [
  { value: 150, suffix: "+", label: "Events delivered", badge: "EVENTS" },
  { value: 50, suffix: "+", label: "Trusted clients", badge: "NETWORK" },
  { value: 8, suffix: "K+", label: "Guests experienced", badge: "REACH" },
  { value: 100, suffix: "%", label: "End-to-end managed", badge: "DELIVERY" },
];

export const eventTypes = [
  "Corporate Events",
  "Product Launches",
  "Weddings",
  "Sangeet Ceremonies",
  "Brand Activations",
  "Annual Days",
  "Team Building",
  "Conferences",
  "Award Ceremonies",
  "House Warmings",
];
