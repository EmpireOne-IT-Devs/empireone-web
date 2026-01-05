import React, { forwardRef, useState, useEffect, useRef } from "react";

const Select = forwardRef(
    (
        {
            label,
            name,
            options = [],
            error,
            iconLeft,
            iconRight,
            disabled = false,
            required = false,
            readOnly = false,
            className = "",
            value, // This is the value from React Hook Form
            onChange, // This is the change handler from React Hook Form
            ...props
        },
        ref
    ) => {
        // 1. Initialize search with the label matching the current value
        const [search, setSearch] = useState("");
        const [isOpen, setIsOpen] = useState(false);
        const containerRef = useRef();

        // Sync search text when the external 'value' (from RHF) changes
        useEffect(() => {
            const selectedOption = options.find((o) => o.value === value);
            if (selectedOption) {
                setSearch(selectedOption.label);
            } else if (!value) {
                setSearch("");
            }
        }, [value, options]);

        // Filter based on what the user is typing
        const filteredOptions = options.filter((opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase())
        );

        const handleSelect = (option) => {
            setSearch(option.label);
            onChange(option.value); // Update React Hook Form
            setIsOpen(false);
        };

        const handleInputChange = (e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            // Optional: Clear the value in RHF if the user clears the input
            if (e.target.value === "") {
                onChange("");
            }
        };

        // Close dropdown when clicking outside
        useEffect(() => {
            const handleClickOutside = (e) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(e.target)
                ) {
                    setIsOpen(false);
                    // Sync search back to the actual selected value label on blur
                    const selectedOption = options.find(
                        (o) => o.value === value
                    );
                    setSearch(selectedOption ? selectedOption.label : "");
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () =>
                document.removeEventListener("mousedown", handleClickOutside);
        }, [value, options]);

        return (
            <div className="w-full" ref={containerRef}>
                <div className="relative">
                    {/* Left Icon */}
                    {iconLeft && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                            {iconLeft}
                        </div>
                    )}

                    {/* Search Input */}
                    <input
                        {...props}
                        autoComplete="off"
                        ref={ref}
                        id={name}
                        name={name}
                        disabled={disabled}
                        placeholder=" " // Required for peer-placeholder-shown to work
                        readOnly={readOnly}
                        value={search}
                        onChange={handleInputChange}
                        onFocus={() => setIsOpen(true)}
                        className={`
              peer w-full rounded-md border bg-white py-2.5 px-4 text-sm text-black
              placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500
              ${iconLeft ? "pl-10" : ""} ${iconRight ? "pr-10" : ""}
              ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
              ${className}
            `}
                    />

                    {/* Floating Label */}
                    <label
                        htmlFor={name}
                        className={`
              absolute left-3 top-2.5 bg-white px-1 text-gray-500 text-sm
              transition-all duration-200 ease-out
              peer-placeholder-shown:top-2.5
              peer-placeholder-shown:text-sm
              peer-placeholder-shown:text-gray-500
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
              peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-700
            `}
                    >
                        {label}
                    </label>

                    {/* Right Icon */}
                    {iconRight && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {iconRight}
                        </div>
                    )}

                    {/* Dropdown Options */}
                    {isOpen && !disabled && (
                        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, index) => (
                                    <li
                                        key={index}
                                        className="cursor-pointer px-4 py-2 hover:bg-blue-100 text-black text-sm"
                                        onMouseDown={(e) => {
                                            // Use onMouseDown to prevent the input blur from closing list before click
                                            e.preventDefault();
                                            handleSelect(option);
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

                {/* Error Message */}
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
