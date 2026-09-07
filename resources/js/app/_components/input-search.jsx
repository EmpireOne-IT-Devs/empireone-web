import React, { useState, useRef, useEffect } from 'react';

export default function InputSearch({
    label,
    name,
    options = [],
    value,       // Accepts string or object
    onChange,    // Fires ONLY when typing (to trigger the API search)
    onSelect,    // Fires ONLY when an option is clicked (returns full object)
    error,
    className = "",
    placeholder = "Search..."
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(""); 
    const wrapperRef = useRef(null);

    // Sync input text if a value is passed in from the parent
    useEffect(() => {
        if (value && typeof value === 'object') {
            setInputValue(value.label || value.name || "");
        } else if (typeof value === 'string') {
            setInputValue(value);
        } else if (!value) {
            setInputValue("");
        }
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInputValue(text);
        if (onChange) onChange(text); // Trigger the API search
        if (onSelect) onSelect(null); // Clear selected object when typing a new search
        setIsOpen(true);
    };

    const handleOptionClick = (option) => {
        setInputValue(option.label); 
        if (onSelect) onSelect(option.value); // Return the entire object (res) to the parent
        setIsOpen(false);
    };

    const handleClear = () => {
        setInputValue('');
        if (onChange) onChange('');
        if (onSelect) onSelect(null);
        setIsOpen(false);
        document.getElementsByName(name)[0]?.focus();
    };

    return (
        <div ref={wrapperRef} className={`relative flex flex-col w-full ${className}`}>
            {label && (
                <label className="mb-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {label}
                </label>
            )}

            <div className={`relative flex items-center w-full transition-all duration-300 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
                <div className="absolute left-3 text-gray-400 pointer-events-none flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke={error ? "#ef4444" : (isFocused ? "#2563eb" : "currentColor")} className="w-4 h-4 transition-colors duration-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>

                <input
                    type="text"
                    name={name}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => {
                        setIsFocused(true);
                        if (options.length > 0) setIsOpen(true);
                    }}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    autoComplete="off"
                    className={`w-full py-2.5 pl-9 pr-10 text-sm text-gray-700 bg-gray-50 border rounded-xl shadow-sm outline-none transition-all duration-300 hover:bg-white focus:bg-white focus:ring-4 ${
                        error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                />

                <div className={`absolute right-2 flex items-center justify-center transition-opacity duration-200 ${inputValue ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <button type="button" onClick={handleClear} className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                    </button>
                </div>
            </div>

            {error && typeof error === 'string' && (
                <span className="text-red-500 text-xs mt-1.5 ml-1 font-medium">{error}</span>
            )}

            <div className={`absolute top-full left-0 z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg shadow-blue-900/5 overflow-hidden transition-all duration-200 origin-top ${isOpen && options.length > 0 ? 'scale-y-100 opacity-100 pointer-events-auto' : 'scale-y-95 opacity-0 pointer-events-none'}`}>
                <ul className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                    {options.map((option, index) => (
                        <li
                            key={option.value?.id || index}
                            onClick={() => handleOptionClick(option)}
                            className="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors border-b border-gray-50 last:border-none flex items-center justify-between"
                        >
                            <span className="font-medium">{option.label}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 opacity-0 hover:opacity-100 transition-opacity">
                                <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                            </svg>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}