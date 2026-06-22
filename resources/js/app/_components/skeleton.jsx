import React from "react";


export default function Skeleton({ lines = 6, rounded = "rounded", className = "" }) {
    // Natural-looking widths so it doesn't look like a solid block
    const widths = ["w-full", "w-11/12", "w-full", "w-4/5", "w-full", "w-3/4"];

    return (
        <div className={`w-full flex flex-col gap-3 ${className}`} aria-busy="true" aria-label="Loading…">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={`h-3 bg-gray-200 animate-pulse ${rounded} ${widths[i % widths.length]}`}
                />
            ))}
        </div>
    );
}