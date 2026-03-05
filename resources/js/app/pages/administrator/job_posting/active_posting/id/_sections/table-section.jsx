import Table from "@/app/_components/table";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";

export default function TableSection() {
    const { job_applications } = useSelector((store) => store.job_postings);
   
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
            header: "Status",
            accessor: "status",
        },
    ];
    return (
        <div>
            <Table
                columns={columns}
                data={job_applications?.job_application?.applicants?.map(
                    (res) => ({
                        name: res.applicant.name,
                        email: res.applicant.email,
                        contact: res.personal_information.contact,
                        applied_at: moment(res.created_at).format("LLL"),
                        status: res.status,
                    }),
                )}
            />
        </div>
    );
}
