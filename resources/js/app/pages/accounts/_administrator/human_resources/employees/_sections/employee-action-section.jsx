import React, { useState, useRef, useEffect } from 'react';
import { BsThreeDots } from "react-icons/bs";
import AddAttritionSection from './add-attrition-section';

export default function EmployeeActionSection({ props_data }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Toggle the dropdown menu
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Close the dropdown if the user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDelete = () => {
        console.log("Delete clicked for:", props_data);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={toggleDropdown}
                aria-expanded={isOpen}
                className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
            >
                <BsThreeDots size={20} />
            </button>

            {/* Dropdown Menu */}
            <div
                className={`
                  absolute left-0 top-full mt-1.5 min-w-52 bg-white rounded-md shadow-lg flex flex-col z-50 ring-1 ring-black ring-opacity-5
                  transition-all duration-200 ease-in-out
                  ${isOpen ? 'opacity-100 visible translate-y-0 pointer-events-auto' : 'opacity-0 invisible -translate-y-2 pointer-events-none'}
                `}
            >
                {/* 
                  Note: I kept your styling here, but be careful! 
                  If AddAttritionSection also has its own button styling, 
                  you might end up with a button inside a div that looks like a button. 
                */}
                <div
                    className="
                        group flex items-center justify-center gap-2 
                        px-6 py-2.5 
                        bg-gray-300 font-semibold hover:text-white text-sm tracking-wide
                        rounded-lg shadow-sm 
                        transition-all duration-200 ease-in-out
                        hover:bg-gray-400 hover:shadow-md hover:-translate-y-0.5
                        active:scale-95 active:translate-y-0 active:bg-gray-400
                        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                    "
                >
                    <AddAttritionSection props_data={props_data} />
                </div>
            </div>
        </div>
    );
}