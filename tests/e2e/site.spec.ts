import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { url } from "./base";

async function expectNoSeriousA11yIssues(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  const serious = violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

test.describe("homepage", () => {
  test("renders sections in order", async ({ page }) => {
    await page.goto(url("/"));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Building reliable software for complex business needs.",
    );
    const ids = await page
      .locator("main section[id]")
      .evaluateAll((els) => els.map((e) => e.id));
    expect(ids).toEqual([
      "work",
      "experience",
      "expertise",
      "about",
      "contact",
    ]);
  });

  test("lists the four case studies as private and linked", async ({
    page,
  }) => {
    await page.goto(url("/"));
    const work = page.locator("#work");
    await expect(work.locator("h3")).toHaveCount(4);
    await expect(work.getByText("Professional Project · Private")).toHaveCount(
      4,
    );
    await expect(
      work.getByRole("link", { name: /Real-Time Auction Platform/ }),
    ).toHaveAttribute("href", url("/projects/real-time-auction-platform/"));
    await expect(work.getByText("View case study")).toHaveCount(4);
    // No repository or demo links on private project cards.
    await expect(work.locator("a")).toHaveCount(4);
  });

  test("cards show the agreed descriptions and main technologies", async ({
    page,
  }) => {
    await page.goto(url("/"));
    const card = (title: string) =>
      page
        .locator("#work li")
        .filter({ has: page.getByRole("link", { name: title }) });

    const petroleum = card("Petroleum Distribution Management System");
    await expect(petroleum).toContainText(
      "Enterprise petroleum operations platform with hands-on frontend and backend development, business analysis, and system integration.",
    );
    await expect(
      petroleum.getByRole("list", { name: "Main technologies" }).locator("li"),
    ).toHaveText(["Next.js", "React", "TypeScript", "Laravel"]);

    const insurance = card("General Core Insurance Platform");
    await expect(insurance).toContainText(
      "Hands-on Angular frontend development and technical leadership for enterprise insurance workflows.",
    );
    await expect(
      insurance.getByRole("list", { name: "Main technologies" }).locator("li"),
    ).toHaveText(["Angular", "TypeScript", "REST APIs"]);
  });

  test("hero stays text-only while no portrait is configured", async ({
    page,
  }) => {
    await page.goto(url("/"));
    await expect(page.locator("main img")).toHaveCount(0);
  });

  test("shows separate roles at the same company", async ({ page }) => {
    await page.goto(url("/"));
    const exp = page.locator("#experience");
    await expect(exp.getByText("Ecoinsoft Solution Co., Ltd")).toHaveCount(1);
    await expect(exp.getByText("Frontend Team Leader")).toBeVisible();
    await expect(exp.getByText("Mar 2020 – Sep 2023")).toBeVisible();
    await expect(exp.getByText("Jan 2026 – Present")).toBeVisible();
  });

  test("contact shows real links and no email action when none is set", async ({
    page,
  }) => {
    await page.goto(url("/"));
    const contact = page.locator("#contact");
    await expect(
      contact.getByRole("heading", { name: "Let's connect." }),
    ).toBeVisible();
    await expect(contact).toContainText(
      "Interested in discussing software engineering opportunities",
    );
    const linkedIn = contact.getByRole("link", {
      name: "LinkedIn (external site)",
    });
    await expect(linkedIn).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/chanthornyoeun/",
    );
    await expect(linkedIn).toHaveAttribute("rel", "me");
    await expect(
      contact.getByRole("link", { name: "GitHub (external site)" }),
    ).toHaveAttribute("href", "https://github.com/chanthornyoeun");
    // No address is configured yet, so no mailto action may render anywhere.
    await expect(page.locator("a[href^='mailto:']")).toHaveCount(0);
  });

  test("has no serious a11y issues in light and dark", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(url("/"));
    await expectNoSeriousA11yIssues(page);
    await page.emulateMedia({ colorScheme: "dark" });
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expectNoSeriousA11yIssues(page);
  });

  test("theme toggle works from the keyboard", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto(url("/"));
    const toggle = page.getByRole("button", { name: "Toggle dark mode" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto(url("/"));
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe("navigation", () => {
  test("desktop anchors reach their sections", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop nav only");
    await page.goto(url("/"));
    await page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL(/#about$/);
    await expect(page.locator("#about-heading")).toBeInViewport();
  });

  test("mobile menu is keyboard accessible", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile nav only");
    await page.goto(url("/"));
    const button = page.getByRole("button", { name: "Menu" });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();

    await button.click();
    await menu.getByRole("link", { name: "Experience" }).click();
    await expect(page).toHaveURL(/#experience$/);
    await expect(menu).toBeHidden();
  });
});

test.describe("layout", () => {
  for (const width of [320, 768, 1024, 1440]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of [
        "/",
        "/resume/",
        "/projects/",
        "/projects/general-insurance-platform/",
      ]) {
        await page.goto(url(path));
        await expectNoHorizontalOverflow(page);
      }
    });
  }

  test("interactive controls meet the 24px target size", async ({ page }) => {
    await page.goto(url("/"));
    const small = await page
      .locator(
        "header a:visible, header button:visible, main a:visible, main button:visible",
      )
      .evaluateAll((els) =>
        els
          .map((el) => ({
            text: el.textContent?.trim(),
            r: el.getBoundingClientRect(),
          }))
          .filter(({ r }) => r.width < 24 || r.height < 24)
          .map(({ text }) => text),
      );
    expect(small).toEqual([]);
  });
});

test.describe("linked pages", () => {
  test("resume lists every role", async ({ page }) => {
    await page.goto(url("/resume/"));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Chanthorn Yoeun",
    );
    await expect(
      page.getByText("Backend Developer", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Computer Science studies")).toBeVisible();
    await expectNoSeriousA11yIssues(page);
  });
});
