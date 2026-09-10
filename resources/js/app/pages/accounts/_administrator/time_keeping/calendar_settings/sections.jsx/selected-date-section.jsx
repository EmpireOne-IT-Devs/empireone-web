import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { Calendar } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";

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

export default function SelectedDateSection({ children, data }) {
    const [open, setOpen] = useState(false);

    /*
     * IMPORTANT:
     * Do not use new Date(data[0].date) here.
     *
     * Example:
     * "2026-09-11" -> new Date() may interpret this as UTC
     * which can become September 10 in Philippine time.
     *
     * moment(date, "YYYY-MM-DD") keeps it as the intended calendar date.
     */
    const selectedDate = data?.[0]?.date
        ? moment(data[0].date, "YYYY-MM-DD")
        : null;

    const displayDate = selectedDate?.isValid()
        ? selectedDate.format("dddd, MMMM D")
        : "Daily Schedule";

    const modalDate = selectedDate?.isValid()
        ? selectedDate.format("LL")
        : "Holiday Schedule";

    const handleAddHoliday = (e) => {
        e.preventDefault();
        // Add your holiday handling logic here
    };

    const siteOptions = [
        { value: "", label: "Select Site to Effect" },
        { value: "All", label: "All Sites" },
        { value: "Carcar", label: "Carcar" },
        { value: "Cebu", label: "Cebu" },
        { value: "San Carlos", label: "San Carlos" },
        { value: "Urdaneta", label: "Urdaneta" },
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
                    {data?.length > 0 ? (
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Talent
                                    </th>

                                    <th scope="col" className="px-6 py-3">
                                        Start Time
                                    </th>

                                    <th scope="col" className="px-6 py-3">
                                        End Time
                                    </th>

                                    <th scope="col" className="px-6 py-3">
                                        Duration
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="bg-white border-b"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {item.talent}
                                        </td>

                                        <td className="px-6 py-4">
                                            {formatTime(item.startTime)}
                                        </td>

                                        <td className="px-6 py-4">
                                            {formatTime(item.endTime)}
                                        </td>

                                        <td className="px-6 py-4">
                                            {calculateDuration(
                                                item.startTime,
                                                item.endTime,
                                            )}
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
                        <Input placeholder="Enter holiday name" />
                        <Select
                            options={siteOptions}
                            outlined
                            className="text-xs w-full"
                        />
                    </div>
                    <div className="flex justify-end p-4 border-t border-gray-100">
                        <Button outlined className="text-xs">
                            Add Holiday
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
