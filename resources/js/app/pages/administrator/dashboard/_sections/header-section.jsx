import React from "react";

export default function HeaderSection() {
    return (
        <div className="flex flex-col gap-2 my-3">
            <div className="text-2xl font-black">
              Welcome Back! 👋
            </div>
            <div className="text-gray-600">
                Here's what's happening in your workspace today
            </div>
        </div>
    );
}
