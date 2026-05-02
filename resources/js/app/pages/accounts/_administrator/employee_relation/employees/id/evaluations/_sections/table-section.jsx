import Button from "@/app/_components/button";
import Table from "@/app/_components/table";
import { Link } from "@inertiajs/react";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";

export default function TableSection() {
    const { user } = useSelector((store) => store.app);
    const role = window.location.pathname.split("/")[2];

    const columns = [
        { header: "Supervisor", accessor: "supervisor" },
        { header: "Date Of Assessment", accessor: "date_of_assessment" },
        { header: "Remarks", accessor: "remarks" },
        { header: "Recommendation", accessor: "recommendation" },
        { header: "Average 1", accessor: "section1_average" },
        { header: "Average 2", accessor: "section2_average" },
        { header: "Total", accessor: "total_average" },
        { header: "Action", accessor: "action" },
    ];
    return (
        <>
            <Table
                columns={columns}
                data={user?.evaluations?.map((res) => ({
                    supervisor: `${res?.supervisor?.name}`,
                    date_of_assessment: moment(res.date_of_assessment).format(
                        "LL",
                    ),
                    remarks: res.remarks,
                    recommendation: res.recommendation,
                    section1_average: res.section1_average,
                    section2_average: res.section2_average,
                    total_average: res.total_average,
                    action: (
                        <a
                            target="_blank"
                            href={`/accounts/${role}/employee_relation/235/evaluations/${res.id}`}
                        >
                            SHOW RESULT
                        </a>
                    ),
                }))}
            />
        </>
    );
}
