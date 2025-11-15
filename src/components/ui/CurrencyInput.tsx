import React, { useState, useEffect, forwardRef } from 'react';
import { Input } from '@/components/ui/input';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  allowDecimalPoint?: boolean;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, currency, allowDecimalPoint, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState('');
    const [currencySymbol, setCurrencySymbol] = useState('$');

    // Get the currency symbol from localStorage when the component mounts
    useEffect(() => {
      const storedSymbol = localStorage.getItem('finance-tracker-currency-symbol');
      if (storedSymbol) {
        setCurrencySymbol(storedSymbol);
      } else if (currency) {
        // Use the currency prop as a fallback
        setCurrencySymbol(currency);
      }
    }, [currency]);

    // Format the value as currency on mount and when value changes
    useEffect(() => {
      // Format with commas but no decimals for whole numbers
      setDisplayValue(value.toString());
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Remove all non-numeric characters except decimal point
      const numericValue = inputValue.replace(/[^0-9.]/g, '');
      
      // Ensure only one decimal point is allowed
      const parts = numericValue.split('.');
      const sanitizedValue = parts.length > 2 
        ? `${parts[0]}.${parts.slice(1).join('')}` 
        : numericValue;
      
      // Allow empty input, numbers, and properly formatted decimal values
      setDisplayValue(sanitizedValue);
      onChange(sanitizedValue === '' ? 0 : parseFloat(sanitizedValue) || 0);
    };

    const handleBlur = () => {
      // Format the display value when the input loses focus
      if (displayValue === '') {
        setDisplayValue('0');
        onChange(0);
      } else {
        const numericValue = parseFloat(displayValue);
        
        // Format with commas
        const formattedValue = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).format(numericValue);
        
        setDisplayValue(numericValue.toString());
        onChange(numericValue);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      const length = e.target.value.length;
      e.target.setSelectionRange(length, length) // Moves the cursor to the end
    };

    // Format the displayed value with commas
    const formattedDisplayValue = (() => {
      if (displayValue === '') return '';
      
      // If it has a decimal point, format the part before the decimal
      if (displayValue.includes('.')) {
        const [wholePart, decimalPart] = displayValue.split('.');
        const formattedWholePart = new Intl.NumberFormat('en-US').format(parseFloat(wholePart) || 0);
        return `${formattedWholePart}.${decimalPart}`;
      } else {
        // Format whole numbers
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }).format(parseFloat(displayValue) || 0);
      }
    })();

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          {currencySymbol}
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          className={`pl-7 ${className}`}
          value={displayValue === '' ? '' : formattedDisplayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export default CurrencyInput;