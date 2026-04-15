export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Planberry turned a logistical nightmare into the smoothest annual day we've ever run. They thought through things we hadn't even considered.",
    author: "Priya Menon",
    role: "Head of People",
    company: "Helix Technologies",
  },
  {
    quote:
      "The calm on the ground was palpable. Twelve vendors, one team — no ego, no friction, no surprises.",
    author: "Arjun Rao",
    role: "VP Marketing",
    company: "Northwind",
  },
  {
    quote:
      "They understood what mattered to our family. Not one thing felt generic or off-the-shelf.",
    author: "Meera Kapoor",
    role: "Bride",
    company: "Kapoor Wedding",
  },
  {
    quote:
      "Every detail looked considered. Our leaders noticed — which almost never happens at corporate events.",
    author: "Ravi Desai",
    role: "COO",
    company: "Lumen",
  },
];
