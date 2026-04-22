import Table from "@/app/_components/table";
import moment from "moment";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ShowApplicantDetailsSection from "./show-applicant-details-section";
import EditStatusSection from "./edit-status-section";
import SendJobOfferSection from "../../../../applicants/_sections/send-job-offer-section";
import Button from "@/app/_components/button";
import AddInterviewSchedule from "./add-interview-schedule";
import { Calendar } from "lucide-react";

export default function TableSection() {
    const [openModal, setOpenModal] = useState(false);
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
        action: (
            <div className="flex gap-3">
                {res.final_status == "Passed" && (
                    <SendJobOfferSection data={res} />
                )}
                <Button
                    className="text-xs px-3 py-1"
                    variant="success"
                    outlined
                    onClick={() => setOpenModal(true)}
                >
                    Schedule Interview
                </Button>
                <ShowApplicantDetailsSection data={res} />
            </div>
        ),
    }));
    return (
        <div>
            <Table columns={columns} data={tableData} />

            <AddInterviewSchedule
                open={openModal}
                onClose={() => setOpenModal(false)}
            />
        </div>
    );
}
