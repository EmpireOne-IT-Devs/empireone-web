import React from "react";

export default function HeaderSection() {
    return (
        <div className="flex flex-col gap-1 my-3">
            <div className="text-3xl font-black">My Tickets</div>
            <div className="text-gray-700">
                Track and manage all your submitted support requests
            </div>
        </div>
    );
}
