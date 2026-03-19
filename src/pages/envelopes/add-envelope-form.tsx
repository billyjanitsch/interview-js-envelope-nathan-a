import { useState } from "react";

import { parseDollars } from "../../currency.ts";
import { PlusIcon } from "../../icons.tsx";

export function AddEnvelopeForm({
  addEnvelope,
}: {
  addEnvelope: (name: string, allocation: number) => void;
}) {
  const [newName, setNewName] = useState("");
  const [newAllocation, setNewAllocation] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cents = parseDollars(newAllocation);
    if (!newName.trim() || cents === null || cents <= 0) return;
    addEnvelope(newName.trim(), cents);
    setNewName("");
    setNewAllocation("");
  }

  return (
    <div className="mb-8 rounded-lg border border-ink/8 bg-white p-5">
      <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-ink-faint">
        Add Envelope
      </h3>
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-ink-light">Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Clothing"
            className="w-full rounded border border-ink/10 bg-paper px-3 py-2 text-sm"
          />
        </div>
        <div className="w-36">
          <label className="mb-1 block text-xs text-ink-light">
            Monthly Budget
          </label>
          <div className="flex items-center gap-1">
            <span className="font-mono text-sm text-ink-light">$</span>
            <input
              type="text"
              value={newAllocation}
              onChange={(e) => setNewAllocation(e.target.value)}
              placeholder="0.00"
              className="w-full rounded border border-ink/10 bg-paper px-3 py-2 font-mono text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink/80"
        >
          <PlusIcon />
          Add
        </button>
      </form>
    </div>
  );
}
