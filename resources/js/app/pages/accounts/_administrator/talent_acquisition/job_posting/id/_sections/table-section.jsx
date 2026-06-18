import Table from "@/app/_components/table";
import moment from "moment";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ShowApplicantDetailsSection from "./show-applicant-details-section";
import EditStatusSection from "./edit-status-section";
import Button from "@/app/_components/button";
import SendJobOfferSection from "./send-job-offer-section";
import ResendJobOfferSection from "./resend-job-offer-section";
import SendDocumentsSection from "./send-documents-section";
import { FcApproval, FcButtingIn } from "react-icons/fc";
import Tooltip from "@/app/_components/tooltip";
import { router } from "@inertiajs/react";

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
        // name: res?.applicant?.name,
        name: (
            <div className="flex items-center gap-2">
                <Tooltip
                    title="Current Employee"
                >
                    {
                        res?.applicant?.account_employee?.employee_id && <FcApproval className="text-2xl" />
                    }
                </Tooltip>
                <Tooltip
                    title={`Former employee in the ${res?.applicant?.personal_information?.previous_employee_status}`}
                >
                    {res?.applicant?.personal_information?.previous_employee_status && <FcButtingIn className="text-2xl" />}
                </Tooltip>
                <span>{res?.applicant?.name}</span>
            </div>
        ),
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
                {res?.user?.role == "3" && (res.final_status == "Passed" ||
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
                {
                    (res.final_status == "Passed" && res?.applicant?.account_employee?.employee_id) && <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.visit(`/accounts/administrator/human_resources/employee_movements/assessment_process/promotions?employee_id=${res?.applicant?.account_employee?.employee_id}`)}
                    >
                        CREATE&nbsp;ERF
                    </Button>
                }
                <ShowApplicantDetailsSection data={res} />
            </div>
        ),
    }));
    return (
        <>
            <div className="flex flex-col gap-3">
                <Table columns={columns} data={tableData} />
            </div>
        </>
    );
}
