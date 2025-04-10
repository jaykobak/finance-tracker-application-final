import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Transaction, TransactionType } from '@/lib/types';
import CurrencyInput from '@/components/ui/CurrencyInput';
import { PlusIcon, MinusIcon, PlusCircleIcon } from 'lucide-react';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Business income', 'Allowance', 'Other'],
  expense: ['Housing', 'Food', 'Transportation', 'Utilities', 'Shopping', 'Healthcare', 'Subscriptions', 'Church giving', 'Education', 'Maintenance', 'Travel', 'Other']
};

export function TransactionForm({ onAddTransaction }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // Keep track of user-added custom categories
  const [userCategories, setUserCategories] = useState<{
    income: string[];
    expense: string[];
  }>({
    income: [],
    expense: []
  });

  // Combined categories (default + user added)
  const allCategories = {
    income: [...CATEGORIES.income, ...userCategories.income],
    expense: [...CATEGORIES.expense, ...userCategories.expense]
  };

  const resetForm = () => {
    setAmount(0);
    setDescription('');
    setCategory('');
    setCustomCategory('');
    setShowCustomCategory(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (description.trim() === '') {
      alert('Please enter a description');
      return;
    }
    
    const finalCategory = showCustomCategory ? customCategory : category;
    
    if (finalCategory.trim() === '') {
      alert('Please select or enter a category');
      return;
    }
    
    // If using a custom category that's not in our lists yet, add it
    if (showCustomCategory && !allCategories[type].includes(customCategory)) {
      setUserCategories(prev => ({
        ...prev,
        [type]: [...prev[type], customCategory]
      }));
    }
    
    onAddTransaction({
      type,
      amount,
      description: description.trim(),
      category: finalCategory.trim(),
      date: new Date().toISOString(),
    });
    
    resetForm();
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim() !== '' && !allCategories[type].includes(customCategory)) {
      setUserCategories(prev => ({
        ...prev,
        [type]: [...prev[type], customCategory]
      }));
      setCategory(customCategory);
      setCustomCategory('');
      setShowCustomCategory(false);
    }
  };

  return (
    <Card className="w-full transition-all duration-300 animate-scale-in">
      <CardHeader className="pb-4">
        <CardTitle>Add Transaction</CardTitle>
        <CardDescription>Record your income or expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <RadioGroup
              value={type}
              onValueChange={(value) => {
                setType(value as TransactionType);
                setCategory('');
                setShowCustomCategory(false);
              }}
              className="flex"
            >
              <div className="flex items-center flex-1 space-x-2 bg-secondary/50 p-3 rounded-l-md cursor-pointer hover:bg-secondary transition-colors">
                <RadioGroupItem value="income" id="income" className="sr-only" />
                <Label
                  htmlFor="income"
                  className={`flex items-center justify-center w-full cursor-pointer space-x-2 ${
                    type === 'income' ? 'text-positive font-medium' : ''
                  }`}
                >
                  <PlusIcon size={16} />
                  <span>Income</span>
                </Label>
              </div>
              <div className="flex items-center flex-1 space-x-2 bg-secondary/50 p-3 rounded-r-md cursor-pointer hover:bg-secondary transition-colors">
                <RadioGroupItem value="expense" id="expense" className="sr-only" />
                <Label
                  htmlFor="expense"
                  className={`flex items-center justify-center w-full cursor-pointer space-x-2 ${
                    type === 'expense' ? 'text-negative font-medium' : ''
                  }`}
                >
                  <MinusIcon size={16} />
                  <span>Expense</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <CurrencyInput
              id="amount"
              value={amount}
              onChange={setAmount}
              placeholder="0.00"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this transaction for?"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="category">Category</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={() => setShowCustomCategory(!showCustomCategory)}
              >
                {showCustomCategory ? 'Select Existing' : 'Add Custom'}
              </Button>
            </div>
            
            {showCustomCategory ? (
              <div className="flex gap-2">
                <Input
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddCustomCategory}
                  disabled={customCategory.trim() === ''}
                  size="sm"
                >
                  <PlusCircleIcon size={16} className="mr-1" />
                  Add
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                {allCategories[type].map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={category === cat ? "default" : "outline"}
                    className={`h-auto py-2 text-xs font-normal ${
                      category === cat ? "" : "border-muted-foreground/20"
                    }`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={amount <= 0 || description.trim() === '' || 
              (showCustomCategory ? customCategory.trim() === '' : category === '')}
          >
            Add {type === 'income' ? 'Income' : 'Expense'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}