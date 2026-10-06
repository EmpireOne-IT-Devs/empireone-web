import React from "react";
import { Pencil } from "lucide-react";

/**
 * Dropdown menu item that opens the shared survey form modal pre-filled with
 * this survey's data in edit mode (via the imperative ref), saving changes
 * back to the same survey instead of creating a new one.
 */
export default function EditSurveySection({ survey, createSurveyRef, onAction }) {
    const handleClick = () => {
        createSurveyRef?.current?.openEdit(survey);
        onAction?.();
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-normal text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
            <Pencil size={16} className="shrink-0 text-amber-500" />
            Edit
        </button>
    );
}
