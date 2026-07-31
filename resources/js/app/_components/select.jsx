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
            value, // from React Hook Form
            onChange, // from React Hook Form
            ...props
        },
        ref,
    ) => {
        const [search, setSearch] = useState("");
        const [isOpen, setIsOpen] = useState(false);
        const containerRef = useRef();

        // Sync search text with value
        useEffect(() => {
            const selectedOption = options.find((o) => o.value === value);
            if (selectedOption) setSearch(selectedOption.label);
            else setSearch("");
        }, [value, options]);

        const handleSelect = (option) => {
            setSearch(option.label);
            if (onChange) onChange(option.value);
            if (onSelect) onSelect(option);
            setIsOpen(false);
        };

        const handleInputClick = (e) => {
            e.stopPropagation(); // Prevent clicks from bleeding to parent modal
            if (!disabled) setIsOpen(true);
        };

        // Close dropdown on outside click
        useEffect(() => {
            const handleClickOutside = (e) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(e.target)
                ) {
                    setIsOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        // Filter options
        const filteredOptions = options.filter((opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase()),
        );

        return (
            <div className="w-full" ref={containerRef}>
                <div className="relative">
                    {/* Left Icon */}
                    {iconLeft && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                            {iconLeft}
                        </div>
                    )}

                    {/* Input */}
                    <input
                        type="search"
                        {...props}
                        autoComplete="off"
                        ref={ref}
                        id={name}
                        name={name}
                        disabled={disabled}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setIsOpen(true); // open dropdown while typing
                        }}
                        onClick={handleInputClick}
                        placeholder=""
                        className={`w-full rounded-md border bg-white py-2.5 px-4 text-sm text-black
              focus:outline-none focus:ring-2 focus:ring-purple-500
              ${iconLeft ? "pl-10" : ""} ${iconRight ? "pr-10" : "pr-8"}
              ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
              ${className}`}
                    />

                    {/* Floating Label */}
                    <label
                        htmlFor={name}
                        className={`absolute left-3 bg-white px-1 text-sm transition-all duration-200 ease-out pointer-events-none
              ${search || isOpen ? "-top-2 text-xs text-purple-600" : "top-2.5 text-gray-500"}`}
                    >
                        {label}
                    </label>

                    {/* Dropdown Arrow */}
                    {!iconRight && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                            <svg
                                className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
                            // Block any clicks inside the UL from reaching the modal backdrop
                            onMouseDown={(e) => e.stopPropagation()}
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
                                            e.preventDefault(); // Prevent input from losing focus
                                            e.stopPropagation(); // Stop bubbling
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Stop bubbling to modal
                                            handleSelect(option); // Moved selection logic here
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
    },
);

Select.displayName = "Select";

export default Select;