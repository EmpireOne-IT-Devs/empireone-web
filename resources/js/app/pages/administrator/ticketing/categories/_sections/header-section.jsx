import React from "react";

export default function HeaderSection() {
    return (
        <div className="flex flex-col gap-1 my-3">
            <div className="text-3xl font-black">Department Categories</div>
            <div className="text-gray-700">
                Manage ticket categories for each department
            </div>
        </div>
    );
}
