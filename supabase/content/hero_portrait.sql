-- Hero refresh: new introduction and the portrait image.
-- Before running: upload design/portrait/portrait-sm.webp, portrait.webp and portrait-lg.webp
-- to Storage → portfolio-media → profile/ (same names). Safe to re-run.
begin;
update public.profile set
  introduction = 'Software engineer with 7+ years of experience in full-stack development, technical leadership, and enterprise software delivery.',
  avatar_path = 'profile/portrait.webp';
commit;

select introduction, avatar_path from public.profile;
