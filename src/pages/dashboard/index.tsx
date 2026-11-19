import type { Envelope, Transaction } from "../../types.ts";
import { EnvelopeCard } from "./envelope-card.tsx";
import { SpendingChart } from "./spending-chart.tsx";
import { getStatus, statusHex } from "./status.ts";
import { TotalsBar } from "./totals-bar.tsx";

export function Dashboard({
  envelopes,
  transactions,
}: {
  envelopes: Envelope[];
  transactions: Transaction[];
}) {
  const byEnvelope: Record<string, number> = {};
  for (const tx of transactions) {
    const envId = tx.envelopeId ?? "unallocated";
    byEnvelope[envId] = (byEnvelope[envId] ?? 0) + tx.amount;
  }

  const activeEnvelopes = envelopes.filter(
    (e) => !e.archived && e.id !== "unallocated",
  );
  const unallocated = envelopes.find((e) => e.id === "unallocated");
  const unallocatedSpent = byEnvelope["unallocated"] ?? 0;

  const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalBudget = activeEnvelopes.reduce(
    (sum, e) => sum + (e.allocation ?? 0),
    0,
  );
  const totalRemaining = totalBudget - totalSpent;

  const chartData = activeEnvelopes.map((e) => {
    const spent = byEnvelope[e.id] ?? 0;
    const status = getStatus(spent, e.allocation);
    return {
      budgeted: (e.allocation ?? 0) / 100,
      fill: statusHex(status),
      name: e.name,
      spent: spent / 100,
    };
  });

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl">Dashboard</h2>

      <TotalsBar
        totalBudget={totalBudget}
        totalRemaining={totalRemaining}
        totalSpent={totalSpent}
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activeEnvelopes.map((envelope) => (
          <EnvelopeCard
            key={envelope.id}
            allocation={envelope.allocation}
            envelope={envelope}
            spent={byEnvelope[envelope.id] ?? 0}
            transactions={transactions.filter(
              (tx) => tx.envelopeId === envelope.id,
            )}
          />
        ))}
      </div>

      {unallocated && unallocatedSpent > 0 && (
        <div className="mb-8">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-ink-faint">
            Unallocated
          </h3>
          <EnvelopeCard
            allocation={null}
            envelope={unallocated}
            spent={unallocatedSpent}
            transactions={transactions.filter((tx) => tx.envelopeId === null)}
          />
        </div>
      )}

      <SpendingChart data={chartData} />
    </div>
  );
}
