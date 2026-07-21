import Badge from "@/app/_components/badge";
import React from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import Table from "@/app/_components/table";

export default function ERPTableSection() {
    const { erps } = useSelector(
        (store) => store.job_postings,
    );

    const getStatusVariant = (status) => {
        switch (status) {
            case "New":
                return "primary";
            case "Conducted":
            case "Scheduled":
            case "Not Scheduled":
            case "Pooled":
                return "warning";
            case "Screened Passed":
            case "Passed":
            case "Accepted Job Offer":
            case "Hired":
                return "success";
            case "Screened Failed":
            case "Failed":
            case "Rejected":
                return "danger";
            case "No Response":
            case "No Show":
            case "Withdrawn":
                return "secondary";
            default:
                return "secondary";
        }
    };

    const columns = [
        {
            header: "Referral Name",
            accessor: "referral_name",
        },
        {
            header: "Contact",
            accessor: "contact",
        },
        {
            header: "Referrer Name",
            accessor: "referrer_name",
        },
        {
            header: "Employee Id",
            accessor: "employee_id",
        },
        {
            header: "Department/Account",
            accessor: "account",
        },
        {
            header: "Date Submitted",
            accessor: "date_submitted",
        },
        {
            header: "Assessment Status",
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
    ];

    const tableData = erps?.map((res) => {

        return {
            referral_name: `${res?.applicant?.personal_information?.first_name} ${res?.applicant?.personal_information?.last_name}`,
            contact: res?.referral?.contact,
            referrer_name: `${res?.referral?.first_name} ${res?.referral?.last_name}`,
            employee_id: `${res?.employee?.employee_id}`,
            account: `${res?.employee?.account.name ?? res?.employee?.department.name}`,
            date_submitted: moment(res.created_at).format('LLL'),
            screening_status: <Badge
                label={res.screening_status ?? ""}
                variant={getStatusVariant(res.screening_status)}
                solid
            />,
            interview_status:  <Badge
                label={res.interview_status ?? ""}
                variant={getStatusVariant(res.interview_status)}
                solid
            />,
            final_status: <Badge
                label={res.final_status ?? ""}
                variant={getStatusVariant(res.final_status)}
                solid
            />,
        };
    });
    return (
        <div className="flex flex-col gap-3">
            <Table columns={columns} data={tableData} />
        </div>
    );
}
