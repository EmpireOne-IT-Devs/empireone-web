import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import React, { useState } from "react";
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
import moment from "moment";
import { router } from "@inertiajs/react";
import { apply_application_service } from "@/app/services/job-application-service";
import { useDispatch } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import { get_job_posting_thunk } from "@/app/redux/job-posting-thunk";
import store from "@/app/store/store";

export default function ViewJobPostingDetailsSection({ data, children }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();

    async function apply_job_position() {
        try {
            await apply_application_service({
                job_posting_id: data.id,
            });
            store.dispatch(get_job_posting_thunk());
            await dispatch(
                setAlert({
                    type: "success",
                    title: "Job application submitted Successfully!",
                }),
            );
        } catch (error) {
            await dispatch(
                setAlert({
                    type: "error",
                    title: "Job application submitted error!",
                }),
            );
        }
    }
    return (
        <div>
            <div onClick={() => setOpen(true)}>{children}</div>

            <Modal
                width="max-w-4xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title={`Position: ${data?.job_requisition?.title}`}
            >
                <div className="flex flex-col max-h-[80vh] overflow-y-auto ">
                    <div className="mb-6 gap-2 flex items-center">
                        <Badge
                            showDot={false}
                            className="rounded-md"
                            variant="success"
                            label="active"
                        />
                        <span className="text-gray-700">
                            {data?.applications?.length ?? 0} applicants
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-100 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                            <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500 mb-1">
                                    Department
                                </p>
                                <p className="font-medium text-gray-900">
                                    {data?.job_requisition?.department?.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div>
                                <p className="text-sm text-gray-500 mb-1">
                                    Location
                                </p>
                                <p className="font-medium text-gray-900">
                                    {data?.job_requisition?.location?.name}
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
                                    {data?.job_requisition?.employment_type}
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
                                    {data?.job_requisition?.salary_range
                                        ? data?.job_requisition?.salary_range
                                        : "Salary not specified"}
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
                                    {moment(data?.created_at).format("LL")}
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
                                    {data?.application_deadline}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="mt-2 space-y-6 text-gray-800">
                            {data?.job_requisition
                                ?.justification_for_position && (
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">
                                        Job Description
                                    </h3>
                                    <div
                                        className="prose max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: data?.job_requisition
                                                ?.justification_for_position,
                                        }}
                                    />
                                </div>
                            )}

                            {data?.job_requisition?.qualifications && (
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">
                                        Requirements
                                    </h3>
                                    <ul className="space-y-2">
                                        {data.job_requisition.qualifications
                                            .replace(/<\/?ul>/g, "")
                                            .split(/<\/?li>/)
                                            .map((item) =>
                                                item
                                                    .replace(/<[^>]+>/g, "")
                                                    .trim(),
                                            )
                                            .filter(Boolean)
                                            .map((item, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center gap-2 text-gray-700"
                                                >
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    {item}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <LuBriefcase className="w-5 h-5 text-blue-600" />
                                <h4 className="font-medium text-gray-900">
                                    Experience
                                </h4>
                            </div>
                            <p className="text-sm text-gray-600">
                                {data?.experience_required}
                            </p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <LuGraduationCap className="w-5 h-5 text-purple-600" />
                                <h4 className="font-medium text-gray-900">
                                    Education
                                </h4>
                            </div>
                            <p className="text-sm text-gray-600">
                                {data?.education_required}
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
                            disabled={data.is_applied}
                            onClick={() => apply_job_position()}
                        >
                            {data.is_applied
                                ? "Applied"
                                : "Apply for this Position"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
