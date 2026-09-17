import React, { useState, useRef, useEffect } from 'react';
import { FcMenu } from "react-icons/fc";
import AddAttritionSection from './add-attrition-section';
import UpdateEmployee from './update-employee';

export default function EmployeeActionSection({ props_data }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen((prev) => !prev);
    const closeDropdown = () => setIsOpen(false);

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
            {/* MUI IconButton */}
            <button
                type="button"
                onClick={toggleDropdown}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className={`
                    relative p-2 rounded-full transition-all duration-150 outline-none
                    hover:bg-black/5 active:bg-black/10
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600
                    ${isOpen ? 'bg-black/10' : ''}
                `}
            >
                <FcMenu size={20} />
            </button>

            {/* MUI Menu Paper Container */}
            <div
                className={`
                    absolute left-0 top-full mt-1 min-w-[200px] py-1.5 bg-white rounded-md z-[100]
                    shadow-[0px_5px_5px_-3px_rgba(0,0,0,0.2),0px_8px_10px_1px_rgba(0,0,0,0.14),0px_3px_14px_2px_rgba(0,0,0,0.12)]
                    transform transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top-left
                    ${isOpen
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }
                `}
            >
                {/* Item 1: Add Attrition */}
                <div
                      className="
                        w-full hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors duration-150
                        [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-gray-800
                    "
               >
                    <AddAttritionSection
                        props_data={props_data}
                        onAction={closeDropdown}
                    />
                </div>

                {/* Item 2: Update Employee */}
                <div
                    className="
                        w-full hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors duration-150
                        [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-gray-800
                    "
                >
                    <UpdateEmployee
                        props_data={props_data}
                        onAction={closeDropdown}
                    />
                </div>
            </div>
        </div>
    );
}