import React, { forwardRef } from "react";

const TextArea = forwardRef(function TextArea(
    {
        label,
        name,
        placeholder = " ",
        required = false,
        disabled = false,
        error,
        className = "",
        rows = 4,
        ...rest
    },
    ref
) {
    // Ensure placeholder has at least a space so peer-placeholder-shown works
    const activePlaceholder = placeholder || " ";

    return (
        <div className="w-full">
            <div className="relative">
                <textarea
                    ref={ref}
                    id={name}
                    name={name}
                    rows={rows}
                    placeholder={activePlaceholder}
                    required={required}
                    disabled={disabled}
                    className={`peer w-full px-5 pt-4 pb-2.5 text-black border border-gray-400 rounded-md bg-white focus:outline-none focus:border-blue-500 resize-none transition-all ${error ? "border-red-500" : ""
                        } ${className}`}
                    {...rest}
                />
                <label
                    htmlFor={name}
                    className="absolute left-2.5 px-2.5 transition-all bg-white text-gray-500 text-sm pointer-events-none -top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:bg-white"
                >
                    {label}
                </label>
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
});

export default TextArea;