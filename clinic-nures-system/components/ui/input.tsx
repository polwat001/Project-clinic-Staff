import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input(props: InputProps) {
  return (
    <input
      {...props}
      className="border-2 border-[#D9D9D9] rounded-[15px] px-6 py-3 w-full text-lg bg-[#F5F5F5] placeholder:text-[#B4AAAA]"
    />
  );
}
