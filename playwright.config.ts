import { defineConfig, devices } from "@playwright/test";
import { PORT, SITE } from "./tests/e2e/base";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: { baseURL: `http://localhost:${PORT}`, trace: "on-first-retry" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // Builds the static export for SITE (set E2E_BASE_PATH to test a repository
  // subpath) and serves out/ the way GitHub Pages does.
  webServer: {
    command: `npm run build && node scripts/serve-static.mjs ${PORT}`,
    url: `${SITE}/`,
    env: { NEXT_PUBLIC_SITE_URL: SITE },
    // Never reuse: a server left over from a different base path would give false results.
    reuseExistingServer: false,
    timeout: 240_000,
  },
});
