import * as React from "react";
import { cn } from "@/lib/utils";

interface CurrencyInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  value?: string | number;
  onChange?: (value: string) => void;
  currency?: string;
}

const formatCurrency = (value: string): string => {
  // Remove tudo excepto números
  const numbers = value.replace(/[^\d]/g, "");
  
  if (!numbers) return "";
  
  // Converte para número e formata com separadores
  const num = parseInt(numbers, 10);
  return num.toLocaleString("pt-PT");
};

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, currency = "Kz", ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(
      value ? formatCurrency(String(value)) : ""
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(formatCurrency(String(value)));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const formatted = formatCurrency(rawValue);
      setDisplayValue(formatted);
      
      // Retorna o valor numérico limpo
      const numericValue = rawValue.replace(/[^\d]/g, "");
      onChange?.(numericValue);
    };

    return (
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleChange}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-12 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-right",
            className,
          )}
          ref={ref}
          {...props}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
          {currency}
        </span>
      </div>
    );
  },
);
CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
