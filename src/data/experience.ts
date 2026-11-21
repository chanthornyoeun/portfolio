/** Year and month, e.g. '2024-11'. `null` end date means the role is current. */
type YearMonth = `${number}-${number}`;

export interface Role {
  title: string;
  startDate: YearMonth;
  endDate: YearMonth | null;
  project?: string;
  highlights: string[];
}

export interface ExperienceGroup {
  company: string;
  /** Newest role first. */
  roles: Role[];
}

export const experience: ExperienceGroup[] = [
  {
    company: 'Freelance',
    roles: [
      {
        title: 'Freelance Software Engineer',
        startDate: '2026-01',
        endDate: null,
        project: 'Petroleum Distribution Management System',
        highlights: [
          'Hands-on frontend development with Next.js, React, and TypeScript.',
          'Laravel (PHP) backend development, REST API integration, and database design.',
          'Business requirements analysis and Figma UI/UX prototyping with stakeholders.',
          'Enterprise workflows across wholesale, retail, logistics, and master data.',
        ],
      },
    ],
  },
  {
    company: 'Aibodia Co., Ltd',
    roles: [
      {
        title: 'Project Leader / Team Lead',
        startDate: '2024-11',
        endDate: '2025-12',
        highlights: [
          'Hands-on backend and frontend development with Java Spring Boot and Vue.js.',
          'Real-time auction features using Redis distributed locking.',
          'Database transactions, concurrency handling, and API and SQL optimization.',
          'Technical leadership, mentoring, code reviews, and technical coordination.',
        ],
      },
      {
        title: 'Senior Frontend Developer',
        startDate: '2024-08',
        endDate: '2024-10',
        highlights: ['React e-commerce frontend development and API integration.', 'Reusable UI components, troubleshooting, and improvements.'],
      },
    ],
  },
  {
    company: 'YesCAR Cambodia',
    roles: [
      {
        title: 'Senior Java Developer',
        startDate: '2024-01',
        endDate: '2024-06',
        highlights: [
          'Java Spring Boot backend development.',
          'Vue.js frontend development, CRM features, and REST API integration.',
          'Technical troubleshooting and support.',
        ],
      },
    ],
  },
  {
    company: 'Ecoinsoft Solution Co., Ltd',
    roles: [
      {
        title: 'Frontend Team Leader',
        startDate: '2020-03',
        endDate: '2023-09',
        highlights: [
          'Hands-on Angular implementation of core General Insurance modules and workflows.',
          'Reusable frontend components, API integration, and frontend architecture.',
          'Led and mentored frontend developers, including on the Vessel Monitoring System and Insurance Reporting projects.',
          'Coordinated business requirements with backend developers and supported clients.',
        ],
      },
      {
        title: 'Frontend Developer',
        startDate: '2019-11',
        endDate: '2020-02',
        highlights: ['Angular interfaces for General Insurance, CRM, real estate, and POS systems.', 'API integration and frontend maintenance.'],
      },
      {
        title: 'Backend Developer',
        startDate: '2018-12',
        endDate: '2019-10',
        highlights: ['Java/Grails REST APIs for real estate, CMS, and POS back-office systems.', 'Database queries and SQL optimization.'],
      },
    ],
  },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const parse = (ym: YearMonth) => {
  const [y, m] = ym.split('-').map(Number);
  return { y, m };
};

export const formatMonth = (ym: YearMonth | null) => {
  if (!ym) return 'Present';
  const { y, m } = parse(ym);
  return `${MONTHS[m - 1]} ${y}`;
};

export const formatPeriod = (start: YearMonth, end: YearMonth | null) => `${formatMonth(start)} – ${formatMonth(end)}`;

/** Company period: earliest start to latest end (null = still there). Gaps between roles are not filled in. */
export function companyPeriod(group: ExperienceGroup) {
  const starts = group.roles.map((r) => r.startDate).sort();
  const ends = group.roles.map((r) => r.endDate);
  const end = ends.includes(null) ? null : (ends as YearMonth[]).sort().at(-1)!;
  return { start: starts[0], end };
}

/** Inclusive month count, e.g. Aug 2024 – Dec 2025 = 17 months. */
export function monthsBetween(start: YearMonth, end: YearMonth | null, now = new Date()) {
  const s = parse(start);
  const e = end ? parse(end) : { y: now.getFullYear(), m: now.getMonth() + 1 };
  return (e.y - s.y) * 12 + (e.m - s.m) + 1;
}

export function formatDuration(months: number) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const part = (n: number, unit: string) => (n ? `${n} ${unit}${n > 1 ? 's' : ''}` : '');
  return [part(y, 'yr'), part(m, 'mo')].filter(Boolean).join(' ') || '1 mo';
}
