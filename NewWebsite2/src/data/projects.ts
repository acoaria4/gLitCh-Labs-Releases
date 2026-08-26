export type Project = {
  id: string;
  index: string;
  name: string;
  category: string;
  year: string;
  status: string;
  summary: string;
};

export const projects: Project[] = [
  {
    id: "expenses",
    index: "001",
    name: "EXPENSES",
    category: "PERSONAL FINANCE",
    year: "2026",
    status: "ACTIVE",
    summary:
      "A local-first finance instrument. Quiet ledgers, sharp structure, no dashboard theater.",
  },
  {
    id: "lattice",
    index: "002",
    name: "LATTICE",
    category: "SYSTEMATIC EQUITY RESEARCH",
    year: "2026",
    status: "LAB",
    summary:
      "A research system that treats markets as measurable geometry — signal over spectacle.",
  },
];

export const principles = [
  {
    id: "01",
    title: "ARCHITECTURAL RESTRAINT",
    body: "Every surface earns its place. If removing it improves clarity, it was never necessary.",
  },
  {
    id: "02",
    title: "LOCAL-FIRST SOVEREIGNTY",
    body: "Computation belongs with the person who owns the data. Cloud is optional, not assumed.",
  },
  {
    id: "03",
    title: "KINETIC & ACOUSTIC RESONANCE",
    body: "Interfaces should feel physical. Motion has mass. Feedback has tone. Nothing floats without reason.",
  },
  {
    id: "04",
    title: "MATHEMATICAL TYPOGRAPHY",
    body: "Type is structure, not decoration. Scale, tracking, and rhythm follow measurable systems.",
  },
] as const;
