import React from "react";

export default function Checkbox({
    label,
    name,
    checked,
    onChange,
    register,
    disabled = false,
    required = false,
    error,
}) {
    return (
        <div className="flex items-start sgap-2 w-full">
            {/* Checkbox Input */}
            <div className="relative flex items-center">
                <input
                    {...register}
                    type="checkbox"
                    id={name}
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    className={`peer w-5 h-5 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 focus:outline-none transition-all
          ${error ? "border-red-500" : ""}
          `}
                />
            </div>

            {/* Label */}
            <label
                htmlFor={name}
                className="text-gray-700 ml-2 text-sm select-none peer-disabled:text-gray-400"
            >
                {label}
            </label>

            {/* Error Message */}
            {error && <div className="ml-1 text-sm text-red-500">{error}</div>}
        </div>
    );
}
