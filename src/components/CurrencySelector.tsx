
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useCurrency, CurrencyCode } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

interface CurrencySelectorProps {
  variant?: "default" | "navbar" | "mobile";
}

const CurrencySelector = ({ variant = "default" }: CurrencySelectorProps) => {
  const { currentCurrency, setCurrency, currencies } = useCurrency();

  const handleCurrencyChange = (value: string) => {
    setCurrency(value as CurrencyCode);
    // Store the selected currency in localStorage to persist it
    localStorage.setItem("preferredCurrency", value);
  };

  return (
    <Select value={currentCurrency.code} onValueChange={handleCurrencyChange}>
      <SelectTrigger 
        className={cn(
          variant === "navbar" && "w-[70px] h-8 text-sm bg-transparent border hover:bg-secondary/50",
          variant === "mobile" && "w-full text-left justify-start px-4 py-2",
          variant === "default" && "w-[140px]"
        )}
      >
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {Object.values(currencies).map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            {currency.code} - {currency.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
