import { NavLink } from "react-router";

import { ChevronLeftIcon, ChevronRightIcon } from "./icons.tsx";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/" },
  { label: "Envelopes", to: "/envelopes" },
  { label: "Transactions", to: "/transactions" },
  { label: "Import", to: "/import" },
];

function formatMonth(month: string): string {
  const [year, m] = month.split("-");
  const date = new Date(Number(year), Number(m) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function shiftMonth(month: string, delta: number): string {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(year, m - 1 + delta);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function Sidebar({
  month,
  onMonthChange,
}: {
  month: string;
  onMonthChange: (month: string) => void;
}) {
  const isCurrentMonth = month === currentMonth();
  const isPast = month < currentMonth();

  return (
    <aside className="flex h-screen w-60 flex-shrink-0 flex-col bg-sidebar text-white/90">
      <div className="px-6 pt-8 pb-6">
        <h1 className="font-display text-2xl italic text-white">Envelope</h1>
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onMonthChange(shiftMonth(month, -1))}
            className="rounded p-1 text-white/50 transition-colors hover:bg-sidebar-hover hover:text-white"
          >
            <ChevronLeftIcon />
          </button>
          <span className="flex-1 text-center font-mono text-sm tracking-wide">
            {formatMonth(month)}
          </span>
          <button
            onClick={() => onMonthChange(shiftMonth(month, 1))}
            disabled={isCurrentMonth}
            className="rounded p-1 text-white/50 transition-colors hover:bg-sidebar-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRightIcon />
          </button>
        </div>
        {isPast && (
          <div className="mt-2 flex justify-center">
            <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[11px] tracking-wide text-white/50">
              Read only
            </span>
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-hover text-white"
                  : "text-white/60 hover:bg-sidebar-hover hover:text-white/90"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-6 pb-6 pt-4">
        <p className="font-mono text-[11px] text-white/30">
          Monthly budget tracker
        </p>
      </div>
    </aside>
  );
}
