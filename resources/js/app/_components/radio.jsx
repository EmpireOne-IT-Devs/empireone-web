import React, { forwardRef } from "react";

// 1. Wrap with forwardRef to allow React Hook Form to control the element
const Radio = forwardRef(
    (
        {
            label,
            disabled = false,
            ...props // 2. Collect all other props (name, value, onChange, onBlur, etc.)
        },
        ref,
    ) => {
        return (
            <label
                className={`flex items-center gap-2 cursor-pointer ${
                    disabled ? "opacity-60 cursor-not-allowed" : ""
                }`}
            >
                <input
                    type="radio"
                    ref={ref} // 3. Attach the ref here
                    disabled={disabled}
                    {...props} // 4. Spread everything else (includes value and the register functions)
                    className="w-4 h-4 text-blue-600 accent-blue-600"
                />
                <span className="text-sm text-gray-800">{label}</span>
            </label>
        );
    },
);

export default Radio;
