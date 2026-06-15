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
import { useSelector } from "react-redux";
import moment from "moment";
import Table from "@/app/_components/table";
import EditStatusSection from "./edit-status-section";
import ShowApplicantDetailsSection from "./show-applicant-details-section";
import SendJobOfferSection from "./send-job-offer-section";
import ResendJobOfferSection from "./resend-job-offer-section";
import SendDocumentsSection from "./send-documents-section";
import { FcApproval } from "react-icons/fc";
import Button from "@/app/_components/button";

export default function ApplicantTableSection() {
    const { applicants, search_applicant_status } = useSelector(
        (store) => store.job_postings,
    );
    console.log("applicants", applicants.data);

    const columns = [
        {
            header: "Applicant Name",
            accessor: "name",
        },
        {
            header: "Position",
            accessor: "position",
        },
        {
            header: "Recruiter",
            accessor: "recruiter",
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

    const filteredApplications = applicants?.data?.filter((res) => {
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
    });

    console.log("filteredApplications", filteredApplications);

    const tableData = filteredApplications?.map((res) => ({
        name: (
            <div className="flex items-center gap-2">
                <span>{res?.applicant?.name}</span>

                {res?.previous_employee_status === "Yes" && (
                    <Badge>Former Employee</Badge>
                )}
            </div>
        ),
        position: res?.job_posting?.job_requisition?.title,
        recruiter: res?.job_posting?.job_requisition?.recruiter?.name,
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
        action: (
            <div className="flex gap-3">
                {res?.user?.role == "3" &&
                    (res.final_status == "Passed" ||
                        res.final_status == "Pooled") && (
                        <SendJobOfferSection data={res} />
                    )}
                {res.final_status === "Declined Job Offer" && (
                    <>
                        <ResendJobOfferSection data={res} />
                    </>
                )}

                {res?.final_status == "Accepted Job Offer" && (
                    <>
                        <SendDocumentsSection data={res} />
                    </>
                )}
                <ShowApplicantDetailsSection data={res} />
            </div>
        ),
    }));
    return (
        <div className="flex flex-col gap-3">
            <Table columns={columns} data={tableData} />
        </div>
    );
}
