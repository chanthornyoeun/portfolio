# Analytics setup (Google Analytics 4)

The portfolio uses the official Google tag (`gtag.js`) through a small module, `src/lib/analytics.ts`. It has no backend, no visitor database and no public counter. Reports are read in the normal Google Analytics dashboard.

## How it behaves

- **Off by default.** The tag loads only when all of these are true:
  - `VITE_GA_MEASUREMENT_ID` is set to a valid `G-…` ID.
  - The site is a production build. `npm run dev` stays silent unless `VITE_GA_DEBUG=true`.
  - The visitor clicked **Allow** in the consent bar.
- **Consent first.** Until a visitor clicks Allow, no Google script loads, no cookie is set and nothing is sent.
  - The only thing stored is the choice itself, in `localStorage` under `analytics-consent` (`granted` or `denied`).
  - **Privacy settings** in the footer clears the choice and shows the consent bar again.
  - Declining after allowing stops collection straight away and deletes the `_ga` cookies.
- **Page views are sent manually** (`send_page_view: false`), so nothing is counted twice:
  - Each hash route is reported as its own virtual path, for example `#/work/real-time-auction` becomes `/portfolio_v1/work/real-time-auction`, with the case-study title.
  - Section anchors (`#work`, `#contact`) count as the homepage, not as separate pages.
  - A repeat of the current page is ignored, which also covers React StrictMode and back and forward navigation.
  - UTM query parameters are kept on `page_location`, so campaign traffic is attributed.
- **Privacy settings in the tag:**
  - Google signals and ad personalisation are turned off.
  - GA4 does not log or store IP addresses.
  - No user ID, email address or form content is ever sent.

## Events

| Event | Fired when | Parameters |
| --- | --- | --- |
| `page_view` | First load and each route change | `page_path`, `page_title`, `page_location` |
| `project_view` | A case study page opens (from a card, a direct link or back/forward) | `project_slug`, `project_title` |
| `project_card_click` | A visitor clicks a project card | `project_slug`, `project_title` |
| `navigation_click` | A visitor uses the header or mobile menu | `navigation_target`, `link_location` |
| `contact_email_click` | A visitor clicks an Email link (Contact or footer) | `link_location` |
| `linkedin_click` / `github_click` | A visitor clicks a LinkedIn or GitHub link (Hero or Contact) | `link_location` |
| `resume_view` | A visitor clicks a Resume link (only shown once a CV is configured) | `link_location` |
| `resume_download` | Reserved; no download-only link exists yet | `link_location` |

`contact_email_click` only means the visitor opened their mail app. It does not prove that a message was sent.

## 1. Create the property and stream

1. Go to <https://analytics.google.com>, then **Admin → Create → Property**, and complete the steps.
2. Under **Data collection and modification → Data streams → Add stream → Web**, enter `https://chanthornyoeun.github.io/portfolio_v1/`.
3. In the stream settings, open **Enhanced measurement** and turn off **Page changes based on browser history events**. The app sends page views itself.
4. Copy the **Measurement ID** (`G-…`) from the stream details.

## 2. Configure the ID

- **Locally:** copy `.env.example` to `.env.local`, which git already ignores, and fill in `VITE_GA_MEASUREMENT_ID`. To send events while testing with `npm run dev`, also set `VITE_GA_DEBUG=true`.
- **Production (GitHub Actions):** in the repository, go to **Settings → Secrets and variables → Actions → Variables → New repository variable**.
  - Set the name to `VITE_GA_MEASUREMENT_ID` and the value to your ID.
  - The deploy workflow already passes it to `npm run build`.
  - It is a public identifier, so a variable is enough rather than a secret.
  - Never put a service-account key or an Admin API credential in the frontend.

If the variable is missing, the build still succeeds and analytics stays off.

## 3. Test with DebugView

1. Run `npm run dev` with `VITE_GA_DEBUG=true` set in `.env.local`, then open the site and click **Allow**.
2. In GA4, go to **Admin → DebugView**, which lists events within seconds:
   - Open a project and check for `project_card_click`, `page_view` and `project_view`.
   - Use browser back and check for a single `page_view` of `/portfolio_v1/`.
   - Click Email, LinkedIn or GitHub and check `link_location`.
3. On the live site, check **Reports → Realtime**.

Real visitor data appears only after the site has had tracked traffic; standard reports can take 24–48 hours.

## 4. Reading the reports

- **Audience:**
  - **Reports → User → Demographics** shows countries and cities.
  - **Tech → Overview** shows device categories.
  - **Retention** shows new versus returning users.
- **Acquisition:** **Reports → Acquisition → Traffic acquisition** shows Organic Search, Direct, Referral and campaigns. In **Session source**, LinkedIn and GitHub appear as `linkedin.com` / `lnkd.in` and `github.com`. To tag your own links, use `?utm_source=linkedin&utm_medium=social&utm_campaign=profile`.
- **Engagement:**
  - **Reports → Engagement → Pages and screens** shows the most viewed pages and case studies, plus average engagement time.
  - **Events** lists every custom event.
- **Projects:** in **Explore → Free form**, add the dimension `project_slug` as a row and the metric **Event count** as a value, then filter **Event name** to exactly `project_view`.
  - First register the parameters under **Admin → Custom definitions → Create custom dimension**, with scope Event, for `project_slug`, `project_title`, `link_location` and `navigation_target`.

## 5. Key events

Go to **Admin → Events** (or **Key events**) and mark these as key events:

- `contact_email_click`
- `resume_download`, once a download link exists

Each event appears in that list after it has fired at least once.

## 6. Data retention and privacy

- **Admin → Data collection and modification → Data retention:** 2 months is the privacy-friendly default; 14 months gives longer explorations. Standard reports are not affected by this setting.
- **Admin → Data collection:** leave Google signals off.
- **Totals undercount by design.** Visitors who decline, or never answer the consent bar, are not counted at all, and ad blockers block the tag too. Treat the numbers as a trend, not an exact visitor count.
- The bar asks every visitor, not only visitors from regions that require consent. This is the privacy-preserving choice when the legal requirements are uncertain.

## 7. Turning analytics off

- To stop collection, delete the `VITE_GA_MEASUREMENT_ID` repository variable and redeploy.
- Visitors can opt out at any time through **Privacy settings** in the footer.
