// Progressive fade-in for [data-reveal] elements. The prerendered HTML is fully visible; this only hides
// items that are still below the fold once JavaScript runs, then reveals them as they scroll into view.
// Nothing happens without JavaScript, without IntersectionObserver, or for reduced-motion users.
export function startReveal() {
  if (typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const items = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  const fold = window.innerHeight;
  // Anything already on screen (or scrolled past) stays as it is: no flash of hidden content.
  for (const el of items) if (el.getBoundingClientRect().top < fold) el.dataset.shown = '';

  const observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        (e.target as HTMLElement).dataset.shown = '';
        observer.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  items.filter((el) => !('shown' in el.dataset)).forEach((el) => observer.observe(el));
  document.documentElement.classList.add('reveal-ready');
  return () => observer.disconnect();
}
