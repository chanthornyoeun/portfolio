import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { SITE, url } from "./base";

async function expectNoSeriousA11yIssues(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(
    violations
      .filter((v) => v.impact === "serious" || v.impact === "critical")
      .map((v) => `${v.id}: ${v.help}`),
  ).toEqual([]);
}

const slugs = [
  "real-time-auction-platform",
  "general-insurance-platform",
  "petroleum-distribution-management",
  "enterprise-crm-platform",
];

test.describe("project list", () => {
  test("shows heading, confidentiality note and all projects", async ({
    page,
  }) => {
    await page.goto(url("/projects/"));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Selected Projects",
    );
    await expect(
      page.getByText(/source code, data and client details are confidential/),
    ).toBeVisible();
    const hrefs = await page
      .locator(`main a[href^='${url("/projects/")}']`)
      .evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    expect(hrefs).toEqual(slugs.map((s) => url(`/projects/${s}/`)));
    await expectNoSeriousA11yIssues(page);
  });

  test("each row's link is named by the title alone, and the whole row is clickable", async ({
    page,
  }) => {
    await page.goto(url("/projects/"));
    const link = page.getByRole("link", {
      name: "Real-Time Auction Platform",
      exact: true,
    });
    await expect(link).toHaveCount(1);
    // Clicking the summary text, not the title, still opens the case study.
    await page
      .getByText("An online auction system where many users")
      .click({ force: true });
    await expect(page).toHaveURL(
      `${SITE}/projects/real-time-auction-platform/`,
    );
  });

  test("direct load and refresh of a case study work without a server", async ({
    page,
  }) => {
    // Without the trailing slash, Pages (and the test server) redirect to it.
    const res = await page.goto(url("/projects/enterprise-crm-platform"));
    expect(res?.status()).toBe(200);
    await expect(page).toHaveURL(`${SITE}/projects/enterprise-crm-platform/`);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Enterprise CRM Platform",
    );
    // Client-side navigation back to the list stays under the base path.
    await page.getByRole("link", { name: "Back to Projects" }).click();
    await expect(page).toHaveURL(`${SITE}/projects/`);
  });

  test("CSS and JavaScript load from the base path", async ({ page }) => {
    const assets: { url: string; status: number }[] = [];
    page.on("response", (r) => {
      if (/\.(css|js)$/.test(new URL(r.url()).pathname)) {
        assets.push({ url: r.url(), status: r.status() });
      }
    });
    await page.goto(url("/projects/"), { waitUntil: "networkidle" });
    expect(assets.some((a) => a.url.endsWith(".css"))).toBe(true);
    expect(assets.some((a) => a.url.endsWith(".js"))).toBe(true);
    for (const a of assets) {
      expect(a.url).toContain(`${SITE}/_next/static/`);
      expect(a.status, a.url).toBe(200);
    }
    // Styles actually applied: the h1 uses the Geist font, not a default serif.
    const font = await page
      .getByRole("heading", { level: 1 })
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(font).toMatch(/Geist/i);
  });
});

