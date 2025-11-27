import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends React.ComponentProps<"input"> {
  onClear?: () => void;
  minCharacters?: number;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, minCharacters = 3, placeholder, ...props }, ref) => {
    const [localValue, setLocalValue] = React.useState(value || "");
    const [showWarning, setShowWarning] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      
      if (newValue.length > 0 && newValue.length < minCharacters) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
      
      onChange?.(e);
    };

    const handleClear = () => {
      setLocalValue("");
      setShowWarning(false);
      onClear?.();
    };

    return (
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-10 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            showWarning && "border-warning",
            className,
          )}
          placeholder={placeholder || `Pesquisar (mín. ${minCharacters} caracteres)...`}
          ref={ref}
          {...props}
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
            title="Limpar pesquisa"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {showWarning && (
          <p className="absolute -bottom-5 left-0 text-xs text-warning">
            Introduza pelo menos {minCharacters} caracteres para pesquisar
          </p>
        )}
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
