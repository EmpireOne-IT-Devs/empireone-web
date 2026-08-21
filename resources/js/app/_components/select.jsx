import React, { forwardRef, useState, useEffect, useRef } from "react";

const Select = forwardRef(
    (
        {
            label,
            name,
            options = [],
            error,
            onSelect,
            iconLeft,
            iconRight,
            disabled = false,
            className = "",
            value, // from React Hook Form (via ...field)
            onChange, // from React Hook Form (via ...field)
            onBlur, // from React Hook Form (via ...field)
            ...props
        },
        ref
    ) => {
        const [search, setSearch] = useState("");
        const [isOpen, setIsOpen] = useState(false);
        const containerRef = useRef(null);

        // 1. Sync search text with value ONLY when dropdown is closed or value changes externally
        useEffect(() => {
            if (!isOpen) {
                const selectedOption = options.find((o) => o.value === value);
                setSearch(selectedOption ? selectedOption.label : "");
            }
        }, [value, options, isOpen]);

        const handleInputClick = () => {
            if (!disabled) setIsOpen((prev) => !prev);
        };

        // 2. Close dropdown on outside click
        useEffect(() => {
            const handleClickOutside = (e) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(e.target)
                ) {
                    setIsOpen(false);
                }
            };

            window.addEventListener("mousedown", handleClickOutside, true);
            return () =>
                window.removeEventListener("mousedown", handleClickOutside, true);
        }, []);

        const filteredOptions = options.filter((opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase())
        );

        return (
            <div className="w-full" ref={containerRef}>
                <div className="relative">
                    {/* Left Icon */}
                    {iconLeft && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none">
                            {iconLeft}
                        </div>
                    )}

                    {/* Input */}
                    <input
                        type="text" // 'text' instead of 'search' prevents the native browser 'x' clear button from breaking state
                        {...props}
                        autoComplete="off"
                        ref={ref}
                        id={name}
                        name={name}
                        disabled={disabled}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setIsOpen(true);
                        }}
                        onBlur={(e) => {
                            // Forward onBlur to React Hook Form for validation triggers
                            if (onBlur) onBlur(e);
                        }}
                        onClick={handleInputClick}
                        placeholder=""
                        className={`w-full rounded-md border bg-white py-2.5 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-500 ${iconLeft ? "pl-10" : ""
                            } ${iconRight ? "pr-10" : "pr-8"} ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                            } ${className}`}
                    />

                    {/* Floating Label */}
                    <label
                        htmlFor={name}
                        className={`absolute left-3 bg-white px-1 text-sm transition-all duration-200 ease-out pointer-events-none ${search || isOpen
                                ? "-top-2 text-xs text-purple-600"
                                : "top-2.5 text-gray-500"
                            }`}
                    >
                        {label}
                    </label>

                    {/* Dropdown Arrow */}
                    {!iconRight && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                            <svg
                                className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    )}

                    {/* Right Icon */}
                    {iconRight && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                            {iconRight}
                        </div>
                    )}

                    {/* Dropdown Options */}
                    {isOpen && !disabled && (
                        <ul
                            className="absolute z-[60] mt-1 w-full max-h-60 overflow-auto rounded-md border bg-white shadow-lg"
                            // Block clicks from bubbling up to the Modal
                            onMouseDown={(e) => e.stopPropagation()}
                            onMouseUp={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, idx) => (
                                    <li
                                        key={idx}
                                        className={`cursor-pointer px-4 py-2 hover:bg-purple-100 text-black text-sm ${value === option.value
                                                ? "bg-purple-50 text-purple-600"
                                                : ""
                                            }`}
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // Prevent input defocusing
                                            e.stopPropagation(); // Stop event bubbling
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Stop event bubbling

                                            // 1. Update the state immediately
                                            setSearch(option.label);
                                            if (onChange) onChange(option.value);
                                            if (onSelect) onSelect(option);

                                            // 2. Wait 100ms before deleting the node so the Modal 
                                            // doesn't falsely detect an "outside click"
                                            setTimeout(() => {
                                                setIsOpen(false);
                                            }, 100);
                                        }}
                                    >
                                        {option.label}
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-sm text-gray-500">
                                    No results found
                                </li>
                            )}
                        </ul>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <p className="mt-1 text-xs text-red-500">
                        {error.message ?? error}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";

export default Select;