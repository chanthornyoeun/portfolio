// Resolves a file in public/ against the Vite base path (/portfolio_v1/ on GitHub Pages).
// `?.` keeps this importable from Node tests, where import.meta.env is undefined.
export const asset = (file: string) => (file ? `${import.meta.env?.BASE_URL ?? '/'}${file.replace(/^\//, '')}` : '');

export const profile = {
  name: 'Chanthorn Yoeun',
  title: 'Senior Software Engineer',
  location: 'Phnom Penh, Cambodia',
  headline: 'Building reliable software for complex business needs.',
  intro:
    "I'm Chanthorn, a software engineer with 7+ years of experience building enterprise applications, solving technical challenges, and guiding development teams.",
  about: [
    "Over the past 7+ years I've worked across backend and frontend engineering, mostly on enterprise applications such as insurance, distribution, auction, and CRM systems.",
    "Alongside hands-on development, I've led frontend and project teams — mentoring developers, reviewing code, and working with clients and stakeholders to turn business requirements into working software.",
    'I care most about software that is reliable and maintainable: clear data models, careful handling of transactions and concurrency, and code that the next developer can understand.',
  ],
  education: {
    title: 'Computer Science Studies',
    school: 'Norton University, Cambodia',
    period: '2016–2020',
  },
  languages: [
    { name: 'Khmer', level: 'Native' },
    { name: 'English', level: 'Intermediate' },
  ],
  // Empty values hide the related links and buttons.
  email: 'chanthorn.developer@gmail.com',
  // CV: add the PDF as public/resume.pdf, then set resumeUrl: asset('resume.pdf').
  // While empty, the Resume nav link and hero button stay hidden.
  resumeUrl: asset(''),
  // Portrait: add a real photo (square, ~400x400 WebP) as public/portrait.webp, then set portrait: asset('portrait.webp').
  portrait: asset(''),
  github: 'https://github.com/chanthornyoeun',
  linkedin: 'https://www.linkedin.com/in/chanthornyoeun/',
};
