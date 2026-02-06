import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import React, { useState } from "react";
import { TbEye } from "react-icons/tb";
import {
    Building,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    MapPin,
} from "lucide-react";
import { LuGraduationCap, LuBriefcase } from "react-icons/lu";
import Badge from "@/app/_components/badge";

export default function ViewJobPostingDetailsSection({ data }) {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <button type="button" onClick={() => setOpen(true)}>
                <TbEye className="cursor-pointer text-blue-500 hover:text-blue-600" />
            </button>

            <Modal
                width="max-w-2xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Senior Software Engineer"
            >
                <div className="flex flex-col max-h-[80vh] overflow-y-auto ">
                    <div className="mb-6 gap-2 flex items-center">
                        <Badge
                            showDot={false}
                            className="rounded-md"
                            variant="success"
                            label="active"
                        />
                        <span className="text-gray-700">28 applicants</span>
                    </div>

                    <div className="  grid grid-cols-2 gap-6 mb-8 bg-gray-100 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                            <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500 mb-1">
                                    Department
                                </p>
                                <p className="font-medium text-gray-900">IT</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500 mb-1">
                                    Location
                                </p>
                                <p className="font-medium text-gray-900">
                                    Manila
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500 mb-1">
                                    Employment Type
                                </p>
                                <p className="font-medium text-gray-900">
                                    Full-time
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500 mb-1">
                                    Salary Range
                                </p>
                                <p className="font-medium text-gray-900">
                                    ₱80,000 - ₱120,000
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500 mb-1">
                                    Posted Date
                                </p>
                                <p className="font-medium text-gray-900">
                                    12/1/2024
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500 mb-1">
                                    Deadline
                                </p>
                                <p className="font-medium text-gray-900">
                                    12/31/2024
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">
                            Job Description
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            We are looking for an experienced Senior Software
                            Engineer to join our growing IT team.
                        </p>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">
                            Requirements
                        </h3>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                5+ years experience
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                Proficiency in React and Node.js
                            </li>
                            <li className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                Strong problem-solving skills
                            </li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <LuBriefcase className="w-5 h-5 text-blue-600" />
                                <h4 className="font-medium text-gray-900">
                                    Experience
                                </h4>
                            </div>
                            <p className="text-sm text-gray-600">5+ years</p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <LuGraduationCap className="w-5 h-5 text-purple-600" />
                                <h4 className="font-medium text-gray-900">
                                    Education
                                </h4>
                            </div>
                            <p className="text-sm text-gray-600">
                                Bachelor's degree in Computer Science
                            </p>
                        </div>
                    </div>

                    <div className="sticky bottom-0 bg-white border-t pt-4 flex justify-between gap-3">
                        <Button
                            variant="secondary"
                            type="button"
                            outlined
                            onClick={() => setOpen(false)}
                            className="flex-1"
                        >
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            type="button"
                            className="flex-1"
                        >
                            View Applicants
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
