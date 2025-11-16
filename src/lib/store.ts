import { useState, useEffect } from "react";
import { Transaction, FinancialSummary } from "./types";
import { toast } from "sonner";
import { transactionsAPI } from "./api";

// Calculate financial summary
export const calculateSummary = (
  transactions: Transaction[]
): FinancialSummary => {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

// Hook to manage transactions
export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions from API on mount
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await transactionsAPI.getAll();

      // Convert transaction IDs to strings and amounts to numbers
      const formattedTransactions = response.transactions.map((t: any) => ({
        ...t,
        id: String(t.id),
        amount: parseFloat(t.amount),
        // Preserve account reference if present (frontend or future backend)
        accountId: t.accountId ?? t.account_id ?? t.account_id ?? undefined,
      }));

      setTransactions(formattedTransactions);

      // Fetch summary
      const summaryResponse = await transactionsAPI.getSummary();
      setSummary(summaryResponse.summary);
    } catch (error: any) {
      console.error("Failed to load transactions:", error);
      toast.error(error.message || "Failed to load transactions");
      // Set empty state on error
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Add a new transaction
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    try {
      const response = await transactionsAPI.create(transaction);

      const newTransaction: Transaction = {
        ...response.transaction,
        id: String(response.transaction.id),
        amount: parseFloat(response.transaction.amount),
        // Persist the selected account locally for UI balance updates
        accountId: transaction.accountId,
      } as unknown as Transaction;

      // Update local state
      setTransactions((prev) => [newTransaction, ...prev]);

      // Recalculate summary
      const newSummary = calculateSummary([newTransaction, ...transactions]);
      setSummary(newSummary);

      toast.success(
        `${transaction.type === "income" ? "Income" : "Expense"} added`,
        {
          description: transaction.description,
        }
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to add transaction");
      throw error;
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id: string) => {
    try {
      const transaction = transactions.find((t) => t.id === id);

      await transactionsAPI.delete(id);

      // Update local state
      const updatedTransactions = transactions.filter((t) => t.id !== id);
      setTransactions(updatedTransactions);

      // Recalculate summary
      const newSummary = calculateSummary(updatedTransactions);
      setSummary(newSummary);

      if (transaction) {
        toast.success(
          `${transaction.type === "income" ? "Income" : "Expense"} deleted`,
          {
            description: transaction.description,
          }
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete transaction");
      throw error;
    }
  };

  return {
    transactions,
    summary,
    addTransaction,
    deleteTransaction,
    isLoading,
    refetch: fetchTransactions,
  };
};
