export type ApproachStep = {
  number: string;
  title: string;
  description: string;
};

export const approach: ApproachStep[] = [
  {
    number: "01",
    title: "Consultation & Requirement Understanding",
    description:
      "We begin by understanding your event objectives, expectations, timelines, and budget. This initial consultation helps us align with your vision and clearly define the scope.",
  },
  {
    number: "02",
    title: "Concept, Planning & Budget Alignment",
    description:
      "We develop an event concept and a detailed plan that aligns with your goals and budget. Every element is thoughtfully planned for feasibility, clarity, and value.",
  },
  {
    number: "03",
    title: "Design, Vendor Coordination & Scheduling",
    description:
      "We manage design elements, vendor partnerships, and scheduling. From decor and production to technical setups, we coordinate every detail for smooth collaboration.",
  },
  {
    number: "04",
    title: "On-Ground Execution & Event Management",
    description:
      "Our team oversees the event on-site, managing logistics, timelines, and real-time coordination — so you can focus on your guests and the experience.",
  },
  {
    number: "05",
    title: "Post-Event Wrap-Up & Media Delivery",
    description:
      "After the event we handle the wrap-up — media delivery, vendor closure, and final coordination — for a complete and professional conclusion.",
  },
];
