import React, { useState, useRef, useEffect } from 'react';
import { FcMenu } from "react-icons/fc";

export default function Menu({ items = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    };

    const handleItemClick = (onClick) => {
        if (typeof onClick === 'function') {
            onClick();
        }
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Toggle Button */}
            <button
                type="button"
                onClick={toggleDropdown}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label="Toggle actions menu"
                className={`
                    relative p-2 rounded-full transition-all duration-150 outline-none
                    hover:bg-black/5 active:bg-black/10
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600
                    ${isOpen ? 'bg-black/10' : ''}
                `}
            >
                <FcMenu size={20} />
            </button>

            {/* Dropdown Menu Container */}
            <div
                className={`
                    absolute right-0 top-full mt-1 min-w-[200px] py-1 bg-white rounded-md z-[9999]
                    shadow-[0px_5px_5px_-3px_rgba(0,0,0,0.2),0px_8px_10px_1px_rgba(0,0,0,0.14),0px_3px_14px_2px_rgba(0,0,0,0.12)]
                    transform transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top-right
                    ${isOpen
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }
                `}
            >
                <div className="flex flex-col py-1">
                    {items.map((res, index) => {
                        const IconComponent = res.icon;
                        const key = res.id || index;

                        // If custom JSX element/component is passed in item.component
                        if (res.component) {
                            return (
                                <div
                                    key={key}
                                    onClick={() => setIsOpen(false)}
                                    className="w-full cursor-pointer"
                                >
                                    {res.component}
                                </div>
                            );
                        }

                        // Default Button Menu Item
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => handleItemClick(res.onClick)}
                                className="
                                    group flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm font-medium 
                                    text-gray-700 hover:bg-black/[0.04] active:bg-black/[0.08] hover:text-gray-900 
                                    transition-colors duration-150
                                "
                            >
                                {IconComponent && (
                                    <IconComponent
                                        size={20}
                                        className="shrink-0 transition-transform duration-200 ease-out group-hover:scale-110"
                                    />
                                )}
                                <span>{res.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}