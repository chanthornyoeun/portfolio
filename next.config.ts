import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { resolveBasePath, validateEnv } from "./src/lib/env";

// GitHub Pages is static hosting: no server, no runtime env, no custom headers.
const nextConfig: NextConfig = {
  output: "export",
  // "/repo" for https://user.github.io/repo, "" for a custom domain or user site.
  basePath: resolveBasePath(process.env),
  // /projects/x/ is exported as projects/x/index.html, which Pages serves directly.
  trailingSlash: true,
  // The default image optimizer needs a server.
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default function config(phase: string): NextConfig {
  // Fail the build early instead of publishing wrong canonical URLs.
  if (phase === PHASE_PRODUCTION_BUILD) {
    const errors = validateEnv(process.env);
    if (errors.length > 0) {
      throw new Error(
        `Invalid environment:\n${errors.map((e) => `  - ${e}`).join("\n")}`,
      );
    }
  }
  return nextConfig;
}
