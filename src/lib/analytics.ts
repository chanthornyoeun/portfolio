// Google Analytics 4 via the official gtag.js, loaded only after the visitor opts in.
// No personal data is ever sent: events carry slugs, titles and link locations only.

type EventParams = {
  project_view: { project_slug: string; project_title: string };
  project_card_click: { project_slug: string; project_title: string };
  contact_email_click: { link_location: LinkLocation };
  linkedin_click: { link_location: LinkLocation };
  github_click: { link_location: LinkLocation };
  resume_view: { link_location: LinkLocation };
  resume_download: { link_location: LinkLocation };
  navigation_click: { navigation_target: string; link_location: LinkLocation };
};
export type LinkLocation = 'header' | 'mobile_menu' | 'hero' | 'contact' | 'footer';
export type Consent = 'granted' | 'denied';

const env = import.meta.env ?? {};
const measurementId: string = env.VITE_GA_MEASUREMENT_ID ?? '';
const base: string = env.BASE_URL ?? '/';
const CONSENT_KEY = 'analytics-consent';
export const CONSENT_EVENT = 'analytics-consent-change';

/** Off unless an ID is set, and off in `npm run dev` unless VITE_GA_DEBUG=true. */
export function isConfigured(e: Record<string, unknown> = env) {
  return /^G-[A-Z0-9]+$/.test(String(e.VITE_GA_MEASUREMENT_ID ?? '')) && (e.PROD === true || e.VITE_GA_DEBUG === 'true');
}

/** Hash route → virtual path GA4 can report on. Section anchors (#work) are the homepage. */
export function pagePath(hash: string, basePath = base) {
  const route = hash.startsWith('#/') ? hash.slice(2).replace(/\/+$/, '') : '';
  return basePath + route;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Fallback when storage is blocked, so a choice still applies for this visit.
let memoryConsent: Consent | null = null;

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : memoryConsent;
  } catch {
    return memoryConsent;
  }
}

/** Sends only while consent is granted, including after a later withdrawal. */
const active = () => loaded && getConsent() === 'granted';

let loaded = false;
let lastPath = '';
let pending: { path: string; title: string } | null = null;

function load() {
  if (loaded || !isConfigured() || getConsent() !== 'granted') return false;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object, not an array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false, // page views are sent manually for hash routes
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    debug_mode: env.VITE_GA_DEBUG === 'true' || undefined,
  });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(s);
  if (pending) sendPageView(pending.path, pending.title);
  return true;
}

function sendPageView(path: string, title: string) {
  if (!active()) return;
  window.gtag?.('event', 'page_view', {
    page_location: location.origin + path + location.search, // keeps UTM parameters
    page_path: path,
    page_title: title,
  });
}

/** Called on load and on every hash change. Returns false for a repeat of the current page, which is ignored. */
export function trackPageView(hash: string, title: string) {
  const path = pagePath(hash);
  if (path === lastPath) return false;
  lastPath = path;
  pending = { path, title };
  sendPageView(path, title);
  return true;
}

export function trackEvent<K extends keyof EventParams>(name: K, params: EventParams[K]) {
  if (active()) window.gtag?.('event', name, params);
}

export function setConsent(value: Consent | null) {
  memoryConsent = value;
  try {
    if (value) localStorage.setItem(CONSENT_KEY, value);
    else localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
  if (loaded) {
    // gtag.js stays in memory until reload; this flag pauses or resumes it.
    (window as unknown as Record<string, boolean>)[`ga-disable-${measurementId}`] = value !== 'granted';
  }
  if (value === 'granted') load();
  if (value === 'denied') {
    document.cookie.split(';').forEach((c) => {
      const name = c.split('=')[0].trim();
      if (!name.startsWith('_ga')) return;
      document.cookie = `${name}=; Max-Age=0; path=/`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname}`;
    });
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export const initAnalytics = load;
