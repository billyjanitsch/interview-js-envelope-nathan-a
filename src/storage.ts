import {
  DEFAULT_ENVELOPES,
  DEFAULT_INCOME,
  seedTransactionsForMonth,
} from "./seed-data.ts";
import type { Envelope, MonthState } from "./types.ts";

const ENVELOPES_KEY = "envelope:envelopes";
const INCOME_KEY = "envelope:income";
const IMPORT_CONFIRMED_KEY = "envelope:import-confirmed";

function monthKey(month: string): string {
  return `envelope:month:${month}`;
}

// --- Envelopes ---

export function loadEnvelopes(): Envelope[] {
  const raw = localStorage.getItem(ENVELOPES_KEY);
  if (!raw) {
    saveEnvelopes(DEFAULT_ENVELOPES);
    return DEFAULT_ENVELOPES;
  }
  return JSON.parse(raw) as Envelope[];
}

export function saveEnvelopes(envelopes: Envelope[]): void {
  localStorage.setItem(ENVELOPES_KEY, JSON.stringify(envelopes));
}

// --- Income ---

export function loadIncome(): number {
  const raw = localStorage.getItem(INCOME_KEY);
  if (!raw) {
    saveIncome(DEFAULT_INCOME);
    return DEFAULT_INCOME;
  }
  return JSON.parse(raw) as number;
}

export function saveIncome(income: number): void {
  localStorage.setItem(INCOME_KEY, JSON.stringify(income));
}

// --- Month State (Transactions) ---

export function loadMonthState(month: string): MonthState {
  const raw = localStorage.getItem(monthKey(month));
  if (!raw) {
    const transactions = seedTransactionsForMonth(month);
    if (transactions.length === 0) return { month, transactions: [] };

    const seeded = { month, transactions };
    saveMonthState(seeded);
    return seeded;
  }
  return JSON.parse(raw) as MonthState;
}

export function saveMonthState(state: MonthState): void {
  localStorage.setItem(monthKey(state.month), JSON.stringify(state));
}

// --- Import confirmed IDs ---

export function loadConfirmedImports(): Set<string> {
  const raw = localStorage.getItem(IMPORT_CONFIRMED_KEY);
  if (!raw) return new Set();
  return new Set(JSON.parse(raw) as string[]);
}

export function saveConfirmedImports(ids: Set<string>): void {
  localStorage.setItem(IMPORT_CONFIRMED_KEY, JSON.stringify([...ids]));
}
