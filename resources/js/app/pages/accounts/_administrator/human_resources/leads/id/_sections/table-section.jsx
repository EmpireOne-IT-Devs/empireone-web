import Table from "@/app/_components/table";
import { Link } from "@inertiajs/react";
import React from "react";
import { useSelector } from "react-redux";

export default function TableSection() {
    const { leader } = useSelector((store) => store.human_resourcess);
    console.log("leaderadada", leader?.data?.subordinates);

    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Fullname", accessor: "name" },
        { header: "Position", accessor: "position" },
        { header: "Department", accessor: "department" },
        { header: "Account", accessor: "account" },
        { header: "Action", accessor: "action" },
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
                            //     {res?.employee?.account_employee?.employee_id}
                            // </Link>
                            <> {res?.employee?.account_employee?.employee_id}</>
                        ),
                        name: `${res?.employee?.personal_information?.first_name} ${res?.employee?.personal_information?.middle_name} ${res?.employee?.personal_information?.last_name}`,
                        position: `${res?.employee?.account_employee?.position} `,
                        department:
                            res?.employee?.account_employee?.department?.name,
                        account:
                            res?.employee?.account_employee?.account?.name ??
                            "N/A",
                        action: "button",
                    })) ?? []
                }
            />
        </>
    );
}
