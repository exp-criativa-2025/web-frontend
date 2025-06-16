import * as React from "react";
import { cn } from "@/lib/utils";

interface CNPJInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function formatCNPJ(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  let formatted = "";

  for (let i = 0; i < digits.length; i++) {
    formatted += digits[i];
    if (i === 1 || i === 4) formatted += ".";
    else if (i === 7) formatted += "/";
    else if (i === 11) formatted += "-";
  }

  return formatted;
}

export function CNPJInput({ value, onChange, className, ...props }: CNPJInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatCNPJ(e.target.value);
    onChange(formatted);
  }

  return (
    <input
      type="text"
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      value={value}
      onChange={handleChange}
      maxLength={18} 
      {...props}
    />
  );
}
