/**
 * siteConfig — single source of truth for all portfolio content.
 *
 * Wiring notes for Ayan:
 *  • cvPath        → drop the real PDF into /public and the buttons light up.
 *  • projects[].image → swap to a real screenshot path here (no layout changes needed).
 */

export const siteConfig = {
  name: "Ayan Malik",
  role: "Network · Cloud · Security Engineer",
  secondary: "Cisco · AWS · SIEM",
  url: "https://ayan-malik.vercel.app", // update if a custom domain is added
  description:
    "Network, Cloud & Security engineer specialising in Cisco infrastructure, AWS cloud deployments and SIEM-based threat detection. Based in Darwin, NT, Australia.",

  // Resume served from /public/Ayan-Malik-CV.pdf — wired into the nav + contact
  // "Download CV" buttons. To update, replace that file in /public.
  cvPath: "/Ayan-Malik-CV.pdf",

  // Centred hero portrait (taller capsule crop). To revert to the monogram,
  // set this back to "/monogram.svg".
  heroMark: "/ayan.jpg",
  heroMarkAlt: "Ayan Malik",

  contact: {
    email: "sarkerayanmalik@gmail.com",
    phone: "0413 269 957",
    phoneHref: "tel:+61413269957",
    linkedin: "linkedin.com/in/sarker-ayanmalik",
    linkedinHref: "https://linkedin.com/in/sarker-ayanmalik",
    github: "github.com/sarkerayanmalik",
    githubHref: "https://github.com/sarkerayanmalik",
    location: "Darwin, NT, Australia",
  },

  nav: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export const summary =
  "Final-year IT graduate specialising in Networking & Security, with practical experience configuring Cisco LAN/WAN infrastructure, deploying multi-tier AWS cloud environments, and building SIEM-based threat detection systems. Currently a Network Engineer Intern at Nazmec, applying STRIDE threat modelling and Agile practices to live client infrastructure. Seeking an entry-level role in Network Support, Cloud Operations, or Cybersecurity where hands-on skills translate into measurable impact.";

/** Tokens wrapped in ** ** are rendered emphasised in the About paragraph. */
export const summaryRich =
  "Final-year IT graduate specialising in **Networking & Security**, with practical experience configuring Cisco LAN/WAN infrastructure, deploying multi-tier AWS cloud environments, and building SIEM-based threat detection systems. Currently a **Network Engineer Intern at Nazmec**, applying STRIDE threat modelling and Agile practices to live client infrastructure. Seeking an entry-level role in **Network Support, Cloud Operations, or Cybersecurity** where hands-on skills translate into measurable impact.";

export const stats = [
  { value: 3, suffix: "+", label: "Live project domains" },
  { value: 3, suffix: "", label: "Core stacks · AWS · Cisco · SIEM" },
  { value: 100, suffix: "%", label: "Remote-ready · Darwin, NT" },
] as const;

export type Experience = {
  role: string;
  org: string;
  meta: string;
  date: string;
  bullets: string[];
};

export const experience: Experience[] = [
  {
    role: "Network Engineer Intern",
    org: "Nazmec",
    meta: "Darwin, NT",
    date: "Jun 2025 – Present",
    bullets: [
      "Configured and maintained **Cisco LAN/WAN infrastructure** (routers, switches, VLANs, ACLs) across multiple client environments.",
      "Supported deployment of **multi-tier AWS environments** (VPC, EC2, IAM, Security Groups) applying least-privilege and high-availability principles.",
      "Performed deep-packet traffic analysis with **Wireshark** to diagnose and resolve Layer 2/3 connectivity faults before client impact.",
      "Contributed to **STRIDE-based security assessments**, documenting threat vectors and mitigations.",
      "Produced technical documentation improving knowledge transfer across the engineering team.",
    ],
  },
  {
    role: "Backend Developer — Mobile Application",
    org: "Federation University Australia",
    meta: "Academic Team Project",
    date: "Mar – Nov 2025",
    bullets: [
      "Built the backend for a cross-platform mobile app using **React Native + Expo** with Supabase (auth + real-time DB sync).",
      "Designed and tested **RESTful API endpoints**; ran Agile sprints with code reviews, CI/CD testing, and stakeholder demos.",
    ],
  },
  {
    role: "SIEM Implementation & Threat Detection",
    org: "Personal Home Lab",
    meta: "Self-directed",
    date: "Jan – Nov 2025",
    bullets: [
      "Deployed a **SIEM platform** with log forwarding from Linux and Windows endpoints; built custom detection rules and alerting dashboards.",
      "Authored an incident-response runbook aligned with **NIST SP 800-61**, practising full SOC triage, containment, and escalation.",
    ],
  },
];

export type Project = {
  index: string;
  name: string;
  tags: string[];
  description: string;
  image: string; // swap to a screenshot path here when available
  accent: "accent" | "accent-2" | "gold";
};

export const projects: Project[] = [
  {
    index: "01",
    name: "AWS Cloud Architecture & Security",
    tags: ["VPC", "EC2", "RDS", "S3", "IAM", "HA"],
    description:
      "Multi-tier AWS environment with subnet segmentation, NAT gateways, IAM least-privilege, encryption at rest, and VPC flow logging for end-to-end visibility.",
    image: "/project-aws.svg",
    accent: "accent",
  },
  {
    index: "02",
    name: "Cisco Network Design — Packet Tracer",
    tags: ["Cisco IOS", "VLANs", "ACLs", "Inter-VLAN Routing"],
    description:
      "Segmented enterprise LAN with VLAN trunking and inter-VLAN routing; granular ACL policies and Layer 2/3 fault resolution.",
    image: "/project-cisco.svg",
    accent: "accent",
  },
  {
    index: "03",
    name: "OSINT Environmental Analysis System",
    tags: ["MongoDB", "Neo4j", "ACH", "Graph DB"],
    description:
      "Dual-database intelligence tool correlating global datasets; ACH methodology to surface non-obvious relationships in graph data.",
    image: "/project-osint.svg",
    accent: "accent-2",
  },
  {
    index: "04",
    name: "Job Management System — Java",
    tags: ["Java", "OOP", "JUnit", "Swing", "Git"],
    description:
      "Full OOP desktop app for construction project & cost management, with file I/O persistence and a JUnit test suite.",
    image: "/project-java.svg",
    accent: "gold",
  },
];

export type SkillGroup = { title: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Networking",
    items: [
      "Cisco IOS",
      "VLANs",
      "ACLs",
      "NAT",
      "Subnetting",
      "LAN/WAN",
      "Wireshark",
      "Packet Tracer",
    ],
  },
  {
    title: "Cloud — AWS",
    items: ["VPC", "EC2", "IAM", "S3", "RDS", "Security Groups", "HA Architecture"],
  },
  {
    title: "Security",
    items: [
      "STRIDE",
      "SIEM",
      "NIST SP 800-61",
      "Firewall Config",
      "Threat Modelling",
      "Access Control",
    ],
  },
  {
    title: "Programming & Data",
    items: ["Python", "Java", "SQL", "MongoDB", "Neo4j", "Git/GitHub"],
  },
  {
    title: "Systems & Tools",
    items: ["Linux", "Windows Server", "React Native", "Supabase", "VS Code"],
  },
];

export const certifications = [
  {
    name: "AWS Academy Graduate",
    sub: "Cloud Computing Foundations · Amazon Web Services",
  },
  {
    name: "Cisco Networking Essentials",
    sub: "Routing & Switching Fundamentals · Cisco Systems",
  },
  {
    name: "Python (Basic)",
    sub: "Programming Fundamentals · HackerRank",
  },
];

export const education = {
  degree: "Bachelor of Information Technology (Networking & Security)",
  uni: "Federation University Australia",
  dates: "Feb 2023 – Nov 2025",
  award: "Certificate of Academic Excellence",
};

export const languages = [
  { name: "English", level: "Professional" },
  { name: "Bengali", level: "Native" },
];
