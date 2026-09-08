import Table from "@/app/_components/table";
import React from "react";
import { useSelector } from "react-redux";
import ChangeFormDetailsSection from "./change-form-details-section";


export default function ChangeFormTableSection() {
    const { change_forms } = useSelector((store) => store.human_resources);
    const role = window.location.pathname.split("/")[2];

    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Fullname", accessor: "name" },
        { header: "Position", accessor: "position" },
        { header: "Department", accessor: "department" },
        { header: "Action", accessor: "action" },
    ];

    console.log('change_forms',change_forms)
    return (
        <>
            <Table
                columns={columns}
                data={
                    change_forms?.data?.map((res) => ({
                        ...res,
                        employee_id: (
                            <> {res?.employee_id}</>
                        ),
                        name: `${res?.employee?.personal_information?.first_name} ${res?.employee?.personal_information?.middle_name} ${res?.employee?.personal_information?.last_name}`,
                        position: `${res?.position} `,
                        department:
                            res?.department,
                        started_at:
                            res?.employee?.account_employee?.started_at,
                        action: (
                            <div className="flex gap-3">
                               <ChangeFormDetailsSection props_data={res} />
                            </div>
                        ),
                    })) ?? []
                }
            />
        </>
    );
}
