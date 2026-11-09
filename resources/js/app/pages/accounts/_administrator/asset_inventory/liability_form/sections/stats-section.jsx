import React from "react";
import { motion } from "framer-motion";
import { FiFileText, FiCalendar, FiLink } from "react-icons/fi";
import { fadeUp, staggerContainer } from "@/lib/animations";

const CARDS = [
    {
        key: "total",
        label: "Total Forms",
        icon: FiFileText,
        surface: "border-blue-100 bg-blue-50/70",
        iconTile: "bg-blue-100 text-blue-600",
        value: (forms) => forms.length,
    },
    {
        key: "signed_today",
        label: "Signed Today",
        icon: FiCalendar,
        surface: "border-green-100 bg-green-50/70",
        iconTile: "bg-green-100 text-green-600",
        value: (forms, today) =>
            forms.filter(
                (f) => f.signedDate && f.signedDate.slice(0, 10) === today,
            ).length,
    },
    {
        key: "public",
        label: "Public Agreements",
        icon: FiLink,
        surface: "border-purple-100 bg-purple-50/70",
        iconTile: "bg-purple-100 text-purple-600",
        value: (forms) => forms.filter((f) => f.type === "Public Agreement").length,
    },
];

export default function StatsSection({ forms = [], today }) {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
            {CARDS.map((card) => {
                const Icon = card.icon;
                return (
                    <motion.div
                        key={card.key}
                        variants={fadeUp}
                        className={`flex items-center justify-between rounded-2xl border p-5 shadow-sm ${card.surface}`}
                    >
                        <div>
                            <p className="text-sm font-medium text-gray-600">{card.label}</p>
                            <p className="mt-1 text-3xl font-bold text-gray-900">
                                {card.value(forms, today)}
                            </p>
                        </div>
                        <span
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconTile}`}
                        >
                            <Icon className="h-5 w-5" />
                        </span>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
