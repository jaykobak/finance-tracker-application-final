import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSignIcon,
  PlusIcon,
  CreditCardIcon,
  WalletIcon,
  PiggyBankIcon,
  BarChartIcon,
  BriefcaseIcon,
  TrashIcon,
  Building2Icon as BankIcon,
  ShoppingCartIcon,
  PlaneIcon,
  BanknoteIcon,
} from "lucide-react";
import { FinancialSummary, Transaction } from "@/lib/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  format,
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  startOfWeek,
} from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import CurrencyInput from "@/components/ui/CurrencyInput";

// Account type
interface Account {
  id: string;
  name: string;
  balance: number;
  type: "cash" | "bank" | "credit" | "investment" | "savings" | "other";
  accountNumber?: string;
  icon: string;
}

// Account icon options
const ACCOUNT_ICONS = [
  { id: "wallet", icon: <WalletIcon className="h-6 w-6" />, label: "Wallet" },
  {
    id: "credit-card",
    icon: <CreditCardIcon className="h-6 w-6" />,
    label: "Credit Card",
  },
  { id: "bank", icon: <BankIcon className="h-6 w-6" />, label: "Bank" },
  {
    id: "piggy-bank",
    icon: <PiggyBankIcon className="h-6 w-6" />,
    label: "Savings",
  },
  {
    id: "chart",
    icon: <BarChartIcon className="h-6 w-6" />,
    label: "Investments",
  },
  {
    id: "briefcase",
    icon: <BriefcaseIcon className="h-6 w-6" />,
    label: "Business",
  },
  { id: "money", icon: <BanknoteIcon className="h-6 w-6" />, label: "Cash" },
  {
    id: "shopping",
    icon: <ShoppingCartIcon className="h-6 w-6" />,
    label: "Shopping",
  },
  { id: "travel", icon: <PlaneIcon className="h-6 w-6" />, label: "Travel" },
];

// Account types
const ACCOUNT_TYPES = [
  { value: "cash", label: "Cash" },
  { value: "bank", label: "Bank Account" },
  { value: "credit", label: "Credit Card" },
  { value: "investment", label: "Investment" },
  { value: "savings", label: "Savings" },
  { value: "other", label: "Other" },
];

interface BalanceChartProps {
  summary: any;
  transactions: any[];
  onAccountsUpdate?: (accounts: Array<{ id: string; name: string }>) => void;
}

