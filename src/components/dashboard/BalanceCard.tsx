import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function BalanceCard({ balance }: { balance: number }) {
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('');
  
  // Get the user's currency preference from localStorage
  useEffect(() => {
    const storedCurrency = localStorage.getItem('finance-tracker-currency');
    const storedSymbol = localStorage.getItem('finance-tracker-currency-symbol');
    
    if (storedCurrency) {
      setCurrencyCode(storedCurrency);
    }
    
    if (storedSymbol) {
      setCurrencySymbol(storedSymbol);
    }
  }, []);
  
  // Format the balance based on currency
  let formattedBalance;
  if (currencyCode === 'NGN' || currencyCode === 'GHS') {
    // For Nigerian Naira and Ghanaian Cedi, use the symbol directly
    const symbol = currencyCode === 'NGN' ? '₦' : '₵';
    formattedBalance = `${symbol}${new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(balance)}`;
  } else {
    // For other currencies, use the standard Intl formatter
    formattedBalance = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "symbol",
    }).format(balance);
  }
  
  return (
    <Card className="bg-primary text-primary-foreground">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Current Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{formattedBalance}</div>
      </CardContent>
    </Card>
  );
}