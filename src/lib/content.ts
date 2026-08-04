export type Skill = {
  id: string;
  name: string;
  category: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  stack: string[];
  href: string;
};

export type BlogCard = {
  id: string;
  title: string;
  href: string;
  image: string;
  sizeClass: string;
};

export type EventCard = {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
};

export const skills: Skill[] = [
  { id: "1", name: "React", category: "Frontend" },
  { id: "2", name: "Next.js", category: "Frontend" },
  { id: "3", name: "Tailwind CSS", category: "Styling" },
  { id: "4", name: "TypeScript", category: "Language" },
  { id: "5", name: "Supabase", category: "Backend" },
  { id: "6", name: "Node.js", category: "Backend" },
  { id: "7", name: "Firebase", category: "Cloud" },
  { id: "8", name: "Flutter", category: "Mobile" },
];

export type TechGroup = {
  id: string;
  heading: string;
  items: string[];
};

export const technologies: TechGroup[] = [
  {
    id: "t1",
    heading: "VLSI & Hardware Design",
    items: [
      "Verilog",
      "SystemVerilog",
      "RTL Design",
      "Computer/Microprocessor Architecture",
      "RISC-V",
      "Cadence (Genus, Innovus, Virtuoso)",
      "Xilinx Vivado",
      "Intel Quartus Prime",
      "ModelSim/Questa",
    ],
  },
  {
    id: "t2",
    heading: "Software & Simulation",
    items: [
      "Python",
      "Embedded C",
      "MATLAB",
      "SolidWorks",
      "Git/GitHub",
      "Linux",
    ],
  },
  {
    id: "t3",
    heading: "Management & Analytics",
    items: [
      "MS Excel (Pivot Tables, VLOOKUP, dashboards)",
      "Power BI",
      "SQL",
      "Root Cause Analysis (RCA)",
      "Agile-style workflows",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "p1",
    title: "Portfolio CMS",
    description:
      "A content-managed portfolio with sections editable from an admin dashboard.",
    stack: ["Next.js", "Supabase", "Tailwind"],
    href: "#projects",
  },
  {
    id: "p2",
    title: "Realtime Dashboard",
    description:
      "A responsive analytics dashboard with live updates and fast content editing.",
    stack: ["React", "Postgres", "Charts"],
    href: "#projects",
  },
  {
    id: "p3",
    title: "Mobile Experience",
    description:
      "A cross-platform app concept focused on smooth UX and crisp motion.",
    stack: ["Flutter", "API", "Design"],
    href: "#projects",
  },
];

export const blogCards: BlogCard[] = [
  {
    id: "b1",
    title: "Building a design system from scratch",
    href: "https://blogspot.com",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    sizeClass: "h-72",
  },
  {
    id: "b2",
    title: "Why I moved portfolio content to Supabase",
    href: "https://blogspot.com",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    sizeClass: "h-56",
  },
  {
    id: "b3",
    title: "Shipping interface motion that still feels calm",
    href: "https://blogspot.com",
    image:
      "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
    sizeClass: "h-80",
  },
  {
    id: "b4",
    title: "Working with content-heavy personal sites",
    href: "https://blogspot.com",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    sizeClass: "h-64",
  },
  {
    id: "b5",
    title: "Field notes from modern frontend work",
    href: "https://blogspot.com",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    sizeClass: "h-52",
  },
];

export const events: EventCard[] = [
  {
    id: "e1",
    title: "Hackathon Sprint",
    description:
      "Built and demoed a product concept with a small cross-functional team.",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80",
    date: "2025",
  },
  {
    id: "e2",
    title: "Tech Conference",
    description:
      "Attended talks on design systems, AI workflows, and frontend scaling.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80",
    date: "2025",
  },
  {
    id: "e3",
    title: "Community Meetup",
    description: "Shared project learnings and networked with other builders.",
    image:
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1000&q=80",
    date: "2024",
  },
];

export const education = [
  {
    title: "Vellore Institute of Technology, Chennai",
    subtitle: "B.Tech in Electronics Engineering (VLSI Design) — CGPA: 8.04",
    period: "2023–2027",
    details: [
      "Relevant coursework: Computer Architecture, Microprocessors & Microcontrollers, Embedded C Programming, Digital Systems Design, VLSI System Design, CAD for IC Design",
    ],
  },
];
