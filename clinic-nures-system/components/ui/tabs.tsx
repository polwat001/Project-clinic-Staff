import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ children, className, ...props }) => (
  <div className={cn("w-full", className)} {...props}>{children}</div>
);

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={cn("flex gap-2 border-b mb-2", className)} {...props}>{children}</div>
);

export const TabsTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }> = ({ children, className, ...props }) => (
  <button className={cn("px-4 py-2 rounded-t-md text-sm font-medium focus:outline-none", className)} {...props}>{children}</button>
);

export const TabsContent: React.FC<React.HTMLAttributes<HTMLDivElement> & { value: string }> = ({ children, className, ...props }) => (
  <div className={cn("pt-2", className)} {...props}>{children}</div>
);
