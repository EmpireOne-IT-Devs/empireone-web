import Table from "@/app/_components/table";
import Button from "@/app/_components/button";
import React from "react";
import { useSelector } from "react-redux";
import MenuSection from "./menu-section";
import HoverWeekSection from "./hover-week-section";

const calculateCompletion = (res) => {
    if (!res) return 0;

    const fields = [
        res?.employee_id,
        res?.department_id,
        res?.position,
        res?.eogs_email,
        res?.personal_information?.first_name,
        res?.personal_information?.last_name,
        res?.personal_information?.contact,
        res?.site_id,
        res?.department_manager_id,
    ];

    const filledFields = fields.filter(
        (field) => field !== null && field !== undefined && field !== "",
    );

    return Math.round((filledFields.length / fields.length) * 100);
};
export default function TableSection({ isloading }) {
    const { teams } = useSelector((store) => store.departments);
    const { data } = useSelector((store) => store.app);

    // Get search params from URL
    const params = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : "",
    );
    const search_teams = params.get("search")?.toLowerCase() || "";

    const columns = [
        { header: "Employee ID", accessor: "employee_id" },
        { header: "Name", accessor: "full_name" },
        { header: "Immediate Supervisor", accessor: "immediate_supervisor" },
        { header: "Next Level Manager ", accessor: "next_level_manager" },
        { header: "Week 1", accessor: "week_1" },
        { header: "Week 2", accessor: "week_2" },
        { header: "Week 3", accessor: "week_3" },
        { header: "Week 4", accessor: "week_4" },
        // { header: "Email", accessor: "eogs_email" },
        // { header: "Date Added", accessor: "created_at" },
        { header: "Action", accessor: "action" },
    ];
    console.log("teams", teams);

    // Format the array structure from console log
    const formattedTeams = Array.isArray(teams)
        ? teams
              .filter((item) => {
                  if (!search_teams) return true;
                  const firstName =
                      item?.personal_information?.first_name?.toLowerCase() ||
                      "";
                  const lastName =
                      item?.personal_information?.last_name?.toLowerCase() ||
                      "";
                  const empId = item?.employee_id?.toLowerCase() || "";
                  return (
                      firstName.includes(search_teams) ||
                      lastName.includes(search_teams) ||
                      empId.includes(search_teams)
                  );
              })
              .map((item) => {
                  const firstName =
                      item?.personal_information?.first_name || "";
                  const lastName = item?.personal_information?.last_name || "";
                  const fullName = `${firstName} ${lastName}`.trim() || "N/A";

                  const completionPercent = calculateCompletion(item);
                  return {
                      id: item?.id,
                      employee_id: item?.employee_id || "N/A",
                      full_name: (
                          <>
                              {fullName}
                              <div className="flex items-center gap-2 w-32 md:ml-0 ml-auto">
                                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex-1 shadow-inner">
                                      <div
                                          className={`h-full rounded-full transition-all duration-500 ${
                                              completionPercent === 100
                                                  ? "bg-emerald-500"
                                                  : "bg-purple-500"
                                          }`}
                                          style={{
                                              width: `${completionPercent}%`,
                                          }}
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
                          </>
                      ),
                      immediate_supervisor: `${item?.er_leader?.employee?.personal_information?.first_name} ${item?.er_leader?.employee?.personal_information?.last_name}`,
                      next_level_manager: `${item?.department_manager?.personal_information?.first_name} ${item?.department_manager?.personal_information?.last_name}`,
                      week_1: (
                          <HoverWeekSection props_data={item} week="week_1" />
                      ),
                      week_2: (
                          <HoverWeekSection props_data={item} week="week_2" />
                      ),
                      week_3: (
                          <HoverWeekSection props_data={item} week="week_3" />
                      ),
                      week_4: (
                          <HoverWeekSection props_data={item} week="week_4" />
                      ),
                      action: <MenuSection props_data={item} />,
                  };
              })
        : [];

    return (
        <div className="w-full">
            <Table
                isloading={isloading}
                columns={columns}
                data={formattedTeams}
            />
        </div>
    );
}
