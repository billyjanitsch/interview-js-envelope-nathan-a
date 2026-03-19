import { useState } from "react";

import { formatCents, parseDollars } from "../../currency.ts";
import { ArchiveIcon } from "../../icons.tsx";
import type { Envelope } from "../../types.ts";

export function EnvelopeListItem({
  envelope,
  readOnly,
  updateEnvelope,
}: {
  envelope: Envelope;
  readOnly: boolean;
  updateEnvelope: (id: string, changes: Partial<Envelope>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  function startEditing() {
    setEditing(true);
    setEditValue(
      envelope.allocation !== null
        ? (envelope.allocation / 100).toFixed(2)
        : "",
    );
  }

  function commitEdit() {
    const cents = parseDollars(editValue);
    if (cents !== null && cents > 0) {
      updateEnvelope(envelope.id, { allocation: cents });
    }
    setEditing(false);
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-ink/8 bg-white px-5 py-3">
      <span className="text-sm font-medium">{envelope.name}</span>
      <div className="flex items-center gap-3">
        {editing ? (
          <div className="flex items-center gap-1">
            <span className="font-mono text-sm text-ink-light">$</span>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitEdit();
                if (e.key === "Escape") setEditing(false);
              }}
              autoFocus
              className="w-24 rounded border border-ink/10 bg-paper px-2 py-1 font-mono text-sm"
            />
          </div>
        ) : (
          <button
            onClick={() => !readOnly && startEditing()}
            disabled={readOnly}
            className="font-mono text-sm text-ink-light transition-colors hover:text-ink disabled:cursor-not-allowed"
          >
            {formatCents(envelope.allocation ?? 0)}/mo
          </button>
        )}
        {!readOnly && (
          <button
            onClick={() => updateEnvelope(envelope.id, { archived: true })}
            className="rounded p-1 text-ink-faint transition-colors hover:bg-paper-dark hover:text-ink"
            title="Archive"
          >
            <ArchiveIcon />
          </button>
        )}
      </div>
    </div>
  );
}
