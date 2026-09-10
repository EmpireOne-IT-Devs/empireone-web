import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { Calendar, Trash2 } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
    create_holiday_service,
    delete_holiday_service,
} from "@/app/services/holiday-service";
import { setAlert } from "@/app/redux/app-slice";

const formatTime = (timeString) => {
    if (!timeString) return "";

    const [hourString, minute] = timeString.split(":");
    const hour = parseInt(hourString, 10);

    if (isNaN(hour)) return "";

    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    return `${formattedHour.toString().padStart(2, "0")}:${minute} ${ampm}`;
};

const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "";

    const start = moment(startTime, "HH:mm");
    const end = moment(endTime, "HH:mm");

    // Handle schedule that passes midnight
    if (end.isBefore(start)) {
        end.add(1, "day");
    }

    const diffMins = end.diff(start, "minutes");

    if (diffMins >= 60) {
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;

        return `${hours} hr${hours > 1 ? "s" : ""}${
            mins > 0 ? ` ${mins} mins` : ""
        }`;
    }

    return `${diffMins} mins`;
};

export default function SelectedDateSection({
    children,
    data,
    holidays = [],
    selectedDate: dateObj,
    onHolidayChange,
}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [site, setSite] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useDispatch();

    const selectedDate = dateObj ? moment(dateObj) : null;

    const modalDate = selectedDate?.isValid()
        ? selectedDate.format("LL")
        : "Holiday Schedule";

    const resetForm = () => {
        setName("");
        setType("");
        setSite("");
    };

    const handleAddHoliday = async (e) => {
        e.preventDefault();

        if (!selectedDate?.isValid() || !name || !type || !site) return;

        setIsSaving(true);

        try {
            await create_holiday_service({
                name,
                date: selectedDate.format("YYYY-MM-DD"),
                type,
                site,
            });
            await onHolidayChange?.();
            resetForm();
            dispatch(
                setAlert({
                    type: "success",
                    title: "Holiday Added Successfully!",
                    message:
                        "The holiday has been saved and will reflect in employee attendance.",
                    open: true,
                }),
            );
        } catch (error) {
            console.error("Failed to add holiday: ", error);
            dispatch(
                setAlert({
                    type: "error",
                    title: "Failed to Add Holiday",
                    message:
                        error?.response?.data?.message ??
                        "Please check the form and try again.",
                    open: true,
                }),
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteHoliday = async (holidayId) => {
        try {
            await delete_holiday_service(holidayId);
            await onHolidayChange?.();
        } catch (error) {
            console.error("Failed to delete holiday: ", error);
        }
    };

    const siteOptions = [
        { value: "", label: "Select Site to Effect" },
        { value: "All", label: "All Sites" },
        { value: "Carcar", label: "Carcar" },
        { value: "Cebu", label: "Cebu" },
        { value: "San Carlos", label: "San Carlos" },
        { value: "Urdaneta", label: "Urdaneta" },
    ];

    const typeOfHolidayOptions = [
        { value: "", label: "Select Type of Holiday" },
        { value: "Regular", label: "Regular Holiday" },
        { value: "Special", label: "Special Holiday" },
        // { value: "Regular Non-Working", label: "Regular Non-Working Holiday" },
        // { value: "Special Non-Working", label: "Special Non-Working Holiday" },
        // { value: "Special Working", label: "Special Working Holiday" },
        // { value: "Regular Working", label: "Regular Working Holiday" },
    ];

    return (
        <>
            <div className="h-full w-full" onClick={() => setOpen(true)}>
                {children}
            </div>

            <Modal
                width="max-w-2xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <Calendar />
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Holiday Schedule
                            </p>

                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                {modalDate}
                            </h2>
                        </div>
                    </div>
                }
            >
                <div className="p-6">
                    {holidays?.length > 0 ? (
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Name of Holiday
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Site
                                    </th>
                                    <th scope="col" className="px-6 py-3" />
                                </tr>
                            </thead>

                            <tbody>
                                {holidays.map((holiday) => (
                                    <tr
                                        key={holiday.id}
                                        className="bg-white border-b"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {holiday.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {holiday.type} Holiday
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {holiday.site}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteHoliday(
                                                        holiday.id,
                                                    )
                                                }
                                                className="text-rose-500 hover:text-rose-700"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-500">
                            No holiday available for this date.
                        </p>
                    )}
                </div>
                <form
                    onSubmit={handleAddHoliday}
                    className="p-6 flex flex-col gap-4"
                >
                    <div className="flex justify-end flex-col gap-3 border-gray-100">
                        <Input
                            placeholder="Enter holiday name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Select
                            options={typeOfHolidayOptions}
                            value={type}
                            onChange={(value) => setType(value)}
                            outlined
                            className="text-xs w-full"
                        />
                        <Select
                            options={siteOptions}
                            value={site}
                            onChange={(value) => setSite(value)}
                            outlined
                            className="text-xs w-full"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-2 border-t border-gray-100">
                        <Button
                            outlined
                            onClick={() => setOpen(false)}
                            className="text-sm"
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            className="text-sm"
                            type="submit"
                            disabled={isSaving}
                        >
                            {isSaving ? "Adding..." : "Add Holiday"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
