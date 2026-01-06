import React from "react";

export default function HeaderSection() {
    return (
        <div className="flex flex-col gap-2 my-3">
            <div className="text-2xl font-black">Interview Management</div>
            <div className="text-gray-600">
                Schedule and manage candidate interviews
            </div>
        </div>
    );
}
