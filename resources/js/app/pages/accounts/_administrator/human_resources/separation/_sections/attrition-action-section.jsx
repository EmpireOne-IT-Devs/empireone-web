import React, { useState, useRef, useEffect } from 'react';
import { FcMenu } from "react-icons/fc";
import { FiFileText, FiExternalLink } from "react-icons/fi";

export default function AttritionActionSection({ props_data }) {
    const [isOpen, setIsOpen] = useState(false);
    const [openUp, setOpenUp] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = (e) => {
        e.stopPropagation();

        if (!isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const MENU_HEIGHT = 180;

            setOpenUp(spaceBelow < MENU_HEIGHT);
        }

        setIsOpen((prev) => !prev);
    };

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

    // Handle both direct array props or props_data.documents
    const documents = Array.isArray(props_data?.documents)
        ? props_data.documents
        : Array.isArray(props_data)
            ? props_data
            : [];

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Toggle Button */}
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

            {/* Dropdown Menu Container */}
            <div
                className={`
                    absolute right-0 min-w-[220px] py-1.5 bg-white rounded-xl z-[9999] border border-gray-100
                    shadow-[0px_5px_15px_rgba(0,0,0,0.12),0px_2px_4px_rgba(0,0,0,0.06)]
                    transform transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${openUp ? 'bottom-full mb-1 origin-bottom-right' : 'top-full mt-1 origin-top-right'}
                    ${isOpen
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : openUp
                            ? 'opacity-0 scale-95 translate-y-2 pointer-events-none'
                            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }
                `}
            >
                <div className="px-3 py-1.5 border-b border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Documents
                    </span>
                </div>

                <div className="flex flex-col py-1">
                    {documents.length > 0 ? (
                        documents.map((doc, idx) => (
                            <a
                                key={doc.id || idx}
                                href={doc.href}
                                target="_blank"
                                rel="noreferrer"
                                onClick={closeDropdown}
                                className="w-full px-3.5 py-2 flex items-center justify-between gap-2.5 text-left text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150"
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <FiFileText className="w-4 h-4 text-purple-600 shrink-0" />
                                    <span className="truncate">{doc.document_type}</span>
                                </div>
                                <FiExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            </a>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-center text-xs text-gray-400">
                            No documents available
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}