import React, { useState, useEffect } from 'react';
import { Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { PlusCircleIcon, MinusCircleIcon, MoreVerticalIcon, Trash2Icon, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

export function TransactionItem({
  transaction,
  onDelete,
}: TransactionItemProps) {
  const { id, type, amount, description, category, date } = transaction;
  const isIncome = type === "income";
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');

  // Check if we're on mobile
  const isMobile = useMediaQuery('(max-width: 640px)');

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

  const formattedDate = format(new Date(date), "MMM d, yyyy");
  const formattedTime = format(new Date(date), "h:mm a");

  // Format currency with abbreviated suffixes (K, M, B) for large numbers
  const formatCurrency = (amount: number) => {
    // Special handling for Nigerian Naira and Ghanaian Cedi
    if (currencyCode === 'NGN' || currencyCode === 'GHS') {
      const symbol = currencyCode === 'NGN' ? '₦' : '₵';
      
      // Format with appropriate suffix based on amount
      if (Math.abs(amount) < 100000) {
        return `${symbol}${new Intl.NumberFormat("en-US", {
          style: "decimal",
          maximumFractionDigits: 0,
        }).format(amount)}`;
      } else if (Math.abs(amount) >= 100000 && Math.abs(amount) < 1000000) {
        const formatted = new Intl.NumberFormat("en-US", {
          style: "decimal",
          maximumFractionDigits: 1,
        }).format(amount / 1000).replace(".0", "");
        return `${symbol}${formatted}K`;
      } else if (Math.abs(amount) >= 1000000 && Math.abs(amount) < 1000000000) {
        const formatted = new Intl.NumberFormat("en-US", {
          style: "decimal",
          maximumFractionDigits: 1,
        }).format(amount / 1000000).replace(".0", "");
        return `${symbol}${formatted}M`;
      } else if (Math.abs(amount) >= 1000000000) {
        const formatted = new Intl.NumberFormat("en-US", {
          style: "decimal",
          maximumFractionDigits: 1,
        }).format(amount / 1000000000).replace(".0", "");
        return `${symbol}${formatted}B`;
      }
    }
    
    // For other currencies, use the standard Intl formatter
    // If amount is less than 100,000, just return regular formatting
    if (Math.abs(amount) < 100000) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "symbol",
        maximumFractionDigits: 0,
      }).format(amount);
    }

    // For thousands (K)
    else if (Math.abs(amount) >= 100000 && Math.abs(amount) < 1000000) {
      return (
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currencyCode,
          currencyDisplay: "symbol",
          maximumFractionDigits: 1,
        })
          .format(amount / 1000)
          .replace(".0", "") + "K"
      );
    }

    // For millions (M)
    else if (Math.abs(amount) >= 1000000 && Math.abs(amount) < 1000000000) {
      return (
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currencyCode,
          currencyDisplay: "symbol",
          maximumFractionDigits: 1,
        })
          .format(amount / 1000000)
          .replace(".0", "") + "M"
      );
    }

    // For billions (B)
    else if (Math.abs(amount) >= 1000000000) {
      return (
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currencyCode,
          currencyDisplay: "symbol",
          maximumFractionDigits: 1,
        })
          .format(amount / 1000000000)
          .replace(".0", "") + "B"
      );
    }
  };

  // Use abbreviated format for display in the list
  const formattedAmount = formatCurrency(amount);

  // Keep full format for the details dialog
  let fullFormattedAmount;
  if (currencyCode === 'NGN' || currencyCode === 'GHS') {
    const symbol = currencyCode === 'NGN' ? '₦' : '₵';
    fullFormattedAmount = `${symbol}${new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)}`;
  } else {
    fullFormattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "symbol",
    }).format(amount);
  }

  const handleViewDetails = () => {
    setDetailsDialogOpen(true);
  };

  // Transaction details content - extracted to avoid duplication
  const renderTransactionDetails = () => (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg">{description}</CardTitle>
          <div
            className={cn(
              "px-2 py-1 rounded text-sm font-medium",
              isIncome
                ? "bg-positive/10 text-positive"
                : "bg-negative/10 text-negative"
            )}
          >
            {isIncome ? "Income" : "Expense"}
          </div>
        </div>
        <CardDescription>{category}</CardDescription>
      </CardHeader>

      <CardContent className="p-0 mt-4 space-y-4">
        <div className="flex flex-col space-y-1">
          <span className="text-sm text-muted-foreground">Amount</span>
          <span
            className={cn(
              "text-xl font-semibold",
              isIncome ? "text-positive" : "text-negative"
            )}
          >
            {isIncome ? "+" : "-"}
            {fullFormattedAmount}
          </span>
        </div>

        <div className="flex flex-col space-y-1">
          <span className="text-sm text-muted-foreground">
            Date & Time
          </span>
          <div>
            <div className="text-sm font-medium">{formattedDate}</div>
            <div className="text-xs text-muted-foreground">
              {formattedTime}
            </div>
          </div>
        </div>
      </CardContent>

      {!isMobile && (
        <CardFooter className="p-0 mt-6">
          <DialogClose asChild>
            <Button className="w-full">Close</Button>
          </DialogClose>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <>
      <div
        className={cn(
          "group flex items-center justify-between p-2 sm:p-3 rounded-lg bg-card transition-all animate-fade-up",
          "hover:bg-secondary/50 hover-lift"
        )}
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div
            className={cn(
              "p-1.5 sm:p-2 rounded-full",
              isIncome
                ? "bg-positive/10 text-positive"
                : "bg-negative/10 text-negative"
            )}
          >
            {isIncome ? (
              <PlusCircleIcon size={18} className="sm:h-5 sm:w-5" />
            ) : (
              <MinusCircleIcon size={18} className="sm:h-5 sm:w-5" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-sm max-w-full">
              <span className="block sm:hidden" title={description}>
                {description.length > 15
                  ? `${description.substring(0, 15)}...`
                  : description}
              </span>
              <span className="hidden sm:block" title={description}>
                {description.length > 30
                  ? `${description.substring(0, 30)}...`
                  : description}
              </span>
            </h3>
            <div className="flex items-center text-xs text-muted-foreground">
              {/* This only renders on small screens */}
              <div className="hidden sm:flex items-center space-x-2">
                <span>{category}</span>
                <span>•</span>
              </div>
              {/* Always render the date */}
              <span className="sm:ml-2">{formattedDate}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-3">
          <span
            className={cn(
              "font-medium",
              isIncome ? "text-positive" : "text-negative"
            )}
          >
            {isIncome ? "+" : "-"}
            {formattedAmount}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVerticalIcon className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={handleViewDetails}
                className="cursor-pointer"
              >
                <InfoIcon className="mr-2 h-4 w-4" />
                <span>View Details</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(id)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                <span>Delete Transaction</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isMobile ? (
        <Sheet open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <SheetContent 
            side="bottom" 
            className="h-auto max-h-[60vh] rounded-t-xl overflow-auto sheet-content"
            onPointerDown={(e) => {
              // This handles swipe on the entire sheet content
              const content = e.currentTarget;
              const startY = e.clientY;
              let moved = false;
              
              const onMove = (moveEvent: PointerEvent) => {
                moved = true;
                const deltaY = moveEvent.clientY - startY;
                if (deltaY > 0) {
                  content.style.transform = `translateY(${deltaY}px)`;
                  content.style.transition = 'none';
                }
              };
              
              const onUp = (upEvent: PointerEvent) => {
                document.removeEventListener('pointermove', onMove);
                document.removeEventListener('pointerup', onUp);
                
                if (moved) {
                  content.style.transition = 'transform 0.2s ease-out';
                  const deltaY = upEvent.clientY - startY;
                  if (deltaY > 40) {
                    content.style.transform = `translateY(100%)`;
                    setTimeout(() => setDetailsDialogOpen(false), 200);
                  } else {
                    content.style.transform = '';
                  }
                }
              };
              
              document.addEventListener('pointermove', onMove);
              document.addEventListener('pointerup', onUp);
            }}
          >
            <div className="w-full flex justify-center mb-4">
              {/* Improve handle visibility in light mode */}
              <div className="w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-muted" />
            </div>
            <SheetHeader className="mb-4">
              <SheetTitle>Transaction Details</SheetTitle>
            </SheetHeader>
            {renderTransactionDetails()}
          </SheetContent>
        </Sheet>
      ) : (
        // Desktop dialog remains the same
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                View detailed information about this transaction.
              </DialogDescription>
            </DialogHeader>
            {renderTransactionDetails()}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}