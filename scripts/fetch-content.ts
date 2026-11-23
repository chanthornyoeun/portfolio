// Fetches published content from Supabase, validates it and writes src/generated/content.json for the build.
// Usage: npm run content:fetch            (needs VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY)
//        npm run content:fetch -- --from-backup   (local development only: uses supabase/backup/content.json)
// On any error the snapshot is not written and the process exits non-zero, so CI never deploys bad content.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { supabaseConfig } from '../src/lib/supabase.ts';
import { applyDisclosure, fetchRows, mapContent, validateContent } from '../src/services/content.ts';
import type { Content } from '../src/services/content.ts';

for (const file of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(file);
  } catch {
    /* optional */
  }
}

const out = new URL('../src/generated/content.json', import.meta.url);
let content: Content;

if (process.argv.includes('--from-backup')) {
  console.warn('content: using supabase/backup/content.json (development only, not for deploys)');
  content = applyDisclosure(JSON.parse(readFileSync(new URL('../supabase/backup/content.json', import.meta.url), 'utf8')));
} else {
  const config = supabaseConfig(process.env);
  if (!config) {
    console.error('content: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (publishable, not secret) are required.');
    console.error('         For local work without Supabase run: npm run content:fetch -- --from-backup');
    process.exit(1);
  }
  try {
    content = mapContent(await fetchRows(config.url, config.key), process.env);
  } catch (error) {
    console.error(`content: fetching from Supabase failed: ${(error as Error).message}`);
    process.exit(1);
  }
}

const errors = validateContent(content);
if (errors.length) {
  console.error(`content: ${errors.length} problem(s), nothing written:\n  - ${errors.join('\n  - ')}`);
  process.exit(1);
}

mkdirSync(new URL('.', out), { recursive: true });
writeFileSync(out, JSON.stringify(content) + '\n');
console.log(`content: ${content.projects.length} projects, ${content.experience.length} companies, ${content.skills.length} skill groups`);
