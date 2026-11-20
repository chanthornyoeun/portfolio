import { describe, expect, it } from "vitest";
import { resolveBasePath, resolveSiteUrl, validateEnv } from "@/lib/env";

describe("resolveSiteUrl and resolveBasePath", () => {
  it("uses NEXT_PUBLIC_SITE_URL without a trailing slash", () => {
    expect(
      resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://example.com/" }),
    ).toBe("https://example.com");
    expect(resolveSiteUrl({})).toBe("http://localhost:3000");
  });

  it("derives the base path for a GitHub Pages project site", () => {
    expect(
      resolveBasePath({
        NEXT_PUBLIC_SITE_URL: "https://user.github.io/developer-portfolio/",
      }),
    ).toBe("/developer-portfolio");
  });

  it("uses no base path for a custom domain or user site", () => {
    expect(
      resolveBasePath({ NEXT_PUBLIC_SITE_URL: "https://example.com" }),
    ).toBe("");
    expect(
      resolveBasePath({ NEXT_PUBLIC_SITE_URL: "https://user.github.io" }),
    ).toBe("");
    expect(resolveBasePath({})).toBe("");
  });
});

describe("validateEnv", () => {
  it("accepts an empty local environment", () => {
    expect(validateEnv({})).toEqual([]);
  });

  it("accepts production project-site and custom-domain URLs", () => {
    for (const url of [
      "https://user.github.io/developer-portfolio",
      "https://example.com",
    ]) {
      expect(
        validateEnv({ DEPLOY_ENV: "production", NEXT_PUBLIC_SITE_URL: url }),
      ).toEqual([]);
    }
  });

  it("requires an https, non-localhost site URL in production", () => {
    expect(validateEnv({ DEPLOY_ENV: "production" })[0]).toMatch(/required/);
    expect(
      validateEnv({
        DEPLOY_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      }),
    ).toHaveLength(2);
  });

  it("rejects malformed URLs, other protocols, queries and hashes", () => {
    expect(validateEnv({ NEXT_PUBLIC_SITE_URL: "example.com" })[0]).toMatch(
      /not a valid URL/,
    );
    expect(
      validateEnv({ NEXT_PUBLIC_SITE_URL: "ftp://example.com" })[0],
    ).toMatch(/http or https/);
    expect(
      validateEnv({ NEXT_PUBLIC_SITE_URL: "https://example.com/?x=1" })[0],
    ).toMatch(/query or hash/);
  });

  it("flags secrets that would be published in the static site", () => {
    expect(validateEnv({ NEXT_PUBLIC_ANTHROPIC_API_KEY: "k" })[0]).toMatch(
      /published in the static site/,
    );
  });
});
