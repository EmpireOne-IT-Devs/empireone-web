import Input from "@/app/_components/input";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import React from "react";

export default function RescheduleSection({ isOpen, onClose }) {
    const applicant = {
        name: "John Smith",
        date: "12/20/2024",
        time: "at 10:00",
    };

    return (
        <Modal width="max-w-lg" isOpen={isOpen} onClose={onClose}>
            {/* Header */}
            <div className="flex flex-col items-start border-b pb-4 gap-1">
                <h3 className="text-xl sm:text-2xl font-bold">Reschedule Interview</h3>
                <div className="text-base sm:text-lg text-gray-600">{applicant.name}</div>
            </div>

            {/* Current schedule banner */}
            <div className="flex flex-col sm:flex-row sm:items-center border border-blue-200 rounded-xl bg-blue-50 p-4 mt-4 gap-1 sm:gap-2">
                <span className="font-medium text-sm sm:text-base">Current Schedule:</span>
                <div className="text-sm sm:text-base text-gray-600">
                    {applicant.date} {applicant.time}
                </div>
            </div>

            {/* New Date */}
            <div className="mt-5 sm:mt-6">
                <div className="text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                    New Date *
                </div>
                <Input type="date" className="w-full" />
            </div>

            {/* New Time */}
            <div className="mt-5 sm:mt-6">
                <div className="text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                    New Time *
                </div>
                <Input type="time" className="w-full" />
            </div>

            {/* Actions */}
            <div className="mt-6 sm:mt-8 border-t pt-4">
                <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                    <Button
                        variant="secondary"
                        outlined
                        type="button"
                        className="h-11 inline-flex items-center justify-center gap-2 px-4 w-full sm:w-auto sm:min-w-[160px]"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="h-11 inline-flex items-center justify-center gap-2 px-4 w-full sm:w-auto sm:min-w-[180px]"
                    >
                        Reschedule Interview
                    </Button>
                </div>
            </div>
        </Modal>
    );
} 