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
import Table from "@/app/_components/table";
import EditStatusSection from "./edit-status-section";

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

export default function ApplicantTableSection() {
    const { applicants,search_applicant_status } = useSelector((store) => store.job_postings);
    console.log("applicants", applicants.data);

    const columns = [
        {
            header: "Applicant Name",
            accessor: "name",
        },
        {
            header: "Email",
            accessor: "email",
        },
        {
            header: "Contact #",
            accessor: "contact",
        },
         {
            header: "Position",
            accessor: "position",
        },
        {
            header: "Applied At",
            accessor: "applied_at",
        },
        {
            header: "Screening Status",
            accessor: "screening_status",
        },
        {
            header: "Interview Status",
            accessor: "interview_status",
        },
        {
            header: "Final Status",
            accessor: "final_status",
        },
        {
            header: "Action",
            accessor: "action",
        },
    ];

        const filteredApplications = applicants?.data?.filter(
            (res) => {
                const { screening_status, interview_status, final_status } =
                    search_applicant_status;
    
                const screeningMatch = screening_status
                    ? res.screening_status === screening_status
                    : true;
                const interviewMatch = interview_status
                    ? res.interview_status === interview_status
                    : true;
                const finalMatch = final_status
                    ? res.final_status === final_status
                    : true;
    
                return screeningMatch && interviewMatch && finalMatch;
            },
        );
        
    
        const tableData = filteredApplications?.map((res) => ({
            name: res?.applicant?.name,
            email: res?.applicant?.email,
            position: res?.job_posting?.job_requisition?.title,
            contact: res?.applicant?.personal_information?.contact,
            applied_at: moment(res.created_at).format("LLL"),
            screening_status: (
                <EditStatusSection data={res} table_status="screening_status" />
            ),
            interview_status: (
                <EditStatusSection data={res} table_status="interview_status" />
            ),
            final_status: (
                <EditStatusSection data={res} table_status="final_status" />
            ),
            // action: <ShowApplicantDetailsSection data={res} />,
        }));
    return (
        <div className="flex flex-col gap-3">
            <Table columns={columns} data={tableData} />
            {/* {applicants?.data?.map((res, i) => (
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
            ))} */}
        </div>
    );
}
