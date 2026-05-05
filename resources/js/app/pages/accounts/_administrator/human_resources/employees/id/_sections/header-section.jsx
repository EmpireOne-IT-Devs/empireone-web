import { ChevronDownIcon } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

export default function HeaderSection() {
    const { user } = useSelector((store) => store.app);
    return (
        <>
            <div className="flex flex-col gap-2 my-3">
                <div className="text-2xl font-black">
                    {user?.personal_information?.first_name}{" "}
                    {user?.personal_information?.last_name}👥
                </div>
                <div className="text-gray-600">
                    Manage team concerns, communication, and workplace
                    engagement
                </div>
            </div>
        </>
    );
}
