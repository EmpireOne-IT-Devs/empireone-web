import Table from "@/app/_components/table";
import React from "react";
import { useSelector } from "react-redux";
import Badge from "@/app/_components/badge";

export default function TableSection() {
    const { job_offers } = useSelector((store) => store.applicants);
    const role_path = window.location.pathname.split("/")[2];
    const columns = [
        { header: "Applicant Name", accessor: "name" },
        { header: "Email", accessor: "email" },
        { header: "Role", accessor: "role" },
        { header: "Position", accessor: "position" },
        { header: "Status", accessor: "status" },
        { header: "Action", accessor: "action" },
    ];

    // Map status to badge variant
    const getBadgeVariant = (status) => {
        switch (status) {
            case "Pending":
                return "warning"; // yellow
            case "Accepted":
                return "success"; // green
            case "Re-Offered":
                return "secondary"; // blue/orange
            case "Declined":
                return "danger"; // red
            default:
                return "primary"; // default blue
        }
    };

    return (
        <div>
            <Table
                columns={columns}
                data={job_offers?.data?.map((res, i) => {
                    return {
                        name: res.user.name,
                        email: res.user.email,
                        role: res.role,
                        position:res?.job_application?.job_posting?.job_requisition?.title,
                        status: (
                            <Badge
                                label={res.status}
                                variant={getBadgeVariant(res.status)}
                                className="rounded-md text-white"
                            />
                        ),
                        action: (
                            <div className="flex gap-3">
                                {res.status == "Pending" && (
                                    <a
                                        className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                                        href={`/accounts/${role_path}/job_offers/${res.id}`}
                                        target="_blank"
                                    >
                                        Accept Job Offer
                                    </a>
                                )}
                            </div>
                        ),
                    };
                })}
            />
        </div>
    );
}
