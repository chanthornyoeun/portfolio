import { experience } from "@/content/experience";
import { formatPeriod, groupByCompany } from "@/lib/content";

/** Compact timeline: one entry per company, separate roles kept as rows. */
export function ExperienceTimeline({
  showDetails = false,
}: {
  showDetails?: boolean;
}) {
  return (
    <ol className="border-border space-y-10 border-l">
      {groupByCompany(experience).map((group) => (
        <li
          key={`${group.company}-${group.roles[0]?.start}`}
          className="relative pl-6"
        >
          <span
            className="border-bg bg-accent absolute top-2 -left-[5px] size-[9px] rounded-full border-2"
            aria-hidden
          />
          <h3 className="font-semibold tracking-tight">{group.company}</h3>
          <ul className="mt-2 space-y-4">
            {group.roles.map((role) => (
              <li key={role.start}>
                <div className="flex flex-col gap-x-4 sm:flex-row sm:items-baseline sm:justify-between">
                  <p>{role.title}</p>
                  <p className="text-fg-muted shrink-0 font-mono text-sm">
                    {formatPeriod(role.start, role.end)}
                  </p>
                </div>
                {showDetails && (
                  <ul className="text-fg-muted mt-2 list-disc space-y-1 pl-5">
                    {role.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
