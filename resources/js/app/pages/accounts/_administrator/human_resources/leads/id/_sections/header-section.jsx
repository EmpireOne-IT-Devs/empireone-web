import React from "react";
import { useSelector } from "react-redux";

export default function HeaderSection() {
    const { leader } = useSelector((store) => store.human_resourcess);
    return (
        <div className="flex flex-col gap-2 my-3">
            <div className="text-2xl font-black">
                Hi Team {leader?.data?.user?.personal_information?.first_name}👥
            </div>
            <div className="text-gray-600">
                Manage team concerns, communication, and workplace engagement
            </div>
        </div>
    );
}
