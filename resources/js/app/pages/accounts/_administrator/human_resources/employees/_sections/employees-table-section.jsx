import React from "react";
import { useSelector } from "react-redux";
import Table from "@/app/_components/table";
import EmployeeActionSection from "./employee-action-section";
import ShowEmployeeDetailsSection from "./show-employee-details-section";

// Helper using exactly your required fields array
const calculateCompletion = (res) => {
    if (!res) return 0;

    const fields = [
        res?.employee_id,
        res?.department_id,
        res?.position,
        res?.eogs_email,
        res?.user?.email,
        res?.personal_information?.first_name,
        res?.personal_information?.last_name,
        res?.personal_information?.contact,
        res?.personal_information?.date_of_birth,
        res?.site_id,
        res?.reporting_to,
        res?.department_manager_id,
    ];

    const filledFields = fields.filter(
        (field) => field !== null && field !== undefined && field !== "",
    );

    return Math.round((filledFields.length / fields.length) * 100);
};

export default function EmployeesTableSection({ loading }) {
    const { employees } = useSelector((store) => store.human_resources);

    const columns = [
        {
            header: "ID",
            accessor: "employee_id",
            render: (row) => (
                <ShowEmployeeDetailsSection
                    props_data={row}
                    trigger={
                        <button className="font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors">
                            #{row?.employee_id}
                        </button>
                    }
                />
            ),
        },

        {
            header: "Profile Completion",
            render: (row) => {
                const completionPercent = calculateCompletion(row);
                return (
                    <div className="flex items-center gap-2 w-32 md:ml-0 ml-auto">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex-1 shadow-inner">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                    completionPercent === 100
                                        ? "bg-emerald-500"
                                        : "bg-purple-500"
                                }`}
                                style={{ width: `${completionPercent}%` }}
                            ></div>
                        </div>
                        <span
                            className={`text-[11px] font-bold w-7 text-right ${
                                completionPercent === 100
                                    ? "text-emerald-600"
                                    : "text-purple-600"
                            }`}
                        >
                            {completionPercent}%
                        </span>
                    </div>
                );
            },
        },
        {
            header: "Fullname",
            render: (row) =>
                `${row?.personal_information?.first_name || ""} ${row?.personal_information?.middle_name ?? ""} ${row?.personal_information?.last_name || ""}`.trim(),
        },
        {
            header: "Email",
            render: (row) => (
                <span
                    title={row?.user?.email || row?.eogs_email}
                    className="truncate max-w-[180px] block"
                >
                    {row?.user?.email || row?.eogs_email}
                </span>
            ),
        },
        {
            header: "Department",
            render: (row) => row?.department?.name,
        },
        {
            header: "Account",
            render: (row) =>
                row?.account?.name || row?.account?.description || row?.account,
        },
        {
            header: "Site",
            render: (row) => row?.site?.location?.name || row?.site?.name,
        },
        {
            header: "Actions",
            render: (row) => {
                const empId = row.id || row.employee_id;
                return (
                    <div className="flex items-center gap-2">
                        <EmployeeActionSection props_data={row} />
                    </div>
                );
            },
        },
    ];

    return (
        <div className="w-full">
            <Table
                isloading={loading}
                columns={columns}
                data={employees?.data}
            />
        </div>
    );
}
