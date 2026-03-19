import { useCallback, useEffect, useState } from "react";

import { RefreshIcon } from "../../icons.tsx";
import type { Envelope, ImportItem, Transaction } from "../../types.ts";
import { CompletedItem } from "./completed-item.tsx";
import { PendingItem } from "./pending-item.tsx";

const API_URL = import.meta.env.VITE_API_URL;

type FetchState =
  | { message: string; status: "error" }
  | { items: ImportItem[]; status: "loaded" }
  | { status: "idle" }
  | { status: "loading" };

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function ImportPage({
  addTransaction,
  confirm,
  confirmed,
  envelopes,
  month,
  readOnly,
}: {
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  confirm: (id: string) => void;
  confirmed: Set<string>;
  envelopes: Envelope[];
  month: string;
  readOnly: boolean;
}) {
  const [fetchState, setFetchState] = useState<FetchState>({ status: "idle" });
  const [envelopeSelections, setEnvelopeSelections] = useState<
    Record<string, string>
  >({});

  const activeEnvelopes = envelopes.filter((e) => !e.archived);

  const fetchImports = useCallback(async () => {
    setFetchState({ status: "loading" });
    try {
      const res = await fetch(`${API_URL}/api/import`);
      if (!res.ok) {
        throw new Error(`Server error (${res.status})`);
      }
      const data = (await res.json()) as ImportItem[];
      setFetchState({ items: data, status: "loaded" });
    } catch (err) {
      setFetchState({
        message: err instanceof Error ? err.message : "Failed to fetch imports",
        status: "error",
      });
    }
  }, []);

  useEffect(() => {
    fetchImports();
  }, [fetchImports]);

  const allItems = fetchState.status === "loaded" ? fetchState.items : [];
  const pendingItems = allItems.filter((item) => !confirmed.has(item.id));
  const completedItems = allItems.filter((item) => confirmed.has(item.id));

  function handleConfirm(item: ImportItem) {
    const envelopeId = envelopeSelections[item.id] || null;
    addTransaction({
      amount: item.amount,
      date: item.date,
      description: item.description,
      envelopeId,
      notes: "",
      source: "import",
    });
    confirm(item.id);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl">Import</h2>
        <button
          onClick={fetchImports}
          disabled={fetchState.status === "loading"}
          className="flex items-center gap-2 rounded-md border border-ink/10 px-3 py-1.5 font-mono text-xs transition-colors hover:bg-paper-dark disabled:opacity-50"
        >
          <RefreshIcon />
          Refresh
        </button>
      </div>

      {fetchState.status === "loading" && (
        <div className="rounded-lg border border-ink/8 bg-white p-12 text-center">
          <p className="font-mono text-sm text-ink-faint">Loading imports...</p>
        </div>
      )}

      {fetchState.status === "error" && (
        <div className="rounded-lg border border-red/20 bg-red-light p-8 text-center">
          <p className="mb-3 text-sm text-red">{fetchState.message}</p>
          <button
            onClick={fetchImports}
            className="rounded-md bg-red px-4 py-2 font-mono text-xs text-white transition-colors hover:bg-red/80"
          >
            Try again
          </button>
        </div>
      )}

      {fetchState.status === "loaded" && (
        <>
          <div className="mb-8">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-ink-faint">
              Pending ({pendingItems.length})
            </h3>
            {pendingItems.length === 0 ? (
              <div className="rounded-lg border border-ink/8 bg-white p-8 text-center">
                <p className="text-sm text-ink-faint">No pending imports</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingItems.map((item) => (
                  <PendingItem
                    key={item.id}
                    envelopeSelection={envelopeSelections[item.id] ?? ""}
                    envelopes={activeEnvelopes}
                    item={item}
                    onConfirm={() => handleConfirm(item)}
                    onSelectEnvelope={(value) =>
                      setEnvelopeSelections({
                        ...envelopeSelections,
                        [item.id]: value,
                      })
                    }
                    readOnly={readOnly}
                  />
                ))}
              </div>
            )}
          </div>

          {completedItems.length > 0 && (
            <div>
              <h3 className="mb-4 font-mono text-xs uppercase tracking-wider text-ink-faint">
                Completed ({completedItems.length})
              </h3>
              <div className="space-y-2">
                {completedItems.map((item) => (
                  <CompletedItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {fetchState.status === "loaded" && month !== currentMonth() && (
        <p className="mt-4 font-mono text-xs text-ink-faint">
          Viewing imports for the current period. Switch to the current month to
          confirm new imports.
        </p>
      )}
    </div>
  );
}
