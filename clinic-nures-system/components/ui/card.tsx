// components/ui/card.tsx
import React from "react";

export function Card({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className="border rounded-lg shadow-sm p-4 bg-white" {...props}>{children}</div>;
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 font-semibold">{children}</div>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-bold">{children}</h3>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
export function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 text-right">{children}</div>;
}