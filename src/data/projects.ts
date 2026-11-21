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
    title: 'YesCAR — Customer Relationship Management System',
    role: 'Senior Java Developer',
    summary:
      'Developed and maintained a CRM platform that digitized customer management, sales leads, and reporting. Contributed to backend and frontend development, resolved a production N+1 query performance issue, and implemented large-volume data exports.',
    featuredTech: ['Java', 'Spring Boot', 'Spring Data JPA', 'Vue.js', 'REST APIs'],
    tech: ['Java', 'Spring Boot', 'Spring Data JPA', 'Vue.js', 'REST APIs'],
    overview:
      'The YesCAR CRM platform replaced manual paperwork with digital workflows for managing customer information, sales leads, customer relationships, and sales reports.',
    // Paragraphs are separated by a blank line ("\n\n").
    challenge:
      'After deployment to production, growing customer data exposed an N+1 query problem in an existing customer phone number update workflow. The original implementation fetched records, evaluated matching conditions in application memory, and performed repeated database operations, creating a performance bottleneck. Non-unique customer names and phone numbers also complicated identifying the intended records without changing unrelated ones.\n\nExporting thousands of CRM records for reporting and business operations was a second engineering challenge.',
    myRole:
      'As a Senior Java Developer, I worked on Java Spring Boot backend services, Spring Data JPA persistence, Vue.js frontend features, and REST API integration. I also investigated and resolved the production N+1 query issue and implemented large-volume CRM data exports.',
    team:
      'The CRM was developed collaboratively by a development team. The customer phone number update feature had been implemented before I took ownership of its performance issue. I investigated and optimized that workflow while contributing to backend, frontend, and export functionality.',
    contributions: [
      'Developed backend services using Java and Spring Boot.',
      'Used Spring Data JPA for database access and persistence.',
      'Developed Vue.js frontend functionality and integrated REST APIs.',
      'Supported customer, lead, and sales reporting workflows.',
      'Investigated a production N+1 query problem in an existing customer update feature.',
      'Identified inefficient application-level record fetching and repeated database operations.',
      'Replaced the affected workflow with direct conditional database updates.',
      'Eliminated unnecessary in-memory record checking and the N+1 query pattern.',
      'Implemented data exports involving thousands of CRM records.',
      'Supported troubleshooting and maintenance.',
    ],
    approach:
      'The CRM uses Java Spring Boot backend services with Spring Data JPA for data access, exposing REST APIs consumed by a Vue.js frontend.\n\nSet-based update optimization: I investigated the production bottleneck and replaced the application-level processing with direct conditional database updates. The database now evaluates the matching conditions and updates the intended records itself, which eliminated the N+1 query pattern in the affected workflow, avoided loading records into application memory, and removed unnecessary database round trips. Because customer names and phone numbers are not unique, the update conditions still had to be defined carefully to target only the intended records. The result resolved a production performance bottleneck and improved the efficiency and scalability of customer information updates.\n\nLarge-volume export: I implemented CRM data export functionality capable of handling thousands of records to support business reporting and operational needs.',
    lessons:
      'Performance problems in enterprise applications may only become visible under real production data volumes. ORM query behavior and application-level record processing need careful attention, especially with growing datasets and non-unique customer information. Direct database operations can significantly simplify inefficient workflows.',
  },
];

export const otherProjects: { title: string; description: string; url?: string }[] = [
  { title: 'Vessel Monitoring System', description: 'Frontend leadership (Ecoinsoft).' },
  { title: 'Insurance Reporting / IAC', description: 'Frontend leadership for insurance reporting (Ecoinsoft).', url: 'https://www.iac.org.kh/' },
  { title: 'E-commerce Frontend', description: 'React e-commerce frontend and reusable UI components (Aibodia).' },
  { title: 'Real Estate, CMS, and POS Systems', description: 'Java/Grails APIs and Angular interfaces (Ecoinsoft).' },
];

export const findProject = (slug: string) => projects.find((p) => p.slug === slug);
