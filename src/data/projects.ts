export interface Project {
  slug: string;
  title: string;
  role: string;
  summary: string;
  /** Up to five shown on the homepage card. */
  featuredTech: string[];
  /** Full verified stack, shown on the case study. */
  tech: string[];
  /** Optional authorized, sanitized screenshot (16:9) in public/, e.g. 'projects/auction.webp'. Resolved with asset(). */
  image?: string;
  overview: string;
  challenge: string;
  myRole: string;
  /** Work done by others on the project, so it isn't read as mine. */
  team?: string;
  contributions: string[];
  approach: string;
  lessons: string;
}

// All projects are private professional work: no repository or demo links by design.
export const projects: Project[] = [
  {
    slug: 'petroleum-distribution',
    title: 'Petroleum Distribution Management System',
    role: 'Freelance Software Engineer — Frontend Development & Client Coordination',
    summary:
      'An enterprise petroleum distribution platform supporting wholesale, retail, logistics, and master data operations. Responsible for frontend development, client communication, requirements analysis, and UI/UX prototyping, while collaborating with a dedicated backend development team.',
    featuredTech: ['Next.js', 'React', 'TypeScript', 'Figma', 'REST APIs'],
    tech: ['Next.js', 'React', 'TypeScript', 'Figma', 'REST APIs', 'Laravel (backend team)'],
    overview:
      'A business platform supporting petroleum distribution operations, covering wholesale, retail, logistics, and master data.',
    challenge:
      'Distribution operations involve several connected business areas. Each workflow needs to reflect real operational rules while staying consistent with shared master data.',
    myRole:
      'Responsible for frontend implementation using Next.js, React, and TypeScript, communicating directly with clients to understand business requirements, creating Figma prototypes, and coordinating with backend developers to deliver integrated business workflows.',
    team: 'The Laravel backend, including its APIs and database, is implemented and maintained by a dedicated backend team.',
    contributions: [
      'Developed frontend features using Next.js, React, and TypeScript.',
      'Communicated with clients to gather and clarify business requirements.',
      'Created Figma prototypes and translated requirements into working interfaces.',
      'Integrated frontend modules with REST APIs.',
      'Coordinated with backend developers on API contracts and business rules.',
      'Contributed to wholesale, retail, logistics, and master data workflows.',
    ],
    approach:
      'Requirements are clarified with the client and prototyped in Figma before implementation. The Next.js frontend consumes REST APIs from the Laravel backend built by the backend team, with API contracts and business rules agreed together before integration.',
    lessons:
      'Close collaboration with stakeholders and early prototyping help align complex operational workflows before code is written.',
  },
  {
    slug: 'general-core-insurance',
    title: 'General Core Insurance Platform',
    role: 'Frontend Team Leader',
    summary:
      'An enterprise general insurance platform where I led frontend development and contributed hands-on to implementing core insurance workflows using Angular, while coordinating technical requirements with backend teams and clients.',
    featuredTech: ['Angular', 'TypeScript', 'REST APIs'],
    tech: ['Angular', 'TypeScript', 'REST APIs'],
    overview:
      'An enterprise general insurance system covering the core insurance lifecycle, from underwriting requests and quotations to policies, claims, and endorsements.',
    challenge:
      'Insurance workflows are rule-heavy and interconnected. The frontend needed to represent these processes clearly while staying aligned with backend services built by a separate team.',
    myRole:
      'Frontend Team Leader: implemented Angular features directly while guiding the frontend team and coordinating requirements with backend developers and clients. ',
    team: 'Backend services were built and owned by a separate backend team.',
    contributions: [
      'Hands-on Angular frontend development.',
      'Insurance modules and business workflows.',
      'Underwriting requests.',
      'Quotations.',
      'Policy management.',
      'Claims.',
      'Endorsements.',
      'Reusable frontend components.',
      'REST API integration.',
      'Frontend team leadership.',
      'Backend requirements coordination.',
      'Client communication and support.',
    ],
    approach:
      'Shared, reusable Angular components were used across modules, with each workflow integrated against backend REST APIs.',
    lessons:
      'Reusable components and clear communication between frontend, backend, and clients are essential in large, rule-heavy business domains.',
  },
  {
    slug: 'real-time-auction',
    title: 'Real-Time Auction & E-Commerce Platform',
    role: 'Project Leader / Team Lead',
    summary:
      'Developed and maintained a real-time auction and e-commerce platform using Java Spring Boot and Vue.js, supporting live bidding, concurrent transactions, and online shopping workflows.',
    featuredTech: ['Spring Boot', 'Vue.js', 'WebSocket', 'Redis', 'MySQL'],
    tech: ['Java', 'Spring Boot', 'Vue.js', 'Redis', 'MySQL', 'WebSocket', 'RabbitMQ', 'OneSignal', 'MyBatis'],
    overview:
      'An auction and e-commerce platform where many users can bid on the same item at the same time and see new bids as they happen. It includes customer-facing auction and shop interfaces and an admin dashboard.',
    challenge:
      'Concurrent bids on the same item must be accepted or rejected safely so the recorded winning bid stays consistent, while every watching user sees the change in real time.',
    myRole:
      'Project Leader / Team Lead with hands-on development across the Java Spring Boot backend and the Vue.js frontend.',
    team:
      'Built collaboratively with my development team. Alongside my own backend and frontend work, I led the team through code reviews, mentoring, and day-to-day technical coordination with developers. Integrations not listed under my contributions were delivered as a team effort.',
    contributions: [
      'Java Spring Boot backend development.',
      'Vue.js frontend development for auction participation and e-commerce.',
      'Real-time auction features.',
      'Redis distributed locking for concurrent bidding.',
      'Transactional bidding workflows to keep bid data consistent.',
      'MySQL query and backend API optimization.',
    ],
    approach:
      'Standard business operations go through REST APIs on a Java Spring Boot backend. Bids for the same item are serialized with a Redis distributed lock, and each accepted bid is written to MySQL through MyBatis inside a transaction so the stored result stays consistent. Accepted bids are pushed to connected clients over WebSocket. RabbitMQ handles asynchronous event processing outside the request flow, and OneSignal delivers push notifications to users. Vue.js powers the auction and e-commerce interfaces and the admin dashboard.',
    lessons:
      'Concurrency issues need to be designed for explicitly — locking and transaction boundaries are part of the business logic, not an afterthought.',
  },
  {
    slug: 'enterprise-crm',
    title: 'Enterprise CRM Platform',
    role: 'Senior Java Developer',
    summary:
      'An enterprise CRM application involving backend services, frontend development, API integration, and business workflow support.',
    featuredTech: ['Java', 'Spring Boot', 'Vue.js', 'REST APIs'],
    tech: ['Java', 'Spring Boot', 'Vue.js', 'REST APIs'],
    overview: 'A CRM application supporting customer-related business workflows.',
    challenge: 'Adding CRM features and keeping an existing business application stable and maintainable.',
    myRole: 'Senior Java Developer working on both backend services and the frontend.',
    team: 'Developed collaboratively as part of a development team, with my contributions spanning both backend and frontend.',
    contributions: [
      'Java Spring Boot backend development.',
      'Vue.js frontend development.',
      'REST API integration.',
      'Troubleshooting and maintenance.',
      'Supporting business workflows.',
    ],
    approach: 'Spring Boot backend services exposed through REST APIs and consumed by a Vue.js frontend.',
    lessons: 'Working across backend and frontend makes troubleshooting faster in business applications.',
  },
];

export const otherProjects: { title: string; description: string; url?: string }[] = [
  { title: 'Vessel Monitoring System', description: 'Frontend leadership (Ecoinsoft).' },
  { title: 'Insurance Reporting / IAC', description: 'Frontend leadership for insurance reporting (Ecoinsoft).', url: 'https://www.iac.org.kh/' },
  { title: 'E-commerce Frontend', description: 'React e-commerce frontend and reusable UI components (Aibodia).' },
  { title: 'Real Estate, CMS, and POS Systems', description: 'Java/Grails APIs and Angular interfaces (Ecoinsoft).' },
];

export const findProject = (slug: string) => projects.find((p) => p.slug === slug);
