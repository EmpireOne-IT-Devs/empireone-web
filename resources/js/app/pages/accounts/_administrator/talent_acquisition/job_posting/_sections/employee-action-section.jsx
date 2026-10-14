import { setAlert } from '@/app/redux/app-slice';
import { get_job_posting_thunk } from '@/app/redux/job-posting-thunk';
import { change_status_service } from '@/app/services/job-posting-service';
import store from '@/app/store/store';
import React, { useState, useRef, useEffect } from 'react';
import { FcMenu, FcCheckmark, FcClock, FcCancel } from "react-icons/fc";
import { useDispatch } from 'react-redux';

export default function JobPostingActionSection({ props_data }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();

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

    const statuses = [
        { label: 'Active', value: 'Active', icon: <FcCheckmark size={18} /> },
        { label: 'On Hold', value: 'On Hold', icon: <FcClock size={18} /> },
        { label: 'Closed', value: 'Closed', icon: <FcCancel size={18} /> },
    ];

    async function change_status(params) {
        setLoading(true);
        closeDropdown();

        try {
            await change_status_service({
                ...props_data,
                ...params,
            });

            await store.dispatch(get_job_posting_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Status Updated",
                    message: `Job posting status changed to ${params.status}`,
                    open: true,
                })
            );
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to update status",
                    message:
                        error?.response?.data?.message ||
                        error?.message ||
                        "Something went wrong",
                    open: true,
                })
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Toggle Button */}
            <button
                type="button"
                onClick={toggleDropdown}
                disabled={loading}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className={`
                    relative p-2 rounded-full transition-all duration-150 outline-none
                    hover:bg-black/5 active:bg-black/10
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isOpen ? 'bg-black/10' : ''}
                `}
            >
                {loading ? (
                    /* Inline Loading Spinner */
                    <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <FcMenu size={20} />
                )}
            </button>

            {/* Dropdown Menu Container */}
            <div
                className={`
                    absolute right-0 top-full mt-1 min-w-[200px] py-1.5 bg-white rounded-md z-[9999]
                    shadow-[0px_5px_5px_-3px_rgba(0,0,0,0.2),0px_8px_10px_1px_rgba(0,0,0,0.14),0px_3px_14px_2px_rgba(0,0,0,0.12)]
                    transform transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top-right
                    ${isOpen
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }
                `}
            >
                {statuses.map((item) => (
                    <div
                        key={item.value}
                        className="
                            w-full hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors duration-150
                            [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-gray-800
                        "
                    >
                        <button
                            type="button"
                            onClick={() => change_status({ status: item.value })}
                            className="group flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}