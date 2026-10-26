import React from "react";
import { motion } from "framer-motion";

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};

const item = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 28 },
    },
};

export default function SummaryCardsSection({ summary, loading }) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
        >
            {summary.map((entry) => (
                <motion.div
                    key={entry.title}
                    variants={item}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 transition-shadow hover:shadow-md"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm">
                                {entry.title}
                            </p>

                            {loading ? (
                                <div className="mt-3 h-8 w-12 rounded-md bg-gray-200 animate-pulse" />
                            ) : (
                                <h2 className="text-3xl font-bold mt-2 text-gray-800">
                                    {entry.value}
                                </h2>
                            )}
                        </div>

                        <div
                            className={`w-3 h-12 rounded-full ${entry.color}`}
                        />
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
