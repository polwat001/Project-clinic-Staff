import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

const variantClasses: Record<string, string> = {
  default: "bg-blue-600 text-white",
  secondary: "bg-gray-200 text-gray-800",
  outline: "border border-gray-400 text-gray-700 bg-white",
  destructive: "bg-red-500 text-white"
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        className={cn(
          "inline-flex items-center px-2 py-1 text-xs font-semibold rounded", 
          variantClasses[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
