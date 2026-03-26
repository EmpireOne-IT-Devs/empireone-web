import React from "react";

export default function HeaderSection() {
    const user = {
        first_name: "Wacky",
    };

    return (
        <div className="flex flex-col gap-2 my-3">
            <div className="text-2xl font-black">
                Welcome Back, {""}
                {user?.first_name}!
            </div>
            <div className="text-gray-600">
                Stay updated on your application status and next steps.
            </div>
        </div>
    );
}
