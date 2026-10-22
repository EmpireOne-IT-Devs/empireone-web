import Table from "@/app/_components/table";
import Button from "@/app/_components/button";
import React from "react";
import { useSelector } from "react-redux";
import MenuSection from "./menu-section";

export default function TableSection({ isloading }) {
    const { teams } = useSelector((store) => store.departments);
    const { data } = useSelector((store) => store.app);

    // Get search params from URL
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const search_teams = params.get("search")?.toLowerCase() || "";

    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Name", accessor: "full_name" },
        { header: "Email", accessor: "eogs_email" },
        { header: "Date Added", accessor: "created_at" },
        { header: "Action", accessor: "action" },
    ];

    // Format the array structure from console log
    const formattedTeams = Array.isArray(teams)
        ? teams
            .filter((item) => {
                if (!search_teams) return true;
                const firstName = item?.personal_information?.first_name?.toLowerCase() || "";
                const lastName = item?.personal_information?.last_name?.toLowerCase() || "";
                const empId = item?.employee_id?.toLowerCase() || "";
                return (
                    firstName.includes(search_teams) ||
                    lastName.includes(search_teams) ||
                    empId.includes(search_teams)
                );
            })
            .map((item) => {
                const firstName = item?.personal_information?.first_name || "";
                const lastName = item?.personal_information?.last_name || "";
                const fullName = `${firstName} ${lastName}`.trim() || "N/A";

                return {
                    id: item?.id,
                    employee_id: item?.employee_id || "N/A",
                    full_name: fullName,
                    eogs_email: item?.eogs_email || "N/A",
                    created_at: item?.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : "N/A",
                    action: (
                        <MenuSection props_data={item} />
                    ),
                };
            })
        : [];

    return (
        <div className="w-full">
            <Table
                isloading={isloading}
                columns={columns} data={formattedTeams} />
        </div>
    );
}