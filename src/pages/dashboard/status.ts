export type BudgetStatus = "none" | "on-track" | "over" | "watch";

export function getStatus(
  spent: number,
  allocation: number | null,
): BudgetStatus {
  if (allocation === null) return "none";
  const pct = spent / allocation;
  if (pct > 1) return "over";
  if (pct >= 0.8) return "watch";
  return "on-track";
}

export function statusLabel(status: BudgetStatus): string | null {
  switch (status) {
    case "on-track":
      return "On Track";
    case "watch":
      return "Watch";
    case "over":
      return "Over Budget";
    default:
      return null;
  }
}

export function statusColors(status: BudgetStatus) {
  switch (status) {
    case "on-track":
      return { badge: "bg-green-light text-green", bar: "bg-green" };
    case "watch":
      return { badge: "bg-amber-light text-amber", bar: "bg-amber" };
    case "over":
      return { badge: "bg-red-light text-red", bar: "bg-red" };
    default:
      return { badge: "", bar: "bg-ink-faint" };
  }
}

export function statusHex(status: BudgetStatus): string {
  switch (status) {
    case "on-track":
      return "#3d7c4a";
    case "watch":
      return "#b8860b";
    case "over":
      return "#c43030";
    default:
      return "#a39e97";
  }
}
