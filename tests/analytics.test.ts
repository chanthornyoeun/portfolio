import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isConfigured, trackEvent, trackPageView } from '../src/lib/analytics.ts';

test('analytics stays off without a valid ID, and in dev unless debug is on', () => {
  assert.equal(isConfigured({}), false);
  assert.equal(isConfigured({ VITE_GA_MEASUREMENT_ID: 'G-XXXXXXXXXX', PROD: false }), false);
  assert.equal(isConfigured({ VITE_GA_MEASUREMENT_ID: 'not-an-id', PROD: true }), false);
  assert.equal(isConfigured({ VITE_GA_MEASUREMENT_ID: 'G-ABC123', PROD: true }), true);
  assert.equal(isConfigured({ VITE_GA_MEASUREMENT_ID: 'G-ABC123', PROD: false, VITE_GA_DEBUG: 'true' }), true);
});

test('nothing is sent before analytics loads', () => {
  const calls: unknown[] = [];
  (globalThis as { window?: unknown }).window = { gtag: (...a: unknown[]) => calls.push(a) };
  trackPageView('/portfolio/', 'Home');
  trackEvent('contact_email_click', { link_location: 'contact' });
  assert.equal(calls.length, 0);
});

test('a page view counts once per page path; repeats (StrictMode) are ignored', () => {
  assert.equal(trackPageView('/portfolio/work/enterprise-crm/', 'CRM'), true);
  assert.equal(trackPageView('/portfolio/work/enterprise-crm/', 'CRM'), false);
  assert.equal(trackPageView('/portfolio/', 'Home'), true);
});
