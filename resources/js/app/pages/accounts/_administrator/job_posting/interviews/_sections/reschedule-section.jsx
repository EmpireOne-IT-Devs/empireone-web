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
            <div className="flex flex-col items-start border-b pb-4 gap-1">
                <h3 className="text-2xl font-bold">Reschedule Interview</h3>
                <div className="text-lg text-gray-600">{applicant.name}</div>
            </div>

            <div className="flex items-start border border-blue-200 rounded-xl bg-blue-50 p-4 mt-4 gap-2">
                <span className="font-medium">Current Schedule:</span>
                <div className="text-md text-gray-600">
                    {applicant.date} {applicant.time}
                </div>
            </div>
            <div className="mt-6">
                <div className="text-gray-700 font-semibold mb-2">
                    New Date *
                </div>
                <Input 
                type="date" 
                className="w-full" />
            </div>

            <div className="mt-6">
                <div className="text-gray-700 font-semibold mb-2">
                    New Time *
                </div>
                <Input type="time" className="w-full" />
            </div>
            <div className="mt-8 border-t pt-4">
                <div className="flex justify-end gap-2">
                    <Button
                        variant="secondary"
                        outlined
                        type="button"
                        className="h-11 inline-flex items-center gap-2 px-4 min-w-[230px]"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="h-11 inline-flex items-center gap-2 px-4 min-w-[230px]"
                    >
                        Reschedule Interview
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
