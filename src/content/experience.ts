import type { Experience } from "@/lib/types";

/** Newest first. Titles and dates are exactly as confirmed by the owner. */
export const experience: Experience[] = [
  {
    company: "Freelance",
    title: "Freelance Software Engineer",
    start: "2026-01",
    summary:
      "Full-stack development of an enterprise petroleum distribution management system, with hands-on Next.js frontend and Laravel backend work.",
    highlights: [
      "Develop the frontend hands-on with Next.js, React and TypeScript.",
      "Develop backend features with Laravel and integrate the frontend with its APIs.",
      "Contribute to database design and enterprise application workflows across wholesale, retail, logistics and master data.",
      "Analyze business requirements with stakeholders and prototype screens and flows in Figma.",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Laravel", "PHP", "Figma"],
    projects: ["petroleum-distribution-management"],
  },
  {
    company: "Aibodia Co., Ltd",
    title: "Project Leader / Team Lead",
    start: "2024-11",
    end: "2025-12",
    summary:
      "Led development teams on auction, e-commerce, investment and payment-related applications while contributing directly to backend and frontend code.",
    highlights: [
      "Led the technical direction of development teams and coordinated their work.",
      "Built real-time bidding with Redis distributed locks and database transactions to keep concurrent bids consistent.",
      "Developed backend services in Java Spring Boot and frontend features in Vue.js.",
      "Reviewed code, mentored developers and troubleshot production issues.",
    ],
    technologies: ["Java", "Spring Boot", "Vue.js", "Redis"],
    projects: ["real-time-auction-platform"],
  },
  {
    company: "Aibodia Co., Ltd",
    title: "Senior Frontend Developer",
    start: "2024-08",
    end: "2024-10",
    summary: "Built e-commerce features in React.",
    highlights: [
      "Developed e-commerce features in React.",
      "Integrated REST APIs.",
      "Built reusable frontend components.",
    ],
    technologies: ["React", "REST APIs"],
  },
  {
    company: "YesCAR Cambodia",
    title: "Senior Java Developer",
    start: "2024-01",
    end: "2024-06",
    summary:
      "Developed and supported a CRM built with Java Spring Boot and Vue.js.",
    highlights: [
      "Built backend and frontend features for the CRM.",
      "Worked from business requirements to implementation.",
      "Provided production support and troubleshooting.",
    ],
    technologies: ["Java", "Spring Boot", "Vue.js"],
    projects: ["enterprise-crm-platform"],
  },
  {
    company: "Ecoinsoft Solution Co., Ltd",
    title: "Frontend Team Leader",
    start: "2020-03",
    end: "2023-09",
    summary:
      "Led the frontend team on the General Core Insurance platform while implementing its Angular frontend hands-on.",
    highlights: [
      "Implemented the General Core Insurance frontend hands-on in Angular, including modules, forms and business workflows.",
      "Built reusable frontend components and shaped the frontend structure used across the team.",
      "Led and mentored frontend developers, reviewed their work and oversaw frontend delivery, including VMS and IAC reporting.",
      "Worked with backend developers to clarify business requirements and integration through REST APIs.",
      "Communicated with clients and provided technical support and troubleshooting.",
    ],
    technologies: ["Angular", "TypeScript", "REST APIs"],
    projects: ["general-insurance-platform"],
  },
  {
    company: "Ecoinsoft Solution Co., Ltd",
    title: "Frontend Developer",
    start: "2019-11",
    end: "2020-02",
    summary:
      "Built Angular frontends for insurance and other business applications.",
    highlights: [
      "Developed the Angular frontend for an insurance application.",
      "Built interfaces for CRM, real estate and point-of-sale applications.",
    ],
    technologies: ["Angular", "TypeScript"],
  },
  {
    company: "Ecoinsoft Solution Co., Ltd",
    title: "Backend Developer",
    start: "2018-12",
    end: "2019-10",
    summary: "Built REST APIs in Java and Grails for business applications.",
    highlights: [
      "Developed REST APIs with Java and Grails.",
      "Worked on real estate and CMS applications and point-of-sale back-office systems.",
      "Optimized SQL queries and troubleshot database issues.",
    ],
    technologies: ["Java", "Grails", "SQL"],
  },
];
