import type { Project } from "@/lib/types";

/**
 * Professional projects described at a general level. No outcomes are listed
 * until the owner verifies them; see docs/CONTENT_GUIDELINES.md.
 */
export const projects: Project[] = [
  {
    slug: "real-time-auction-platform",
    title: "Real-Time Auction Platform",
    summary:
      "An online auction system where many users bid on the same item at once, built with Spring Boot, Redis and Vue.js.",
    role: "Project Leader / Team Lead — led the team and contributed to backend and frontend code.",
    organization: "Aibodia Co., Ltd",
    context:
      "Part of a group of auction, e-commerce, investment and payment-related applications. Bidding happens in real time, so several users can place bids on the same item within moments of each other.",
    challenges: [
      "Two bids for the same item can arrive at almost the same moment. If both read the current highest bid before either is saved, both can be accepted against a stale price, leaving the auction in an inconsistent state.",
      "Running more than one application instance means in-memory locking is not enough, because each instance only sees its own requests.",
      "Bid handling has to stay correct under load without making users wait on long-held locks.",
    ],
    contributions: {
      leadership: [
        "Led the development team and set technical direction for the auction work.",
        "Reviewed code and mentored developers.",
        "Troubleshot issues across backend and frontend.",
      ],
      implementation: [
        "Implemented bidding logic in Java Spring Boot.",
        "Applied Redis distributed locks and database transactions to bid placement.",
        "Built frontend features in Vue.js.",
      ],
    },
    technicalApproach: [
      "A Redis distributed lock serializes bid placement per item, so only one bid for that item is evaluated at a time across application instances.",
      "Inside the lock, the bid is validated against the current state and saved in a database transaction, so a failure leaves no partial update.",
      "Locking per item rather than globally means bids on different items do not wait for each other.",
    ],
    diagram: {
      caption:
        "Simplified flow of a single bid. Bids for the same item are handled one at a time; bids for different items proceed independently.",
      steps: [
        { label: "Bidder", detail: "Places a bid from the Vue.js client." },
        {
          label: "Bid service",
          detail: "A Spring Boot endpoint receives the bid.",
        },
        {
          label: "Redis lock",
          detail:
            "Acquires a distributed lock for that item. Other bids for the same item wait.",
        },
        {
          label: "Database transaction",
          detail:
            "Checks the bid against the current highest bid and saves it, or rolls back.",
        },
        {
          label: "Release",
          detail: "The lock is released and the next bid for the item runs.",
        },
      ],
    },
    outcomes: [],
    technologies: ["Java", "Spring Boot", "Redis", "Vue.js"],
    visibility: "private",
    featured: true,
    order: 1,
  },
  {
    slug: "general-insurance-platform",
    title: "General Core Insurance Platform",
    summary:
      "An enterprise general insurance platform where I led frontend development and contributed hands-on to implementing core insurance workflows using Angular, while coordinating technical requirements with backend teams and clients.",
    cardSummary:
      "Hands-on Angular frontend development and technical leadership for enterprise insurance workflows.",
    role: "Frontend Team Leader — led the frontend team and worked hands-on on the Angular frontend.",
    organization: "Ecoinsoft Solution Co., Ltd",
    context:
      "An enterprise general insurance platform supporting core insurance operations: underwriting requests, quotations, policy management, claims and endorsements.",
    challenges: [
      "Core insurance processes such as underwriting, quotations, policies, claims and endorsements carry many business rules, and the frontend has to reflect them accurately in forms and workflows.",
      "Requirements came from clients and had to be understood the same way by frontend developers, backend developers and the client before they could be built.",
      "A team of frontend developers needed consistent modules and components across a large application.",
    ],
    contributions: {
      leadership: [
        "Led and guided the frontend developers.",
        "Reviewed frontend implementations and supported technical problem-solving.",
        "Coordinated with backend developers to clarify business rules and integration requirements, and helped them understand the insurance workflows.",
        "Took part in client discussions, requirements clarification, troubleshooting and support.",
        "Oversaw frontend delivery for VMS and IAC reporting.",
      ],
      implementation: [
        "Implemented the core insurance frontend platform hands-on in Angular.",
        "Developed and maintained frontend modules, reusable components, forms and business workflows.",
        "Implemented frontend integration with the backend REST APIs.",
      ],
    },
    technicalApproach: [
      "The Angular application is organized into modules for the core insurance processes, built on shared, reusable components and forms.",
      "The frontend consumes the backend through REST APIs; business rules and integration details were clarified with the backend team before implementation.",
      "Requirements were clarified with clients first, then shared with both frontend and backend developers so each side built against the same understanding.",
    ],
    outcomes: [],
    technologies: ["Angular", "TypeScript", "REST APIs"],
    visibility: "private",
    featured: true,
    order: 2,
  },
  {
    slug: "petroleum-distribution-management",
    title: "Petroleum Distribution Management System",
    summary:
      "An enterprise petroleum distribution platform built with Next.js and Laravel, where I contribute to frontend and backend development, business analysis, and operational workflows.",
    cardSummary:
      "Enterprise petroleum operations platform with hands-on frontend and backend development, business analysis, and system integration.",
    role: "Freelance Software Engineer — full-stack development, with hands-on Next.js frontend and Laravel backend work.",
    organization: "Freelance",
    context:
      "An enterprise petroleum distribution management system supporting business operations across wholesale, retail, logistics and master data management.",
    challenges: [
      "Wholesale, retail and logistics each have their own rules but depend on the same master data, so modules have to stay consistent with each other.",
      "Business requirements had to be understood and agreed with stakeholders before they could become working features.",
    ],
    contributions: {
      leadership: [
        "Took part in business requirements analysis and discussions with stakeholders.",
        "Designed and refined user interfaces and interactive prototypes in Figma.",
        "Collaborated with stakeholders to turn business requirements into working features.",
      ],
      implementation: [
        "Develop the frontend hands-on with Next.js, React and TypeScript.",
        "Contribute hands-on to backend development with Laravel.",
        "Develop frontend features and integrate them with the backend APIs.",
        "Contribute to database design and application workflows.",
        "Work across the wholesale, retail, logistics and master data modules.",
      ],
    },
    technicalApproach: [
      "The frontend is built with Next.js, React and TypeScript and talks to a Laravel (PHP) backend through its APIs.",
      "Figma prototypes are used to agree on screens and flows with stakeholders before implementation.",
      "The application is organized into operational modules for wholesale, retail and logistics, alongside master data management.",
    ],
    outcomes: [],
    technologies: ["Next.js", "React", "TypeScript", "Laravel", "PHP", "Figma"],
    visibility: "private",
    featured: true,
    order: 3,
  },
  {
    slug: "enterprise-crm-platform",
    title: "Enterprise CRM Platform",
    summary:
      "Backend and frontend development and production support for a CRM built with Java Spring Boot and Vue.js.",
    role: "Senior Java Developer — backend and frontend development and production support.",
    organization: "YesCAR Cambodia",
    context:
      "A customer relationship management system for an automotive business.",
    challenges: [
      "CRM features span customer data, business rules and screens, so backend and frontend changes have to stay in step.",
      "Production issues needed quick diagnosis across backend and frontend.",
    ],
    contributions: {
      leadership: ["Worked with the business to clarify requirements."],
      implementation: [
        "Built backend services in Java Spring Boot.",
        "Built frontend features in Vue.js.",
        "Provided production support, maintenance and troubleshooting.",
      ],
    },
    technicalApproach: [
      "Features were delivered end to end: Spring Boot services together with the Vue.js screens that use them.",
      "The Vue.js frontend communicates with the Spring Boot backend through REST APIs.",
    ],
    outcomes: [],
    technologies: ["Java", "Spring Boot", "Vue.js", "REST APIs"],
    visibility: "private",
    featured: true,
    order: 4,
  },
];

export const privacyNote =
  "This is a professional project. Its code, data and client details are confidential, so it is described here at a general level, and there is no public repository or demo.";

export const projectsIntro =
  "These are professional projects built for employers and clients. Their source code, data and client details are confidential, so each case study describes my role and the technical approach at a general level, without repositories, demos or screenshots.";

export const selectedWorkNote =
  "Selected examples from professional work. They are not a complete list of the projects I have contributed to.";
