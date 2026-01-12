import React from "react";

const VARIANTS = {
    primary: "bg-blue-600",
    secondary: "bg-gray-600",
    success: "bg-green-600",
    warning: "bg-orange-500",
    danger: "bg-red-600",
    outlined: "bg-transparent border-2 border-gray-600",
};

export default function Indicator({
    variant = "primary",
    size = "sm", 
    className = "",
    label = "", 
}) {
    const sizes = {
        sm: "h-2 w-2",
        md: "h-3 w-3",
    };
    const variantClasses =
        variant === "outlined"
            ? `${VARIANTS[variant]}`
            : `${VARIANTS[variant]}`;

    return (
        <span className={`inline-flex items-center space-x-2 ${className}`}>
            <span
                className={`inline-block rounded-full ${sizes[size]} ${variantClasses}`}
            />
            {label && <span className="text-sm">{label}</span>}
        </span>
    );
}
