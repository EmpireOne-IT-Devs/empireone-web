import Table from "@/app/_components/table";
import { Link } from "@inertiajs/react";
import React from "react";
import { useSelector } from "react-redux";

export default function TableSection() {
    const { leaders } = useSelector((store) => store.human_resources);


    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Fullname", accessor: "name" },
        { header: "Position", accessor: "position" },
        { header: "Department", accessor: "department" },
        { header: "Account", accessor: "account" },
        { header: "Member handled", accessor: "subordinates_count" },
        { header: "Action", accessor: "action" },
    ];
    return (
        <div>
            <Table
                columns={columns}
                data={
                    leaders?.data?.map((res) => ({
                        ...res,
                        employee_id: (
                            <Link
                                target="_blnak"
                                className="underline text-blue-500 hover:text-blue-600"
                                disabled
                                href={`/accounts/administrator/human_resources/leads/${res.id}`}
                            >
                                {res?.user?.account_employee?.employee_id}
                            </Link>
                        ),
                        name: `${res?.user?.personal_information?.first_name} ${res?.user?.personal_information?.middle_name} ${res?.user?.personal_information?.last_name}`,
                        position: `${res?.user?.account_employee?.position} `,
                        department:
                            res?.user?.account_employee?.department?.name,
                        account:
                            res?.user?.account_employee?.account?.name ?? "N/A",
                        subordinates_count: res?.subordinates_count,
                        action: "button",
                    })) ?? []
                }
            />
        </div>
    );
}
