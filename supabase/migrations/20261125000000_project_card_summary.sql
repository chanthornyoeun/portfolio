-- Optional short summary for homepage project cards. Empty = the card shows the full summary.
-- Run before deploying the code that reads it (the build selects this column). Safe to re-run.
alter table public.projects add column if not exists card_summary text;

alter table public.projects drop constraint if exists projects_card_summary_length;
alter table public.projects add constraint projects_card_summary_length
  check (card_summary is null or char_length(btrim(card_summary)) between 1 and 220);
