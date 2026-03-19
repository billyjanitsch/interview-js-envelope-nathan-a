import { formatCents } from "../../currency.ts";
import { CheckIcon } from "../../icons.tsx";
import type { Envelope, ImportItem } from "../../types.ts";

export function PendingItem({
  envelopeSelection,
  envelopes,
  item,
  onConfirm,
  onSelectEnvelope,
  readOnly,
}: {
  envelopeSelection: string;
  envelopes: Envelope[];
  item: ImportItem;
  onConfirm: () => void;
  onSelectEnvelope: (value: string) => void;
  readOnly: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-ink/8 bg-white px-5 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.description}</p>
        <p className="font-mono text-xs text-ink-faint">{item.date}</p>
      </div>
      <p className="font-mono text-sm">{formatCents(item.amount)}</p>
      <select
        value={envelopeSelection}
        onChange={(e) => onSelectEnvelope(e.target.value)}
        disabled={readOnly}
        className="w-40 rounded border border-ink/10 bg-paper px-2 py-1.5 text-sm disabled:opacity-50"
      >
        <option value="">Unallocated</option>
        {envelopes.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))}
      </select>
      <button
        onClick={onConfirm}
        disabled={readOnly}
        className="flex items-center gap-1.5 rounded-md bg-green px-3 py-1.5 font-mono text-xs text-white transition-colors hover:bg-green/80 disabled:opacity-50"
      >
        <CheckIcon />
        Confirm
      </button>
    </div>
  );
}
