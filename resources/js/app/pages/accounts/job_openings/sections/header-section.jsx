import React from "react";

export default function HeaderSection() {
    return (
        <div className="flex flex-col gap-2 my-3">
            <div className="text-2xl font-black">Active Job Postings</div>
            <div className="text-gray-600">
                Manage and track all job postings
            </div>
        </div>
    );
}
