import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({ children, value, onValueChange, className, ...props }) => (
  <select
    className={cn("block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500", className)}
    value={value}
    onChange={e => onValueChange?.(e.target.value)}
    {...props}
  >
    {children}
  </select>
);

// Remove custom dropdown elements to prevent div inside select hydration error
export const SelectTrigger = undefined;
export const SelectValue = undefined;
export const SelectContent = undefined;
export const SelectItem: React.FC<React.OptionHTMLAttributes<HTMLOptionElement>> = ({ children, className, ...props }) => (
  <option className={cn("px-3 py-2 text-sm", className)} {...props}>{children}</option>
);
