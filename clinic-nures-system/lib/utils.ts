// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


// Removed duplicate fmtDate and fmtDateOnly definitions

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// utils อื่น ๆ ที่โปรเจกต์คุณใช้
export function fmtDate(d: string | number | Date) {
  const date = new Date(d)
  return isNaN(date.getTime()) ? "-" : date.toLocaleString("th-TH")
}

export function fmtDateOnly(d: string | number | Date) {
  const date = new Date(d)
  return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("th-TH")
}
