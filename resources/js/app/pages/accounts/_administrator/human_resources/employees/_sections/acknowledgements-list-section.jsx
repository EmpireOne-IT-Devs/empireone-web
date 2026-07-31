import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    ChevronDown,
    FileText,
    Folder,
    XCircle,
} from 'lucide-react';

export default function AcknowledgementsListSection({ props_data, empId }) {
    const [open, setOpen] = useState(false);
    const [openItems, setOpenItems] = useState({});

    // Ref attached to the component container to detect outside clicks
    const containerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    // Calculate total count, done count, and incomplete count
    const { totalDocs, doneCount, incompleteCount } = useMemo(() => {
        const acks = props_data?.acknowledgements || [];
        let done = 0;
        let incomplete = 0;

        acks.forEach((item) => {
            if (item?.is_already_acknowledged) {
                done++;
            } else {
                incomplete++;
            }

            if (item?.items && item.items.length > 0) {
                item.items.forEach((subItem) => {
                    if (subItem?.is_already_acknowledged) {
                        done++;
                    } else {
                        incomplete++;
                    }
                });
            }
        });

        return {
            totalDocs: acks.length,
            doneCount: done,
            incompleteCount: incomplete,
        };
    }, [props_data?.acknowledgements]);

    const toggleAccordion = (employeeId, ackId) => {
        const key = `${employeeId}-${ackId}`;
        setOpenItems((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        /* Attached containerRef here to catch outside clicks */
        <div ref={containerRef} className="pt-3 border-t border-gray-100/80 w-full relative">
            {/* Header / Toggle Button */}
            <button
                onClick={() => setOpen(!open)}
                type="button"
                className="w-full flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg hover:bg-slate-100/70 transition-colors group cursor-pointer select-none"
            >
                <div className="flex items-center gap-1.5 flex-wrap">
                    <Folder className="w-4 h-4 text-purple-600 group-hover:text-purple-700 transition-colors" />
                    <span className="text-xs font-bold text-left text-gray-700 group-hover:text-gray-900 uppercase tracking-wider">
                        Acknowledgements
                    </span>

                    {/* Count Badges */}
                    {totalDocs > 0 && (
                        <div className="flex items-center gap-1 ml-1">
                            {/* Done Count Badge */}
                            <span className="bg-emerald-50 text-emerald-700 font-semibold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" /> {doneCount}
                            </span>

                            {/* Incomplete Count Badge */}
                            <span className="bg-amber-50 text-amber-700 font-semibold text-[10px] px-2 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-1">
                                <XCircle className="w-2.5 h-2.5" /> {incompleteCount}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-purple-700 shrink-0">
                    <span>{open ? 'Hide' : 'Show'}</span>
                    <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                        <ChevronDown className="w-4 h-4" />
                    </motion.div>
                </div>
            </button>

            {/* FLOATING OVERLAY DROPDOWN */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="main-doc-list"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute left-0 right-0 top-full mt-2 z-50 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-xl max-h-[320px] overflow-y-auto"
                    >
                        <div className="flex flex-col gap-2.5">
                            {totalDocs > 0 ? (
                                props_data.acknowledgements.map((ress) => {
                                    const hasSubItems = ress?.items && ress?.items?.length > 0;
                                    const accordionKey = `${empId}-${ress.id}`;
                                    const isOpen = !!openItems[accordionKey];

                                    return (
                                        <div
                                            key={ress.id}
                                            className="flex flex-col bg-slate-50/90 border border-slate-200/80 rounded-xl p-3 transition-all"
                                        >
                                            {/* Main Acknowledgement Header */}
                                            <div className="flex items-center justify-between w-full gap-2">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 shrink-0">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                                                        {ress.title}
                                                    </span>
                                                </div>

                                                {/* Status Badge OR Accordion Toggle Button */}
                                                {hasSubItems ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleAccordion(empId, ress.id)}
                                                        className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-100/70 hover:bg-purple-200/80 px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer"
                                                    >
                                                        <span>{ress.items.length} Sub-policies</span>
                                                        <motion.div
                                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                                                        >
                                                            <ChevronDown className="w-3.5 h-3.5" />
                                                        </motion.div>
                                                    </button>
                                                ) : (
                                                    <StatusBadge isDone={ress?.is_already_acknowledged} />
                                                )}
                                            </div>

                                            {/* Inner Sub-items Accordion */}
                                            <AnimatePresence initial={false}>
                                                {hasSubItems && isOpen && (
                                                    <motion.div
                                                        key="sub-content"
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-col gap-2 pl-2">
                                                            {ress.items.map((item) => (
                                                                <div
                                                                    key={item.id}
                                                                    className="flex items-center justify-between text-xs py-1 hover:bg-slate-100/50 rounded-md px-1.5 transition-colors"
                                                                >
                                                                    <span className="text-gray-600 font-medium flex items-center gap-2 truncate pr-2">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"></span>
                                                                        <span className="truncate">{item?.title}</span>
                                                                    </span>
                                                                    <StatusBadge isDone={item?.is_already_acknowledged} size="sm" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-4 text-xs font-medium text-gray-400 bg-slate-50/50 rounded-xl border border-dashed border-gray-200">
                                    No documents assigned
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper Badge Component
function StatusBadge({ isDone, size = 'md' }) {
    if (isDone) {
        return (
            <span
                className={`inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50/90 border border-emerald-200/80 rounded-lg shrink-0 ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
                    }`}
            >
                <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} /> Done
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50/90 border border-amber-200/80 rounded-lg shrink-0 ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
                }`}
        >
            <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} /> Incomplete
        </span>
    );
}