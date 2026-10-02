import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuFolder } from 'react-icons/lu';
import { CheckCircle2, ChevronDown, FileText, XCircle } from 'lucide-react';

export default function AcknowledgementsListSection({ props_data, empId }) {
    const [open, setOpen] = useState(true);
    const [openItems, setOpenItems] = useState({});
    const containerRef = useRef(null);

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

    // Calculates item completion without double-counting parent policy + sub-items
    const { totalItemsCount, doneCount, incompleteCount } = useMemo(() => {
        const acks = props_data?.acknowledgements || [];
        let done = 0;
        let incomplete = 0;
        let totalItems = 0;

        acks.forEach((item) => {
            if (item?.items && item.items.length > 0) {
                item.items.forEach((subItem) => {
                    totalItems++;
                    if (subItem?.is_already_acknowledged) done++;
                    else incomplete++;
                });
            } else {
                totalItems++;
                if (item?.is_already_acknowledged) done++;
                else incomplete++;
            }
        });

        return {
            totalItemsCount: totalItems,
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

    const acknowledgements = props_data?.acknowledgements || [];

    return (
        <div ref={containerRef} className="w-full text-left">
            <button
                onClick={() => setOpen(!open)}
                type="button"
                className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-slate-100/80 transition-colors group cursor-pointer select-none border border-slate-200 bg-white"
            >
                <div className="flex items-center gap-2">
                    <LuFolder className="w-4 h-4 text-purple-600 group-hover:text-purple-700 transition-colors" />
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Acknowledgements
                    </span>

                    {totalItemsCount > 0 && (
                        <div className="flex items-center gap-1 ml-1">
                            <span className="bg-emerald-50 text-emerald-700 font-semibold text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> {doneCount}
                            </span>
                            <span className="bg-amber-50 text-amber-700 font-semibold text-[10px] px-1.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-0.5">
                                <XCircle className="w-2.5 h-2.5" /> {incompleteCount}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-purple-700 shrink-0">
                    <span className="text-[11px]">{open ? 'Hide' : 'Show'}</span>
                    <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                        <ChevronDown className="w-3.5 h-3.5" />
                    </motion.div>
                </div>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="main-doc-list"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="overflow-hidden mt-2"
                    >
                        <div className="flex flex-col gap-2 p-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {acknowledgements.length > 0 ? (
                                acknowledgements.map((ress, idx) => {
                                    const hasSubItems = ress?.items && ress?.items?.length > 0;
                                    const accordionKey = `${empId || 'emp'}-${ress.id || idx}`;
                                    const isOpen = !!openItems[accordionKey];

                                    return (
                                        <div
                                            key={ress.id || `ack-${idx}`}
                                            className="flex flex-col bg-slate-50/90 border border-slate-200/80 rounded-xl p-2.5 transition-all"
                                        >
                                            <div className="flex items-center justify-between w-full gap-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="p-1 rounded bg-purple-50 text-purple-700 border border-purple-100 shrink-0">
                                                        <FileText className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="font-semibold text-gray-800 text-xs truncate">
                                                        {ress.title}
                                                    </span>
                                                </div>

                                                {hasSubItems ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleAccordion(empId || 'emp', ress.id || idx)}
                                                        className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 hover:text-purple-900 bg-purple-100/70 px-2 py-0.5 rounded transition-all shrink-0 cursor-pointer"
                                                    >
                                                        <span>{ress.items.length} Sub-policies</span>
                                                        <motion.div
                                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                                                        >
                                                            <ChevronDown className="w-3 h-3" />
                                                        </motion.div>
                                                    </button>
                                                ) : (
                                                    <StatusBadge isDone={ress?.is_already_acknowledged} size="sm" />
                                                )}
                                            </div>

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
                                                        <div className="mt-2 pt-2 border-t border-slate-200 flex flex-col gap-1.5 pl-1">
                                                            {ress.items.map((item, subIdx) => (
                                                                <div
                                                                    key={item.id || `sub-${subIdx}`}
                                                                    className="flex items-center justify-between text-xs py-1 hover:bg-slate-100/60 rounded px-1.5 transition-colors"
                                                                >
                                                                    <span className="text-gray-600 font-medium flex items-center gap-1.5 truncate pr-2">
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
                                <div className="text-center py-3 text-xs font-medium text-gray-400 bg-slate-50/50 rounded-xl border border-dashed border-gray-200">
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

function StatusBadge({ isDone, size = 'md' }) {
    if (isDone) {
        return (
            <span className={`inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded shrink-0 ${size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'}`}>
                <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} /> Done
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded shrink-0 ${size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'}`}>
            <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} /> Incomplete
        </span>
    );
}