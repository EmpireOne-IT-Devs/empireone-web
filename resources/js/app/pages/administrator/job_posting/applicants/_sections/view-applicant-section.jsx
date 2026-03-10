import React, { useState } from "react";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import { BriefcaseIcon, EyeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { TbCategory, TbFilter } from "react-icons/tb";
import { FiFile, FiMail, FiMessageSquare } from "react-icons/fi";
import { FaDownload } from "react-icons/fa6";
import { CalendarIcon } from "@heroicons/react/20/solid";
import { TiMortarBoard } from "react-icons/ti";
import moment from "moment";

export default function ViewApplicantSection({ data, children }) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <div onClick={() => setOpen(true)}>{children}</div>
            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <div className="flex items-center gap-4 border-b pb-4">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
                        {data?.applicant?.name[0]}
                    </div>
                    <div>
                        <div className="text-lg font-semibold">
                            {data?.applicant?.name}
                        </div>
                        <div className="text-gray-500">
                            {data.job_posting.job_requisition.title}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 mb-2 bg-gray-50  rounded-lg p-3">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-600">Current Status:</span>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {data.status}
                        </span>
                    </div>
                    <div className="justify-end">
                        <Select
                            iconLeft={<TbFilter className="text-xl" />}
                            label="Update Status"
                            options={[
                                { value: "reviewing", label: "Reviewing" },
                                { value: "shortlisted", label: "Shortlisted" },
                                { value: "rejected", label: "Rejected" },
                            ]}
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <div className="text-gray-700 font-semibold mb-2">
                        Contact Information
                    </div>

                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-5">
                        <div className="flex items-center gap-2">
                            <FiMail className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600">
                                {data.applicant.email}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <PhoneIcon className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600">
                                {data.applicant.personal_information.contact}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="text-gray-700 font-semibold mb-2">
                        Qualifications
                    </div>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1 bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                                <BriefcaseIcon className="w-5 h-5 " />
                                Experience
                            </div>
                            <div className="text-gray-700">
                                {data.job_posting.experience_required}
                            </div>
                        </div>
                        <div className="flex-1 bg-purple-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-purple-700 font-medium mb-1">
                                <TiMortarBoard className="text-xl" />
                                Education
                            </div>
                            <div className="text-gray-700">
                                {data.job_posting.education_required}
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="mt-4">
                    <div className="text-gray-700 font-semibold mb-2">
                        Skills
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {applicant.skills.map((skill) => (
                            <span
                                key={skill}
                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div> */}

                <div className="mt-4">
                    <div className="text-gray-700 font-semibold mb-2">
                        Cover Letter
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                        {data.applicant.cover_letter.name}
                    </div>
                </div>

                <div>
                    <div className=" flex flex-col gap-2">
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <FiFile className="text-blue-700 text-xl flex-shrink-0" />

                                <div className="flex flex-col">
                                    <span className="text-blue-700 font-medium">
                                        {data.applicant.cover_letter.name}
                                    </span>
                                    <span className="text-gray-600 text-sm">
                                        Cover Letter
                                    </span>
                                </div>
                            </div>

                            <Button variant="secondary" outlined>
                                <FaDownload className="text-sm mr-2" />
                                Download
                            </Button>
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <FiFile className="text-blue-700 text-xl flex-shrink-0" />

                                <div className="flex flex-col">
                                    <span className="text-blue-700 font-medium">
                                        {data.applicant.resume.name}
                                    </span>
                                    <span className="text-gray-600 text-sm">
                                        PDF Document
                                    </span>
                                </div>
                            </div>

                            <Button variant="secondary" outlined>
                                <FaDownload className="text-sm mr-2" />
                                Download
                            </Button>
                        </div>

                        <div className="flex-1 bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                                <CalendarIcon className="w-5 h-5 mr-2" />
                                {moment(data.created_at).format("LLL")}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4 px-2 border-t">
                            <Button
                                variant="secondary"
                                type="button"
                                outlined
                                onClick={() => setOpen(false)}
                            >
                                Close
                            </Button>

                            <Button type="button">
                                <CalendarIcon className="w-5 h-5 mr-2" />
                                Schedule Interview
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
