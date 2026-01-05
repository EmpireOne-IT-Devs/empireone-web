import React from "react";

export default function HeaderSection() {
    return (
        <div className="flex flex-col gap-2 my-3">
            <div className="text-2xl font-black">Applicant Management</div>
            <div className="text-gray-600">
                Review and manage job applications
            </div>
        </div>
    );
}
