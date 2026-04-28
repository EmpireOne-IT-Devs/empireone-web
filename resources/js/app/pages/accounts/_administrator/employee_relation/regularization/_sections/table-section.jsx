import Table from "@/app/_components/table";
import { Link, router } from "@inertiajs/react";
import React from "react";
import { useSelector } from "react-redux";

export default function TableSection() {
    const { probationaries } = useSelector((store) => store.employee_relations);
    const role = window.location.pathname.split("/")[2];
    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Fullname", accessor: "name" },
        { header: "Position", accessor: "position" },
        { header: "Department", accessor: "department" },
        { header: "Account", accessor: "account" },
        { header: "Hired Date", accessor: "started_at" },
        { header: "Site", accessor: "site" },
        { header: "Status", accessor: "status" },
        { header: "Action", accessor: "action" },
    ];
    return (
        <div>
            <Table
                columns={columns}
                data={
                    probationaries?.map((res) => ({
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
                        action: (
                            <div>
                                <button
                                    onClick={() =>
                                        router.visit(
                                            `/accounts/${role}/employee_relation/regularization/${res.id}`,
                                        )
                                    }
                                >
                                    View ECF
                                </button>
                            </div>
                        ),
                    })) ?? []
                }
            />
        </div>
    );
}
