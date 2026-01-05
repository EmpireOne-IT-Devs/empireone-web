import React, { useState } from "react";
import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { TbFilter } from "react-icons/tb";
import { Textarea } from "@headlessui/react";

export default function CreateJobSection() {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Button type="button" onClick={() => setOpen(true)}>
                <div className="flex items-center gap-2">
                    <PlusCircleIcon className="w-5 h-5" />
                    Create Job Post
                </div>
            </Button>

            <Modal
                width="max-w-4xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Create New Job Posting"
            >
                <form className="space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">
                            Basic Information
                        </h3>
                        <div className="mb-4">
                            <Input
                                label="Job Title"
                                placeholder="e.g. Senior Software Engineer"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Department" placeholder="e.g. IT" />
                            <Input label="Location" placeholder="e.g. Manila" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            iconLeft={<TbFilter className="text-xl" />}
                            label="Employment Type"
                            options={[
                                { value: "full time", label: "Full Time" },
                                { value: "part time", label: "Part Time" },
                                { value: "contract", label: "Contract" },
                            ]}
                        />

                        <Input
                            label="Salary Range"
                            placeholder="₱50,000 - ₱100,000"
                        />
                        <Select
                            iconLeft={<TbFilter className="text-xl" />}
                            label="Status"
                            options={[
                                { value: "draft", label: "Draft" },
                                { value: "active", label: "Active" },
                                { value: "closed", label: "Closed" },
                            ]}
                        />
                    </div>

                    <Input label="Application Deadline" type="date" />
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">
                            Job Details
                        </h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Job Description *
                        </label>
                        <Textarea
                            placeholder="Describe the role and responsibilities..."
                            className="w-full border border-gray-300 rounded-md p-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Requirements (one per line) *
                        </label>
                        <Textarea
                            placeholder="Years of experience in relevant field..."
                            className="w-full border border-gray-300 rounded-md p-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Experience Required"
                            placeholder="e.g. 3+ years in relevant field"
                        />
                        <Input
                            label="Education Required"
                            placeholder="e.g. Bachelor's..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 px-2 border-t">
                        <Button
                            variant="secondary"
                            type="button"
                            outlined
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="button">Create Job Post</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
