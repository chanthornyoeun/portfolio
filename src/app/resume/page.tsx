import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { SkillGroups } from "@/components/skill-groups";
import { profile } from "@/content/profile";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.name}, ${profile.title} in ${profile.location}.`,
  alternates: { canonical: absoluteUrl("/resume/") },
};

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border border-t py-10">
      <h2 className="text-fg-muted mb-6 font-mono text-sm font-medium tracking-wide uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ResumePage() {
  return (
    <Container className="py-16 sm:py-20">
      <header className="pb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {profile.name}
        </h1>
        <p className="text-fg-muted mt-2">
          {profile.title} · {profile.location}
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-5 text-sm">
          {profile.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-accent inline-flex min-h-11 items-center hover:underline"
              >
                {link.href
                  .replace(/^https:\/\/(www\.)?/, "")
                  .replace(/\/$/, "")}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-[70ch]">{profile.intro}</p>
      </header>

      <ResumeSection title="Experience">
        <ExperienceTimeline showDetails />
      </ResumeSection>

      <ResumeSection title="Skills">
        <SkillGroups />
      </ResumeSection>

      <ResumeSection title="Education">
        {profile.education.map((e) => (
          <div
            key={e.institution}
            className="flex flex-col gap-x-4 sm:flex-row sm:justify-between"
          >
            <p>
              <span className="font-semibold">{e.program}</span>,{" "}
              {e.institution}, {e.location}
            </p>
            <p className="text-fg-muted font-mono text-sm">
              {e.start} – {e.end}
            </p>
          </div>
        ))}
      </ResumeSection>

      <ResumeSection title="Languages">
        <ul className="space-y-1">
          {profile.languages.map((l) => (
            <li key={l.name}>
              {l.name} <span className="text-fg-muted">— {l.level}</span>
            </li>
          ))}
        </ul>
      </ResumeSection>
    </Container>
  );
}
