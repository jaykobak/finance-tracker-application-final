import React from 'react';
import { Transaction } from '@/lib/types';
import { TransactionItem } from './TransactionItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReceiptIcon } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionList({ transactions, onDeleteTransaction }: TransactionListProps) {
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
      <CardHeader className="pb-4">
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your recent financial activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4 -mr-4">
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onDelete={onDeleteTransaction}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}