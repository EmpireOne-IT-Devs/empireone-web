import Button from "@/app/_components/button";
import Table from "@/app/_components/table";
import { Link } from "@inertiajs/react";
import React from "react";
import { useSelector } from "react-redux";

export default function TableSection() {
    const { data } = useSelector((store) => store.app);
    console.log("leaderadada", data?.user?.leader?.subordinates);
    const role = window.location.pathname.split("/")[2];

    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Fullname", accessor: "name" },
        { header: "Position", accessor: "position" },
        { header: "Department", accessor: "department" },
        { header: "Employment Status", accessor: "status" },
        { header: "Hired Date", accessor: "started_at" },
        { header: "3rd Month Evaluation", accessor: "evaluation_period3" },
        { header: "5th Month Evaluation", accessor: "evaluation_period5" },
        { header: "Action", accessor: "action" },
    ];
    return (
        <>
            <Table
                columns={columns}
                data={
                    data?.user?.leader?.subordinates?.map((res) => ({
                        ...res,
                        employee_id: (
                            <> {res?.employee?.account_employee?.employee_id}</>
                        ),
                        name: `${res?.employee?.personal_information?.first_name} ${res?.employee?.personal_information?.middle_name} ${res?.employee?.personal_information?.last_name}`,
                        position: `${res?.employee?.account_employee?.position} `,
                        department:
                            res?.employee?.account_employee?.department?.name,
                        started_at:
                            res?.employee?.account_employee?.started_at,
                        status:
                            res?.employee?.account_employee?.status ?? "N/A",
                        evaluation_period3: res?.has3_months_evaluation?.status == null ? (
                            // Render plain text if status is null
                            <span className="text-gray-500">
                                {res?.has3_months_evaluation?.evaluation_period || "No Evaluation"}
                            </span>
                        ) : (
                            // Render the active link if status exists
                            <a
                                target="_blank"
                                rel="noopener noreferrer" // Security best practice when using target="_blank"
                                className="underline text-blue-500 hover:text-blue-600"
                                href={`/accounts/administrator/human_resources/review/evaluations/${res?.has3_months_evaluation?.id}`}
                            >
                                {res?.has3_months_evaluation?.evaluation_period}
                            </a>
                        ),
                        evaluation_period5: res?.has5_months_evaluation?.status == null ? (
                            // Render plain text if status is null
                            <span className="text-gray-500">
                                {res?.has5_months_evaluation?.evaluation_period || "No Evaluation"}
                            </span>
                        ) : (
                            // Render the active link if status exists
                            <a
                                target="_blank"
                                rel="noopener noreferrer" // Security best practice when using target="_blank"
                                className="underline text-blue-500 hover:text-blue-600"
                                href={`/accounts/administrator/human_resources/review/evaluations/${res?.has5_months_evaluation?.id}`}
                            >
                                {res?.has5_months_evaluation?.evaluation_period}
                            </a>
                        ),
                        action: (
                            <div className="flex gap-3">
                                {/* {
                                    res?.has3_months_evaluation?.user_id
                                } */}
                                {res?.has3_months_evaluation?.status === null && (
                                    <>
                                        <a
                                            target="_blank"
                                            href={`/accounts/${role}/performance_evaluation/${res?.employee?.account_employee?.user_id}?evaluation_period=${res?.has3_months_evaluation?.evaluation_period}`}
                                        >
                                            Evaluate Performance
                                        </a>
                                        |
                                    </>
                                )}

                                <a
                                    target="_blank"
                                    href={`/accounts/${role}/my_team/${res?.employee?.account_employee?.user_id}/personal_information`}
                                >
                                    View Information
                                </a>
                            </div>
                        ),
                    })) ?? []
                }
            />
        </>
    );
}
