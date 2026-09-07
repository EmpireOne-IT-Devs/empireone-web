import Badge from "@/app/_components/badge";
import React from "react";

import { useSelector } from "react-redux";
import moment from "moment";
import Table from "@/app/_components/table";
import { FcApproval } from "react-icons/fc";
import { Link, router } from "@inertiajs/react";
import EmployeeChangeFormSection from "./employee-change-form-section";
import Button from "@/app/_components/button";

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

    console.log("evaluations", applicants?.data);

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
            <div className="flex items-center justify-center">
                {!res.change_form && <EmployeeChangeFormSection props_data={res} />}

                {res.change_form &&
                    <Button
                        className="w-full"
                        onClick={() => window.open(`/accounts/my_documents/${res.change_form.id}/employee_change_form`, '_blank')}
                        variant={res.change_form.status === 'Pending' ? 'warning' : 'success'}
                    >
                        <div className="uppercase">
                            Change Form {res.change_form.status}
                        </div>
                    </Button>}
            </div>

        ),
    }));
    return (
        <div className="flex flex-col gap-3">
            <Table columns={columns} data={tableData} />
        </div>
    );
}
