import { formatCents } from "../../currency.ts";

export function TotalsBar({
  totalBudget,
  totalRemaining,
  totalSpent,
}: {
  totalBudget: number;
  totalRemaining: number;
  totalSpent: number;
}) {
  return (
    <div className="mb-8 flex gap-6 rounded-lg bg-ink p-5 text-white">
      <div>
        <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-white/50">
          Total Spent
        </p>
        <p className="font-mono text-xl font-medium">
          {formatCents(totalSpent)}
        </p>
      </div>
      <div className="w-px bg-white/10" />
      <div>
        <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-white/50">
          Total Budget
        </p>
        <p className="font-mono text-xl font-medium">
          {formatCents(totalBudget)}
        </p>
      </div>
      <div className="w-px bg-white/10" />
      <div>
        <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-white/50">
          Remaining
        </p>
        <p
          className={`font-mono text-xl font-medium ${totalRemaining < 0 ? "text-red" : ""}`}
        >
          {formatCents(totalRemaining)}
        </p>
      </div>
    </div>
  );
}
