import React, { useState, useRef, useEffect } from "react";
import { Menu } from "lucide-react";
import EditSurveySection from "./edit-survey-section";
import DuplicateSurveySection from "./duplicate-survey-section";
import DeleteSurveySection from "./delete-survey-section";

/**
 * Single consolidated "Actions" menu for a survey row (Edit, Duplicate,
 * Delete), replacing what used to be several separate buttons crowding the
 * table. Mirrors the same dropdown pattern used in the employees table.
 */
export default function SurveyActionsSection({ survey, createSurveyRef }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = (e) => {
        e.stopPropagation();
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
            if (event.key === "Escape") {
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
            <button
                type="button"
                onClick={toggleDropdown}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label="Survey actions"
                className={`relative p-2 rounded-full transition-all duration-150 outline-none hover:bg-black/5 active:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 ${
                    isOpen ? "bg-black/10" : ""
                }`}
            >
                <Menu size={18} className="text-gray-500" />
            </button>

            <div
                className={`absolute right-0 top-full mt-1 min-w-[180px] py-1.5 bg-white rounded-md z-[9999] shadow-[0px_5px_5px_-3px_rgba(0,0,0,0.2),0px_8px_10px_1px_rgba(0,0,0,0.14),0px_3px_14px_2px_rgba(0,0,0,0.12)] transform transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top-right ${
                    isOpen
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
            >
                <EditSurveySection
                    survey={survey}
                    createSurveyRef={createSurveyRef}
                    onAction={closeDropdown}
                />
                <DuplicateSurveySection
                    survey={survey}
                    createSurveyRef={createSurveyRef}
                    onAction={closeDropdown}
                />
                <DeleteSurveySection survey={survey} onAction={closeDropdown} />
            </div>
        </div>
    );
}
