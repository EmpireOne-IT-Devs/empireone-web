import React from "react";

export default function HeaderSection() {
    return (
        <div className="flex flex-col gap-2 my-3">
            <div className="text-2xl font-black">
               Job Posting Dashboard
            </div>
            <div className="text-gray-600">
               Overview of recruitment activities and metrics
            </div>
        </div>
    );
}
