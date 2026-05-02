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
                            // <Link
                            //     target="_blnak"
                            //     className="underline text-blue-500 hover:text-blue-600"
                            //     disabled
                            //     href={`/accounts/administrator/employee_relation/leads/${res.id}`}
                            // >
                            //     {res?.employee?.account_employee?.employee_id}
                            // </Link>
                            <> {res?.employee?.account_employee?.employee_id}</>
                        ),
                        name: `${res?.employee?.personal_information?.first_name} ${res?.employee?.personal_information?.middle_name} ${res?.employee?.personal_information?.last_name}`,
                        position: `${res?.employee?.account_employee?.position} `,
                        department:
                            res?.employee?.account_employee?.department?.name,
                        status:
                            res?.employee?.account_employee?.status ?? "N/A",
                        action: (
                            <>
                                <a
                                    target="_blank"
                                    href={`/accounts/${role}/performance_evaluation/${res?.employee?.account_employee?.user_id}`}
                                >
                                    create_performance
                                </a>
                                ||
                                <a
                                    target="_blank"
                                    href={`/accounts/${role}/my_team/${res?.employee?.account_employee?.user_id}/personal_information`}
                                >
                                    View Information
                                </a>
                            </>
                        ),
                    })) ?? []
                }
            />
        </>
    );
}
