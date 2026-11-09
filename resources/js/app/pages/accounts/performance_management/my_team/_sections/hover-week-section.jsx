import React, { useState, useRef, useEffect } from 'react';
import PopupCorrectiveActionSection from './popup-corrective-action-section';

export default function HoverWeekSection({ props_data, week = 'week_1', label }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const list = Array.isArray(props_data?.[week]) ? props_data[week] : [];
    const displayLabel = label || week.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative inline-block group"
        // onMouseEnter={() => setIsOpen(true)}
        // onMouseLeave={() => setIsOpen(false)}
        >
            {/* Interactive Badge (Hover or Focus/Click) */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="cursor-pointer font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            >
                {list.length}
            </button>

            {/* Popover */}
            {isOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 flex flex-col z-50 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-xl text-xs text-gray-700 animate-in fade-in zoom-in-95 duration-100">
                    <div className="font-semibold text-gray-900 border-b pb-1.5 mb-2 flex justify-between items-center">
                        <span>{displayLabel} Details</span>
                        <span className="text-gray-400 font-normal">({list.length} total)</span>
                    </div>

                    {list.length === 0 ? (
                        <p className="text-gray-400 italic py-1">No reaches recorded</p>
                    ) : (
                        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                            {list.map((reach, index) => (
                                <div
                                    key={reach.id || index}
                                    className="p-1.5 rounded bg-gray-50 border border-gray-100 flex flex-col gap-0.5"
                                >
                                    <PopupCorrectiveActionSection props_data={reach}>
                                        <div className="flex justify-between items-center font-medium text-gray-800">
                                            <span>Reach #{reach.id || index + 1}</span>
                                            {reach.value !== undefined && (
                                                <span className="text-emerald-600 font-semibold">
                                                    {reach.value}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-gray-500">
                                            {reach.created_at
                                                ? new Date(reach.created_at).toLocaleDateString()
                                                : 'N/A'}
                                        </span>
                                    </PopupCorrectiveActionSection>

                                </div>
                            ))}
                        </div>
                    )}

                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-white" />
                </div>
            )}
        </div>
    );
}