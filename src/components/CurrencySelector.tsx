
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useCurrency, CurrencyCode } from "@/context/CurrencyContext";

interface CurrencySelectorProps {
  variant?: "default" | "navbar";
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
      <SelectTrigger className={variant === "navbar" ? "w-[80px] h-9 text-sm bg-transparent border-none hover:bg-secondary/50 focus:ring-0" : "w-[140px]"}>
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
