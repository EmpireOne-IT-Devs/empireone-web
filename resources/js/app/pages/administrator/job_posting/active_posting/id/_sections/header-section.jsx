import React from "react";
import { useSelector } from "react-redux";

export default function HeaderSection() {
    const { job_applications } = useSelector((store) => store.job_postings);
    return (
        <div className="flex flex-col p-4 gap-2 rounded-md my-3 bg-blue-800">
            <div className="text-2xl font-black text-white">
                Applications Review
            </div>
            <div className=" text-white flex ">
                <div>Position</div>:
                <div className="text-white font-black ml-1">
                    {job_applications?.job_application?.job_posting
                        ?.job_requisition?.title ?? ""}
                </div>
            </div>
        </div>
    );
}
