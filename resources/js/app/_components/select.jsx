import React, {
    forwardRef,
    useState,
    useEffect,
    useRef,
    useMemo,
} from "react";

const MAX_RENDERED_OPTIONS = 100;

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
            variant = "light",
            labelBgClass,
            value, // from React Hook Form
            onChange, // from React Hook Form
            ...props
        },
        ref,
    ) => {
        const [search, setSearch] = useState("");
        const [isOpen, setIsOpen] = useState(false);
        const containerRef = useRef(null);

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

        const handleInputClick = () => {
            if (!disabled) setIsOpen((prev) => !prev);
        };

        // Close dropdown on outside click
        // Close dropdown on outside click (using capture phase)
        useEffect(() => {
            const handleClickOutside = (e) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(e.target)
                ) {
                    setIsOpen(false);
                }
            };

            // 'true' uses the capture phase so parent stopPropagation won't block it
            window.addEventListener("mousedown", handleClickOutside, true);
            return () =>
                window.removeEventListener("mousedown", handleClickOutside, true);
        }, []);

        const filteredOptions = useMemo(() => {
            const term = (search ?? "").toLowerCase();
            return options.filter((opt) =>
                opt?.label?.toLowerCase()?.includes(term),
            );
        }, [options, search]);

        const visibleOptions = filteredOptions.slice(0, MAX_RENDERED_OPTIONS);
        const hiddenCount = filteredOptions.length - visibleOptions.length;

        const isDark = variant === "dark";
        const iconColor = isDark ? "text-purple-300/70" : "text-gray-500";
        const inputTheme = isDark
            ? `rounded-xl bg-white/5 text-purple-100 focus:ring-purple-400 focus:shadow-[0_0_20px_rgba(168,85,247,0.25)] disabled:opacity-60 ${error ? "border-red-500 focus:ring-red-500" : "border-purple-500/30"}`
            : `rounded-md bg-white text-black focus:ring-purple-500 ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`;
        const labelTheme = isDark
            ? `${labelBgClass ?? "bg-[#130830]"} ${search || isOpen ? "-top-2 text-xs text-purple-300" : "top-2.5 text-purple-200/50 !bg-transparent"}`
            : `bg-white ${search || isOpen ? "-top-2 text-xs text-purple-600" : "top-2.5 text-gray-500"}`;
        const listTheme = isDark
            ? "rounded-xl border-purple-500/30 bg-[#130830] shadow-[0_8px_30px_rgba(168,85,247,0.25)]"
            : "rounded-md bg-white shadow-lg";
        const optionTheme = (selected) =>
            isDark
                ? `text-purple-100 hover:bg-purple-500/20 ${selected ? "bg-purple-500/20 text-orange-300" : ""}`
                : `text-black hover:bg-purple-100 ${selected ? "bg-purple-50 text-purple-600" : ""}`;
        const mutedText = isDark ? "text-purple-200/50" : "text-gray-500";

        return (
            <div className="w-full" ref={containerRef}>
                <div className="relative">
                    {/* Left Icon */}
                    {iconLeft && (
                        <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor} z-10`}>
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
                            setIsOpen(true);
                        }}
                        onClick={handleInputClick}
                        placeholder=""
                        className={`w-full border py-2.5 px-4 text-sm transition-shadow
              focus:outline-none focus:ring-2
              ${iconLeft ? "pl-10" : ""} ${iconRight ? "pr-10" : "pr-8"}
              ${inputTheme}
              ${className}`}
                    />

                    {/* Floating Label */}
                    <label
                        htmlFor={name}
                        className={`absolute left-3 px-1 text-sm transition-all duration-200 ease-out pointer-events-none
              ${labelTheme}`}
                    >
                        {label}
                    </label>

                    {/* Dropdown Arrow */}
                    {!iconRight && (
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconColor} pointer-events-none`}>
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
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconColor} pointer-events-none`}>
                            {iconRight}
                        </div>
                    )}

                    {/* Dropdown Options */}
                    {isOpen && !disabled && (
                        <ul className={`absolute z-[60] mt-1 w-full max-h-60 overflow-auto border ${listTheme}`}>
                            {visibleOptions.length > 0 ? (
                                visibleOptions.map((option, idx) => (
                                    <li
                                        key={option.value ?? idx}
                                        className={`cursor-pointer px-4 py-2 text-sm ${optionTheme(value === option.value)}`}
                                        onMouseDown={(e) => {
                                            e.preventDefault(); // Prevent input defocusing
                                        }}
                                        onClick={() => handleSelect(option)}
                                    >
                                        {option.label}
                                    </li>
                                ))
                            ) : (
                                <li className={`px-4 py-2 text-sm ${mutedText}`}>
                                    No results found
                                </li>
                            )}
                            {hiddenCount > 0 && (
                                <li className={`px-4 py-2 text-xs ${isDark ? "text-purple-200/40" : "text-gray-400"}`}>
                                    {hiddenCount} more — type to narrow results
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