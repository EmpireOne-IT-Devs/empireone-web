import React from "react";
import { Copy } from "lucide-react";

/**
 * Dropdown menu item that opens the shared survey form modal pre-filled with
 * this survey's data (via the imperative ref), so publishing always creates
 * a brand-new survey — the original is never touched.
 */
export default function DuplicateSurveySection({ survey, createSurveyRef, onAction }) {
    const handleClick = () => {
        createSurveyRef?.current?.openDuplicate(survey);
        onAction?.();
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-normal text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
            <Copy size={16} className="shrink-0 text-blue-500" />
            Duplicate
        </button>
    );
}
