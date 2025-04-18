import { Transaction } from '@/lib/types';
import { FilterOption } from '@/components/transactions/TransactionFilter';

export function filterTransactions(
  transactions: Transaction[],
  activeFilters: FilterOption[]
): Transaction[] {
  if (activeFilters.length === 0) {
    return transactions;
  }

  return transactions.filter(transaction => {
    const date = new Date(transaction.date);
    
    // Check each filter type
    const yearFilters = activeFilters.filter(f => f.type === 'year');
    const monthFilters = activeFilters.filter(f => f.type === 'month');
    const categoryFilters = activeFilters.filter(f => f.type === 'category');
    const accountFilters = activeFilters.filter(f => f.type === 'account'); // Add account filters
    
    // If there are year filters, check if the transaction year matches any of them
    if (yearFilters.length > 0) {
      const transactionYear = date.getFullYear();
      if (!yearFilters.some(f => f.value === transactionYear)) {
        return false;
      }
    }
    
    // If there are month filters, check if the transaction month matches any of them
    if (monthFilters.length > 0) {
      const transactionMonth = date.getMonth() + 1; // JavaScript months are 0-indexed
      if (!monthFilters.some(f => f.value === transactionMonth)) {
        return false;
      }
    }
    
    // If there are category filters, check if the transaction category matches any of them
    if (categoryFilters.length > 0) {
      if (!categoryFilters.some(f => f.value === transaction.category)) {
        return false;
      }
    }
    
    // If there are account filters, check if the transaction accountId matches any of them
    if (accountFilters.length > 0) {
      if (!accountFilters.some(f => f.value === transaction.accountId)) {
        return false;
      }
    }
    
    // If all checks pass, include the transaction
    return true;
  });
}

// Helper function to extract unique years from transactions
export function getUniqueYears(transactions: Transaction[]): number[] {
  const years = transactions.map(t => new Date(t.date).getFullYear());
  return [...new Set(years)].sort((a, b) => b - a); // Sort descending
}

// Helper function to extract unique categories from transactions
export function getUniqueCategories(transactions: Transaction[]): string[] {
  const categories = transactions.map(t => t.category);
  return [...new Set(categories)].sort();
}

// Months data for filtering
export const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' }
];