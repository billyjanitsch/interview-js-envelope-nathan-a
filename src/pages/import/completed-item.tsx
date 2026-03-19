import { formatCents } from "../../currency.ts";
import type { ImportItem } from "../../types.ts";

export function CompletedItem({ item }: { item: ImportItem }) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-ink/5 bg-white/60 px-5 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-ink-light">{item.description}</p>
        <p className="font-mono text-xs text-ink-faint">{item.date}</p>
      </div>
      <p className="font-mono text-sm text-ink-light">
        {formatCents(item.amount)}
      </p>
      <span className="rounded bg-green-light px-2 py-0.5 font-mono text-[11px] text-green">
        Imported
      </span>
    </div>
  );
}
