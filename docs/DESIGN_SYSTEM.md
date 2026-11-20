# Design System

Style: minimal, editorial, professional. Content first, design second, animation last.

## Tokens (CSS variables, Tailwind v4 `@theme`)

| Token         | Light     | Dark      | Use                                 |
| ------------- | --------- | --------- | ----------------------------------- |
| `--bg`        | `#ffffff` | `#0b0c0e` | Page background                     |
| `--bg-subtle` | `#f7f7f8` | `#131518` | Cards, code, hover                  |
| `--fg`        | `#111214` | `#ececee` | Body text                           |
| `--fg-muted`  | `#5b616e` | `#9aa0ab` | Secondary text (≥ 4.5:1 on bg)      |
| `--border`    | `#e6e7ea` | `#24272c` | Hairlines                           |
| `--accent`    | `#2457c5` | `#7aa2f7` | Links, focus ring, small highlights |

Exact values are checked for AA contrast during implementation. Any change must keep 4.5:1 for text and 3:1 for UI.

## Typography

- Font: Geist Sans, plus Geist Mono for small labels and tech tags. Loaded with `next/font` (self-hosted, no layout shift).
- Scale: 14 / 16 (body) / 18 / 20 / 24 / 32 / 40–48 (hero only). Line height 1.6 for body and 1.15 for headings.
- Reading measure ≤ 70ch. Headings use weight 600 with slight negative tracking.

## Layout

- Max content width is about 1000px (`max-w-[1000px]`), with side padding of 20px on mobile and 32px on larger screens.
- Single-column reading flow. Grids are only for project cards (1 column on mobile, 2 on `md` and up) and the expertise groups.
- Section vertical rhythm: 96px on desktop, 64px on mobile. Each section has an `h2` and an anchor id.

## Components

- **Header:** name on the left, nav on the right, theme toggle. Sticky with a thin bottom border and no blur effects. Mobile uses a simple disclosure menu.
- **Project card:** title, one-line summary, role, and up to 5 tech tags. Shows the "Professional Project · Private" label in muted mono. The only action is "View case study →". No disabled demo or repo buttons.
- **Experience item:** company, title, dates, 2–4 highlights, tech line.
- **Tag:** small mono text on `--bg-subtle` with a 1px border. Not colorful pills.
- **Buttons:** primary (accent fill) and secondary (border). There is at most one primary per view.
- **Assistant panel:** a plain bordered panel or dialog with focus trap, Esc to close, and a clear "answers come from portfolio content only" note.

## Motion

Only opacity and color transitions of 150ms or less, plus focus and hover. No scroll-triggered animations. Everything is disabled under `prefers-reduced-motion`.

## Never

Large gradients, glassmorphism, neon, particles, heavy shadows, 3D, auto-playing media, skill percentage bars, carousels, stock photos, AI portraits, fake testimonials, fake stats, slogans.

## Accessibility

Visible 2px accent focus ring with offset, skip-to-content link, semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, link text that makes sense out of context, `aria-current` on the active nav item, and theme toggle with an accessible label.
