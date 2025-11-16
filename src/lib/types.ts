export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string; // ISO string
  accountId?: string; // Optional for backward compatibility
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
