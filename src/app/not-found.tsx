import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="py-24 sm:py-32">
      <p className="text-fg-muted font-mono text-sm">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="text-fg-muted mt-4 max-w-[60ch]">
        The page you are looking for does not exist or has moved.
      </p>
      <ul className="mt-8 flex flex-wrap gap-x-6">
        <li>
          <Link
            href="/"
            className="text-accent inline-flex min-h-11 items-center hover:underline"
          >
            Go to the homepage
          </Link>
        </li>
        <li>
          <Link
            href="/projects"
            className="text-accent inline-flex min-h-11 items-center hover:underline"
          >
            View selected projects
          </Link>
        </li>
      </ul>
    </Container>
  );
}
