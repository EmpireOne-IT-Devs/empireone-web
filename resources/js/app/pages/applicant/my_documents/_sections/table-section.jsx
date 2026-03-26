import Badge from "@/app/_components/badge";
import Table from "@/app/_components/table";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";

export default function TableSection() {
    const { documents } = useSelector((store) => store.applicants);
    const columns = [
        {
            header: "Document Name",
            accessor: "name",
        },
        {
            header: "Date Uploaded",
            accessor: "created_at",
        },
        {
            header: "Status",
            accessor: "status",
        },
        {
            header: "Open Link",
            accessor: "url",
        },
        {
            header: "Action",
            accessor: "action",
        },
    ];
    console.log("documents", documents?.data);

    const getBadgeVariant = (status) => {
        switch (status) {
            case "Pending":
                return "warning"; // yellow
            case "Approved":
                return "success"; // green
            case "Re-Uploaded":
                return "info"; //orange
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
                data={
                    documents?.data?.map((res) => ({
                        ...res,
                        url: (
                            <a
                                className="underline cursor-pointer"
                                href={res.url}
                                target="_blank"
                            >
                                {res.url}
                            </a>
                        ),
                        status: (
                            <Badge
                                label={res.status}
                                variant={getBadgeVariant(res.status)}
                                className="rounded-md text-white"
                            />
                        ),
                        created_at: moment(res.created_at).format("LLL"),
                        action: res.status == "Declined" && (
                            <div>Re-Upload</div>
                        ),
                    })) ?? []
                }
            />
        </div>
    );
}
