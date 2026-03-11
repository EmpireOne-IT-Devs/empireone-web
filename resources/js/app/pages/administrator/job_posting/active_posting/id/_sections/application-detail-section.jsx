import Modal from "@/app/_components/modal";
import moment from "moment";
import React from "react";
import { FaDownload } from "react-icons/fa6";
import { FiFile } from "react-icons/fi";
import { TbEye } from "react-icons/tb";

export default function ApplicationDetailSection({ open, onClose, applicant }) {
    if (!applicant) return null;
    const job = applicant.job_requisition || {};
    const resume = applicant.resume || {
        name: "Blue and White Minimalist Business Proposal Presentation.pdf",
        url: "#",
    };
    return (
        <Modal
            width="max-w-2xl"
            isOpen={open}
            onClose={onClose}
            title="Application Details "
        >
            <div className="p-6  border-t text-gray">
                {/* Applicant Information */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Applicant Information
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 ">
                        <div className="font-medium">Name:</div>
                        <div className="font-semibold">
                            {applicant.applicant?.name}
                        </div>
                        <div className="font-medium">Email:</div>
                        <div>{applicant.applicant?.email}</div>
                        <div className="font-medium">Phone:</div>
                        <div>{applicant.personal_information?.contact}</div>
                        <div className="font-medium">Applied Date:</div>
                        <div>{moment(applicant?.created_at).format("LLL")}</div>
                        <div className="font-medium">Status:</div>
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                                {applicant.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Position Details */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Position Details
                    </h2>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                        <div className="font-medium">Job Title:</div>
                        <div className="font-semibold">{job.title || "-"}</div>
                        <div className="font-medium">Department:</div>
                        <div>{job.department?.name || "-"}</div>
                        <div className="font-medium">Location:</div>
                        <div>{job.location?.name || "-"}</div>
                    </div>
                </div>

                {/* Cover Letter */}
                <div>
                    <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4 ">
                        <div className="flex items-center gap-3">
                            <FiFile className="text-blue-700 text-xl flex-shrink-0" />

                            <div className="flex flex-col">
                                <span className="text-blue-700 font-medium">
                                    {applicant?.cover_letter?.name}
                                </span>
                                <span className="text-gray-600 text-sm">
                                    Cover Letter
                                </span>
                            </div>
                        </div>

                        <a
                            href={applicant?.cover_letter?.url}
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
                                    {applicant?.resume?.name}
                                </span>
                                <span className="text-gray-600 text-sm">
                                    PDF Document
                                </span>
                            </div>
                        </div>

                        <a
                            href={applicant?.resume?.url}
                            target="_blank"
                            className="p-2 border border-black rounded-md w-2/6 text-center flex items-center justify-center"
                        >
                            <FaDownload className="text-sm mr-2" />
                            Download
                        </a>
                    </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end mt-8">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-white border border-gray-300 hover:bg-gray-100 text-sm font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
