import React, { createContext, useContext, useState, useEffect } from "react";

// Define currency types
export type CurrencyCode = "KES" | "USD" | "TZS" | "UGX" | "RWF" | "BIF" | "EUR" | "GBP" | "CNY" | "JPY" | "AUD" | "CAD" | "ZAR" | "NGN";

export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rate: number; // Conversion rate from base currency (KES)
}

// Default rates (will be updated with real-time data)
const defaultCurrencies: Record<CurrencyCode, Currency> = {
  KES: { code: "KES", name: "Kenyan Shilling", symbol: "KES", rate: 1 },
  USD: { code: "USD", name: "US Dollar", symbol: "$", rate: 0.0077 },
  TZS: { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", rate: 19.54 },
  UGX: { code: "UGX", name: "Ugandan Shilling", symbol: "USh", rate: 28.67 },
  RWF: { code: "RWF", name: "Rwandan Franc", symbol: "RF", rate: 9.72 },
  BIF: { code: "BIF", name: "Burundian Franc", symbol: "FBu", rate: 22.14 },
  EUR: { code: "EUR", name: "Euro", symbol: "€", rate: 0.007 },
  GBP: { code: "GBP", name: "British Pound", symbol: "£", rate: 0.006 },
  CNY: { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 0.05 },
  JPY: { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 1.2 },
  AUD: { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 0.011 },
  CAD: { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 0.01 },
  ZAR: { code: "ZAR", name: "South African Rand", symbol: "R", rate: 0.14 },
  NGN: { code: "NGN", name: "Nigerian Naira", symbol: "₦", rate: 3.8 },
};

interface CurrencyContextType {
  currentCurrency: Currency;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number, to?: CurrencyCode) => number;
  currencies: Record<CurrencyCode, Currency>;
  baseCurrency: CurrencyCode;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencies, setCurrencies] = useState<Record<CurrencyCode, Currency>>(defaultCurrencies);
  const baseCurrency: CurrencyCode = "KES";
  
  // Initialize with KES as default currency
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(() => {
    const savedCurrency = localStorage.getItem("preferredCurrency") as CurrencyCode | null;
    return savedCurrency && currencies[savedCurrency] ? currencies[savedCurrency] : currencies.KES;
  });

  // Fetch real-time exchange rates
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        const data = await response.json();
        
        if (data.rates) {
          const updatedCurrencies = { ...currencies };
          
          // Update rates for all currencies we support
          Object.keys(updatedCurrencies).forEach((code) => {
            const currencyCode = code as CurrencyCode;
            if (data.rates[currencyCode]) {
              updatedCurrencies[currencyCode] = {
                ...updatedCurrencies[currencyCode],
                rate: data.rates[currencyCode]
              };
            }
          });
          
          setCurrencies(updatedCurrencies);
          
          // Update current currency rate if needed
          if (updatedCurrencies[currentCurrency.code]) {
            setCurrentCurrency(updatedCurrencies[currentCurrency.code]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch exchange rates", error);
        // Use default rates if API fails
      }
    };

    fetchExchangeRates();
    const intervalId = setInterval(fetchExchangeRates, 60 * 60 * 1000); // Update hourly

    return () => clearInterval(intervalId);
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrentCurrency(currencies[code]);
    localStorage.setItem("preferredCurrency", code);
  };

  // Convert price from base currency (KES) to current currency
  const convertPrice = (price: number, to?: CurrencyCode) => {
    const targetCurrency = to ? currencies[to] : currentCurrency;
    return price * targetCurrency.rate;
  };

  // Format price according to current currency
  const formatPrice = (price: number) => {
    const convertedPrice = convertPrice(price);
    
    return `${currentCurrency.symbol} ${convertedPrice.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currentCurrency,
        setCurrency,
        formatPrice,
        convertPrice,
        currencies,
        baseCurrency
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};