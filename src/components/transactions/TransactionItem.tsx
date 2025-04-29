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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
  accountName?: string; // Add optional accountName prop
}

export function TransactionItem({
  transaction,
  onDelete,
  accountName, // Add the accountName prop
}: TransactionItemProps) {
  const { id, type, amount, description, category, date } = transaction;
  const isIncome = type === "income";
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // Add state for delete confirmation
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

  // Format currency with abbreviated suffixes (K, M, B, T) for large numbers
  const formatCurrency = (amount: number) => {
    // Special handling for Nigerian Naira and Ghanaian Cedi
    if (currencyCode === 'NGN' || currencyCode === 'GHS') {
      const symbol = currencyCode === 'NGN' ? '₦' : '₵';

      if (Math.abs(amount) < 1000) {
        return `${symbol}${new Intl.NumberFormat("en-US", {
          style: "decimal",
          maximumFractionDigits: 0,
        }).format(amount)}`;
      } else if (Math.abs(amount) < 1_000_000) {
        const formatted = new Intl.NumberFormat("en-US", {
          style: "decimal",
          maximumFractionDigits: 1,
        }).format(amount / 1_000).replace(".0", "");
        return `${symbol}${formatted}K`;
      } else if (Math.abs(amount) < 1_000_000_000) {
        const formatted = new Intl.NumberFormat("en-US", {
          style: "decimal",
          maximumFractionDigits: 1,
        }).format(amount / 1_000_000).replace(".0", "");
        return `${symbol}${formatted}M`;
      } else if (Math.abs(amount) < 1_000_000_000_000) {
        const formatted = new Intl.NumberFormat("en-US", {
          style: "decimal",
          maximumFractionDigits: 1,
        }).format(amount / 1_000_000_000).replace(".0", "");
        return `${symbol}${formatted}B`;
      } else {
        const formatted = new Intl.NumberFormat("en-US", {
          style: "decimal",
          maximumFractionDigits: 1,
        }).format(amount / 1_000_000_000_000).replace(".0", "");
        return `${symbol}${formatted}T`;
      }
    }

    // For other currencies, use the standard Intl formatter
    if (Math.abs(amount) < 1000) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currencyCode,
        currencyDisplay: "symbol",
        maximumFractionDigits: 0,
      }).format(amount);
    } else if (Math.abs(amount) < 1_000_000) {
      return (
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currencyCode,
          currencyDisplay: "symbol",
          maximumFractionDigits: 1,
        })
          .format(amount / 1_000)
          .replace(".0", "") + "K"
      );
    } else if (Math.abs(amount) < 1_000_000_000) {
      return (
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currencyCode,
          currencyDisplay: "symbol",
          maximumFractionDigits: 1,
        })
          .format(amount / 1_000_000)
          .replace(".0", "") + "M"
      );
    } else if (Math.abs(amount) < 1_000_000_000_000) {
      return (
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currencyCode,
          currencyDisplay: "symbol",
          maximumFractionDigits: 1,
        })
          .format(amount / 1_000_000_000)
          .replace(".0", "") + "B"
      );
    } else {
      return (
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currencyCode,
          currencyDisplay: "symbol",
          maximumFractionDigits: 1,
        })
          .format(amount / 1_000_000_000_000)
          .replace(".0", "") + "T"
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

  // Add handler for delete confirmation
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(id);
    setDeleteDialogOpen(false);
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

        {/* Add account information to the details */}
        {accountName && (
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">Account</span>
            <div className="text-sm font-medium">{accountName}</div>
          </div>
        )}

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

        {/* Split into two columns: amount and actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Amount column with account name above */}
          <div className="flex flex-col items-end">
            {/* Account name above amount with truncation */}
            {accountName && (
              <span
                className="text-xs text-muted-foreground mb-0.5"
                title={accountName} // Show full name on hover
              >
                {accountName.length > 14
                  ? `${accountName.substring(0, 14)}...`
                  : accountName}
              </span>
            )}
            <span
              className={cn(
                "font-medium",
                isIncome ? "text-positive" : "text-negative"
              )}
            >
              {isIncome ? "+" : "-"}
              {formattedAmount}
            </span>
          </div>

          {/* Actions column (three-dot menu) */}
          <div>
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
                  onClick={handleDeleteClick} // Changed to open confirmation dialog
                  className="text-red-500 hover:bg-destructive focus:bg-destructive cursor-pointer"
                >
                  <Trash2Icon className="mr-2 h-4 w-4 text-red-500" />
                  <span>Delete Transaction</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
                  content.style.transition = "none";
                }
              };

              const onUp = (upEvent: PointerEvent) => {
                document.removeEventListener("pointermove", onMove);
                document.removeEventListener("pointerup", onUp);

                if (moved) {
                  content.style.transition = "transform 0.2s ease-out";
                  const deltaY = upEvent.clientY - startY;
                  if (deltaY > 40) {
                    content.style.transform = `translateY(100%)`;
                    setTimeout(() => setDetailsDialogOpen(false), 200);
                  } else {
                    content.style.transform = "";
                  }
                }
              };

              document.addEventListener("pointermove", onMove);
              document.addEventListener("pointerup", onUp);
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
          <DialogContent className="sm:max-w-md max-h-[80vh] overflow-auto">
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

      {/* Add delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Delete Transaction
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center space-y-2">
              <p>Are you sure you want to delete this transaction?</p>
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <div className="font-medium text-foreground">{description}</div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-muted-foreground">
                    {formattedDate}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      isIncome ? "text-positive" : "text-negative"
                    )}
                  >
                    {isIncome ? "+" : "-"}
                    {formattedAmount}
                  </span>
                </div>
              </div>
              <p className="text-sm text-destructive mt-2">
                This action cannot be undone.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:space-x-2">
            <AlertDialogCancel className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}