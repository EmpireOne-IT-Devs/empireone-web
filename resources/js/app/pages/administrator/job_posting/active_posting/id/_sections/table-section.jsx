import Table from "@/app/_components/table";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import ShowApplicantDetailsSection from "./show-applicant-details-section";
import EditStatusSection from "./edit-status-section";

export default function TableSection() {
    const { job_applications, search_applicant_status } = useSelector(
        (store) => store.job_postings,
    );

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
    const filteredApplications = job_applications?.job_applications?.filter(
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
        action: <ShowApplicantDetailsSection data={res} />,
    }));
    return (
        <div>
            <Table columns={columns} data={tableData} />
        </div>
    );
}
