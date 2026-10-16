import * as React from "react";
import Link from "next/link";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "landingOutline" | "accent";
  size?: "sm" | "md" | "lg";
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-deep text-white hover:bg-brand/90",
    secondary: "bg-deep text-white hover:bg-deep/90",
    outline:
      "border border-border bg-transparent text-main hover:bg-surface",
    ghost: "bg-transparent text-main hover:bg-surface",
    landingOutline:
      "border border-[#0F6B56] bg-transparent text-[#0F6B56] hover:bg-[#0F6B56]/5",
    accent: "bg-[#C65D3A] text-white hover:bg-[#B95332]",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const buttonClassName = `
        inline-flex items-center justify-center gap-2
        rounded-lg font-medium
        transition-colors
        cursor-pointer
        disabled:pointer-events-none disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `;

  if (href) {
    return (
      <Link href={href} className={buttonClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
}
