// The validated, published-only snapshot written at build time by scripts/fetch-content.ts.
// It is bundled and prerendered, so visitors make no Supabase requests.
import data from '../generated/content.json';
import type { Content } from '../services/content';

const content = data as unknown as Content;

export const useContent = () => content;
