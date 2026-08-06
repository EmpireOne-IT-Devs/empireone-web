import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import { Eye, MailIcon } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";

export default function ShowApplicantDetailsSection({ data }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <Button
                className="w-full"
                outlined onClick={() => setOpen(true)}>

                <Eye className="w-4 h-4 mr-2" />
                SHOW
            </Button>
            <Modal
                width="max-w-3xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <MailIcon />
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Applicant
                            </p>
                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                Applicant Details
                            </h2>
                        </div>
                    </div>
                }
            >
                <div className="space-y-6 animate-in fade-in duration-500 overflow-auto max-h-[70vh]">
                    <div className="  space-y-6 text-sm text-gray-700 ">
                        {/* Personal & Contact Info */}
                        <div className="bg-gray-100 border border-gray-50 rounded-xl p-4 ">
                            <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                                Position Details
                            </p>
                            <div className="grid grid-cols-2 gap-y-1">
                                <p>
                                    <strong>Job Title:</strong>{" "}
                                    {
                                        data?.job_posting?.job_requisition?.title
                                    }{" "}
                                </p>
                                <p>
                                    <strong>Department:</strong>{" "}
                                    {
                                        data?.job_posting?.job_requisition
                                            .department.name
                                    }
                                </p>
                                <p>
                                    <strong>Location:</strong>{" "}
                                    {
                                        data?.job_posting?.job_requisition
                                            .location.name
                                    }
                                </p>
                                <p>
                                    <strong>Source:</strong>{" "}
                                    {data?.applicant?.account_employee?.source}
                                </p>
                            </div>
                        </div>
                        {/* Personal & Contact Info */}
                        <div className="bg-gray-100 border border-gray-50 rounded-xl p-4">
                            <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                                Personal & Contact Details
                            </p>
                            <div className="grid grid-cols-2 gap-y-2">
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
                                    {data?.applicant?.account_employee?.with_bpo}
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
                        {
                            data?.applicant?.personal_information?.previous_employee_status && <div className="bg-gray-100 border border-gray-50 rounded-xl p-4 ">
                                <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                                    Previous Employee Department
                                </p>
                                <p className="capitalize">
                                    {
                                        data?.applicant?.personal_information?.previous_employee_status
                                    }
                                </p>
                            </div>
                        }
                        <div className="bg-gray-100 border border-gray-50 rounded-xl p-4 ">
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

                        <div className="bg-gray-100 border border-gray-50 rounded-xl p-4 ">
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
                        {/* <div className="bg-gray-100 border border-gray-50 rounded-xl p-4 ">
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
                        </div> */}

                        {/* Skills & Proficiency */}
                        {/* <div className="bg-gray-100 border border-gray-50 rounded-xl p-4 ">
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
                        </div> */}

                        {/* Document Review */}

                        {
                            data?.applicant?.resume?.url && <a
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
                        }

                        {/* <a
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
                        </a> */}
                    </div>
                </div>
            </Modal>
        </>
    );
}
