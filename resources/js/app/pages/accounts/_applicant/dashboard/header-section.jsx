import React from "react";
import { useSelector } from "react-redux";

export default function HeaderSection() {
    const {data}=useSelector((store)=>store.app)

    return (
        <div className="flex flex-col gap-2 my-3">
            <div className="text-2xl font-black">
                Welcome Back, {""}
                {data?.user?.name}!
            </div>
            <div className="text-gray-600">
                Stay updated on your application status and next steps.
            </div>
        </div>
    );
}
