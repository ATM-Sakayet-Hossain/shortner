import React from "react";

const baseStyles =
  "w-full rounded-md border px-3 py-2 text-sm transition focus:outline-none focus:ring-2";

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-3 text-base",
};

const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  size = "md",
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      {/* Input */}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          ${baseStyles}
          ${sizes[size]}
          ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          }
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          ${className}
        `}
        {...props}
      />

      {/* Helper / Error Text */}
      {(helperText || error) && (
        <p
          className={`mt-1 text-xs ${error ? "text-red-600" : "text-gray-500"}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
