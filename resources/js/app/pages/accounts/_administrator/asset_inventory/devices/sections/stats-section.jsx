import React from "react";
import { motion } from "framer-motion";
import {
    FiMonitor,
    FiCheckCircle,
    FiAlertCircle,
    FiCpu,
    FiSmartphone,
} from "react-icons/fi";
import { fadeUp, staggerContainer } from "@/lib/animations";

const CARDS = [
    {
        key: "total",
        label: "Total Devices",
        icon: FiMonitor,
        surface: "border-gray-200 bg-gray-50/70",
        iconTile: "bg-gray-200 text-gray-600",
        value: (stats) => stats?.total ?? 0,
    },
    {
        key: "working",
        label: "Working",
        icon: FiCheckCircle,
        surface: "border-green-100 bg-green-50/70",
        iconTile: "bg-green-100 text-green-600",
        value: (stats) => stats?.working ?? 0,
    },
    {
        key: "attention",
        label: "Needs Attention",
        icon: FiAlertCircle,
        surface: "border-red-100 bg-red-50/70",
        iconTile: "bg-red-100 text-red-600",
        value: (stats) => stats?.needs_attention ?? 0,
    },
    {
        key: "laptops",
        label: "Laptops",
        icon: FiCpu,
        surface: "border-amber-100 bg-amber-50/70",
        iconTile: "bg-amber-100 text-amber-600",
        value: (stats) => stats?.laptops ?? 0,
    },
    {
        key: "desktops",
        label: "Desktops",
        icon: FiMonitor,
        surface: "border-purple-100 bg-purple-50/70",
        iconTile: "bg-purple-100 text-purple-600",
        value: (stats) => stats?.desktops ?? 0,
    },
    {
        key: "mobile",
        label: "Mobile Devices",
        icon: FiSmartphone,
        surface: "border-cyan-100 bg-cyan-50/70",
        iconTile: "bg-cyan-100 text-cyan-600",
        value: (stats) => stats?.mobile ?? 0,
    },
];

export default function StatsSection({ stats = null }) {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
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
                                    {card.value(stats)}
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
