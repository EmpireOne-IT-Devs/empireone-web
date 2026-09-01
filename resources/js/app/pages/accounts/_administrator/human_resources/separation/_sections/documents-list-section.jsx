import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    ChevronDown,
    FileText,
    Folder,
    XCircle,
} from 'lucide-react';

export default function DocumentsListSection({ props_data, empId }) {
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
        const acks = props_data?.documents || [];
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
    }, [props_data?.documents]);

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
                        Offboarding Documents
                    </span>

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
                                props_data.documents.map((ress) => {
                                    return (
                                        <a
                                            target='_blank'
                                            key={ress.id}
                                            href={ress.href}
                                            className="flex flex-col bg-slate-50/90 border border-slate-200/80 rounded-xl p-3 transition-all"
                                        >
                                            {/* Main Acknowledgement Header */}
                                            <div className="flex items-center justify-between w-full gap-2">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-100 shrink-0">
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                                                        {ress.document_type}
                                                    </span>
                                                </div>

                                            </div>

                                        </a>
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

