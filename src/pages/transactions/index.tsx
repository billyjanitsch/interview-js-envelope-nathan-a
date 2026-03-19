import type { Envelope, Transaction } from "../../types.ts";
import { AddTransactionForm } from "./add-transaction-form.tsx";
import { TransactionTable } from "./transaction-table.tsx";

export function TransactionsPage({
  addTransaction,
  deleteTransaction,
  envelopes,
  readOnly,
  transactions,
  updateTransaction,
}: {
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  envelopes: Envelope[];
  readOnly: boolean;
  transactions: Transaction[];
  updateTransaction: (id: string, changes: Partial<Transaction>) => void;
}) {
  return (
    <div>
      <h2 className="mb-6 font-display text-2xl">Transactions</h2>

      {!readOnly && (
        <AddTransactionForm
          addTransaction={addTransaction}
          envelopes={envelopes}
        />
      )}

      <TransactionTable
        deleteTransaction={deleteTransaction}
        envelopes={envelopes}
        readOnly={readOnly}
        transactions={transactions}
        updateTransaction={updateTransaction}
      />
    </div>
  );
}
