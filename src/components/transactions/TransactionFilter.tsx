import React, { useState, useEffect } from 'react';
import { FilterIcon, CheckIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Define filter types
export type FilterType = 'year' | 'month' | 'category';
export type FilterValue = string | number;

export interface FilterOption {
  type: FilterType;
  value: FilterValue;
  label: string;
}

interface TransactionFilterProps {
  years: number[];
  months: { value: number; label: string }[];
  categories: string[];
  activeFilters: FilterOption[];
  onFilterChange: (filters: FilterOption[]) => void;
}

export function TransactionFilter({
  years,
  months,
  categories,
  activeFilters,
  onFilterChange,
}: TransactionFilterProps) {
  // State for mobile dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOption[]>([]);
  
  // Check if we're on mobile
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Initialize temp filters when dialog opens
  useEffect(() => {
    if (dialogOpen) {
      setTempFilters([...activeFilters]);
    }
  }, [dialogOpen, activeFilters]);

  // Check if a filter is active
  const isFilterActive = (type: FilterType, value: FilterValue, filters = activeFilters) => {
    return filters.some(filter => filter.type === type && filter.value === value);
  };

  // Toggle a filter
  const toggleFilter = (type: FilterType, value: FilterValue, label: string, isTemp = false) => {
    const filtersToModify = isTemp ? tempFilters : activeFilters;
    const newFilters = [...filtersToModify];
    const existingIndex = newFilters.findIndex(
      filter => filter.type === type && filter.value === value
    );

    if (existingIndex >= 0) {
      // Remove filter if it exists
      newFilters.splice(existingIndex, 1);
    } else {
      // Add new filter
      newFilters.push({ type, value, label });
    }

    if (isTemp) {
      setTempFilters(newFilters);
    } else {
      onFilterChange(newFilters);
    }
  };

  // Clear all filters of a specific type
  const clearFilterType = (type: FilterType, isTemp = false) => {
    if (isTemp) {
      setTempFilters(tempFilters.filter(filter => filter.type !== type));
    } else {
      onFilterChange(activeFilters.filter(filter => filter.type !== type));
    }
  };

  // Clear all filters
  const clearAllFilters = (isTemp = false) => {
    if (isTemp) {
      setTempFilters([]);
    } else {
      onFilterChange([]);
    }
  };

  // Apply temp filters when done
  const applyFilters = () => {
    onFilterChange(tempFilters);
    setDialogOpen(false);
  };

  // Count active filters by type
  const countActiveFiltersByType = (type: FilterType, filters = activeFilters) => {
    return filters.filter(filter => filter.type === type).length;
  };

  // Get total active filters count
  const totalActiveFilters = activeFilters.length;

  // Handle filter button click based on device
  const handleFilterButtonClick = () => {
    if (isMobile) {
      setDialogOpen(true);
    }
  };

  // Render the desktop dropdown filter
  const renderDesktopFilter = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "gap-1",
            totalActiveFilters > 0 && "bg-primary/10 border-primary/20"
          )}
        >
          <FilterIcon className="h-4 w-4" />
          <span>Filter</span>
          {totalActiveFilters > 0 && (
            <span className="ml-1 rounded-full bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center text-xs">
              {totalActiveFilters}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel>Filter Transactions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Year Filter */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="justify-between">
            <span>Year</span>
            {countActiveFiltersByType('year') > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center text-xs">
                {countActiveFiltersByType('year')}
              </span>
            )}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent onCloseAutoFocus={(e) => e.preventDefault()}>
              {years.map(year => (
                <DropdownMenuItem 
                  key={year}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFilter('year', year, year.toString());
                  }}
                >
                  <span>{year}</span>
                  {isFilterActive('year', year) && <CheckIcon className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
              {countActiveFiltersByType('year') > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-muted-foreground cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      clearFilterType('year');
                    }}
                  >
                    Clear year filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {/* Month Filter */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="justify-between">
            <span>Month</span>
            {countActiveFiltersByType('month') > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center text-xs">
                {countActiveFiltersByType('month')}
              </span>
            )}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent onCloseAutoFocus={(e) => e.preventDefault()}>
              {months.map(month => (
                <DropdownMenuItem 
                  key={month.value}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFilter('month', month.value, month.label);
                  }}
                >
                  <span>{month.label}</span>
                  {isFilterActive('month', month.value) && <CheckIcon className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
              {countActiveFiltersByType('month') > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-muted-foreground cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      clearFilterType('month');
                    }}
                  >
                    Clear month filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {/* Category Filter */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="justify-between">
            <span>Category</span>
            {countActiveFiltersByType('category') > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center text-xs">
                {countActiveFiltersByType('category')}
              </span>
            )}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent onCloseAutoFocus={(e) => e.preventDefault()}>
              {categories.map(category => (
                <DropdownMenuItem 
                  key={category}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFilter('category', category, category);
                  }}
                >
                  <span>{category}</span>
                  {isFilterActive('category', category) && <CheckIcon className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
              {countActiveFiltersByType('category') > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-muted-foreground cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      clearFilterType('category');
                    }}
                  >
                    Clear category filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {totalActiveFilters > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-muted-foreground cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                clearAllFilters();
              }}
            >
              Clear all filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Render the mobile dialog filter
  const renderMobileFilterDialog = () => (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Transactions</DialogTitle>
          <DialogDescription>
            Select filters to narrow down your transactions
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Year Filter Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Year</h3>
              {countActiveFiltersByType('year', tempFilters) > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => clearFilterType('year', true)}
                  className="h-8 text-xs text-muted-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {years.map(year => (
                <Button
                  key={year}
                  variant={isFilterActive('year', year, tempFilters) ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => toggleFilter('year', year, year.toString(), true)}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Month Filter Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Month</h3>
              {countActiveFiltersByType('month', tempFilters) > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => clearFilterType('month', true)}
                  className="h-8 text-xs text-muted-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {months.map(month => (
                <Button
                  key={month.value}
                  variant={isFilterActive('month', month.value, tempFilters) ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => toggleFilter('month', month.value, month.label, true)}
                >
                  {month.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Category Filter Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Category</h3>
              {countActiveFiltersByType('category', tempFilters) > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => clearFilterType('category', true)}
                  className="h-8 text-xs text-muted-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={isFilterActive('category', category, tempFilters) ? "default" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => toggleFilter('category', category, category, true)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          {tempFilters.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => clearAllFilters(true)}
              className="w-full sm:w-auto"
            >
              Clear All
            </Button>
          )}
          <Button 
            onClick={applyFilters}
            className="w-full sm:w-auto"
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {isMobile ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleFilterButtonClick}
          className={cn(
            "gap-1",
            totalActiveFilters > 0 && "bg-primary/10 border-primary/20"
          )}
        >
          <FilterIcon className="h-4 w-4" />
          <span>Filter</span>
          {totalActiveFilters > 0 && (
            <span className="ml-1 rounded-full bg-primary text-primary-foreground w-5 h-5 flex items-center justify-center text-xs">
              {totalActiveFilters}
            </span>
          )}
        </Button>
      ) : (
        renderDesktopFilter()
      )}
      
      {renderMobileFilterDialog()}
    </>
  );
}