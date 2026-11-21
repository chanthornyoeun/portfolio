import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isConfigured, pagePath, trackEvent, trackPageView } from '../src/lib/analytics.ts';

test('analytics stays off without a valid ID, and in dev unless debug is on', () => {
  assert.equal(isConfigured({}), false);
  assert.equal(isConfigured({ VITE_GA_MEASUREMENT_ID: 'G-XXXXXXXXXX', PROD: false }), false);
  assert.equal(isConfigured({ VITE_GA_MEASUREMENT_ID: 'not-an-id', PROD: true }), false);
  assert.equal(isConfigured({ VITE_GA_MEASUREMENT_ID: 'G-ABC123', PROD: true }), true);
  assert.equal(isConfigured({ VITE_GA_MEASUREMENT_ID: 'G-ABC123', PROD: false, VITE_GA_DEBUG: 'true' }), true);
});

test('hash routes map to distinct paths; section anchors stay on the homepage', () => {
  const base = '/portfolio_v1/';
  assert.equal(pagePath('', base), '/portfolio_v1/');
  assert.equal(pagePath('#work', base), '/portfolio_v1/');
  assert.equal(pagePath('#/work/real-time-auction', base), '/portfolio_v1/work/real-time-auction');
  assert.equal(pagePath('#/work/enterprise-crm/', base), '/portfolio_v1/work/enterprise-crm');
});

test('nothing is sent before analytics loads', () => {
  const calls: unknown[] = [];
  (globalThis as { window?: unknown }).window = { gtag: (...a: unknown[]) => calls.push(a) };
  trackPageView('', 'Home');
  trackEvent('contact_email_click', { link_location: 'contact' });
  assert.equal(calls.length, 0);
});
