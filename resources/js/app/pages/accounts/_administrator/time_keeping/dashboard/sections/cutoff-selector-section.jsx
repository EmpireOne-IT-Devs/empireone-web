import React from "react";
import { CalendarRange, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CutoffSelectorSection({
    label,
    cutoffDate,
    onPrevious,
    onNext,
    canGoNext,
    disabled,
}) {
    const buttonClass =
        "h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-purple-300 hover:text-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-600";

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <CalendarRange className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Cutoff Period</p>
                    <p className="font-semibold text-gray-800">{label}</p>
                    <p className="text-sm text-gray-500">Cutoff: {cutoffDate}</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <motion.button
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={buttonClass}
                    onClick={onPrevious}
                    disabled={disabled}
                    aria-label="Previous cutoff"
                >
                    <ChevronLeft size={18} />
                </motion.button>
                <motion.button
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={buttonClass}
                    onClick={onNext}
                    disabled={disabled || !canGoNext}
                    aria-label="Next cutoff"
                >
                    <ChevronRight size={18} />
                </motion.button>
            </div>
        </div>
    );
}
