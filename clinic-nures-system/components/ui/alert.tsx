import * as React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Alert: React.FC<AlertProps> = ({ children, className, ...props }) => (
  <div className={cn("border-l-4 p-4 bg-red-50 border-red-300", className)} {...props}>{children}</div>
);

export interface AlertTitleProps extends React.HTMLAttributes<HTMLDivElement> {}
export const AlertTitle: React.FC<AlertTitleProps> = ({ children, className, ...props }) => (
  <div className={cn("font-bold text-red-700 mb-1 flex items-center", className)} {...props}>{children}</div>
);

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}
export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children, className, ...props }) => (
  <div className={cn("text-red-700 text-sm", className)} {...props}>{children}</div>
);
