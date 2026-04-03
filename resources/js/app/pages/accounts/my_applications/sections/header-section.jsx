import React from "react";

export default function HeaderSection() {
    return (
        <div className="flex flex-col gap-2 my-3 p-6 bg-white shadow-xl border-2 rounded-xl">
            <div className="text-2xl font-black">My Applications</div>
            <div className="text-gray-600">
                Track the status of your job applications
            </div>
        </div>
    );
}
