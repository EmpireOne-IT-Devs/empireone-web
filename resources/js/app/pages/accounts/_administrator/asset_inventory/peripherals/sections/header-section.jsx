import React from "react";
import { FiPlus } from "react-icons/fi";
import Button from "@/app/_components/button";

export default function HeaderSection({ onCreateClick }) {
    return (
        <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Peripherals</h1>
                <p className="mt-0.5 text-sm text-gray-500">
                    A list of all the peripherals in your organization.
                </p>
            </div>
            <Button variant="success" onClick={onCreateClick} className="shrink-0">
                <FiPlus className="mr-2 h-4 w-4" />
                Add Peripheral
            </Button>
        </div>
    );
}
