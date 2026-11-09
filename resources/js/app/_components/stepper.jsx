import React from "react";
import classNames from "classnames";
import { motion } from "framer-motion";
import { FiCheck, FiX, FiClock } from "react-icons/fi";

/**
 * Generic, stateless step indicator.
 *
 * steps: [{ key, label, description, status: "approved"|"completed"|"rejected"|"current"|"pending", meta?: ReactNode, children?: ReactNode }]
 * currentStep: index of the active step (used when a step has no explicit status)
 * orientation: "vertical" | "horizontal"
 */
const STATUS_STYLES = {
    completed: {
        ring: "border-green-500 bg-green-500 text-white shadow-[0_0_0_4px_rgba(34,197,94,0.15)]",
        line: "bg-green-500",
        label: "text-gray-900",
        Icon: FiCheck,
    },
    rejected: {
        ring: "border-red-500 bg-red-500 text-white shadow-[0_0_0_4px_rgba(239,68,68,0.15)]",
        line: "bg-gray-200",
        label: "text-red-600",
        Icon: FiX,
    },
    current: {
        ring: "border-purple-600 bg-white text-purple-600 shadow-[0_0_0_4px_rgba(147,51,234,0.18)]",
        line: "bg-gray-200",
        label: "text-purple-700",
        Icon: FiClock,
    },
    pending: {
        ring: "border-gray-300 bg-white text-gray-400",
        line: "bg-gray-200",
        label: "text-gray-500",
        Icon: null,
    },
};

function resolveStatus(step, index, currentStep) {
    if (step.status === "approved" || step.status === "completed") return "completed";
    if (step.status === "rejected") return "rejected";
    if (step.status === "current" || index === currentStep) return "current";
    return "pending";
}

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.4, ease: [0.33, 1, 0.68, 1] },
    }),
};

export default function Stepper({
    steps = [],
    currentStep = -1,
    orientation = "vertical",
    className = "",
}) {
    const isVertical = orientation === "vertical";

    return (
        <ol
            aria-label="Progress"
            className={classNames(
                isVertical ? "flex flex-col" : "flex w-full items-start",
                className,
            )}
        >
            {steps.map((step, index) => {
                const status = resolveStatus(step, index, currentStep);
                const style = STATUS_STYLES[status];
                const Icon = style.Icon;
                const isLast = index === steps.length - 1;

                return (
                    <motion.li
                        key={step.key ?? index}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        aria-current={status === "current" ? "step" : undefined}
                        className={classNames(
                            "relative",
                            isVertical ? "flex gap-4 pb-8 last:pb-0" : "flex flex-1 flex-col items-center text-center",
                        )}
                    >
                        {/* Connector line */}
                        {!isLast && (
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    "absolute",
                                    isVertical
                                        ? "left-[15px] top-8 h-[calc(100%-2rem)] w-0.5"
                                        : "left-1/2 top-4 h-0.5 w-full",
                                    style.line,
                                )}
                            />
                        )}

                        {/* Indicator */}
                        <span className="relative z-10 flex shrink-0 items-center justify-center">
                            {status === "current" && (
                                <span className="absolute inline-flex h-8 w-8 animate-ping rounded-full bg-purple-400 opacity-30" />
                            )}
                            <span
                                className={classNames(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                                    style.ring,
                                )}
                            >
                                {Icon ? <Icon className="h-4 w-4" /> : index + 1}
                            </span>
                        </span>

                        {/* Content */}
                        <div className={classNames("min-w-0 flex-1", !isVertical && "mt-3 px-2")}>
                            <p className={classNames("text-sm font-semibold leading-tight", style.label)}>
                                {step.label}
                            </p>
                            {step.description && (
                                <p className="mt-0.5 text-xs text-gray-500">{step.description}</p>
                            )}
                            {step.meta && <div className="mt-1.5">{step.meta}</div>}
                            {step.children && <div className="mt-3">{step.children}</div>}
                        </div>
                    </motion.li>
                );
            })}
        </ol>
    );
}