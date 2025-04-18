import React, { useState, useEffect } from 'react';
import { Transaction } from '@/lib/types';
import { TransactionItem } from './TransactionItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReceiptIcon } from 'lucide-react';
import { TransactionFilter, FilterOption } from './TransactionFilter';
import { filterTransactions, getUniqueYears, getUniqueCategories, months } from '@/lib/filterTransactions';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  accounts?: Array<{ id: string; name: string }>; // Add accounts prop
}

export function TransactionList({ 
  transactions, 
  onDeleteTransaction,
  accounts = [] // Default to empty array if not provided
}: TransactionListProps) {
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  
  // Get unique years and categories for filters
  const years = getUniqueYears(transactions);
  const categories = getUniqueCategories(transactions);
  
  // Update filtered transactions when transactions or filters change
  useEffect(() => {
    setFilteredTransactions(filterTransactions(transactions, activeFilters));
  }, [transactions, activeFilters]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: FilterOption[]) => {
    setActiveFilters(newFilters);
  };

  // Function to get account name from accountId
  const getAccountName = (accountId?: string) => {
    if (!accountId) return undefined;
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : undefined;
  };

  if (transactions.length === 0) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-4">
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your transaction history will appear here</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <div className="bg-muted p-4 rounded-full mb-3">
            <ReceiptIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No transactions yet</h3>
          <p className="text-muted-foreground text-sm max-w-xs">
            Start by adding your income and expenses using the form above
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your recent financial activities</CardDescription>
        </div>
        <TransactionFilter
          years={years}
          months={months}
          categories={categories}
          accounts={accounts} // Pass accounts to the filter
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
        />
      </CardHeader>
      <CardContent>
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 text-sm mb-3">
            <span className="text-muted-foreground">Filtered by:</span>
            {activeFilters.map((filter, index) => (
              <span key={index} className="bg-secondary px-2 py-1 rounded-md">
                {filter.type}: {filter.label}
              </span>
            ))}
          </div>
        )}
        
        <ScrollArea className="h-[350px] pr-4 -mr-4">
          {filteredTransactions.length > 0 ? (
            <div className="space-y-2">
              {filteredTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onDelete={onDeleteTransaction}
                  accountName={getAccountName(transaction.accountId)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No transactions match your filters
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}