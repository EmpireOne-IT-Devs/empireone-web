import Modal from "@/app/_components/modal";
import Button from "@/app/_components/button";
import React, { useState } from "react";
import {
    Briefcase,
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
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import { get_job_posting_thunk } from "@/app/redux/job-posting-thunk";
import store from "@/app/store/store";
import { TbUsers } from "react-icons/tb";

export default function ViewJobPostingDetailsSection({ data, children }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { data: account } = useSelector((store) => store.app);
    const user_role = window.location.pathname.split("/")[2];
    const profileCompletion = account?.profile_percent
        ? Number(account.profile_percent)
        : 0;

    async function apply_job_position() {
        try {
            setLoading(true);
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
            setLoading(false);
            setOpen(false);
        } catch (error) {
            setLoading(false);
            await dispatch(
                setAlert({
                    type: "error",
                    title: "Job application submitted error!",
                }),
            );
        }
    }
    async function open_modal(params) {
        if (profileCompletion != 100) {
            return dispatch(
                setAlert({
                    type: "error",
                    title: (
                        <button
                            onClick={() =>
                                router.visit(
                                    `/accounts/${user_role}/my_profile`,
                                )
                            }
                        >
                            You need to finish your profile!
                        </button>
                    ),
                    message: (
                        <button
                            onClick={() =>
                                router.visit(
                                    `/accounts/${user_role}/my_profile`,
                                )
                            }
                        >
                            Tap this notification to continue!
                        </button>
                    ),
                }),
            );
        }
        return setOpen(true);
    }
    return (
        <div>
            <div onClick={() => open_modal()}>{children}</div>

            <Modal
                width="max-w-4xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title={
                    <div className="flex items-center gap-3 p-2">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <Briefcase className="w-5 h-5" />
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-neutral-400 font-mono">
                                Job Opening
                            </p>

                            <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                <span className="text-gray-700 mr-1">
                                    Position:
                                </span>
                                {data?.job_requisition?.title}
                            </h2>
                        </div>
                    </div>
                }
            >
                <div className="flex flex-col max-h-[75vh] overflow-y-auto ">
                    <div className="mb-6 gap-2 flex items-center">
                        <Badge
                            showDot={false}
                            className="rounded-md"
                            variant="success"
                            label="active"
                        />
                        {user_role !== "applicant" &&
                            user_role !== "employee" && (
                                <div className="flex items-center gap-2 text-gray-600 font-medium">
                                    <TbUsers />
                                    {data?.job_requisition?.applications?.length ?? 0} applicants
                                </div>
                            )}
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

                    <div className="mt-4 space-y-6 pt-4 text-gray-800 text-sm sm:text-base">
                        {data?.job_requisition.justification_for_position && (
                            <div>
                                <h3 className="font-semibold text-lg mb-2">
                                    Justification for Position
                                </h3>
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: data?.job_requisition
                                            .justification_for_position,
                                    }}
                                />
                            </div>
                        )}
                        {data?.job_requisition.qualifications && (
                            <div>
                                <h3 className="font-semibold text-lg mb-2">
                                    Qualifications
                                </h3>
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: data?.job_requisition
                                            .qualifications,
                                    }}
                                />
                            </div>
                        )}
                        {data?.job_requisition.responsibilities && (
                            <div>
                                <h3 className="font-semibold text-lg mb-2">
                                    Responsibilities
                                </h3>
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: data?.job_requisition
                                            .responsibilities,
                                    }}
                                />
                            </div>
                        )}
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
                            loading={loading}
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
