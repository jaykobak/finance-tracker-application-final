import React from 'react';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { TransactionList } from '@/components/transactions/TransactionList';
import { BalanceChart } from '@/components/charts/BalanceChart';
import { useTransactions } from '@/lib/store';
import { Skeleton } from '@/components/ui/skeleton';

export function Dashboard() {
  const { transactions, summary, addTransaction, deleteTransaction, isLoading } = useTransactions();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Skeleton className="h-[180px] w-full" />
          <Skeleton className="h-[180px] w-full md:col-span-2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BalanceChart summary={summary} transactions={transactions} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionForm onAddTransaction={addTransaction} />
        <TransactionList 
          transactions={transactions}
          onDeleteTransaction={deleteTransaction}
        />
      </div>
    </div>
  );
}