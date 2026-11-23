/** Year and month, e.g. '2024-11'. `null` end date means the role is current. */
type YearMonth = `${number}-${number}`;

export interface Role {
  title: string;
  startDate: YearMonth;
  endDate: YearMonth | null;
  project?: string;
  highlights: string[];
}

export interface ExperienceGroup {
  company: string;
  /** Newest role first. */
  roles: Role[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const parse = (ym: YearMonth) => {
  const [y, m] = ym.split('-').map(Number);
  return { y, m };
};

export const formatMonth = (ym: YearMonth | null) => {
  if (!ym) return 'Present';
  const { y, m } = parse(ym);
  return `${MONTHS[m - 1]} ${y}`;
};

export const formatPeriod = (start: YearMonth, end: YearMonth | null) => `${formatMonth(start)} – ${formatMonth(end)}`;

/** Company period: earliest start to latest end (null = still there). Gaps between roles are not filled in. */
export function companyPeriod(group: ExperienceGroup) {
  const starts = group.roles.map((r) => r.startDate).sort();
  const ends = group.roles.map((r) => r.endDate);
  const end = ends.includes(null) ? null : (ends as YearMonth[]).sort().at(-1)!;
  return { start: starts[0], end };
}

/** Inclusive month count, e.g. Aug 2024 – Dec 2025 = 17 months. */
export function monthsBetween(start: YearMonth, end: YearMonth | null, now = new Date()) {
  const s = parse(start);
  const e = end ? parse(end) : { y: now.getFullYear(), m: now.getMonth() + 1 };
  return (e.y - s.y) * 12 + (e.m - s.m) + 1;
}

export function formatDuration(months: number) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const part = (n: number, unit: string) => (n ? `${n} ${unit}${n > 1 ? 's' : ''}` : '');
  return [part(y, 'yr'), part(m, 'mo')].filter(Boolean).join(' ') || '1 mo';
}
