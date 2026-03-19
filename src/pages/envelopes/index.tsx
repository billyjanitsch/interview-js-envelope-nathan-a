import { useState } from "react";

import { ChevronDownIcon } from "../../icons.tsx";
import type { Envelope } from "../../types.ts";
import { AddEnvelopeForm } from "./add-envelope-form.tsx";
import { EnvelopeListItem } from "./envelope-list-item.tsx";
import { IncomeInput } from "./income-input.tsx";

export function EnvelopesPage({
  addEnvelope,
  envelopes,
  income,
  readOnly,
  updateEnvelope,
  updateIncome,
}: {
  addEnvelope: (name: string, allocation: number) => void;
  envelopes: Envelope[];
  income: number;
  readOnly: boolean;
  updateEnvelope: (id: string, changes: Partial<Envelope>) => void;
  updateIncome: (value: number) => void;
}) {
  const [showArchived, setShowArchived] = useState(false);

  const active = envelopes.filter((e) => !e.archived && e.id !== "unallocated");
  const archived = envelopes.filter((e) => e.archived);
  const totalAllocations = active.reduce(
    (sum, e) => sum + (e.allocation ?? 0),
    0,
  );

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl">Envelopes</h2>

      <IncomeInput
        income={income}
        overAllocated={totalAllocations > income}
        readOnly={readOnly}
        totalAllocations={totalAllocations}
        updateIncome={updateIncome}
      />

      <div className="mb-8">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-ink-faint">
          Active Envelopes
        </h3>
        <div className="space-y-2">
          {active.map((envelope) => (
            <EnvelopeListItem
              key={envelope.id}
              envelope={envelope}
              readOnly={readOnly}
              updateEnvelope={updateEnvelope}
            />
          ))}
        </div>
      </div>

      {!readOnly && <AddEnvelopeForm addEnvelope={addEnvelope} />}

      {archived.length > 0 && (
        <div>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-faint transition-colors hover:text-ink-light"
          >
            <span
              className={`transition-transform ${showArchived ? "rotate-0" : "-rotate-90"}`}
            >
              <ChevronDownIcon />
            </span>
            Archived ({archived.length})
          </button>
          {showArchived && (
            <div className="space-y-2">
              {archived.map((envelope) => (
                <div
                  key={envelope.id}
                  className="flex items-center justify-between rounded-lg border border-ink/8 bg-white/60 px-5 py-3"
                >
                  <span className="text-sm text-ink-light">
                    {envelope.name}
                  </span>
                  {!readOnly && (
                    <button
                      onClick={() =>
                        updateEnvelope(envelope.id, { archived: false })
                      }
                      className="font-mono text-xs text-accent transition-colors hover:text-accent-light"
                    >
                      Restore
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
