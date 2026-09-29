import * as React from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: React.ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--brand-wood)] text-[var(--brand-ivory)] hover:bg-[var(--brand-wood-deep)] shadow-[0_10px_25px_rgba(77,45,36,0.18)]",
  secondary:
    "bg-[var(--brand-gold)] text-[var(--brand-wood-deep)] hover:bg-[var(--brand-gold-deep)] shadow-[0_10px_25px_rgba(201,166,106,0.25)]",
  ghost:
    "bg-[rgba(77,45,36,0.08)] text-[var(--brand-wood)] hover:bg-[rgba(77,45,36,0.12)]",
  outline:
    "border border-[rgba(77,45,36,0.25)] bg-transparent text-[var(--brand-wood)] hover:bg-[rgba(77,45,36,0.04)]",
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export default Button;
