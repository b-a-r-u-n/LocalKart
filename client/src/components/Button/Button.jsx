import React from "react";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer";

  const variants = {
    primary: "bg-[#0ea5e9] text-white hover:bg-[#0284c7]",
    secondary: "bg-[#111827] text-white hover:bg-[#1f2937]",
    accent: "bg-[#f59e0b] text-white hover:bg-[#d97706]",
    outline:
      "border-2 border-[#0ea5e9] text-[#0ea5e9] hover:bg-[#0ea5e9] hover:text-white",
    ghost: "text-[#111827] hover:bg-gray-100",
    destructive: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}