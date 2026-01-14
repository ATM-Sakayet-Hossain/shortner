import React from "react";

const baseStyles =
  "inline-flex cursor-pointer items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

const variants = {
  primary: "bg-brand text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
  outline:
    "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
