import { Container } from "./container";

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="border-border border-t py-16 sm:py-24"
    >
      <Container>
        <h2
          id={`${id}-heading`}
          className="text-fg-muted mb-10 font-mono text-sm font-medium tracking-wide uppercase"
        >
          {title}
        </h2>
        {children}
      </Container>
    </section>
  );
}
