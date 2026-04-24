import Table from "@/app/_components/table";
import { Link } from "@inertiajs/react";
import React from "react";
import { useSelector } from "react-redux";

export default function PoolingTableSection() {
    const { employees } = useSelector((store) => store.employee_relations);
    console.log(
        "employees",
        employees?.data?.map((res) => ({
            ...res,
            name: `${res?.personal_information?.first_name} ${res?.personal_information?.middle_name} ${res?.personal_information?.last_name}`,
            department: res?.department?.name,
        })) ?? [],
    );
    const columns = [
        { header: "Applicant ID", accessor: "employee_id" },
        { header: "Fullname", accessor: "name" },
        { header: "Position", accessor: "position" },
        { header: "Department", accessor: "department" },
        { header: "Account", accessor: "account" },
        { header: "Contact", accessor: "contact" },
        { header: "Site", accessor: "site" },
        { header: "Status", accessor: "status" },
        { header: "Action", accessor: "action" },
    ];
    return (
        <div>
            <Table
                columns={columns}
                data={
                    employees?.data?.map((res) => ({
                        ...res,
                        employee_id: (
                            <Link
                                target="_blnak"
                                className="underline text-blue-500 hover:text-blue-600"
                                href={`/accounts/administrator/employee_relation/${res?.user_id}/personal_information`}
                            >
                                {res?.employee_id}
                            </Link>
                        ),
                        name: `${res?.personal_information?.first_name} ${res?.personal_information?.middle_name} ${res?.personal_information?.last_name}`,
                        department: res?.department?.name,
                        account: res?.account?.name,
                        contact: res?.personal_information?.contact,
                        site: res?.site?.name,
                        status: res?.status,
                    })) ?? []
                }
            />
        </div>
    );
}
