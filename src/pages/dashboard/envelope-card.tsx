import { formatCents } from "../../currency.ts";
import { AlertTriangleIcon, CheckIcon } from "../../icons.tsx";
import type { Envelope, Transaction } from "../../types.ts";
import { getStatus, statusColors, statusLabel } from "./status.ts";
import {
  calculateProjection,
  getVelocityStatus,
  type VelocityStatus,
} from "./velocity.ts";

function VelocityIcon({ status }: { status: VelocityStatus }) {
  if (status === "under") {
    return (
      <span className="text-green">
        <CheckIcon size={14} />
      </span>
    );
  }
  if (status === "near") {
    return (
      <span className="text-amber">
        <AlertTriangleIcon size={14} />
      </span>
    );
  }
  return (
    <span className="text-red">
      <svg width={10} height={10} viewBox="0 0 10 10">
        <circle cx={5} cy={5} r={5} fill="currentColor" />
      </svg>
    </span>
  );
}

export function EnvelopeCard({
  allocation,
  envelope,
  spent,
  transactions,
}: {
  allocation: number | null;
  envelope: Envelope;
  spent: number;
  transactions: Transaction[];
}) {
  const status = getStatus(spent, allocation);
  const colors = statusColors(status);
  const pct = allocation ? Math.min((spent / allocation) * 100, 100) : 0;
  const remaining = allocation !== null ? allocation - spent : null;
  const label = statusLabel(status);

  const { daysRemaining, projected } = calculateProjection(spent, transactions);
  const velocityStatus =
    allocation !== null ? getVelocityStatus(projected, allocation) : null;

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

      {velocityStatus && (
        <div className="mt-3 flex items-center gap-1.5 border-t border-ink/6 pt-3">
          <VelocityIcon status={velocityStatus} />
          <span className="font-mono text-xs text-ink-faint">
            Projected: {formatCents(projected)} by month end
            {daysRemaining > 0 && <> &middot; {daysRemaining} days remaining</>}
          </span>
        </div>
      )}
    </div>
  );
}
