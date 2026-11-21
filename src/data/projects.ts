export interface Project {
  slug: string;
  title: string;
  role: string;
  summary: string;
  tech: string[];
  /** Optional authorized, sanitized screenshot (16:9) in public/, e.g. 'projects/auction.webp'. Resolved with asset(). */
  image?: string;
  overview: string;
  challenge: string;
  myRole: string;
  contributions: string[];
  approach: string;
  lessons: string;
}

// All projects are private professional work: no repository or demo links by design.
export const projects: Project[] = [
  {
    slug: 'petroleum-distribution',
    title: 'Petroleum Distribution Management System',
    role: 'Freelance Software Engineer / Full-Stack Development',
    summary:
      'An enterprise petroleum distribution platform built with Next.js and Laravel, where I contribute to frontend and backend development, business analysis, and operational workflows.',
    tech: ['Next.js', 'React', 'TypeScript', 'Laravel', 'Figma'],
    overview:
      'A business platform supporting petroleum distribution operations, covering wholesale, retail, logistics, and master data.',
    challenge:
      'Distribution operations involve several connected business areas. Each workflow needs to reflect real operational rules while staying consistent with shared master data.',
    myRole:
      'Freelance software engineer working across the stack — from requirements and UI prototypes to frontend and backend implementation.',
    contributions: [
      'Hands-on frontend implementation using Next.js.',
      'Hands-on Laravel backend development.',
      'API integration.',
      'Figma prototyping.',
      'Database design.',
      'Business requirements analysis.',
      'Wholesale, retail, logistics, and master data workflows.',
      'Stakeholder collaboration.',
    ],
    approach:
      'Requirements are clarified with stakeholders and prototyped in Figma before implementation. The Next.js frontend communicates with a Laravel backend through REST APIs.',
    lessons:
      'Close collaboration with stakeholders and early prototyping help align complex operational workflows before code is written.',
  },
  {
    slug: 'general-core-insurance',
    title: 'General Core Insurance Platform',
    role: 'Frontend Team Leader',
    summary:
      'An enterprise general insurance platform where I led frontend development and contributed hands-on to implementing core insurance workflows using Angular, while coordinating technical requirements with backend teams and clients.',
    tech: ['Angular', 'TypeScript', 'REST APIs'],
    overview:
      'An enterprise general insurance system covering the core insurance lifecycle, from underwriting requests and quotations to policies, claims, and endorsements.',
    challenge:
      'Insurance workflows are rule-heavy and interconnected. The frontend needed to represent these processes clearly while staying aligned with backend services built by a separate team.',
    myRole:
      'Frontend Team Leader: implemented Angular features directly while guiding the frontend team and coordinating requirements with backend developers and clients. Backend services were owned by the backend team.',
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
    role: 'Project Leader / Developer',
    summary:
      'Developed and maintained a real-time auction and e-commerce platform using Java Spring Boot and Vue.js, supporting live bidding, concurrent transactions, and online shopping workflows.',
    // Card shows the first five, then "etc."; the case study shows all.
    tech: ['Java', 'Spring Boot', 'Vue.js', 'Redis', 'MySQL', 'WebSocket', 'RabbitMQ', 'OneSignal', 'MyBatis'],
    overview:
      'An auction and e-commerce platform where many users can bid on the same item at the same time and see new bids as they happen. It includes customer-facing auction and shop interfaces and an admin dashboard.',
    challenge:
      'Concurrent bids on the same item must be accepted or rejected safely so the recorded winning bid stays consistent, while every watching user sees the change in real time.',
    myRole: 'Project Leader and developer: technical leadership and mentoring alongside hands-on backend and frontend work.',
    contributions: [
      'Implemented real-time bidding features and live auction updates using WebSocket.',
      'Used Redis distributed locking to manage concurrent bids and prevent duplicate processing.',
      'Implemented transactional bidding workflows to maintain data consistency.',
      'Optimized MySQL queries and backend APIs for auction operations.',
      'Integrated asynchronous messaging and notifications using RabbitMQ and OneSignal.',
      'Developed and maintained frontend features for auction participation and e-commerce.',
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
    tech: ['Java', 'Spring Boot', 'Vue.js', 'REST APIs'],
    overview: 'A CRM application supporting customer-related business workflows.',
    challenge: 'Adding CRM features and keeping an existing business application stable and maintainable.',
    myRole: 'Senior Java Developer working on both backend services and the frontend.',
    contributions: [
      'Backend development.',
      'Frontend development.',
      'REST API integration.',
      'Troubleshooting.',
      'Business application maintenance.',
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
