import Button from "@/app/_components/button";
import Table from "@/app/_components/table";
import { Link } from "@inertiajs/react";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";

export default function TableSection() {
    const { ecfs } = useSelector((store) => store.human_resources);
    const role = window.location.pathname.split("/")[2];

    const columns = [
        { header: "Supervisor", accessor: "supervisor" },
        { header: "Employee", accessor: "employee" },
        { header: "Effective Date", accessor: "effective_date" },
        { header: "Status", accessor: "status" },
        { header: "Action", accessor: "action" },
    ];
    console.log("ecfs", ecfs);
    return (
        <>
            <Table
                columns={columns}
                data={ecfs?.data?.map((res) => ({
                    supervisor: `${res?.reporting_to}`,
                    date_of_assessment: moment(res.date_of_assessment).format(
                        "LL",
                    ),
                    employee: `${res?.employee?.personal_information?.first_name} ${res?.employee?.personal_information?.last_name}`,
                    effective_date: res.effective_date,
                    status: res.status,
                    action: (
                        <div className="flex gap-3">


                            <a
                                target="_blank"
                                href={`/accounts/my_documents/${res.id}/employee_change_form`}
                            >
                                SHOW RESULT
                            </a>
                        </div>
                    ),
                }))}
            />
        </>
    );
}
