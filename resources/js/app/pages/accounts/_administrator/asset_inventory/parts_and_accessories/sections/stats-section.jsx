import React from "react";
import { motion } from "framer-motion";
import { FiPackage, FiBox, FiAlertCircle, FiXCircle } from "react-icons/fi";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { getStockStatus } from "./part-helpers";

const CARDS = [
    {
        key: "total",
        label: "Total Parts",
        icon: FiPackage,
        surface: "border-blue-100 bg-blue-50/70",
        iconTile: "bg-blue-100 text-blue-600",
        value: (items) => items.length,
    },
    {
        key: "in_stock",
        label: "Total Stock",
        icon: FiBox,
        surface: "border-green-100 bg-green-50/70",
        iconTile: "bg-green-100 text-green-600",
        value: (items) =>
            items.filter((i) => getStockStatus(i.quantity, i.lowStockThreshold) === "In Stock").length,
    },
    {
        key: "low",
        label: "Low Stock",
        icon: FiAlertCircle,
        surface: "border-amber-100 bg-amber-50/70",
        iconTile: "bg-amber-100 text-amber-600",
        value: (items) =>
            items.filter((i) => getStockStatus(i.quantity, i.lowStockThreshold) === "Low Stock").length,
    },
    {
        key: "out",
        label: "Out of Stock",
        icon: FiXCircle,
        surface: "border-red-100 bg-red-50/70",
        iconTile: "bg-red-100 text-red-600",
        value: (items) =>
            items.filter((i) => getStockStatus(i.quantity, i.lowStockThreshold) === "Out of Stock").length,
    },
];

export default function StatsSection({ items = [] }) {
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
                                {card.value(items)}
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
