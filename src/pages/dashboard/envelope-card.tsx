import { formatCents } from "../../currency.ts";
import type { Envelope } from "../../types.ts";
import { getStatus, statusColors, statusLabel } from "./status.ts";

export function EnvelopeCard({
  allocation,
  envelope,
  spent,
}: {
  allocation: number | null;
  envelope: Envelope;
  spent: number;
}) {
  const status = getStatus(spent, allocation);
  const colors = statusColors(status);
  const pct = allocation ? Math.min((spent / allocation) * 100, 100) : 0;
  const remaining = allocation !== null ? allocation - spent : null;
  const label = statusLabel(status);

  return (
    <div className="rounded-lg border border-ink/8 bg-white p-5">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-sm font-medium text-ink">{envelope.name}</h3>
        {label && (
          <span
            className={`rounded-full px-2 py-0.5 font-mono text-[11px] ${colors.badge}`}
          >
            {label}
          </span>
        )}
      </div>

      <div className="mb-3 flex items-baseline gap-1.5">
        <span className="font-mono text-lg font-medium">
          {formatCents(spent)}
        </span>
        {allocation !== null && (
          <span className="font-mono text-sm text-ink-light">
            / {formatCents(allocation)}
          </span>
        )}
      </div>

      {allocation !== null && (
        <>
          <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-paper-dark">
            <div
              className={`h-full rounded-full transition-all ${colors.bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="font-mono text-xs text-ink-faint">
            {remaining !== null && remaining >= 0
              ? `${formatCents(remaining)} remaining`
              : remaining !== null
                ? `${formatCents(Math.abs(remaining))} over`
                : null}
          </p>
        </>
      )}
    </div>
  );
}
