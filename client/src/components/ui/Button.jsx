import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  icon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = "font-medium rounded-lg transition-all focus:outline-none focus:ring-2 inline-flex items-center justify-center";

  const variantStyles = {
    primary: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:ring-primary-300",
    secondary: "bg-dark-700 text-white hover:bg-dark-600 active:bg-dark-800 focus:ring-dark-500",
    outline: "bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-500 hover:bg-opacity-10 active:bg-primary-600 active:bg-opacity-20 focus:ring-primary-300",
    danger: "bg-error-500 text-white hover:bg-error-600 active:bg-error-700 focus:ring-error-300",
  };

  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const disabledStyle = disabled || isLoading ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${disabledStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!isLoading && icon && <span className="mr-2">{icon}</span>}

      {children}
    </button>
  );
};

export default Button;
