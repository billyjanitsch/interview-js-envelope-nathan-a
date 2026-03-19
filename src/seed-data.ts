import type { Envelope, Transaction } from "./types.ts";

export const DEFAULT_ENVELOPES: Envelope[] = [
  { allocation: 30000, archived: false, id: "dining", name: "Dining & Bars" },
  {
    allocation: 12000,
    archived: false,
    id: "entertainment",
    name: "Entertainment",
  },
  { allocation: 60000, archived: false, id: "groceries", name: "Groceries" },
  {
    allocation: 10000,
    archived: false,
    id: "health",
    name: "Health & Pharmacy",
  },
  { allocation: 25000, archived: false, id: "shopping", name: "Shopping" },
  {
    allocation: 5000,
    archived: false,
    id: "subscriptions",
    name: "Subscriptions",
  },
  {
    allocation: 15000,
    archived: false,
    id: "transportation",
    name: "Transportation",
  },
  { allocation: 50000, archived: false, id: "travel", name: "Travel" },
  {
    allocation: null,
    archived: false,
    id: "unallocated",
    name: "Unallocated",
  },
];

export const DEFAULT_INCOME = 600000; // $6,000 in cents

type Merchant = {
  /** Inclusive range, in cents, that a charge amount is drawn from. */
  amount: [number, number];
  description: string;
  /** Picked from at random; a merchant with notes still gets blanks. */
  notes?: string[];
};

/** Discretionary spending: a random number of charges from a merchant pool. */
type SpendingPattern = {
  /** Inclusive range for how many charges land in a full month. */
  count: [number, number];
  envelopeId: string | null;
  merchants: Merchant[];
};

const SPENDING_PATTERNS: SpendingPattern[] = [
  {
    count: [6, 12],
    envelopeId: "groceries",
    merchants: [
      { amount: [4500, 12000], description: "Whole Foods Market" },
      { amount: [2800, 7500], description: "Trader Joe's" },
      { amount: [1500, 4800], description: "Key Food" },
      {
        amount: [1200, 3500],
        description: "Union Square Greenmarket",
        notes: ["Produce for the week"],
      },
      {
        amount: [8000, 16000],
        description: "Costco",
        notes: ["Bulk run", "Split with Sam"],
      },
    ],
  },
  {
    count: [4, 10],
    envelopeId: "dining",
    merchants: [
      { amount: [1200, 2800], description: "Joe's Pizza" },
      {
        amount: [4800, 9200],
        description: "Sake Bar Hagi",
        notes: ["Dinner with Alex", "Birthday dinner"],
      },
      { amount: [1400, 2600], description: "Xi'an Famous Foods" },
      { amount: [500, 1400], description: "Blue Bottle Coffee" },
      { amount: [3200, 6800], description: "Thai Diner", notes: ["Takeout"] },
      { amount: [1500, 3200], description: "Los Tacos No. 1" },
    ],
  },
  {
    count: [4, 11],
    envelopeId: "transportation",
    merchants: [
      {
        amount: [275, 3400],
        description: "MTA MetroCard",
        notes: ["7-day pass"],
      },
      { amount: [1100, 4200], description: "Uber", notes: ["Ride home"] },
      { amount: [1000, 3800], description: "Lyft" },
      { amount: [450, 1900], description: "Citi Bike" },
    ],
  },
  {
    count: [1, 5],
    envelopeId: "entertainment",
    merchants: [
      {
        amount: [1800, 3600],
        description: "AMC Theatres",
        notes: ["Movie night"],
      },
      { amount: [1700, 2200], description: "Film Forum" },
      {
        amount: [3500, 8500],
        description: "Brooklyn Steel",
        notes: ["Show tickets"],
      },
      { amount: [2300, 2800], description: "Museum of Natural History" },
    ],
  },
  {
    count: [1, 5],
    envelopeId: "shopping",
    merchants: [
      {
        amount: [2500, 9500],
        description: "Uniqlo",
        notes: ["Summer basics", "Replaced winter coat"],
      },
      { amount: [1200, 4800], description: "Muji" },
      { amount: [900, 7600], description: "Amazon" },
      { amount: [1500, 4500], description: "Housing Works" },
    ],
  },
  {
    count: [0, 3],
    envelopeId: "health",
    merchants: [
      {
        amount: [800, 4200],
        description: "CVS Pharmacy",
        notes: ["Vitamins", "Prescription refill"],
      },
      { amount: [600, 2800], description: "Duane Reade" },
      { amount: [2500, 5000], description: "Mount Sinai", notes: ["Copay"] },
    ],
  },
  {
    count: [0, 2],
    envelopeId: "travel",
    merchants: [
      { amount: [4800, 14000], description: "Amtrak", notes: ["Trip to DC"] },
      { amount: [18000, 42000], description: "Delta Air Lines" },
      {
        amount: [12000, 38000],
        description: "Airbnb",
        notes: ["Weekend away"],
      },
    ],
  },
  {
    // Uncategorized charges the user has not filed into an envelope yet.
    count: [0, 2],
    envelopeId: null,
    merchants: [
      { amount: [2000, 8000], description: "Venmo" },
      { amount: [4000, 10000], description: "ATM Withdrawal" },
      { amount: [1800, 6500], description: "Etsy" },
    ],
  },
];

