export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string; // ISO string
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}