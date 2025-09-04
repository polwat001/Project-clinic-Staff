"use client";
import * as React from "react";

export function Card({ className="", children }: React.PropsWithChildren<{className?: string}>) {
  return <div className={`rounded-2xl border bg-white shadow-sm ${className}`}>{children}</div>;
}
export function CardHeader({ children, className="" }: React.PropsWithChildren<{className?: string}>) {
  return <div className={`p-4 border-b bg-slate-50 rounded-t-2xl ${className}`}>{children}</div>;
}
export function CardContent({ children, className="" }: React.PropsWithChildren<{className?: string}>) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-300 ${props.className||""}`} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-blue-300 ${props.className||""}`} />;
}
export function Button({ children, className="", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...rest} className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 ${className}`} >{children}</button>;
}
export function Badge({ children, tone="slate" }: React.PropsWithChildren<{tone?: "red"|"amber"|"green"|"slate"}>) {
  const styles = {
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    green: "bg-green-100 text-green-700",
    slate: "bg-slate-100 text-slate-700",
  }[tone];
  return <span className={`px-2 py-0.5 rounded-full text-xs ${styles}`}>{children}</span>;
}
