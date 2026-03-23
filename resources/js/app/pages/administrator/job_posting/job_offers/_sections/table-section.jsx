import Table from "@/app/_components/table";
import React from "react";
import { useSelector } from "react-redux";
import ShowDetailsSection from "./show-details-section";

export default function TableSection() {
    const { job_offers } = useSelector((store) => store.job_postings);
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
            header: "Role",
            accessor: "role",
        },
        {
            header: "Status",
            accessor: "status",
        },
        {
            header: "Action",
            accessor: "action",
        },
    ];
    console.log("job_offers", job_offers);
    return (
        <div>
            <Table
                columns={columns}
                data={job_offers?.data?.map((res) => ({
                    name: res.user.name,
                    email: res.user.email,
                    status: res.status,
                    role: res.role,
                    action: (
                        <div className="flex gap-3">
                            <ShowDetailsSection data={res} />
                        </div>
                    ),
                }))}
            />
        </div>
    );
}
