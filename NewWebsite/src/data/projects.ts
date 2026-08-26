export interface Project {
  id: string;
  number: string;
  name: string;
  category: string;
  year: string;
  description: string;
  meta: string;
  href?: string;
  status: string;
  mark: string;
  markAlt: string;
}

export const projects: Project[] = [
  {
    id: "expenses",
    number: "001",
    name: "Expenses",
    category: "PERSONAL FINANCE / MOBILE PRODUCT",
    year: "2025",
    description:
      "A local-first private pocket ledger. Personal and shared expense tracking with optional sync — calm defaults, respect for data.",
    meta: "LOCAL-FIRST · ANDROID / IOS BETA",
    href: "https://play.google.com/store/apps/details?id=com.glitchlabs.expenses",
    status: "ACTIVE",
    mark: "/brand/expenses-icon.png",
    markAlt: "Expenses app icon",
  },
  {
    id: "aura",
    number: "002",
    name: "AURA",
    category: "VEDIC ASTROLOGY / SYSTEMS",
    year: "2025",
    description:
      "Birth charts, predictions, and Porutham presented with clarity. Grounded computation for Tamil calendar contexts.",
    meta: "CHARTS · PREDICTIONS · COMPATIBILITY",
    status: "IN LAB",
    mark: "/brand/aura-icon.png",
    markAlt: "AURA app icon",
  },
  {
    id: "composer",
    number: "003",
    name: "Social Composer",
    category: "INTERNAL TOOL / IMAGE SYSTEMS",
    year: "2025",
    description:
      "Studio utility for composing social surfaces — precise mark placement, export presets, intentional framing.",
    meta: "INTERNAL · COMPOSITION UTILITY",
    status: "INTERNAL",
    mark: "/brand/glitchlabs-icon.png",
    markAlt: "gLitCh Labs mark",
  },
];

export const pillars = [
  {
    id: "01",
    title: "ARCHITECTURAL RESTRAINT",
    copy: "Remove until the structure holds. Every surface earns its place; silence is a design material.",
  },
  {
    id: "02",
    title: "LOCAL-FIRST SOVEREIGNTY",
    copy: "Data lives with the person first. Sync is optional infrastructure — never the default tax.",
  },
  {
    id: "03",
    title: "KINETIC & ACOUSTIC RESONANCE",
    copy: "Motion and feedback carry mass. Interfaces should feel physical: inertia, weight, quiet response.",
  },
  {
    id: "04",
    title: "MATHEMATICAL TYPOGRAPHY",
    copy: "Type as spatial architecture. Scale, tracking, and rhythm are engineered — not decorated.",
  },
] as const;

export const CONTACT_EMAIL = "glitchlabsio@gmail.com";
