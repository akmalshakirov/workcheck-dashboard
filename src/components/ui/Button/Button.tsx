import React, { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800",
    secondary:
        "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 active:bg-gray-800",
    outline:
        "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 active:bg-blue-100",
    ghost: "text-blue-600 hover:bg-blue-50 focus:ring-blue-500 active:bg-blue-100",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800",
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            loading = false,
            fullWidth = false,
            leftIcon,
            rightIcon,
            className = "",
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const baseClasses = [
            "rounded-lg active:scale-[0.95] duration-150 will-change-transform",
            "inline-flex items-center justify-center gap-2",
            "font-medium transition-all",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        ].join(" ");

        const buttonClasses = [
            baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            fullWidth ? "w-full" : "",
            className,
        ]
            .filter(Boolean)
            .join(" ");

        const LoadingSpinner = () => (
            <svg
                className='animate-spin h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'>
                <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                />
                <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
            </svg>
        );

        return (
            <button
                ref={ref}
                className={buttonClasses}
                disabled={disabled || loading}
                {...props}>
                {loading ? (
                    <LoadingSpinner />
                ) : leftIcon ? (
                    <span className='flex items-center'>{leftIcon}</span>
                ) : null}

                <span>{children}</span>

                {!loading && rightIcon && (
                    <span className='flex items-center'>{rightIcon}</span>
                )}
            </button>
        );
    }
);
