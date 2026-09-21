import React from "react";
import { Check } from "lucide-react";

const STEPS = ["Details", "Start", "Submitted", "Approved"];

export default function ChallengeFlowProgressSection({ currentStep, isDeclined }) {
    return (
        <div className="flex items-center">
            {STEPS.map((step, index) => {
                const isComplete = index < currentStep;
                const isActive = index === currentStep;
                const isBad = isActive && isDeclined;

                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center gap-1">
                            <span
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                                    isBad
                                        ? "bg-red-600 text-white"
                                        : isComplete
                                          ? "bg-emerald-500 text-white"
                                          : isActive
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-100 text-gray-400"
                                }`}
                            >
                                {isComplete ? (
                                    <Check className="h-3.5 w-3.5" />
                                ) : (
                                    index + 1
                                )}
                            </span>
                            <span
                                className={`text-[11px] font-medium ${
                                    isBad
                                        ? "text-red-600"
                                        : isComplete || isActive
                                          ? "text-indigo-600"
                                          : "text-gray-400"
                                }`}
                            >
                                {step}
                            </span>
                        </div>
                        {index < STEPS.length - 1 && (
                            <span
                                className={`mx-1 mb-4 h-px flex-1 ${
                                    index < currentStep
                                        ? "bg-emerald-300"
                                        : "bg-gray-200"
                                }`}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