/** Subscriptions bill the same amount on the same day every month. */
const RECURRING_CHARGES = [
  { amount: 1549, day: 2, description: "Netflix" },
  { amount: 1199, day: 6, description: "Spotify Premium" },
  { amount: 299, day: 12, description: "iCloud+" },
  { amount: 425, day: 18, description: "The New York Times" },
];

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function randomPick<T>(options: T[]): T {
  return options[randomInt(0, options.length - 1)];
}

function pickNotes(notes: string[] | undefined): string {
  if (!notes || Math.random() < 0.5) return "";
  return randomPick(notes);
}

/**
 * The last day of `month` worth seeding. Charges are only invented for days
 * that have already happened, so the current month fills in partially and a
 * future month gets nothing at all.
 */
function lastSeededDay(year: number, month: number): number {
  const now = new Date();
  if (year === now.getFullYear() && month === now.getMonth() + 1) {
    return now.getDate();
  }
  if (new Date(year, month - 1) > now) return 0;
  return new Date(year, month, 0).getDate(); // day 0 of next month
}

export function seedTransactionsForMonth(month: string): Transaction[] {
  const [year, m] = month.split("-").map(Number);
  const lastDay = lastSeededDay(year, m);
  if (lastDay === 0) return [];

  // A month still in progress gets proportionally fewer charges.
  const elapsed = lastDay / new Date(year, m, 0).getDate();
  const charges: Omit<Transaction, "id">[] = [];

  for (const pattern of SPENDING_PATTERNS) {
    const count = Math.round(randomInt(...pattern.count) * elapsed);
    for (let i = 0; i < count; i++) {
      const merchant = randomPick(pattern.merchants);
      charges.push({
        amount: randomInt(...merchant.amount),
        date: `${month}-${String(randomInt(1, lastDay)).padStart(2, "0")}`,
        description: merchant.description,
        envelopeId: pattern.envelopeId,
        notes: pickNotes(merchant.notes),
        source: "manual",
      });
    }
  }

  for (const charge of RECURRING_CHARGES) {
    if (charge.day > lastDay) continue;
    charges.push({
      amount: charge.amount,
      date: `${month}-${String(charge.day).padStart(2, "0")}`,
      description: charge.description,
      envelopeId: "subscriptions",
      notes: "Monthly subscription",
      source: "manual",
    });
  }

  charges.sort((a, b) => a.date.localeCompare(b.date));
  return charges.map((charge, i) => ({
    ...charge,
    id: `seed-${month}-${String(i + 1).padStart(2, "0")}`,
  }));
}
