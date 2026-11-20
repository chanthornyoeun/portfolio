import type { Profile } from "@/lib/types";

export const profile: Profile = {
  name: "Chanthorn Yoeun",
  shortName: "Chanthorn",
  title: "Senior Software Engineer",
  location: "Phnom Penh, Cambodia",
  yearsOfExperience: "7+",
  headline: "Building reliable software for complex business needs.",
  intro:
    "I'm Chanthorn, a software engineer with 7+ years of experience building enterprise applications, solving technical challenges, and guiding development teams.",
  about: [
    "I enjoy problems where the hard part is getting the details right, like two people bidding on the same item at the same moment, or an insurance workflow with many exceptions. I started in backend development with Java and Grails, moved into frontend work with Angular, and now work across the stack with Spring Boot, Vue.js and React.",
    "Most of my work has been in business-heavy domains: general insurance, CRM, e-commerce, online auctions and petroleum distribution. I try to understand how the business actually works before deciding how the software should, and I'm often the one translating requirements between clients and developers.",
    "I have led frontend teams and project teams, and I still write code. I review pull requests, mentor developers, and make sure the team understands the business rules behind what it builds.",
    "I keep learning by building, whether that's a newer framework like Next.js or NestJS or AI-assisted development tools.",
  ],
  contactHeading: "Let's connect.",
  contactNote:
    "Interested in discussing software engineering opportunities, technical challenges, or potential collaborations? Feel free to reach out.",
  // Primary contact. Set a real address to show the email link, e.g. email: "name@example.com",
  // Optional portrait (real photo only), e.g. after adding src/assets/portrait.webp:
  //   import portrait from "@/assets/portrait.webp";  ...  photo: { src: portrait, alt: "Chanthorn Yoeun" },
  links: [
    { label: "GitHub", href: "https://github.com/chanthornyoeun" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/chanthornyoeun/" },
  ],
  education: [
    {
      institution: "Norton University",
      location: "Cambodia",
      program: "Computer Science studies",
      start: 2016,
      end: 2020,
    },
  ],
  languages: [
    { name: "Khmer", level: "Native" },
    { name: "English", level: "Intermediate" },
  ],
};
