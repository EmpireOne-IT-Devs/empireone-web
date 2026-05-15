import Badge from "@/app/_components/badge";
import React from "react";

import { useSelector } from "react-redux";
import moment from "moment";
import Table from "@/app/_components/table";
import { FcApproval } from "react-icons/fc";
import { Link } from "@inertiajs/react";

export default function ApplicantTableSection() {
    const { applicants } = useSelector(
        (store) => store.human_resources,
    );
    console.log("applicants", applicants?.data);

    const columns = [
        {
            header: "Applicant Name",
            accessor: "name",
        },
        {
            header: "Position",
            accessor: "position",
        },
        // {
        //     header: "Recruiter",
        //     accessor: "recruiter",
        // },
        {
            header: "Applied At",
            accessor: "applied_at",
        },
        // {
        //     header: "Screening Status",
        //     accessor: "screening_status",
        // },
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


    const tableData = applicants?.data?.map((res) => ({
        name: <div className="flex gap-1">
            {
                res?.applicant?.account_employee?.employee_id && <FcApproval className="text-xl" />
            }
            {res?.applicant?.name}
        </div>,
        position: res?.job_posting?.job_requisition?.title,
        // recruiter: res?.job_posting?.job_requisition?.recruiter?.name,
        applied_at: moment(res.created_at).format("LLL"),

        interview_status: res.interview_status,
        final_status: res.final_status,

        action: (
            <Link
                href={`/accounts/administrator/human_resources/employee_movements/employee_status_changes?user_id=${res?.user_id}`}
            >
                CREATE ECF
            </Link>
        ),
    }));
    return (
        <div className="flex flex-col gap-3">
            <Table columns={columns} data={tableData} />
        </div>
    );
}
