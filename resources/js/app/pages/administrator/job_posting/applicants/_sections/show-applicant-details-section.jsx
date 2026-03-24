import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import moment from "moment";
import React, { useState } from "react";

export default function ShowApplicantDetailsSection({ data }) {
    const [open, setOpen] = useState(false);
    console.log("datadatadata", data);
    return (
        <>
            <Button
            outlined onClick={() => setOpen(true)}>
                SHOW
            </Button>
            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Application Details "
            >
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="bg-gray-50 p-6 rounded-xl space-y-6 text-sm text-gray-700 border border-gray-100">
                        {/* Personal & Contact Info */}
                        <div>
                            <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                                Position Details
                            </p>
                            <div className="grid grid-cols-2 gap-y-1">
                                <p>
                                    <strong>Job Title:</strong>{" "}
                                    {
                                        data.job_posting.job_requisition.title
                                    }{" "}
                                </p>
                                <p>
                                    <strong>Department:</strong>{" "}
                                    {
                                        data.job_posting.job_requisition
                                            .department.name
                                    }
                                </p>
                                <p>
                                    <strong>Location:</strong>{" "}
                                    {
                                        data.job_posting.job_requisition
                                            .location.name
                                    }
                                </p>
                                <p>
                                    <strong>Source:</strong>{" "}
                                    {data.applicant.account_employee.source}
                                </p>
                            </div>
                        </div>
                        {/* Personal & Contact Info */}
                        <div>
                            <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                                Personal & Contact Details
                            </p>
                            <div className="grid grid-cols-2 gap-y-1">
                                <p>
                                    <strong>Name:</strong>{" "}
                                    {
                                        data?.applicant?.personal_information
                                            ?.first_name
                                    }{" "}
                                    {
                                        data?.applicant?.personal_information
                                            ?.middle_name
                                    }{" "}
                                    {
                                        data?.applicant?.personal_information
                                            ?.last_name
                                    }
                                </p>
                                <p>
                                    <strong>Gender:</strong>{" "}
                                    {
                                        data?.applicant?.personal_information
                                            ?.gender
                                    }
                                </p>
                                <p>
                                    <strong>Email:</strong>{" "}
                                    {data?.applicant?.email}
                                </p>
                                <p>
                                    <strong>Contact:</strong>{" "}
                                    {
                                        data?.applicant?.personal_information
                                            ?.contact
                                    }
                                </p>
                                
                                <p>
                                    <strong>BPO Experience:</strong>{" "}
                                    {data.applicant.account_employee.with_bpo}
                                </p>
                                <p>
                                    <strong>DOB: </strong>
                                    {moment(
                                        data?.applicant?.personal_information
                                            ?.date_of_birth,
                                    ).format("LL")}
                                </p>
                                <p>
                                    <strong>Age: </strong>
                                    {data?.applicant?.personal_information
                                        ?.date_of_birth
                                        ? moment().diff(
                                              data.applicant
                                                  .personal_information
                                                  .date_of_birth,
                                              "years",
                                          )
                                        : "N/A"}
                                </p>
                                <p>
                                    <strong>Marital Status: </strong>
                                    {
                                        data?.applicant?.personal_information
                                            ?.marital_status
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div>
                            <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                                Birth Place
                            </p>
                            <p className="capitalize">
                                {" "}
                                {
                                    data?.applicant?.personal_information
                                        ?.birth_place
                                }
                            </p>
                        </div>
                        <div>
                            <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                                Current Address
                            </p>
                            <p className="capitalize">
                                {data?.applicant?.personal_information?.street},{" "}
                                {data?.applicant?.personal_information?.city}{" "}
                                {
                                    data?.applicant?.personal_information
                                        ?.province
                                }{" "}
                                {
                                    data?.applicant?.personal_information
                                        ?.zip_code
                                }
                                ,{" "}
                                {
                                    data?.applicant?.personal_information
                                        ?.region
                                }{" "}
                            </p>
                        </div>

                        {/* Working Experiences */}
                        <div>
                            <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                                Working Experience
                            </p>
                            {data?.applicant?.working_experience &&
                            data?.applicant?.working_experience.length > 0 ? (
                                data?.applicant?.working_experience.map(
                                    (exp, i) => (
                                        <div
                                            key={i}
                                            className="border-l-2 border-blue-200 pl-3 mb-3"
                                        >
                                            <p className="font-semibold text-gray-800">
                                                {exp.position || exp.role}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {exp.company_name ||
                                                    exp.company}{" "}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {exp.start_at} to {exp.end_at}
                                            </p>
                                        </div>
                                    ),
                                )
                            ) : (
                                <p className="text-gray-400 italic">
                                    No experience listed
                                </p>
                            )}
                        </div>

                        {/* Skills & Proficiency */}
                        <div>
                            <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                                Skills & Proficiency
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {data?.applicant?.skills?.map((skill, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm"
                                    >
                                        <span className="font-medium mr-2">
                                            {skill.skill}
                                        </span>
                                        <span className="text-blue-600 font-bold text-[10px]">
                                            {skill.percentage}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Document Review */}

                        <a
                            target="_blank"
                            href={data?.applicant?.resume?.url}
                            className="bg-blue-50 p-3 rounded-lg flex items-center justify-between"
                        >
                            <div>
                                <p className="text-[10px] font-bold text-blue-700 uppercase">
                                    Attached CV
                                </p>
                                <p className="text-xs font-medium text-blue-900 truncate max-w-[200px]">
                                    {data?.applicant?.resume?.name ||
                                        "No file uploaded"}
                                </p>
                            </div>
                            <svg
                                className="w-5 h-5 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                        </a>
                        <a
                            target="_blank"
                            href={data?.applicant?.cover_letter?.url}
                            className="bg-blue-50 p-3 rounded-lg flex items-center justify-between"
                        >
                            <div>
                                <p className="text-[10px] font-bold text-blue-700 uppercase">
                                    Attached Cover Letter
                                </p>
                                <p className="text-xs font-medium text-blue-900 truncate max-w-[200px]">
                                    {data?.applicant?.cover_letter?.name ||
                                        "No file uploaded"}
                                </p>
                            </div>
                            <svg
                                className="w-5 h-5 text-blue-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </Modal>
        </>
    );
}
