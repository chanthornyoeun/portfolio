import { createContext, useContext, useEffect, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { fetchContent, staticContent } from '../services/content';
import type { Content } from '../services/content';

type State = Content & { ready: boolean };

const ContentContext = createContext<State>({ ...staticContent, ready: true });

/**
 * Renders the bundled content immediately, then swaps in published Supabase content once it loads.
 * If Supabase is not configured or the request fails, the bundled content stays.
 */
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(() => ({ ...staticContent, ready: !getSupabase() }));

  useEffect(() => {
    const db = getSupabase();
    if (!db) return;
    let cancelled = false;
    db.then(fetchContent)
      .then((content) => !cancelled && setState({ ...content, ready: true }))
      .catch((error) => {
        console.warn('Portfolio content: using bundled fallback.', error);
        if (!cancelled) setState((s) => ({ ...s, ready: true }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useContent = () => useContext(ContentContext);
