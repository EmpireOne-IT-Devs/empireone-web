import React from "react";

const VARIANTS = {
    primary: {
        bar: "bg-blue-800",
        track: "bg-gray-400",
    },
    success: {
        bar: "bg-green-600",
        track: "bg-gray-400",
    },
    warning: {
        bar: "bg-yellow-500",
        track: "bg-gray-400",
    },
    danger: {
        bar: "bg-red-600",
        track: "bg-gray-400",
    },
};

export default function ProgressBar({
    value = 0,
    max = 100,
    height = "h-2",
    variant = "primary",
}) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const colors = VARIANTS[variant] || VARIANTS.primary;

    return (
        <div className={`w-full ${colors.track} rounded-full ${height}`}>
            <div
                className={`${colors.bar} ${height} rounded-full transition-all duration-300`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
