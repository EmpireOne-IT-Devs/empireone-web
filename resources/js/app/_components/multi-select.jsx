import React, { forwardRef, useState, useEffect, useRef } from "react";
import Button from "./button";

const MultiSelect = forwardRef(
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
            value,
            onChange,
            ...props
        },
        ref,
    ) => {
        const [search, setSearch] = useState("");
        const [isOpen, setIsOpen] = useState(false);
        const [internalValues, setInternalValues] = useState([]);

        const containerRef = useRef(null);
        const inputRef = useRef(null);

        // Check if controlled by parent
        const isControlled = typeof onChange === "function";
        const selectedValues = isControlled
            ? (Array.isArray(value) ? value : [])
            : internalValues;

        const updateSelection = (newValues) => {
            if (isControlled) {
                onChange(newValues);
            } else {
                setInternalValues(newValues);
            }
        };

        const handleSelect = (option) => {
            let newValues;

            if (selectedValues.includes(option.value)) {
                newValues = selectedValues.filter((v) => v !== option.value);
            } else {
                newValues = [...selectedValues, option.value];
            }

            updateSelection(newValues);
            onSelect && onSelect(newValues, option);
            setSearch("");
            inputRef.current?.focus(); // Keep focus after selecting
        };

        const removeTag = (e, optionValue) => {
            e.stopPropagation();
            if (disabled) return;
            const newValues = selectedValues.filter((v) => v !== optionValue);
            updateSelection(newValues);
        };

        const handleInputClick = () => {
            if (!disabled) {
                // Modified: Toggle the dropdown so the user can manually close it
                setIsOpen((prev) => !prev);
                inputRef.current?.focus();
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Backspace" && search === "" && selectedValues.length > 0) {
                e.preventDefault();
                const newValues = selectedValues.slice(0, -1);
                updateSelection(newValues);
            }
        };

        useEffect(() => {
            const handleClickOutside = (e) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(e.target)
                ) {
                    // Modified: Removed setIsOpen(false) so it stays open
                    // We only clear the search text when clicking away
                    setSearch("");
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);

        const filteredOptions = options.filter((opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase()),
        );

        const shouldFloatLabel = search || isOpen || selectedValues.length > 0;

        return (
            <div className="w-full" ref={containerRef}>
                <div className="relative">
                    {iconLeft && (
                        <div className="absolute left-3 top-3 z-10 pointer-events-none text-gray-500">
                            {iconLeft}
                        </div>
                    )}

                    {/* Input Container */}
                    <div
                        onClick={handleInputClick}
                        className={`w-full min-h-[50px] flex flex-wrap items-center gap-1 rounded-md border bg-white py-1.5 px-3 text-sm text-black cursor-text transition-colors
              focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
              ${iconLeft ? "pl-10" : ""} ${iconRight ? "pr-10" : "pr-8"}
              ${error ? "border-red-500 focus-within:ring-red-500" : "border-gray-400"}
              ${disabled ? "bg-gray-50 cursor-not-allowed opacity-70" : ""}
              ${className}`}
                    >
                        {/* Selected Tags */}
                        {selectedValues.map((val) => {
                            const opt = options.find((o) => o.value === val);
                            if (!opt) return null;
                            return (
                                <span
                                    key={val}
                                    className="flex items-center gap-1 rounded border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                                >
                                    {opt.label}
                                    <button
                                        type="button"
                                        onClick={(e) => removeTag(e, val)}
                                        className="text-blue-500 hover:text-blue-800 focus:outline-none"
                                    >
                                        X
                                    </button>
                                </span>
                            );
                        })}

                        {/* Search Input */}
                        <input
                            type="text"
                            {...props}
                            autoComplete="off"
                            ref={(e) => {
                                inputRef.current = e;
                                if (typeof ref === "function") ref(e);
                                else if (ref) ref.current = e;
                            }}
                            id={name}
                            name={name}
                            disabled={disabled}
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setIsOpen(true);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={selectedValues.length === 0 && !shouldFloatLabel ? "" : ""}
                            className="flex-1 bg-transparent border-transparent min-w-[60px] py-1 outline-none text-sm text-gray-800 placeholder-gray-400 focus:ring-0 focus:border-transparent"
                        />
                    </div>

                    {/* Floating Label */}
                    <label
                        htmlFor={name}
                        className={`absolute left-3 bg-white px-1 text-sm transition-all duration-200 ease-out pointer-events-none
              ${shouldFloatLabel ? "-top-2 text-xs text-blue-600" : "top-3 text-gray-500"}
              ${iconLeft && !shouldFloatLabel ? "left-10" : "left-5"}
            `}
                    >
                        {label}
                    </label>

                    {/* Dropdown Arrow */}
                    {!iconRight && (
                        <div className="absolute right-3 top-3 text-gray-500">
                            {/* <svg
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
                            </svg> */}
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={() => setIsOpen(false)}
                            >DONE</Button>
                        </div>
                    )}

                    {iconRight && (
                        <div className="absolute right-3 top-3 pointer-events-none text-gray-500">
                            {iconRight}
                        </div>
                    )}

                    {/* Dropdown Options */}
                    {isOpen && !disabled && (
                        <ul className="absolute z-[60] mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, idx) => {
                                    const isSelected = selectedValues.includes(option.value);
                                    return (
                                        <li
                                            key={idx}
                                            className={`flex cursor-pointer items-center justify-between px-4 py-2 text-sm text-black transition-colors hover:bg-gray-100 ${isSelected ? "font-medium bg-blue-50 text-blue-700" : ""
                                                }`}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleSelect(option);
                                            }}
                                        >
                                            <span>{option.label}</span>
                                            {isSelected && (
                                                <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </li>
                                    );
                                })
                            ) : (
                                <li className="px-4 py-3 text-center text-sm italic text-gray-500">
                                    No results found
                                </li>
                            )}
                        </ul>
                    )}
                </div>

                {error && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                        {error.message ?? error}
                    </p>
                )}
            </div>
        );
    },
);

MultiSelect.displayName = "MultiSelect";

export default MultiSelect;