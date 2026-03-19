import { useCallback, useEffect, useMemo, useState } from "react";

import {
  loadConfirmedImports,
  loadEnvelopes,
  loadIncome,
  loadMonthState,
  saveConfirmedImports,
  saveEnvelopes,
  saveIncome,
  saveMonthState,
} from "./storage.ts";
import type { Envelope, MonthState, Transaction } from "./types.ts";

// --- Envelopes ---

export function useEnvelopes() {
  const [envelopes, setEnvelopes] = useState<Envelope[]>(loadEnvelopes);

  const save = useCallback((updated: Envelope[]) => {
    setEnvelopes(updated);
    saveEnvelopes(updated);
  }, []);

  const addEnvelope = useCallback(
    (name: string, allocation: number) => {
      const id = crypto.randomUUID();
      const next = [
        ...envelopes.filter((e) => e.id !== "unallocated"),
        { allocation, archived: false, id, name },
        ...envelopes.filter((e) => e.id === "unallocated"),
      ];
      save(next);
    },
    [envelopes, save],
  );

  const updateEnvelope = useCallback(
    (id: string, changes: Partial<Envelope>) => {
      save(envelopes.map((e) => (e.id === id ? { ...e, ...changes } : e)));
    },
    [envelopes, save],
  );

  return { addEnvelope, envelopes, updateEnvelope };
}

// --- Income ---

export function useIncome() {
  const [income, setIncome] = useState<number>(loadIncome);

  const updateIncome = useCallback((value: number) => {
    setIncome(value);
    saveIncome(value);
  }, []);

  return { income, updateIncome };
}

// --- Transactions ---

export function useTransactions(month: string) {
  const [state, setState] = useState<MonthState>(() => loadMonthState(month));

  useEffect(() => {
    setState(loadMonthState(month));
  }, [month]);

  const save = useCallback((updated: MonthState) => {
    setState(updated);
    saveMonthState(updated);
  }, []);

  const addTransaction = useCallback(
    (tx: Omit<Transaction, "id">) => {
      const id = crypto.randomUUID();
      const next = {
        ...state,
        transactions: [...state.transactions, { ...tx, id }],
      };
      save(next);
    },
    [state, save],
  );

  const updateTransaction = useCallback(
    (id: string, changes: Partial<Transaction>) => {
      const next = {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === id ? { ...t, ...changes } : t,
        ),
      };
      save(next);
    },
    [state, save],
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      const next = {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== id),
      };
      save(next);
    },
    [state, save],
  );

  return {
    addTransaction,
    deleteTransaction,
    transactions: state.transactions,
    updateTransaction,
  };
}

// --- Spending summaries ---

export function useSpending(
  transactions: Transaction[],
  envelopes: Envelope[],
) {
  return useMemo(() => {
    const byEnvelope: Record<string, number> = {};
    for (const tx of transactions) {
      const envId = tx.envelopeId ?? "unallocated";
      byEnvelope[envId] = (byEnvelope[envId] ?? 0) + tx.amount;
    }

    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalBudget = envelopes
      .filter((e) => !e.archived && e.allocation !== null)
      .reduce((sum, e) => sum + e.allocation!, 0);

    return { byEnvelope, totalBudget, totalSpent };
  }, [transactions, envelopes]);
}

// --- Import confirmed IDs ---

export function useConfirmedImports() {
  const [confirmed, setConfirmed] = useState<Set<string>>(loadConfirmedImports);

  const confirm = useCallback(
    (id: string) => {
      const next = new Set(confirmed);
      next.add(id);
      setConfirmed(next);
      saveConfirmedImports(next);
    },
    [confirmed],
  );

  return { confirm, confirmed };
}
