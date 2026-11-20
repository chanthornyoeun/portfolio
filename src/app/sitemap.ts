import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Trailing slashes match the exported URLs (trailingSlash: true).
  return ["/", "/projects/", "/resume/"]
    .concat(getProjectSlugs().map((slug) => `/projects/${slug}/`))
    .map((path) => ({ url: absoluteUrl(path) }));
}
