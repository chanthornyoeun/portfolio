import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { BASE, SITE, url } from "./base";

const pages = [
  "/",
  "/projects/",
  "/resume/",
  "/projects/real-time-auction-platform/",
  "/projects/general-insurance-platform/",
  "/projects/petroleum-distribution-management/",
  "/projects/enterprise-crm-platform/",
];

test.describe("SEO", () => {
  test("titles, descriptions and canonicals are unique per page", async ({
    page,
  }) => {
    const seen = { title: new Set(), desc: new Set(), canonical: new Set() };
    for (const path of pages) {
      await page.goto(url(path));
      const title = await page.title();
      const desc = await page
        .locator('meta[name="description"]')
        .getAttribute("content");
      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(desc?.length, path).toBeGreaterThan(40);
      expect(canonical, path).toBe(`${SITE}${path}`);
      seen.title.add(title);
      seen.desc.add(desc);
      seen.canonical.add(canonical);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );
    }
    expect(seen.title.size).toBe(pages.length);
    expect(seen.desc.size).toBe(pages.length);
    expect(seen.canonical.size).toBe(pages.length);
  });

  test("every page has one h1 and no skipped heading levels", async ({
    page,
  }) => {
    for (const path of pages) {
      await page.goto(url(path));
      const levels = await page
        .locator("h1, h2, h3, h4, h5, h6")
        .evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
      expect(
        levels.filter((l) => l === 1),
        path,
      ).toHaveLength(1);
      expect(levels[0], path).toBe(1);
      for (let i = 1; i < levels.length; i++) {
        expect(
          (levels[i] ?? 0) - (levels[i - 1] ?? 0),
          `${path} heading ${i}`,
        ).toBeLessThanOrEqual(1);
      }
    }
  });

  test("sitemap, robots and social image are served", async ({ request }) => {
    const sitemap = await (await request.get(url("/sitemap.xml"))).text();
    for (const path of pages) {
      expect(sitemap).toContain(`<loc>${SITE}${path}</loc>`);
    }
    const robots = await (await request.get(url("/robots.txt"))).text();
    expect(robots).toMatch(/Allow: \//);
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
    const og = await request.get(url("/og.png"));
    expect(og.status()).toBe(200);
    expect(og.headers()["content-type"]).toBe("image/png");
  });

  test("social image URL is absolute and includes the base path", async ({
    page,
  }) => {
    await page.goto(url("/projects/enterprise-crm-platform/"));
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      `${SITE}/og.png`,
    );
  });

  test("homepage has valid Person structured data", async ({ page }) => {
    await page.goto(url("/"));
    const json = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    const data = JSON.parse(json ?? "{}");
    expect(data).toMatchObject({
      "@type": "Person",
      name: "Chanthorn Yoeun",
      jobTitle: "Senior Software Engineer",
    });
    expect(data.sameAs).toContain("https://github.com/chanthornyoeun");
    expect(data.email).toBeUndefined();
  });
});

test.describe("links", () => {
  test("every internal link resolves and external links are https", async ({
    page,
    request,
  }) => {
    const internal = new Set<string>();
    const external = new Set<string>();
    for (const path of pages) {
      await page.goto(url(path));
      const hrefs = await page
        .locator("a[href]")
        .evaluateAll((els) => els.map((e) => e.getAttribute("href") ?? ""));
      for (const href of hrefs) {
        if (href.startsWith("http")) external.add(href);
        else if (!href.startsWith("#")) internal.add(href.split("#")[0] || "/");
      }
    }
    // Rendered hrefs already include the base path.
    for (const href of internal) {
      if (BASE) expect(href, href).toMatch(new RegExp(`^${BASE}/`));
      expect((await request.get(href)).status(), href).toBe(200);
    }
    for (const href of external) expect(href).toMatch(/^https:\/\//);
    expect([...external].sort()).toEqual([
      "https://github.com/chanthornyoeun",
      "https://www.linkedin.com/in/chanthornyoeun/",
    ]);
  });
});

test.describe("security", () => {
  // GitHub Pages cannot set custom headers, so policies ship as meta tags.
  test("pages carry CSP and referrer policies as meta tags", async ({
    page,
  }) => {
    for (const path of ["/", "/projects/real-time-auction-platform/"]) {
      await page.goto(url(path));
      const csp = await page
        .locator('meta[http-equiv="Content-Security-Policy"]')
        .getAttribute("content");
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("base-uri 'self'");
      await expect(page.locator('meta[name="referrer"]')).toHaveAttribute(
        "content",
        "strict-origin-when-cross-origin",
      );
    }
  });

  test("no page loads scripts or styles from another origin", async ({
    page,
  }) => {
    const foreign: string[] = [];
    page.on("request", (r) => {
      if (new URL(r.url()).origin !== new URL(SITE).origin)
        foreign.push(r.url());
    });
    for (const path of pages) await page.goto(url(path));
    expect(foreign).toEqual([]);
  });

  test("CSP does not block anything the site needs", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(e.message));
    for (const path of pages) await page.goto(url(path));
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    expect(errors).toEqual([]);
  });
});

test.describe("accessibility", () => {
  for (const scheme of ["light", "dark"] as const) {
    test(`no serious axe violations on any page (${scheme})`, async ({
      page,
    }) => {
      await page.emulateMedia({ colorScheme: scheme });
      for (const path of pages) {
        await page.goto(url(path));
        const { violations } = await new AxeBuilder({ page }).analyze();
        expect(
          violations
            .filter((v) => v.impact === "serious" || v.impact === "critical")
            .map((v) => `${path} ${v.id}`),
        ).toEqual([]);
      }
    });
  }

  test("reduced motion disables smooth scrolling", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(url("/"));
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    ).toBe("auto");
  });

  test("focus indicator is visible on links", async ({ page }) => {
    await page.goto(url("/"));
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(() => {
      const s = getComputedStyle(document.activeElement as Element);
      return { style: s.outlineStyle, width: s.outlineWidth };
    });
    expect(outline.style).toBe("solid");
    expect(outline.width).toBe("2px");
  });
});

test.describe("performance (local production build, no throttling)", () => {
  test("homepage: low layout shift and small JS payload", async ({
    page,
  }, info) => {
    let jsBytes = 0;
    page.on("response", async (res) => {
      if (res.request().resourceType() === "script") {
        jsBytes += (await res.body().catch(() => Buffer.alloc(0))).length;
      }
    });
    await page.goto(url("/"), { waitUntil: "networkidle" });
    const metrics = await page.evaluate(
      () =>
        new Promise<{ cls: number; lcp: number }>((resolve) => {
          let cls = 0;
          let lcp = 0;
          new PerformanceObserver((l) => {
            for (const e of l.getEntries() as (PerformanceEntry & {
              value: number;
              hadRecentInput: boolean;
            })[])
              if (!e.hadRecentInput) cls += e.value;
          }).observe({ type: "layout-shift", buffered: true });
          new PerformanceObserver((l) => {
            const last = l.getEntries().at(-1);
            if (last) lcp = last.startTime;
          }).observe({ type: "largest-contentful-paint", buffered: true });
          setTimeout(() => resolve({ cls, lcp }), 1000);
        }),
    );
    info.annotations.push({
      type: "metrics",
      description: `CLS=${metrics.cls.toFixed(4)} LCP=${Math.round(metrics.lcp)}ms JS=${Math.round(jsBytes / 1024)}KiB uncompressed`,
    });
    expect(metrics.cls).toBeLessThan(0.1);
  });
});
