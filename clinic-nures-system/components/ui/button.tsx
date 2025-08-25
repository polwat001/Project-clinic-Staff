import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="bg-[#4C90E3] text-white px-8 py-3 rounded-[15px] font-medium text-lg shadow hover:bg-[#3570b5] transition"
    >
      {children}
    </button>
  );
}
