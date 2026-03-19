import { useState } from "react";

import { formatCents, parseDollars } from "../../currency.ts";

export function IncomeInput({
  income,
  overAllocated,
  readOnly,
  totalAllocations,
  updateIncome,
}: {
  income: number;
  overAllocated: boolean;
  readOnly: boolean;
  totalAllocations: number;
  updateIncome: (value: number) => void;
}) {
  const [incomeInput, setIncomeInput] = useState(() =>
    (income / 100).toFixed(2),
  );

  function handleBlur() {
    const cents = parseDollars(incomeInput);
    if (cents !== null && cents > 0) {
      updateIncome(cents);
      setIncomeInput((cents / 100).toFixed(2));
    } else {
      setIncomeInput((income / 100).toFixed(2));
    }
  }

  return (
    <div className="mb-8 rounded-lg border border-ink/8 bg-white p-5">
      <label className="mb-2 block font-mono text-xs uppercase tracking-wider text-ink-faint">
        Monthly Income
      </label>
      <div className="flex items-center gap-3">
        <span className="font-mono text-ink-light">$</span>
        <input
          type="text"
          value={incomeInput}
          onChange={(e) => setIncomeInput(e.target.value)}
          onBlur={handleBlur}
          disabled={readOnly}
          className="w-40 rounded border border-ink/10 bg-paper px-3 py-2 font-mono text-sm disabled:opacity-50"
        />
      </div>
      {overAllocated && (
        <p className="mt-2 font-mono text-xs text-red">
          Total allocations ({formatCents(totalAllocations)}) exceed monthly
          income ({formatCents(income)})
        </p>
      )}
    </div>
  );
}
