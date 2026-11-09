import Table from "@/app/_components/table";
import { Link } from "@inertiajs/react";
import React from "react";
import { useSelector } from "react-redux";

export default function TableSection() {
    const { leader } = useSelector((store) => store.human_resources);
    console.log("leaderadada", leader?.data?.subordinates);

    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Fullname", accessor: "name" },
        { header: "Position", accessor: "position" },
        { header: "Department", accessor: "department" },
        { header: "Immediate Supervisor", accessor: "immediate_supervisor" },
        { header: "Next Level Manager", accessor: "second_level_manager" },
        { header: "Account", accessor: "account" },
        // { header: "Action", accessor: "action" },
    ];
    return (
        <>
            <Table
                columns={columns}
                data={
                    leader?.data?.subordinates?.map((res) => ({
                        ...res,
                        employee_id: (
                            // <Link
                            //     target="_blnak"
                            //     className="underline text-blue-500 hover:text-blue-600"
                            //     disabled
                            //     href={`/accounts/administrator/human_resources/leads/${res.id}`}
                            // >
                            //     {res?.employee_id}
                            // </Link>
                            <> {res?.employee_id}</>
                        ),
                        name: `${res?.personal_information?.first_name} ${res?.personal_information?.middle_name} ${res?.personal_information?.last_name}`,
                        position: `${res?.position} `,
                        department:
                            res?.department?.name,
                        account:
                            res?.account?.name ??
                            "N/A",
                        immediate_supervisor:
                            `${res?.er_leader?.employee?.personal_information?.first_name ?? ''} ${res?.er_leader?.employee?.personal_information?.last_name ?? ''}`,
                        second_level_manager:
                            `${res?.department_manager?.personal_information?.first_name ?? ''} ${res?.department_manager?.personal_information?.last_name ?? ''}`,
                        // action: "button",
                    })) ?? []
                }
            />
        </>
    );
}
