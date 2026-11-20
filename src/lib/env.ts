type Env = Record<string, string | undefined>;

const LOCAL_URL = "http://localhost:3000";

/**
 * Public URL of the site, including the GitHub Pages repository path if any:
 * "https://user.github.io/repo" (project site) or "https://example.com" (custom domain).
 */
export function resolveSiteUrl(env: Env): string {
  return (env.NEXT_PUBLIC_SITE_URL || LOCAL_URL).replace(/\/+$/, "");
}

/** Next.js basePath derived from the site URL: "" or "/repo". */
export function resolveBasePath(env: Env): string {
  return new URL(resolveSiteUrl(env)).pathname.replace(/\/+$/, "");
}

/** Returns human-readable problems; empty means the environment is valid. */
export function validateEnv(env: Env): string[] {
  const errors: string[] = [];
  const isProduction = env.DEPLOY_ENV === "production";
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  if (siteUrl) {
    let parsed: URL | undefined;
    try {
      parsed = new URL(siteUrl);
    } catch {
      errors.push(`NEXT_PUBLIC_SITE_URL is not a valid URL: "${siteUrl}"`);
    }
    if (parsed && !["http:", "https:"].includes(parsed.protocol)) {
      errors.push("NEXT_PUBLIC_SITE_URL must use http or https.");
    }
    if (parsed && (parsed.search || parsed.hash)) {
      errors.push("NEXT_PUBLIC_SITE_URL must not contain a query or hash.");
    }
    if (parsed && isProduction && parsed.protocol !== "https:") {
      errors.push("NEXT_PUBLIC_SITE_URL must use https in production.");
    }
    if (parsed && isProduction && /^(localhost|127\.)/.test(parsed.hostname)) {
      errors.push("NEXT_PUBLIC_SITE_URL cannot be localhost in production.");
    }
  } else if (isProduction) {
    errors.push(
      "NEXT_PUBLIC_SITE_URL is required for production builds (e.g. https://user.github.io/repo).",
    );
  }

  // Everything in a static export is public; secrets must never be build inputs.
  for (const name of Object.keys(env)) {
    if (
      name.startsWith("NEXT_PUBLIC_") &&
      /KEY|SECRET|TOKEN|PASSWORD/.test(name)
    ) {
      errors.push(
        `${name} looks like a secret, but NEXT_PUBLIC_ values are published in the static site. Remove it.`,
      );
    }
  }

  return errors;
}
