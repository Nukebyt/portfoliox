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
};

export type EventCard = {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  certificateUrl?: string;
};

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
      "UVM",
      "SVA",
      "Verilator",
      "Computer/Microprocessor Architecture",
      "RISC-V",
      "AXI4/Avalon-MM",
      "Cyclone V/DE10-Standard",
      "ARM Cortex-A9",
      "Cadence (Genus, Innovus, Virtuoso)",
      "Xilinx Vivado",
      "Intel Quartus Prime",
      "Mentor Questa/ModelSim",
    ],
  },
  {
    id: "t2",
    heading: "Software & Simulation",
    items: [
      "Python",
      "C++",
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

export const education = [
  {
    title: "Vellore Institute of Technology, Chennai",
    subtitle: "B.Tech in Electronics Engineering (VLSI Design) - CGPA: 8.04",
    period: "2023–2027",
    details: [
      "Relevant coursework: Computer Architecture, Microprocessors & Microcontrollers, Embedded C Programming, Digital Systems Design, VLSI System Design, CAD for IC Design",
    ],
  },
];
