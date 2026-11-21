/** Primary vs supporting is a presentation choice, not a proficiency ranking. */
export interface SkillGroup {
  category: string;
  primary: string[];
  supporting: string[];
  /** Optional labelled sub-list, e.g. AI-assisted tools under Development Tools. */
  subgroup?: { label: string; items: string[] };
}

export const skills: SkillGroup[] = [
  { category: 'Backend Engineering', primary: ['Java', 'Spring Boot', 'Laravel', 'Go', 'Node.js'], supporting: ['Spring Framework', 'Grails', 'PHP', 'NestJS', 'REST APIs'] },
  { category: 'Frontend Engineering', primary: ['TypeScript', 'React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Angular'], supporting: ['JavaScript'] },
  { category: 'Databases & Caching', primary: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'], supporting: ['MariaDB', 'SQL Server'] },
  { category: 'Cloud & DevOps', primary: ['Docker', 'Linux', 'Nginx'], supporting: ['AWS EC2', 'AWS S3', 'DigitalOcean', 'Apache Tomcat'] },
  {
    category: 'Software Engineering',
    primary: [],
    supporting: ['System Design', 'MVC', 'SOLID', 'Design Patterns', 'Microservices', 'Concurrency Control', 'Database Transactions', 'SQL Optimization', 'API Performance'],
  },
  {
    category: 'Leadership',
    primary: [],
    supporting: ['Technical Leadership', 'Mentoring', 'Code Review', 'Business Analysis', 'Requirements Gathering', 'Client Communication'],
  },
  {
    category: 'Development Tools',
    primary: [],
    supporting: ['Git', 'GitHub', 'GitLab', 'Bitbucket', 'Postman', 'Swagger/OpenAPI'],
    subgroup: { label: 'AI-assisted', items: ['OpenAI Codex', 'Claude Code', 'GitHub Copilot', 'ChatGPT'] },
  },
];
