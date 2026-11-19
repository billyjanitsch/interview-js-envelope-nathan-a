import type { Transaction } from "../../types.ts";

export type VelocityStatus = "near" | "over" | "under";

function getDaysInMonth(month: string): number {
  const [year, m] = month.split("-").map(Number);
  return new Date(year, m, 0).getDate();
}

export function calculateProjection(
  spent: number,
  transactions: Transaction[],
): { daysRemaining: number; projected: number } {
  if (transactions.length === 0) {
    return { daysRemaining: 0, projected: 0 };
  }

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const dayOfMonth = now.getDate();
  const daysInMonth = getDaysInMonth(month);

  const dailyRate = spent / dayOfMonth;
  const projected = dailyRate * daysInMonth;
  const daysRemaining = daysInMonth - dayOfMonth;

  return { daysRemaining, projected };
}

export function getVelocityStatus(
  projected: number,
  allocation: number,
): VelocityStatus {
  const ratio = projected / allocation;
  if (ratio > 1) return "over";
  if (ratio >= 0.9) return "near";
  return "under";
}
