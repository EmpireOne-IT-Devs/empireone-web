import React from "react";
import { FilePlus } from "lucide-react";
import Button from "@/app/_components/button";

export default function HeaderSection({ onRecordPaper }) {
    return (
        <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Liability Forms</h1>
                <p className="mt-0.5 text-sm text-gray-500">
                    Track employee asset acknowledgments and follow up on pending forms.
                </p>
            </div>
            <Button type="button" variant="primary" onClick={onRecordPaper}>
                <FilePlus size={16} aria-hidden="true" /> Record Paper Form
            </Button>
        </div>
    );
}
