export type Envelope = {
  allocation: number | null;
  archived: boolean;
  id: string;
  name: string;
};

export type Transaction = {
  amount: number;
  date: string;
  description: string;
  envelopeId: string | null;
  id: string;
  notes: string;
  source: "manual" | "import";
};

export type MonthState = {
  month: string;
  transactions: Transaction[];
};

export type ImportItem = {
  amount: number;
  date: string;
  description: string;
  id: string;
};
