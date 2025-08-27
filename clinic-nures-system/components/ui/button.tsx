import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "accent";
};

export function Button({ variant = "primary", ...props }: ButtonProps) {
  const colorMap = {
    primary: "var(--color-primary)",
    secondary: "var(--color-secondary)",
    accent: "var(--color-accent)",
  };

  return (
    <button
      {...props}
      style={{
        background: colorMap[variant],
        color: variant === "secondary" ? "#222" : "#fff",
        borderRadius: "var(--border-radius)",
        padding: "8px 24px",
        border: "none",
        margin: "var(--spacing) 0",
        fontFamily: "var(--font-family)",
        cursor: "pointer",
      }}
    >
      {props.children}
    </button>
  );
}
