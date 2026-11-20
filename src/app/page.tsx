import { ArrowRight, Mail } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { ExternalLink } from "@/components/external-link";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { ProjectList } from "@/components/project-list";
import { Section } from "@/components/section";
import { SkillGroups } from "@/components/skill-groups";
import { profile } from "@/content/profile";
import { selectedWorkNote } from "@/content/projects";
import { getFeaturedProjects, isValidEmail } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: absoluteUrl("/"),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Phnom Penh",
    addressCountry: "KH",
  },
  sameAs: profile.links.map((l) => l.href),
  knowsLanguage: profile.languages.map((l) => l.name),
  ...(isValidEmail(profile.email) && { email: `mailto:${profile.email}` }),
};

const primaryButton =
  "bg-accent text-accent-fg inline-flex min-h-11 items-center gap-2 rounded-md px-5 text-sm font-medium transition-opacity hover:opacity-90";
const secondaryButton =
  "border-border hover:bg-bg-subtle inline-flex min-h-11 items-center rounded-md border px-5 text-sm font-medium transition-colors";
const textLink =
  "text-fg-muted hover:text-accent inline-flex min-h-11 items-center gap-1 text-sm font-medium transition-colors";

export default function Home() {
  const email = isValidEmail(profile.email) ? profile.email : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so content can never close the script tag.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Container className="flex flex-col-reverse gap-6 py-20 sm:flex-row sm:items-start sm:justify-between sm:gap-12 sm:py-28">
        <div className="min-w-0">
          <p className="text-fg-muted font-mono text-sm">
            {profile.title} · {profile.location}
          </p>
          <h1 className="mt-4 text-[2rem] leading-[1.15] font-semibold tracking-tight text-balance sm:max-w-[20ch] sm:text-5xl">
            {profile.headline}
          </h1>
          <p className="text-fg-muted mt-6 max-w-[60ch] text-lg">
            {profile.intro}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3">
            <Link href="#work" className={primaryButton}>
              Explore My Work
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/resume" className={secondaryButton}>
              View Resume
            </Link>
            <span className="flex gap-5 sm:ml-3">
              {profile.links.map((link) => (
                <ExternalLink key={link.href} {...link} className={textLink} />
              ))}
            </span>
          </div>
        </div>
        {/* Optional real portrait: small above the text on mobile, beside it on desktop. */}
        {profile.photo && (
          <Image
            src={profile.photo.src}
            alt={profile.photo.alt}
            loading="eager"
            sizes="(min-width: 640px) 160px, 72px"
            className="border-border size-18 shrink-0 rounded-full border object-cover sm:size-40"
          />
        )}
      </Container>

      <Section id="work" title="Selected Work">
        <p className="text-fg-muted mb-6 max-w-[70ch]">{selectedWorkNote}</p>
        <ProjectList projects={getFeaturedProjects()} />
      </Section>

      <Section id="experience" title="Experience">
        <ExperienceTimeline />
        <Link href="/resume" className={`${textLink} mt-8`}>
          Full details on the resume
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>

      <Section id="expertise" title="Expertise">
        <SkillGroups />
      </Section>

      <Section id="about" title="About">
        <div className="max-w-[65ch] space-y-5 text-lg">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section id="contact" title="Contact">
        <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {profile.contactHeading}
        </h3>
        <p className="text-fg-muted mt-4 max-w-[60ch] text-lg">
          {profile.contactNote}
        </p>
        <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          {/* Email is the primary action, shown only once a real address is configured. */}
          {email && (
            <li>
              <a href={`mailto:${email}`} className={primaryButton}>
                <Mail className="size-4" aria-hidden />
                Email {email}
              </a>
            </li>
          )}
          {profile.links.map((link) => (
            <li key={link.href}>
              <ExternalLink {...link} className={textLink} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
