import { useEffect, useState } from "react";
import DayAttendanceComponents from "../components/day-attendance-components";
import { useDispatch, useSelector } from "react-redux";
import Select from "@/app/_components/select";
import { setAlert } from "@/app/redux/app-slice";
import {
    create_attendance_employee_settings_service,
    get_attendance_employee_settings_service,
} from "@/app/services/attendance-employee-settings-service";

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const buildDefaultSchedule = () =>
    DAYS.reduce((acc, day) => {
        acc[day] = {
            timeIn: "08:00",
            timeOut: "17:00",
            isDayOff: day === "Saturday" || day === "Sunday",
        };
        return acc;
    }, {});

export default function SetAttendanceSection() {
    const dispatch = useDispatch();
    const { employees, employeesLoading } = useSelector(
        (store) => store.human_resources,
    );
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
    const [schedule, setSchedule] = useState(buildDefaultSchedule());
    const [loadingSchedule, setLoadingSchedule] = useState(false);
    const [saving, setSaving] = useState(false);

    const employeeList = Array.isArray(employees)
        ? employees
        : (employees?.data ?? []);

    const selectedEmployee = employeeList.find(
        (employee) =>
            employee.employee_id.toString() === selectedEmployeeId.toString(),
    );

    const sortedEmployeeOptions = [...employeeList]
        .sort((a, b) => {
            const lastNameA = a.personal_information?.last_name || "";
            const lastNameB = b.personal_information?.last_name || "";

            const lastNameComparison = lastNameA.localeCompare(lastNameB);

            if (lastNameComparison !== 0) return lastNameComparison;

            const firstNameA = a.personal_information?.first_name || "";
            const firstNameB = b.personal_information?.first_name || "";

            return firstNameA.localeCompare(firstNameB);
        })
        .map((employee) => ({
            value: employee.employee_id,
            label: `${employee.personal_information?.last_name ?? ""}, ${employee.personal_information?.first_name ?? ""} - ${employee.employee_id}`,
        }));

    useEffect(() => {
        if (!selectedEmployeeId) return;

        const fetchSchedule = async () => {
            setLoadingSchedule(true);
            try {
                const res =
                    await get_attendance_employee_settings_service(
                        selectedEmployeeId,
                    );
                const savedRows = res.data ?? [];

                setSchedule(() => {
                    const next = buildDefaultSchedule();
                    savedRows.forEach((row) => {
                        if (!next[row.day]) return;
                        next[row.day] = {
                            timeIn: row.time_in
                                ? row.time_in.slice(0, 5)
                                : next[row.day].timeIn,
                            timeOut: row.time_out
                                ? row.time_out.slice(0, 5)
                                : next[row.day].timeOut,
                            isDayOff: row.is_day_off == "1",
                        };
                    });
                    return next;
                });
            } catch {
                setSchedule(buildDefaultSchedule());
            } finally {
                setLoadingSchedule(false);
            }
        };

        fetchSchedule();
    }, [selectedEmployeeId]);

    const handleDayChange = (day, changes) => {
        setSchedule((prev) => ({
            ...prev,
            [day]: { ...prev[day], ...changes },
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await create_attendance_employee_settings_service({
                user_id: selectedEmployee.user_id,
                employee_id: selectedEmployeeId,
                settings: DAYS.map((day) => ({
                    day,
                    time_in: schedule[day].isDayOff
                        ? null
                        : `${schedule[day].timeIn}:00`,
                    time_out: schedule[day].isDayOff
                        ? null
                        : `${schedule[day].timeOut}:00`,
                    is_day_off: schedule[day].isDayOff,
                })),
            });

            dispatch(
                setAlert({
                    type: "success",
                    title: "Attendance settings saved successfully!",
                }),
            );
        } catch (err) {
            dispatch(
                setAlert({
                    type: "error",
                    title:
                        err.response?.data?.message ??
                        "Failed to save attendance settings.",
                }),
            );
        } finally {
            setSaving(false);
        }
    };

    console.log("Selected Employee ID:", selectedEmployeeId);
    console.log("Selected Employee Data:", selectedEmployee);
    return (
        <div className="">
            <div className="bg-white rounded-xl shadow-md">
                <div className="border-b px-6 py-4">
                    <h2 className="text-2xl font-bold">Attendance Settings</h2>
                    <p className="text-gray-500 mt-1">
                        Configure an employee's official attendance schedule.
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Employee */}

                    <div>
                        <Select
                            label="Select Employee"
                            name="employee_id"
                            options={sortedEmployeeOptions}
                            value={selectedEmployeeId}
                            onChange={(val) => setSelectedEmployeeId(val)}
                        />
                    </div>

                    {selectedEmployee && (
                        <>
                            <div className="border rounded-lg p-5 bg-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold">
                                        {
                                            selectedEmployee
                                                .personal_information
                                                ?.first_name?.[0]
                                        }
                                        {
                                            selectedEmployee
                                                .personal_information
                                                ?.last_name?.[0]
                                        }
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {
                                                selectedEmployee
                                                    .personal_information
                                                    ?.first_name
                                            }{" "}
                                            {
                                                selectedEmployee
                                                    .personal_information
                                                    ?.last_name
                                            }
                                        </h3>

                                        <p className="text-gray-500">
                                            {selectedEmployee?.account ??
                                                selectedEmployee?.department
                                                    ?.name}
                                        </p>

                                        <p className="text-gray-500">
                                            {selectedEmployee?.position}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {loadingSchedule ? (
                                <p className="text-sm text-gray-400">
                                    Loading schedule...
                                </p>
                            ) : (
                                DAYS.map((day) => (
                                    <DayAttendanceComponents
                                        key={day}
                                        day={day}
                                        timeIn={schedule[day].timeIn}
                                        timeOut={schedule[day].timeOut}
                                        isDayOff={schedule[day].isDayOff}
                                        onChange={(changes) =>
                                            handleDayChange(day, changes)
                                        }
                                    />
                                ))
                            )}

                            <div className="flex justify-end gap-3">
                                <button className="px-5 py-2 border rounded-lg">
                                    Cancel
                                </button>

                                <button
                                    disabled={saving || loadingSchedule}
                                    onClick={handleSave}
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {saving ? "Saving..." : "Save Settings"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
