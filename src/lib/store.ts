import { useState, useEffect } from 'react';
import { Transaction, FinancialSummary } from './types';
import { toast } from 'sonner';

// Helper to get a unique ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Local storage key
const STORAGE_KEY = 'financial-tracker-transactions';

// Initial data if needed
const initialTransactions: Transaction[] = [
  {
    id: generateId(),
    type: 'income',
    amount: 5000,
    description: 'Salary',
    category: 'Work',
    date: new Date().toISOString(),
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 1200,
    description: 'Rent',
    category: 'Housing',
    date: new Date().toISOString(),
  },
  {
    id: generateId(),
    type: 'expense',
    amount: 350,
    description: 'Groceries',
    category: 'Food',
    date: new Date().toISOString(),
  },
];

// Load transactions from localStorage
const loadTransactions = (): Transaction[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedTransactions = localStorage.getItem(STORAGE_KEY);
    return savedTransactions ? JSON.parse(savedTransactions) : initialTransactions;
  } catch (error) {
    console.error('Failed to load transactions from localStorage', error);
    return initialTransactions;
  }
};

// Save transactions to localStorage
const saveTransactions = (transactions: Transaction[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions to localStorage', error);
  }
};

// Calculate financial summary
export const calculateSummary = (transactions: Transaction[]): FinancialSummary => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
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
  const [isLoading, setIsLoading] = useState(true);
  
  // Load transactions on mount
  useEffect(() => {
    setTransactions(loadTransactions());
    setIsLoading(false);
  }, []);
  
  // Save transactions when they change
  useEffect(() => {
    if (!isLoading) {
      saveTransactions(transactions);
    }
  }, [transactions, isLoading]);
  
  // Get financial summary
  const summary = calculateSummary(transactions);
  
  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: generateId(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    toast.success(`${transaction.type === 'income' ? 'Income' : 'Expense'} added`, {
      description: transaction.description,
    });
  };
  
  // Delete a transaction
  const deleteTransaction = (id: string) => {
    setTransactions(prev => {
      const transaction = prev.find(t => t.id === id);
      if (!transaction) return prev;
      
      toast.success(`${transaction.type === 'income' ? 'Income' : 'Expense'} deleted`, {
        description: transaction.description,
      });
      
      return prev.filter(t => t.id !== id);
    });
  };
  
  return {
    transactions,
    summary,
    addTransaction,
    deleteTransaction,
    isLoading,
  };
};