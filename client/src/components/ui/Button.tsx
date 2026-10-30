import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "gold" | "light";

const styles: Record<Variant, string> = {
  primary: "bg-ink text-bone hover:bg-champagne hover:text-ink",
  ghost: "border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-bone",
  gold: "bg-champagne text-ink hover:bg-bone",
  light: "border border-bone/30 text-bone hover:border-champagne hover:text-champagne",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: Variant }) {
  return (
    <button
      className={`font-sans text-xs tracking-[0.16em] uppercase px-8 py-3.5 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
