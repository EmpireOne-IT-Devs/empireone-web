import React, { useState, useRef, useEffect } from 'react';
import { FcMenu, FcLeave, FcSettings } from "react-icons/fc";
import AddAttritionSection from './add-attrition-section';
import UpdateEmployee from './update-employee';

export default function EmployeeActionSection({ props_data }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

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

    const handleActionClick = () => {
        setIsOpen(false);
    };

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
                    absolute left-0 top-full mt-1 min-w-[200px] py-2 bg-white rounded-md z-[100]
                    shadow-[0px_5px_5px_-3px_rgba(0,0,0,0.2),0px_8px_10px_1px_rgba(0,0,0,0.14),0px_3px_14px_2px_rgba(0,0,0,0.12)]
                    transform transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top-left
                    ${isOpen 
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }
                `}
            >
                {/* MUI MenuItem 1 */}
                <div 
                    onClick={handleActionClick}
                    className="
                        group relative flex items-center w-full px-4 py-2.5 text-sm font-normal text-gray-800
                        cursor-pointer select-none transition-colors duration-150
                        hover:bg-black/[0.04] active:bg-black/[0.08]
                        [&>button]:w-full [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left
                    "
                >
                    <AddAttritionSection props_data={props_data} />
                </div>

                {/* MUI MenuItem 2 */}
                <div 
                    onClick={handleActionClick}
                    className="
                        group relative flex items-center w-full px-4 py-2.5 text-sm font-normal text-gray-800
                        cursor-pointer select-none transition-colors duration-150
                        hover:bg-black/[0.04] active:bg-black/[0.08]
                        [&>button]:w-full [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left
                    "
                >
                    <UpdateEmployee props_data={props_data} />
                </div>
            </div>
        </div>
    );
}