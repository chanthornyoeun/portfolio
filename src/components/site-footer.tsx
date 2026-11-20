import { profile } from "@/content/profile";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer data-print-hidden className="border-border border-t py-10">
      <Container className="text-fg-muted flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <ul className="flex gap-5">
          {profile.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                rel="me"
                className="hover:text-fg inline-flex min-h-6 items-center transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
