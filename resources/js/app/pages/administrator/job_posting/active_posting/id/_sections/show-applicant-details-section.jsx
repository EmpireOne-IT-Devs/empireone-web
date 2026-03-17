import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import moment from "moment";
import React, { useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { FiFile } from "react-icons/fi";
import { TbEye } from "react-icons/tb";

export default function ShowApplicantDetailsSection({ data }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button outlined onClick={() => setOpen(true)}>
                SHOW
            </Button>
            <Modal
                width="max-w-2xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Application Details "
            >
                <div className="p-6  border-t text-gray">
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold p-2 mb-2 ">
                            Data Information
                        </h2>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2 p-2">  
                            <div className="font-medium">Name:</div>
                            <div className="font-semibold">
                                {data?.applicant?.name}
                            </div>
                            <div className="font-medium">Email:</div>
                            <div> {data?.applicant?.email}</div>
                            <div className="font-medium">Phone:</div>
                            <div>
                                {data.applicant.personal_information?.contact}
                            </div>
                            <div className="font-medium">Applied Date:</div>
                            <div>{moment(data?.created_at).format("LLL")}</div>
                            <div className="font-medium">Status:</div>
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                                    {data.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-4 ">
                            Position Details
                        </h2>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                            <div className="font-medium">Job Title:</div>
                            <div className="font-semibold">
                                {data.job_posting.job_requisition.title}
                            </div>
                            <div className="font-medium">Department:</div>
                            <div>
                                {
                                    data.job_posting.job_requisition.department
                                        .name
                                }
                            </div>
                            <div className="font-medium">Location:</div>
                            <div>
                                {data.job_posting.job_requisition.location.name}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4 ">
                            <div className="flex items-center gap-3">
                                <FiFile className="text-blue-700 text-xl flex-shrink-0" />

                                <div className="flex flex-col">
                                    <span className="text-blue-700 font-medium">
                                        {data?.cover_letter?.name}
                                    </span>
                                    <span className="text-gray-600 text-sm">
                                        Cover Letter
                                    </span>
                                </div>
                            </div>

                            <a
                                href={data?.cover_letter?.url}
                                target="_blank"
                                className="p-2 border border-black rounded-md w-2/6 text-center flex items-center justify-center"
                            >
                                <FaDownload className="text-sm mr-2" />
                                Download
                            </a>
                        </div>

                        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4 mt-2">
                            <div className="flex items-center gap-3">
                                <FiFile className="text-blue-700 text-xl flex-shrink-0" />

                                <div className="flex flex-col">
                                    <span className="text-blue-700 font-medium">
                                        {data?.resume?.name}
                                    </span>
                                    <span className="text-gray-600 text-sm">
                                        PDF Document
                                    </span>
                                </div>
                            </div>

                            <a
                                href={data?.resume?.url}
                                target="_blank"
                                className="p-2 border border-black rounded-md w-2/6 text-center flex items-center justify-center"
                            >
                                <FaDownload className="text-sm mr-2" />
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
