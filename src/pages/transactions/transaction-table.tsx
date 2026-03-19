import { useState } from "react";

import { formatCents, parseDollars } from "../../currency.ts";
import { TrashIcon } from "../../icons.tsx";
import type { Envelope, Transaction } from "../../types.ts";
import { SortButton, type SortField } from "./sort-button.tsx";

type SortDir = "asc" | "desc";

const PAGE_SIZE = 15;

export function TransactionTable({
  deleteTransaction,
  envelopes,
  readOnly,
  transactions,
  updateTransaction,
}: {
  deleteTransaction: (id: string) => void;
  envelopes: Envelope[];
  readOnly: boolean;
  transactions: Transaction[];
  updateTransaction: (id: string, changes: Partial<Transaction>) => void;
}) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Transaction>>({});

  const activeEnvelopes = envelopes.filter((e) => !e.archived);
  const envelopeMap = Object.fromEntries(envelopes.map((e) => [e.id, e]));

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(0);
  }

  const sorted = [...transactions].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortField) {
      case "date":
        return a.date.localeCompare(b.date) * dir;
      case "description":
        return a.description.localeCompare(b.description) * dir;
      case "amount":
        return (a.amount - b.amount) * dir;
      case "envelope":
        return (
          (envelopeMap[a.envelopeId ?? ""]?.name ?? "").localeCompare(
            envelopeMap[b.envelopeId ?? ""]?.name ?? "",
          ) * dir
        );
    }
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function startEdit(tx: Transaction) {
    setEditingId(tx.id);
    setEditValues({
      amount: tx.amount,
      date: tx.date,
      description: tx.description,
      envelopeId: tx.envelopeId,
      notes: tx.notes,
    });
  }

  function commitEdit() {
    if (!editingId) return;
    updateTransaction(editingId, editValues);
    setEditingId(null);
    setEditValues({});
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues({});
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-ink/8 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink/8 text-left">
              <th className="px-5 py-3 font-mono text-[11px] font-normal uppercase tracking-wider text-ink-faint">
                <SortButton
                  field="date"
                  activeField={sortField}
                  onSort={handleSort}
                >
                  Date
                </SortButton>
              </th>
              <th className="px-5 py-3 font-mono text-[11px] font-normal uppercase tracking-wider text-ink-faint">
                <SortButton
                  field="description"
                  activeField={sortField}
                  onSort={handleSort}
                >
                  Description
                </SortButton>
              </th>
              <th className="px-5 py-3 font-mono text-[11px] font-normal uppercase tracking-wider text-ink-faint">
                <SortButton
                  field="envelope"
                  activeField={sortField}
                  onSort={handleSort}
                >
                  Envelope
                </SortButton>
              </th>
              <th className="px-5 py-3 font-mono text-[11px] font-normal uppercase tracking-wider text-ink-faint">
                Notes
              </th>
              <th className="px-5 py-3 text-right font-mono text-[11px] font-normal uppercase tracking-wider text-ink-faint">
                <SortButton
                  field="amount"
                  activeField={sortField}
                  onSort={handleSort}
                >
                  Amount
                </SortButton>
              </th>
              {!readOnly && <th className="w-10 px-3 py-3" />}
            </tr>
          </thead>
          <tbody>
            {paginated.map((tx) => {
              const isEditing = editingId === tx.id;
              return (
                <tr key={tx.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-3">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editValues.date ?? tx.date}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            date: e.target.value,
                          })
                        }
                        className="w-32 rounded border border-ink/10 bg-paper px-2 py-1 font-mono text-sm"
                      />
                    ) : (
                      <button
                        onClick={() => !readOnly && startEdit(tx)}
                        disabled={readOnly}
                        className="font-mono text-sm disabled:cursor-default"
                      >
                        {tx.date}
                      </button>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValues.description ?? tx.description}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            description: e.target.value,
                          })
                        }
                        className="w-full rounded border border-ink/10 bg-paper px-2 py-1 text-sm"
                      />
                    ) : (
                      <span className="text-sm">
                        {tx.description}
                        {tx.source === "import" && (
                          <span className="ml-2 inline-block rounded bg-paper-dark px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">
                            import
                          </span>
                        )}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {isEditing ? (
                      <select
                        value={editValues.envelopeId ?? tx.envelopeId ?? ""}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            envelopeId: e.target.value || null,
                          })
                        }
                        className="w-full rounded border border-ink/10 bg-paper px-2 py-1 text-sm"
                      >
                        <option value="">None</option>
                        {activeEnvelopes.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="font-mono text-xs text-ink-light">
                        {envelopeMap[tx.envelopeId ?? ""]?.name ?? "—"}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValues.notes ?? tx.notes}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            notes: e.target.value,
                          })
                        }
                        className="w-full rounded border border-ink/10 bg-paper px-2 py-1 text-sm"
                      />
                    ) : (
                      <span className="text-sm text-ink-light">{tx.notes}</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-mono text-sm text-ink-light">
                          $
                        </span>
                        <input
                          type="text"
                          value={
                            editValues.amount !== undefined
                              ? (editValues.amount / 100).toFixed(2)
                              : (tx.amount / 100).toFixed(2)
                          }
                          onChange={(e) => {
                            const cents = parseDollars(e.target.value);
                            if (cents !== null) {
                              setEditValues({ ...editValues, amount: cents });
                            }
                          }}
                          className="w-20 rounded border border-ink/10 bg-paper px-2 py-1 text-right font-mono text-sm"
                        />
                      </div>
                    ) : (
                      <span className="font-mono text-sm">
                        {formatCents(tx.amount)}
                      </span>
                    )}
                  </td>
                  {!readOnly && (
                    <td className="px-3 py-3">
                      {isEditing ? (
                        <div className="flex gap-1">
                          <button
                            onClick={commitEdit}
                            className="rounded px-2 py-1 font-mono text-[11px] text-green transition-colors hover:bg-green-light"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="rounded px-2 py-1 font-mono text-[11px] text-ink-faint transition-colors hover:bg-paper-dark"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => deleteTransaction(tx.id)}
                          className="rounded p-1 text-ink-faint transition-colors hover:bg-red-light hover:text-red"
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
            {paginated.length === 0 && (
              <tr>
                <td
                  colSpan={readOnly ? 5 : 6}
                  className="px-5 py-12 text-center text-sm text-ink-faint"
                >
                  No transactions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="font-mono text-xs text-ink-faint">
            {sorted.length} transaction{sorted.length !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`rounded px-3 py-1 font-mono text-xs transition-colors ${
                  page === i
                    ? "bg-ink text-white"
                    : "text-ink-light hover:bg-paper-dark"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