test.describe("case study", () => {
  test("auction renders sections in order with an accessible diagram", async ({
    page,
  }) => {
    await page.goto(url("/projects/real-time-auction-platform/"));
    await expect(
      page.getByRole("link", { name: "Back to Projects" }),
    ).toHaveAttribute("href", url("/projects/"));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Real-Time Auction Platform",
    );

    const h2s = await page.locator("main h2").allTextContents();
    expect(h2s).toEqual([
      "The Challenge",
      "My Contributions",
      "Technical Approach",
      "Related Projects",
    ]);

    const diagram = page.locator("figure");
    await expect(diagram.locator("ol > li")).toHaveCount(5);
    await expect(diagram.locator("figcaption")).toContainText(
      "Simplified flow",
    );
    await expect(diagram.getByText("Redis lock")).toBeVisible();
    await expectNoSeriousA11yIssues(page);
  });

  test("omits sections without verified content", async ({ page }) => {
    await page.goto(url("/projects/general-insurance-platform/"));
    await expect(
      page.getByRole("heading", { name: "Outcome / Lessons Learned" }),
    ).toHaveCount(0);
    await expect(page.locator("figure")).toHaveCount(0);
  });

  for (const slug of slugs) {
    test(`${slug}: private, no repo or demo links, has metadata`, async ({
      page,
    }) => {
      await page.goto(url(`/projects/${slug}/`));
      await expect(
        page
          .locator("main")
          .getByText("Professional Project · Private")
          .first(),
      ).toBeVisible();
      await expect(
        page.getByText(/no public repository or demo/),
      ).toBeVisible();
      await expect(
        page
          .locator("main")
          .getByRole("link", { name: /source code|live site|demo|github/i }),
      ).toHaveCount(0);

      const title = await page.title();
      expect(title).toContain("— Chanthorn Yoeun");
      const h1 = await page.getByRole("heading", { level: 1 }).textContent();
      expect(title.startsWith(h1 ?? "")).toBe(true);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        /.{20,}/,
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${SITE}/projects/${slug}/`,
      );
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
        "content",
        "article",
      );
    });
  }

  test("insurance: hands-on Angular, frontend leadership, no backend ownership", async ({
    page,
  }) => {
    await page.goto(url("/projects/general-insurance-platform/"));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "General Core Insurance Platform",
    );
    const implementation = page
      .getByRole("heading", { name: "Hands-on implementation" })
      .locator("xpath=following-sibling::ul[1]");
    await expect(implementation).toContainText(
      "Implemented the core insurance frontend platform hands-on in Angular.",
    );
    await expect(page.locator("main")).not.toContainText(
      /(built|implemented|owned) (the )?(entire )?backend|full[- ]stack/i,
    );
    await expect(page.getByText("Frontend Team Leader").first()).toBeVisible();
  });

  test("petroleum: Next.js and Laravel stack, hands-on frontend first", async ({
    page,
  }) => {
    await page.goto(url("/projects/petroleum-distribution-management/"));
    const tech = page.locator("dd").filter({ has: page.locator("ul") });
    for (const t of [
      "Next.js",
      "React",
      "TypeScript",
      "Laravel",
      "PHP",
      "Figma",
    ]) {
      await expect(tech.getByText(t, { exact: true })).toBeVisible();
    }
    const implementation = page
      .getByRole("heading", { name: "Hands-on implementation" })
      .locator("xpath=following-sibling::ul[1]");
    await expect(implementation.locator("li").first()).toHaveText(
      "Develop the frontend hands-on with Next.js, React and TypeScript.",
    );
  });

  test("diagram is labelled conceptual and no preview image is shown without one", async ({
    page,
  }) => {
    await page.goto(url("/projects/real-time-auction-platform/"));
    await expect(page.locator("figcaption")).toContainText(
      "Conceptual diagram.",
    );
    await expect(page.locator("figcaption")).toContainText(
      "does not show the production architecture",
    );
    // No project has an approved preview image yet, so none may render.
    await expect(page.locator("main img")).toHaveCount(0);
  });
});

test.describe("invalid slugs", () => {
  test("return a 404 page with a way back", async ({ page }) => {
    const res = await page.goto(url("/projects/not-a-project/"));
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Page not found",
    );
    // GitHub Pages serves 404.html for any missing path; its links must keep the base path.
    await expect(
      page.getByRole("link", { name: "View selected projects" }),
    ).toHaveAttribute("href", url("/projects/"));
    const font = await page
      .getByRole("heading", { level: 1 })
      .evaluate((el) => getComputedStyle(el).fontFamily);
    expect(font).toMatch(/Geist/i);
    expect((await page.goto(url("/does-not-exist")))?.status()).toBe(404);
    expect((await page.goto(url("/deeply/nested/missing/")))?.status()).toBe(
      404,
    );
  });
});
