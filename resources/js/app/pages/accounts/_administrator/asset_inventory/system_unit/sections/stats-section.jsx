import React from "react";
import { motion } from "framer-motion";
import { FiMonitor, FiCheckCircle, FiArrowRightCircle, FiTool } from "react-icons/fi";
import { fadeUp, staggerContainer } from "@/lib/animations";

const CARDS = [
    {
        key: "total",
        label: "Total Systems",
        icon: FiMonitor,
        surface: "border-gray-200 bg-gray-50/70",
        iconTile: "bg-gray-200 text-gray-600",
    },
    {
        key: "available",
        label: "Available",
        icon: FiCheckCircle,
        surface: "border-green-100 bg-green-50/70",
        iconTile: "bg-green-100 text-green-600",
    },
    {
        key: "assigned",
        label: "Assigned",
        icon: FiArrowRightCircle,
        surface: "border-cyan-100 bg-cyan-50/70",
        iconTile: "bg-cyan-100 text-cyan-600",
    },
    {
        key: "custom",
        label: "Custom Built",
        icon: FiTool,
        surface: "border-purple-100 bg-purple-50/70",
        iconTile: "bg-purple-100 text-purple-600",
    },
];

// `stats` holds inventory-wide counts from the API; it is null until the first load.
export default function StatsSection({ stats = null }) {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
            {CARDS.map((card) => {
                const Icon = card.icon;
                return (
                    <motion.div
                        key={card.key}
                        variants={fadeUp}
                        className={`flex items-center justify-between rounded-2xl border p-4 shadow-sm ${card.surface}`}
                    >
                        <div>
                            <p className="text-xs font-medium text-gray-600">{card.label}</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">
                                {stats?.[card.key] ?? "—"}
                            </p>
                        </div>
                        <span
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconTile}`}
                        >
                            <Icon className="h-5 w-5" />
                        </span>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
