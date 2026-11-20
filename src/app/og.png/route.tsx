import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { ogImage } from "@/lib/site";

// Rendered once at build time and exported as og.png.
export const dynamic = "force-static";

// Text-only card in the site's light palette; no photos or illustrations.
export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#ffffff",
        color: "#111214",
        borderTop: "12px solid #2457c5",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#5b616e" }}>
        {profile.title} · {profile.location}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 68,
          fontWeight: 600,
          lineHeight: 1.1,
          letterSpacing: -1.5,
          maxWidth: 950,
        }}
      >
        {profile.headline}
      </div>
      <div style={{ display: "flex", fontSize: 32, fontWeight: 600 }}>
        {profile.name}
      </div>
    </div>,
    { width: ogImage.width, height: ogImage.height },
  );
}
