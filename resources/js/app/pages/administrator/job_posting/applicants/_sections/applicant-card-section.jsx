import Badge from "@/app/_components/badge";
import Card from "@/app/_components/card";
import React from "react";
import {
    TbMail,
    TbPhone,
    TbBriefcase,
    TbCalendarEvent,
    TbEye,
} from "react-icons/tb";
import ViewApplicantSection from "./view-applicant-section";
import { useSelector } from "react-redux";
import moment from "moment";

// const applicants = [
//     {
//         name: "John Smith",
//         role: "Senior Software Engineer",
//         email: "john.smith@email.com",
//         phone: "+63 912 345 6789",
//         experience: "6 years experience",
//         applied: "12/10/2024",
//         status: "Interview",
//     },
//     {
//         name: "Maria Santos",
//         role: "HR Manager",
//         email: "maria.santos@email.com",
//         phone: "+63 917 234 8891",
//         experience: "8 years experience",
//         applied: "12/08/2024",
//         status: "Reviewed",
//     },
//     {
//         name: "Daniel Cruz",
//         role: "Marketing Specialist",
//         email: "daniel.cruz@email.com",
//         phone: "+63 905 778 4421",
//         experience: "4 years experience",
//         applied: "12/09/2024",
//         status: "New",
//     },
//     {
//         name: "Alex Johnson",
//         role: "Senior Software Engineer",
//         email: "alex.johnson@email.com",
//         phone: "+63 916 553 2109",
//         experience: "7 years experience",
//         applied: "12/07/2024",
//         status: "Shortlisted",
//     },
//     {
//         name: "Boss Kyle",
//         role: "Senior Software Engineer",
//         email: "boss.kyle@email.com",
//         phone: "+63 916 553 2109",
//         experience: "7 years experience",
//         applied: "12/07/2024",
//         status: "Rejected",
//     },
//     {
//         name: "Wakin",
//         role: "Senior Software Engineer",
//         email: "wakin@email.com",
//         phone: "+63 916 553 2109",
//         experience: "7 years experience",
//         applied: "12/07/2024",
//         status: "Hired",
//     },
// ];

const STATUS_VARIANTS = {
    New: "primary",
    Reviewed: "warning",
    Shortlisted: "purple",
    Rejected: "danger",
    Hired: "success",
    Interview: "info",
};

export default function ApplicantCardSection() {
    const { applicants } = useSelector((store) => store.job_postings);
    console.log("applicants", applicants.data);
    return (
        <div className="flex flex-col gap-3">
            {applicants?.data?.map((res, i) => (
                <ViewApplicantSection data={res} key={i}>
                    <Card className="rounded-xl border p-5 mt-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                                    {res.applicant.name.charAt(0)}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold">
                                            {res.applicant.name}
                                        </h3>
                                        <Badge
                                            label={res.status}
                                            variant={
                                                STATUS_VARIANTS[res.status] ||
                                                "secondary"
                                            }
                                            outlined={false}
                                            showDot={false}
                                            className="rounded-full px-2"
                                        />
                                    </div>

                                    <p className="text-sm text-gray-500">
                                        {res.job_posting.job_requisition.title}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <TbMail /> {res.applicant.email}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <TbPhone />{" "}
                                            {
                                                res.applicant
                                                    .personal_information
                                                    .contact
                                            }
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <TbCalendarEvent /> Applied:{" "}
                                            {moment(res.created_at).format(
                                                "LLL",
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </ViewApplicantSection>
            ))}
        </div>
    );
}
