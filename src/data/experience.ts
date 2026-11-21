export interface Role {
  title: string;
  company: string;
  period: string;
  project?: string;
  points: string[];
}

export const experience: Role[] = [
  {
    title: 'Freelance Software Engineer',
    company: 'Freelance',
    period: 'January 2026 – Present',
    project: 'Petroleum Distribution Management System',
    points: [
      'Hands-on frontend development using Next.js, React, and TypeScript.',
      'Backend development using Laravel (PHP).',
      'REST API integration.',
      'Business requirements analysis and Figma UI/UX prototyping.',
      'Database design and enterprise application development.',
      'Stakeholder collaboration across wholesale, retail, logistics, and master data.',
    ],
  },
  {
    title: 'Project Leader / Team Lead',
    company: 'Aibodia Co., Ltd',
    period: 'November 2024 – December 2025',
    points: [
      'Technical leadership and mentoring.',
      'Hands-on backend and frontend development with Java Spring Boot and Vue.js.',
      'Real-time auction systems using Redis distributed locking.',
      'Database transactions and concurrency handling.',
      'API and SQL optimization.',
      'Code reviews and technical coordination.',
    ],
  },
  {
    title: 'Senior Frontend Developer',
    company: 'Aibodia Co., Ltd',
    period: 'August 2024 – October 2024',
    points: [
      'React e-commerce frontend development.',
      'API integration.',
      'Reusable UI components.',
      'Frontend troubleshooting and improvements.',
    ],
  },
  {
    title: 'Senior Java Developer',
    company: 'YesCAR Cambodia',
    period: 'January 2024 – June 2024',
    points: [
      'Java Spring Boot backend development.',
      'Vue.js frontend development.',
      'CRM features and REST API integration.',
      'Technical troubleshooting and support.',
    ],
  },
  {
    title: 'Frontend Team Leader',
    company: 'Ecoinsoft Solution Co., Ltd',
    period: 'March 2020 – September 2023',
    points: [
      'Hands-on Angular frontend implementation for General Core Insurance.',
      'Development of core insurance modules and workflows.',
      'Reusable frontend components and API integration.',
      'Frontend architecture and technical guidance.',
      'Leadership and mentoring of frontend developers.',
      'Coordination with backend developers on business requirements.',
      'Client communication and technical support.',
      'Frontend leadership on the Vessel Monitoring System and Insurance Reporting projects.',
    ],
  },
  {
    title: 'Frontend Developer',
    company: 'Ecoinsoft Solution Co., Ltd',
    period: 'November 2019 – February 2020',
    points: [
      'Angular frontend development.',
      'General Insurance, CRM, real estate, and POS interfaces.',
      'API integration and frontend maintenance.',
    ],
  },
  {
    title: 'Backend Developer',
    company: 'Ecoinsoft Solution Co., Ltd',
    period: 'December 2018 – October 2019',
    points: [
      'Java/Grails REST API development.',
      'Real estate and CMS applications.',
      'POS back-office systems.',
      'Database queries and SQL optimization.',
    ],
  },
];
