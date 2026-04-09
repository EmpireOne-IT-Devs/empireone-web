import { ChevronDownIcon } from "lucide-react";
import React from "react";

export default function HeaderSection() {
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Employee
                    </h1>
                    <nav className="text-sm text-gray-500">
                        <span className="text-blue-600">Employee</span> /
                        Employee Detail
                    </nav>
                </div>
            </div>
        </>
    );
}
