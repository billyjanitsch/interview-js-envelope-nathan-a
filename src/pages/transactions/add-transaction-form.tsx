import { useState } from "react";

import { parseDollars } from "../../currency.ts";
import type { Envelope, Transaction } from "../../types.ts";

export function AddTransactionForm({
  addTransaction,
  envelopes,
}: {
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  envelopes: Envelope[];
}) {
  const [form, setForm] = useState({
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    envelopeId: "",
    notes: "",
  });

  const activeEnvelopes = envelopes.filter((e) => !e.archived);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cents = parseDollars(form.amount);
    if (!form.description.trim() || cents === null || cents <= 0) return;
    addTransaction({
      amount: cents,
      date: form.date,
      description: form.description.trim(),
      envelopeId: form.envelopeId || null,
      notes: form.notes,
      source: "manual",
    });
    setForm({
      amount: "",
      date: new Date().toISOString().slice(0, 10),
      description: "",
      envelopeId: "",
      notes: "",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-lg border border-ink/8 bg-white p-5"
    >
      <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-ink-faint">
        Add Transaction
      </h3>
      <div className="flex flex-wrap gap-3">
        <div className="w-36">
          <label className="mb-1 block text-xs text-ink-light">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full rounded border border-ink/10 bg-paper px-3 py-2 font-mono text-sm"
          />
        </div>
        <div className="min-w-48 flex-1">
          <label className="mb-1 block text-xs text-ink-light">
            Description
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="e.g. Whole Foods"
            className="w-full rounded border border-ink/10 bg-paper px-3 py-2 text-sm"
          />
        </div>
        <div className="w-28">
          <label className="mb-1 block text-xs text-ink-light">Amount</label>
          <div className="flex items-center gap-1">
            <span className="font-mono text-sm text-ink-light">$</span>
            <input
              type="text"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              className="w-full rounded border border-ink/10 bg-paper px-2 py-2 font-mono text-sm"
            />
          </div>
        </div>
        <div className="w-44">
          <label className="mb-1 block text-xs text-ink-light">Envelope</label>
          <select
            value={form.envelopeId}
            onChange={(e) => setForm({ ...form, envelopeId: e.target.value })}
            className="w-full rounded border border-ink/10 bg-paper px-3 py-2 text-sm"
          >
            <option value="">None</option>
            {activeEnvelopes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-32 flex-1">
          <label className="mb-1 block text-xs text-ink-light">Notes</label>
          <input
            type="text"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full rounded border border-ink/10 bg-paper px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink/80"
          >
            Add
          </button>
        </div>
      </div>
    </form>
  );
}
