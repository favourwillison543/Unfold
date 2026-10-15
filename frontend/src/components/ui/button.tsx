import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-deep text-white hover:bg-brand/90",
    secondary: "bg-deep text-white hover:bg-deep/90",
    outline:
      "border border-border bg-transparent text-main hover:bg-surface",
    ghost: "bg-transparent text-main hover:bg-surface",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg font-medium
        transition-colors
        cursor-pointer
        disabled:pointer-events-none disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}