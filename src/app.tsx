import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import {
  useConfirmedImports,
  useEnvelopes,
  useIncome,
  useTransactions,
} from "./hooks.ts";
import { Dashboard } from "./pages/dashboard/index.tsx";
import { EnvelopesPage } from "./pages/envelopes/index.tsx";
import { ImportPage } from "./pages/import/index.tsx";
import { TransactionsPage } from "./pages/transactions/index.tsx";
import { Sidebar } from "./sidebar.tsx";

function currentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function AppContent() {
  const [month, setMonth] = useState(currentMonth);
  const readOnly = month < currentMonth();

  const { addEnvelope, envelopes, updateEnvelope } = useEnvelopes();
  const { income, updateIncome } = useIncome();
  const { addTransaction, deleteTransaction, transactions, updateTransaction } =
    useTransactions(month);
  const { confirm, confirmed } = useConfirmedImports();

  return (
    <div className="flex h-screen">
      <Sidebar month={month} onMonthChange={setMonth} />
      <main className="flex-1 overflow-y-auto px-10 py-8">
        <div className="mx-auto max-w-5xl">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard envelopes={envelopes} transactions={transactions} />
              }
            />
            <Route
              path="/envelopes"
              element={
                <EnvelopesPage
                  addEnvelope={addEnvelope}
                  envelopes={envelopes}
                  income={income}
                  readOnly={readOnly}
                  updateEnvelope={updateEnvelope}
                  updateIncome={updateIncome}
                />
              }
            />
            <Route
              path="/transactions"
              element={
                <TransactionsPage
                  addTransaction={addTransaction}
                  deleteTransaction={deleteTransaction}
                  envelopes={envelopes}
                  readOnly={readOnly}
                  transactions={transactions}
                  updateTransaction={updateTransaction}
                />
              }
            />
            <Route
              path="/import"
              element={
                <ImportPage
                  addTransaction={addTransaction}
                  confirm={confirm}
                  confirmed={confirmed}
                  envelopes={envelopes}
                  month={month}
                  readOnly={readOnly}
                />
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
