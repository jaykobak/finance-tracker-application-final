import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, DollarSignIcon } from 'lucide-react';
import { FinancialSummary, Transaction } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { format, isToday, isThisWeek, isThisMonth, isThisYear, startOfDay, startOfWeek, startOfMonth, startOfYear } from 'date-fns';

interface BalanceChartProps {
  summary: FinancialSummary;
  transactions: Transaction[];
}

type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export function BalanceChart({ summary, transactions }: BalanceChartProps) {
  const { balance } = summary;
  const [animate, setAnimate] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  
  // Get the currency symbol from localStorage when the component mounts
  useEffect(() => {
    const storedSymbol = localStorage.getItem('finance-tracker-currency-symbol');
    if (storedSymbol) {
      setCurrencySymbol(storedSymbol);
    }
  }, []);
  
  // Trigger animation when summary changes
  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [summary]);

  // Format currency values
  const formatCurrency = (value: number) => {
    return `${currencySymbol}${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  // Calculate summaries for different time periods
  const calculatePeriodSummary = (period: TimePeriod) => {
    // Filter transactions based on time period
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      switch (period) {
        case 'daily':
          return isToday(transactionDate);
        case 'weekly':
          return isThisWeek(transactionDate, { weekStartsOn: 1 });
        case 'monthly':
          return isThisMonth(transactionDate);
        case 'yearly':
          return isThisYear(transactionDate);
        default:
          return false;
      }
    });
    
    // Calculate income and expense for the period
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    return { income, expense, balance: income - expense };
  };

  const periodSummaries: Record<TimePeriod, { income: number, expense: number, balance: number }> = {
    daily: calculatePeriodSummary('daily'),
    weekly: calculatePeriodSummary('weekly'),
    monthly: calculatePeriodSummary('monthly'),
    yearly: calculatePeriodSummary('yearly')
  };

  const formattedBalance = formatCurrency(balance);

  // Get the period title
  const getPeriodTitle = (period: TimePeriod): string => {
    switch(period) {
      case 'daily':
        return `Today (${format(new Date(), 'MMM d')})`;
      case 'weekly':
        return `This Week (${format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'MMM d')} - ${format(new Date(), 'MMM d')})`;
      case 'monthly':
        return `This Month (${format(new Date(), 'MMMM yyyy')})`;
      case 'yearly':
        return `This Year (${format(new Date(), 'yyyy')})`;
      default:
        return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fade-up">
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Current Balance</CardTitle>
          <CardDescription>Your net financial position</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center pt-6 pb-4">
            <div className={`p-4 rounded-full mb-3 ${
              balance >= 0 ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'
            }`}>
              <DollarSignIcon size={28} />
            </div>
            <h2 
              className={`text-3xl font-bold ${
                balance >= 0 ? 'text-positive' : 'text-negative'
              } ${animate ? 'scale-110' : 'scale-100'} balance-transition`}
            >
              {formattedBalance}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Net balance
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Income vs. Expenses</CardTitle>
          <CardDescription>Financial flow visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <Carousel className="w-full">
            <CarouselContent>
              {(Object.keys(periodSummaries) as TimePeriod[]).map((period) => (
                <CarouselItem key={period}>
                  <div className="p-1">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {getPeriodTitle(period)}
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-center space-x-2 mb-1">
                          <ArrowUpIcon className="h-4 w-4 text-positive" />
                          <span className="text-sm font-medium">Income</span>
                        </div>
                        <span className="text-xl font-bold text-positive">
                          {formatCurrency(periodSummaries[period].income)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-center space-x-2 mb-1">
                          <ArrowDownIcon className="h-4 w-4 text-negative" />
                          <span className="text-sm font-medium">Expenses</span>
                        </div>
                        <span className="text-xl font-bold text-negative">
                          {formatCurrency(periodSummaries[period].expense)}
                        </span>
                      </div>
                    </div>
                    
                    {(periodSummaries[period].income > 0 || periodSummaries[period].expense > 0) ? (
                      <div className="h-[180px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { 
                                  name: 'Income', 
                                  value: periodSummaries[period].income, 
                                  color: 'hsl(var(--positive))' 
                                },
                                { 
                                  name: 'Expenses', 
                                  value: periodSummaries[period].expense, 
                                  color: 'hsl(var(--negative))' 
                                }
                              ].filter(item => item.value > 0)}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {[
                                { name: 'Income', value: periodSummaries[period].income, color: 'hsl(var(--positive))' },
                                { name: 'Expenses', value: periodSummaries[period].expense, color: 'hsl(var(--negative))' }
                              ]
                                .filter(entry => entry.value > 0)
                                .map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))
                              }
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [
                                formatCurrency(value as number),
                                '',
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[180px] mt-4 flex items-center justify-center">
                        <p className="text-muted-foreground">No data for this period</p>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious className="static transform-none translate-y-0 mr-2" />
              <CarouselNext className="static transform-none translate-y-0 ml-2" />
            </div>
          </Carousel>
        </CardContent>
      </Card>
    </div>
  );
}