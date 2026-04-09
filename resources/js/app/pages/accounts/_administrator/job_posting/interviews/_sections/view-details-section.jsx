import { useState } from "react";

import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";

import RescheduleSection from "./reschedule-section";
import CancelInterviewSection from "./cancel-interview-section";

import {
    CheckCircleIcon,
    PhoneIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";

import { CalendarIcon } from "@heroicons/react/20/solid";

import { FiBriefcase, FiClock, FiMail, FiVideo } from "react-icons/fi";

import { LuUser } from "react-icons/lu";
import MarkCompleteSection from "./mark-complete-section";

export default function ViewDetailSection({ isOpen, onClose }) {
    const [open, setOpen] = useState(false);
    const [openReschedule, setOpenReschedule] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [openMarkComplete, setOpenMarkComplete] = useState(false);

    const applicant = {
        name: "John Smith",
        position: "Senior Software Engineer",
        type: "Online",
        status: "Scheduled",
        email: "john.smith@email.com",
        phone: "+63 912 345 6789",
        experience: "6 years",
        date: "12/20/2024",
        time: "at 10:00",
        meetingLink: "https://zoom.us/j/123456789",
        coverLetter: "Technical interview - Focus on React and Node.js",
    };

    return (
        <div>
            <Modal 
            width="max-w-3xl" 
            isOpen={isOpen} 
            onClose={onClose}>

                <div className="flex flex-col items-start border-b pb-4 gap-1">
                    <h3 className="text-2xl font-bold">Interview Details</h3>
                    <div className="text-lg text-gray-600">
                        {applicant.name}
                    </div>
                </div>

                <div className="flex flex-col items-start gap-1 mt-6">
                    <span className="text-sm font-medium text-black">
                        Status
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {applicant.status}
                    </span>
                </div>

                <div className="mt-6">
                    <div className="text-black  mb-4">
                        Candidate Information
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="flex items-start gap-3">
                            <LuUser className="w-5 h-5 text-gray-400 mt-1" />
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm text-gray-600">
                                    Name
                                </span>
                                <span className="text-gray-800">
                                    {applicant.name}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <FiMail className="w-5 h-5 text-gray-400 mt-1" />
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm text-gray-600">
                                    Email
                                </span>
                                <span className="text-gray-800">
                                    {applicant.email}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <PhoneIcon className="w-5 h-5 text-gray-400 mt-1" />
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm text-gray-600">
                                    Phone
                                </span>
                                <span className="text-gray-800">
                                    {applicant.phone}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <FiBriefcase className="w-5 h-5 text-gray-400 mt-1" />
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm text-gray-600">
                                    Position
                                </span>
                                <span className="text-gray-800">
                                    {applicant.position}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="text-black  mb-4">Interview Schedule</div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-start gap-3">
                                <LuUser className="w-5 h-5 text-gray-400 mt-1" />
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm text-gray-600">
                                        Type
                                    </span>
                                    <span className="text-gray-800">
                                        {applicant.type}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <FiVideo className="w-5 h-5 text-gray-400 mt-1" />
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-sm text-gray-600">
                                        Meeting Link
                                    </span>
                                    <span className="text-blue-600 underline break-all">
                                        {applicant.meetingLink}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <CalendarIcon className="w-5 h-5 text-gray-400 mt-1" />
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm text-gray-600">
                                    Date & Time
                                </span>
                                <span className="text-gray-800">
                                    {applicant.date} {applicant.time}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="text-black  mb-3">Notes</div>
                    <div className="bg-gray-50 rounded-lg px-4 py-3 text-black">
                        {applicant.coverLetter}
                    </div>
                </div>

                <div className="mt-8 border-t pt-4">
                    <div className="flex justify-end gap-1">
                        <Button
                            variant="secondary"
                            type="button"
                            outlined
                            className="h-11 inline-flex items-center gap-2 px-6 min-w-[300px]"
                            onClick={() => {
                                setOpen(false);
                                setOpenReschedule(true);
                            }}
                        >
                            <FiClock className="w-5 h-5" />
                            <span>Reschedule</span>
                        </Button>

                        <Button
                            variant="primary"
                            type="button"
                            className="h-11 inline-flex items-center gap-2 px-4"
                            onClick={() => {
                                setOpen(false);
                                setOpenMarkComplete(true);
                            }}
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                            <span>Mark Completed & Add Feedback</span>
                        </Button>

                        <Button
                            variant="danger"
                            type="button"
                            className="h-11 inline-flex items-center gap-2 px-4"
                            onClick={() => {
                                setOpen(false);
                                setOpenCancel(true);
                            }}
                        >
                            <XCircleIcon className="w-5 h-5" />
                            <span>Cancel</span>
                        </Button>
                    </div>
                </div>
            </Modal>

            <RescheduleSection
                isOpen={openReschedule}
                onClose={() => setOpenReschedule(false)}
                applicant={applicant}
            />

            <CancelInterviewSection
                isOpen={openCancel}
                onClose={() => setOpenCancel(false)}
            />
            <MarkCompleteSection
                isOpen={openMarkComplete}
                onClose={() => setOpenMarkComplete(false)}
            />
        </div>
    );
}