export function BalanceChart({
  summary,
  transactions,
  onAccountsUpdate,
}: BalanceChartProps) {
  const { balance } = summary;
  const [animate, setAnimate] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Add the missing state declaration
  const [addAccountSheetOpen, setAddAccountSheetOpen] = useState(false);

  // Form state - moved to component level instead of using formValues in the AccountFormContent
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountType, setNewAccountType] = useState<Account["type"]>("bank");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newAccountIcon, setNewAccountIcon] = useState("wallet");

  // Create a ref to access the account form state
  const accountFormRef = useRef<{
    getFormState: () => {
      name: string;
      type: Account["type"];
      number: string;
      icon: string;
    };
    resetForm: () => void;
  } | null>(null);

  // Base accounts (without calculated balances)
  const [baseAccounts, setBaseAccounts] = useState<Account[]>([
    { id: "cash", name: "Cash", balance: 0, type: "cash", icon: "wallet" },
  ]);

  // Calculate account balances from transactions
  const accounts = React.useMemo(() => {
    return baseAccounts.map((account) => {
      // Find all transactions for this account
      const accountTransactions = transactions.filter(
        (t) => t.accountId === account.id
      );

      // Calculate balance: initial balance + income - expenses
      const transactionBalance = accountTransactions.reduce((sum, t) => {
        return sum + (t.type === "income" ? t.amount : -t.amount);
      }, 0);

      return {
        ...account,
        balance: account.balance + transactionBalance,
      };
    });
  }, [baseAccounts, transactions]);

  // Send initial accounts to parent component when the component mounts
  useEffect(
    () => {
      // Only run once on component mount to initialize the accounts in the transaction form
      if (onAccountsUpdate && baseAccounts.length > 0) {
        const formattedAccounts = baseAccounts.map((account) => ({
          id: account.id,
          name: account.name,
        }));
        onAccountsUpdate(formattedAccounts);
      }
    },
    [
      /* empty dependency array to run only once */
    ]
  );

  // Get the currency symbol from localStorage when the component mounts
  useEffect(() => {
    const storedSymbol = localStorage.getItem(
      "finance-tracker-currency-symbol"
    );
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
    return `${currencySymbol}${value
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  };

  // Add a new account
  const handleAddAccount = () => {
    // Use the ref to get current form state
    if (!accountFormRef.current) {
      toast.error("Form not available");
      return;
    }

    const formState = accountFormRef.current.getFormState();

    if (!formState.name.trim()) {
      toast.error("Account name is required");
      return;
    }

    const newAccount: Account = {
      id: `account-${Date.now()}`,
      name: formState.name,
      balance: formState.initialBalance,
      type: formState.type,
      accountNumber: formState.number || undefined,
      icon: formState.icon,
    };

    // Update base accounts state
    const updatedAccounts = [...baseAccounts, newAccount];
    setBaseAccounts(updatedAccounts);

    // Only update parent component after successfully adding an account
    if (onAccountsUpdate) {
      const formattedAccounts = updatedAccounts.map((account) => ({
        id: account.id,
        name: account.name,
      }));
      onAccountsUpdate(formattedAccounts);
    }

    // Reset the form
    accountFormRef.current.resetForm();

    // Close the dialog/sheet directly
    if (isDesktop) {
      const closeButton = document.querySelector(
        "[data-dialog-close]"
      ) as HTMLButtonElement | null;
      if (closeButton) {
        closeButton.click();
      }
    } else {
      setAddAccountSheetOpen(false); // Close the sheet directly
    }

    toast.success(`Account "${formState.name}" added successfully`);
  };

  // Delete an account
  const handleDeleteAccount = (accountId: string) => {
    // Don't allow deleting the last account
    if (baseAccounts.length <= 1) {
      toast.error("You must have at least one account");
      return;
    }

    const accountToDelete = baseAccounts.find((a) => a.id === accountId);
    if (!accountToDelete) return;

    // Update base accounts state
    const updatedAccounts = baseAccounts.filter((a) => a.id !== accountId);
    setBaseAccounts(updatedAccounts);

    // Only update parent component after successfully deleting an account
    if (onAccountsUpdate) {
      const formattedAccounts = updatedAccounts.map((account) => ({
        id: account.id,
        name: account.name,
      }));
      onAccountsUpdate(formattedAccounts);
    }

    toast.success(`Account "${accountToDelete.name}" deleted`);
  };

  // Get icon for account type
  const getAccountIcon = (iconId: string) => {
    const iconObj = ACCOUNT_ICONS.find((i) => i.id === iconId);
    return iconObj ? iconObj.icon : <WalletIcon className="h-6 w-6" />;
  };

  // Calculate summaries for different time periods
  const calculatePeriodSummary = (period: TimePeriod) => {
    // Filter transactions based on time period
    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);

      switch (period) {
        case "daily":
          return isToday(transactionDate);
        case "weekly":
          return isThisWeek(transactionDate, { weekStartsOn: 1 });
        case "monthly":
          return isThisMonth(transactionDate);
        case "yearly":
          return isThisYear(transactionDate);
        default:
          return false;
      }
    });

    // Calculate income and expense for the period
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense, balance: income - expense };
  };

  const periodSummaries: Record<
    TimePeriod,
    { income: number; expense: number; balance: number }
  > = {
    daily: calculatePeriodSummary("daily"),
    weekly: calculatePeriodSummary("weekly"),
    monthly: calculatePeriodSummary("monthly"),
    yearly: calculatePeriodSummary("yearly"),
  };

  // Get the period title
  const getPeriodTitle = (period: TimePeriod): string => {
    switch (period) {
      case "daily":
        return `Today (${format(new Date(), "MMM d")})`;
      case "weekly":
        return `This Week (${format(
          startOfWeek(new Date(), { weekStartsOn: 1 }),
          "MMM d"
        )} - ${format(new Date(), "MMM d")})`;
      case "monthly":
        return `This Month (${format(new Date(), "MMMM yyyy")})`;
      case "yearly":
        return `This Year (${format(new Date(), "yyyy")})`;
      default:
        return "";
    }
  };

  // Account Form Content - shared between sheet and dialog
  const AccountFormContent = React.forwardRef<
    {
      getFormState: () => {
        name: string;
        type: Account["type"];
        number: string;
        icon: string;
        initialBalance: number;
      };
      resetForm: () => void;
    },
    {}
  >((_props, ref) => {
    // Create local state for form values
    const [formState, setFormState] = useState({
      name: "",
      type: "bank" as Account["type"],
      number: "",
      icon: "wallet",
      initialBalance: 0,
    });

    // Expose methods to parent via ref
    React.useImperativeHandle(ref, () => ({
      getFormState: () => formState,
      resetForm: () => {
        setFormState({
          name: "",
          type: "bank" as Account["type"],
          number: "",
          icon: "wallet",
          initialBalance: 0,
        });
      },
    }));

    return (
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="account-name">Account Name *</Label>
          <Input
            id="account-name"
            placeholder="e.g. Wema Account"
            value={formState.name}
            onChange={(e) =>
              setFormState({ ...formState, name: e.target.value })
            }
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground">Required</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="account-type">Account Type</Label>
          <Select
            value={formState.type}
            onValueChange={(value) =>
              setFormState({ ...formState, type: value as Account["type"] })
            }
          >
            <SelectTrigger id="account-type">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent position="popper">
              {ACCOUNT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="initial-balance">Initial Balance</Label>
          <CurrencyInput
            id="initial-balance"
            value={formState.initialBalance}
            onChange={(value) =>
              setFormState({ ...formState, initialBalance: value })
            }
            placeholder="0.00"
            allowDecimalPoint={true}
          />
          <p className="text-xs text-muted-foreground">
            Starting balance for this account
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="account-number">Account Number (Optional)</Label>
          <Input
            id="account-number"
            placeholder="e.g. **** 1357"
            value={formState.number}
            onChange={(e) =>
              setFormState({ ...formState, number: e.target.value })
            }
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground">
            For your reference only, not required
          </p>
        </div>

        <div className="space-y-2">
          <Label>Account Icon</Label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
            {ACCOUNT_ICONS.map((iconOption) => (
              <TooltipProvider key={iconOption.id}>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() =>
                        setFormState({ ...formState, icon: iconOption.id })
                      }
                      className={`p-3 rounded-lg flex flex-col items-center justify-center transition-colors ${
                        formState.icon === iconOption.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                    >
                      {iconOption.icon}
                      <span className="text-xs mt-1">{iconOption.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{iconOption.label}</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fade-up">
      <Card className="md:col-span-1">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">
              Your Accounts
            </CardTitle>
            {isDesktop ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Account</DialogTitle>
                    <DialogDescription>
                      Create a new account to track your finances
                    </DialogDescription>
                  </DialogHeader>

                  <AccountFormContent ref={accountFormRef} />

                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button variant="outline" data-dialog-close>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button onClick={handleAddAccount}>Add Account</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setAddAccountSheetOpen(true)}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CardDescription>Manage your financial accounts</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Carousel className="w-full">
            <CarouselContent>
              {accounts.map((account) => (
                <CarouselItem key={account.id}>
                  <div className="flex flex-col items-center justify-center pt-6 pb-4 relative">
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteAccount(account.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete account</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>

                    <div
                      className={`p-4 rounded-full mb-3 ${
                        account.balance >= 0
                          ? "bg-positive/10 text-positive"
                          : "bg-negative/10 text-negative"
                      }`}
                    >
                      {getAccountIcon(account.icon)}
                    </div>
                    <h3 className="text-lg font-medium mb-1">{account.name}</h3>
                    <h2
                      className={`text-3xl font-bold ${
                        account.balance >= 0 ? "text-positive" : "text-negative"
                      } ${
                        animate ? "scale-110" : "scale-100"
                      } balance-transition`}
                    >
                      {formatCurrency(account.balance)}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2">
                      Account balance
                    </p>
                    {account.accountNumber && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {account.accountNumber}
                      </p>
                    )}
                  </div>
                </CarouselItem>
              ))}
              <CarouselItem>
                {isDesktop ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="flex flex-col items-center justify-center pt-6 pb-4 h-[200px] cursor-pointer hover:bg-secondary/20 rounded-lg transition-colors">
                        <Button
                          variant="outline"
                          className="rounded-full h-16 w-16 mb-4"
                        >
                          <PlusIcon className="h-8 w-8" />
                        </Button>
                        <h3 className="text-lg font-medium">Add Account</h3>
                        <p className="text-sm text-muted-foreground mt-2 text-center px-4">
                          Add a new account to track your finances
                        </p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Account</DialogTitle>
                        <DialogDescription>
                          Create a new account to track your finances
                        </DialogDescription>
                      </DialogHeader>

                      <AccountFormContent ref={accountFormRef} />

                      <DialogFooter className="mt-6">
                        <DialogClose asChild>
                          <Button variant="outline" data-dialog-close>
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button onClick={handleAddAccount}>Add Account</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center pt-6 pb-4 h-[200px] cursor-pointer hover:bg-secondary/20 rounded-lg transition-colors"
                    onClick={() => setAddAccountSheetOpen(true)}
                  >
                    <Button
                      variant="outline"
                      className="rounded-full h-16 w-16 mb-4"
                    >
                      <PlusIcon className="h-8 w-8" />
                    </Button>
                    <h3 className="text-lg font-medium">Add Account</h3>
                    <p className="text-sm text-muted-foreground mt-2 text-center px-4">
                      Add a new account to track your finances
                    </p>
                  </div>
                )}
              </CarouselItem>
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious className="static transform-none translate-y-0 mr-2" />
              <CarouselNext className="static transform-none translate-y-0 ml-2" />
            </div>
          </Carousel>
        </CardContent>
      </Card>

      {/* Shared mobile sheet for adding accounts */}
      {!isDesktop && (
        <Sheet open={addAccountSheetOpen} onOpenChange={setAddAccountSheetOpen}>
          <SheetContent
            side="bottom"
            className="h-[90vh] sm:h-[60vh] rounded-t-xl sheet-content"
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
                    setTimeout(() => setAddAccountSheetOpen(false), 200);
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
              {/* Improved handle visibility */}
              <div className="w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-muted" />
            </div>
            <div className="overflow-y-auto h-[calc(90vh-80px)] sm:h-[calc(60vh-80px)] pb-4">
              <SheetHeader className="mb-4 sticky top-0 bg-background z-10 pt-2">
                <SheetTitle>Add New Account</SheetTitle>
                <SheetDescription>
                  Create a new account to track your finances
                </SheetDescription>
              </SheetHeader>

              <AccountFormContent ref={accountFormRef} />

              <div className="flex flex-col gap-2 mt-6">
                <Button onClick={handleAddAccount}>Add Account</Button>
                <Button
                  variant="outline"
                  onClick={() => setAddAccountSheetOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">
            Income vs. Expenses
          </CardTitle>
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

                    {periodSummaries[period].income > 0 ||
                    periodSummaries[period].expense > 0 ? (
                      <div className="h-[180px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                {
                                  name: "Income",
                                  value: periodSummaries[period].income,
                                  color: "hsl(var(--positive))",
                                },
                                {
                                  name: "Expenses",
                                  value: periodSummaries[period].expense,
                                  color: "hsl(var(--negative))",
                                },
                              ].filter((item) => item.value > 0)}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {[
                                {
                                  name: "Income",
                                  value: periodSummaries[period].income,
                                  color: "hsl(var(--positive))",
                                },
                                {
                                  name: "Expenses",
                                  value: periodSummaries[period].expense,
                                  color: "hsl(var(--negative))",
                                },
                              ]
                                .filter((entry) => entry.value > 0)
                                .map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                            </Pie>
                            <Tooltip
                              formatter={(value) => [
                                formatCurrency(value as number),
                                "",
                              ]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[180px] mt-4 flex items-center justify-center">
                        <p className="text-muted-foreground">
                          No data for this period
                        </p>
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
