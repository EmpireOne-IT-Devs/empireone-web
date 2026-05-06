import { ChevronDownIcon } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

export default function HeaderSection() {
    const { user } = useSelector((store) => store.app);
    return (
        <>
            <div className="text-2xl font-bold text-black ">Employee Details</div>
            <div className="text-gray-600">
                <span className="font-bold text-gray-700">
                    {user?.personal_information?.first_name}{" "}
                    {user?.personal_information?.last_name}
                </span>{" "}
                • Profile and records overview
            </div>
        </>
    );
}
