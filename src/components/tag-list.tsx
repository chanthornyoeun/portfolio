export function TagList({ items, label }: { items: string[]; label?: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="border-border bg-bg-subtle text-fg-muted rounded border px-2 py-0.5 font-mono text-xs"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
