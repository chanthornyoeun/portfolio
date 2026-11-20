import { ArrowDown } from "lucide-react";
import type { ProjectDiagram } from "@/lib/types";

/** A sanitized step-by-step flow, rendered as an ordered list so it reads correctly to screen readers. */
export function FlowDiagram({ diagram }: { diagram: ProjectDiagram }) {
  return (
    <figure className="mt-6">
      <ol className="space-y-0">
        {diagram.steps.map((step, i) => (
          <li key={step.label}>
            <div className="border-border bg-bg-subtle rounded-md border px-4 py-3">
              <p className="font-mono text-sm font-medium">
                <span className="text-fg-muted">{i + 1}.</span> {step.label}
              </p>
              <p className="text-fg-muted mt-0.5 text-sm">{step.detail}</p>
            </div>
            {i < diagram.steps.length - 1 && (
              <ArrowDown
                className="text-fg-muted mx-auto my-1.5 size-4"
                aria-hidden
              />
            )}
          </li>
        ))}
      </ol>
      <figcaption className="text-fg-muted mt-3 text-sm">
        <span className="text-fg font-medium">Conceptual diagram.</span>{" "}
        {diagram.caption} Simplified for illustration; it does not show the
        production architecture.
      </figcaption>
    </figure>
  );
}
