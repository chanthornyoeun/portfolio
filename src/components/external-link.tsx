import { ArrowUpRight } from "lucide-react";

/**
 * Link to one of the owner's external profiles. Opens in the same tab (no
 * surprise new windows); the arrow marks it visually and the hidden text for
 * screen readers. rel="me" ties the profiles to this site.
 */
export function ExternalLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a href={href} rel="me" className={className}>
      {label}
      <ArrowUpRight className="size-4" aria-hidden />
      <span className="sr-only"> (external site)</span>
    </a>
  );
}
