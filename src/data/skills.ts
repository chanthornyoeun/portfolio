export interface SkillGroup {
  category: string;
  /** Core technologies, shown first and emphasized. */
  core: string[];
  other: string[];
}

export const skills: SkillGroup[] = [
  { category: 'Backend Engineering', core: ['Java', 'Spring Boot', 'Laravel', 'Go', 'Node.js'], other: ['Spring Framework', 'Grails', 'PHP', 'NestJS', 'REST APIs'] },
  { category: 'Frontend Engineering', core: ['TypeScript', 'React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Angular'], other: ['JavaScript'] },
  { category: 'Databases and Caching', core: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'], other: ['MariaDB', 'SQL Server'] },
  { category: 'Cloud and DevOps', core: ['Docker', 'Linux', 'Nginx'], other: ['AWS EC2', 'AWS S3', 'DigitalOcean', 'Apache Tomcat'] },
  {
    category: 'Software Engineering',
    core: [],
    other: ['System Design', 'MVC', 'SOLID', 'Design Patterns', 'Microservices', 'Concurrency Control', 'Database Transactions', 'SQL Optimization', 'API Performance'],
  },
  { category: 'Leadership', core: [], other: ['Technical Leadership', 'Mentoring', 'Code Review', 'Business Analysis', 'Requirements Gathering', 'Client Communication'] },
  { category: 'Development Tools', core: [], other: ['Git', 'GitHub', 'GitLab', 'Bitbucket', 'Postman', 'Swagger/OpenAPI'] },
  { category: 'AI-Assisted Development', core: [], other: ['OpenAI Codex', 'Claude Code', 'GitHub Copilot', 'ChatGPT'] },
];
