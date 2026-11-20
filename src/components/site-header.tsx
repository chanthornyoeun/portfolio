import Link from "next/link";
import { navigation } from "@/content/navigation";
import { profile } from "@/content/profile";
import { Container } from "./container";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header
      data-print-hidden
      className="border-border bg-bg sticky top-0 z-40 border-b"
    >
      <Container className="relative flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="hover:text-accent font-semibold tracking-tight transition-colors"
        >
          {profile.name}.
        </Link>
        <div className="flex items-center gap-1">
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-fg-muted hover:text-fg inline-flex h-11 items-center px-3 text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
          <MobileNav items={navigation} />
        </div>
      </Container>
    </header>
  );
}
