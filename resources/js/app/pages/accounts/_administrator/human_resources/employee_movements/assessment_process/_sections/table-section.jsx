import Button from "@/app/_components/button";
import Table from "@/app/_components/table";
import { Link } from "@inertiajs/react";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import EmployeeChangeFormSection from "./employee-change-form-section";

export default function TableSection() {
    const { evaluations } = useSelector((store) => store.human_resources);
    const role = window.location.pathname.split("/")[2];

    const columns = [
        { header: "Supervisor", accessor: "supervisor" },
        { header: "Employee", accessor: "employee" },
        { header: "Date Of Assessment", accessor: "date_of_assessment" },
        { header: "Recommendation", accessor: "recommendation" },
        { header: "Average 1", accessor: "section1_average" },
        { header: "Average 2", accessor: "section2_average" },
        { header: "Total", accessor: "total_average" },
        { header: "Status", accessor: "status" },
        { header: "Evaluation Period", accessor: "evaluation_period" },
        { header: "Action", accessor: "action" },
    ];
    console.log("evaluations", evaluations);
    return (
        <>
            <Table
                columns={columns}
                data={evaluations?.map((res) => ({
                    supervisor: `${res?.supervisor?.name}`,
                    date_of_assessment: moment(res.date_of_assessment).format(
                        "LL",
                    ),
                    employee: `${res?.user?.personal_information?.first_name} ${res?.user?.personal_information?.last_name}`,
                    recommendation: res.recommendation,
                    section1_average: res.section1_average,
                    section2_average: res.section2_average,
                    total_average: res.total_average,
                    status: res.status,
                    evaluation_period: res.evaluation_period,
                    action: (
                        <div className="flex gap-3">
                            <EmployeeChangeFormSection props_data={res} />
                            <a
                                target="_blank"
                                href={`/accounts/${role}/human_resources/review/evaluations/${res.id}`}
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
