import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked, onCheckedChange, className, ...props }, ref) => (
    <label className={cn("inline-flex items-center cursor-pointer", className)}>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={e => onCheckedChange?.(e.target.checked)}
        ref={ref}
        {...props}
      />
      <span className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all relative">
        <span className={cn("absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-all peer-checked:translate-x-4")}></span>
      </span>
    </label>
  )
);
Switch.displayName = "Switch";
