import React, { useEffect, useState } from "react";

import { usePage, Link, useForm } from "@inertiajs/react";

import { useSelector } from "react-redux";

import { get_pip_by_id_thunk } from "@/app/redux/employee-relation-thunk";

import store from "@/app/store/store";

import moment from "moment";

import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";

import { approved_pip_service } from "@/app/services/human-resources-service";

import ProgressReportSection from "./progress-report-section";

export default function PerformanceImprovementPlanPage() {
    const pageProps = usePage().props;

    const user = pageProps?.auth?.user;

    const { pip } = useSelector((state) => state.human_resources);

    console.log("pippip", pip);

    // Initialize Inertia useForm using numeric is_passed (1 or 0)

    const { data, setData, put, processing, errors } = useForm({
        action_notes: pip?.action_notes || "",

        is_passed: Number(pip?.is_passed) === 1 ? 1 : 0,

        sanction: Number(pip?.is_passed) === 1 ? null : pip?.sanction,

        passed_month: pip?.passed_month || moment().format("MMMM YYYY"),
    });

    useEffect(() => {
        if (pip) {
            setData({
                action_notes: pip.action_notes || "",

                is_passed: Number(pip.is_passed) === 1 ? 1 : 0,

                sanction: Number(pip.is_passed) === 1 ? null : pip.sanction,

                passed_month: pip.passed_month || moment().format("MMMM YYYY"),
            });
        }
    }, [pip]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const getActionId = () => {
        if (pip?.id) return pip.id;

        const pathSegments = window.location.pathname

            .split("/")

            .filter(Boolean);

        const lastSegment = pathSegments[pathSegments.length - 1];

        if (!isNaN(lastSegment)) return lastSegment;

        const numericSegment = pathSegments.find((seg) => !isNaN(seg));

        return numericSegment || 1;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "_____________";

        return moment(dateString).format("LL");
    };

    const handleSign = async (roleType) => {
        const id = getActionId();

        if (!id) return;

        if (
            window.confirm(
                "Are you sure you want to sign and approve this document?",
            )
        ) {
            setIsSubmitting(true);

            console.log("pip?.is_passed", pip?.is_passed);

            try {
                await approved_pip_service({
                    id,

                    role: roleType,

                    action_notes: data.action_notes,

                    is_passed: Number(data.is_passed) === 1 ? 1 : 0,

                    sanction:
                        Number(data.is_passed) === 1 ? null : data.sanction,
                });

                await store.dispatch(get_pip_by_id_thunk(id));

                alert("Successfully signed and approved.");
            } catch (error) {
                console.error("Signature failed:", error);

                alert(
                    error?.response?.data?.message ||
                        "Failed to submit signature. Please try again.",
                );
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Full names & leader mapping from Redux `pip` object & relations

    const employeeFullName = pip
        ? [pip.first_name, pip.last_name].filter(Boolean).join(" ")
        : "";

    const supervisorFullName =
        pip?.supervisor_name ||
        [pip?.supervisor?.first_name, pip?.supervisor?.last_name]

            .filter(Boolean)

            .join(" ") ||
        "";

    const managerFullName =
        pip?.manager_name ||
        [pip?.manager?.first_name, pip?.manager?.last_name]

            .filter(Boolean)

            .join(" ") ||
        "";

    const hrFullName =
        [pip?.hr_first_name, pip?.hr_last_name].filter(Boolean).join(" ") ||
        [pip?.hr?.first_name, pip?.hr?.last_name].filter(Boolean).join(" ") ||
        "";

    // Status flags

    const isEmployeeSigned =
        Number(pip?.is_employee_acknowledged) === 1 ||
        pip?.status === "Acknowledged";

    const isHrSigned = Number(pip?.is_hr_approved) === 1;

    const isManagerSigned = Number(pip?.is_manager_approved) === 1;

    // Role-based permissions

    const canEmployeeSign =
        !isEmployeeSigned && Number(user?.id) === Number(pip?.user_id);

    const canHrSign =
        !isHrSigned &&
        (Number(user?.id) === Number(pip?.hr_user_id) || user?.role === "HR");

    const canManagerSign =
        !isManagerSigned &&
        (Number(user?.id) === Number(pip?.manager_user_id) ||
            user?.role === "Manager");

    const employeeSignature = pip?.employee?.signature;

    const managerSignature = pip?.manager?.signature;

    const hrSignature = pip?.hr?.signature;

    const details = {
        employeeName: employeeFullName || "",

        employeeId: pip?.employee_id || "",

        position: pip?.position || "",

        managerName: managerFullName || "",

        supervisorName: supervisorFullName || "",

        hrName: hrFullName,

        startDate: pip?.pip_start_date ? formatDate(pip.pip_start_date) : "",

        endDate: pip?.pip_end_date ? formatDate(pip.pip_end_date) : "",

        datePrepared: pip?.created_at
            ? moment(pip.created_at).format("LLL")
            : "",

        pipCycle: pip?.pip_cycle || "PIP 1",

        kpiGoal: pip?.history_kpi || pip?.action_kpi_goal || "KPI 1",

        kpiTarget: pip?.history_target || pip?.action_target_action || "—",

        kpiActual: pip?.history_actual || "—",

        rootCause:
            pip?.root_cause_analysis ||
            "No root cause / action plan notes specified.",

        actionKpi: pip?.action_kpi_goal || "KPI 1",

        actionTarget: pip?.action_target_action || "—",

        actionDate: pip?.action_date ? formatDate(pip.action_date) : "—",
    };
    const isWithinOneWeekOfEnd = (endDateString) => {
        if (!endDateString) return false;

        const today = new Date();
        const endDate = new Date(endDateString);

        // Subtract 7 days from the PIP end date
        const oneWeekBefore = new Date(endDate);
        oneWeekBefore.setDate(endDate.getDate() - 7);

        // Show the component if today's date is past the 1-week-before mark
        return today >= oneWeekBefore;
    };

    const SignatureSlot = ({
        isSigned,

        canSign,

        printedName,

        signatureImg,

        roleKey,

        label,
    }) => (
        <div className="flex flex-col items-center justify-end min-h-[70px]">
            <div className="relative w-full border-b border-black pb-1 min-h-[38px] flex items-end justify-center">
                {isSigned ? (
                    <div className="flex flex-col items-center justify-end w-full">
                        {signatureImg && (
                            <img
                                src={signatureImg}
                                alt="Signature"
                                className="h-10 max-w-[120px] object-contain -mb-2 pointer-events-none"
                            />
                        )}

                        <span className="font-bold text-slate-900 leading-tight">
                            {printedName}
                        </span>
                    </div>
                ) : canSign ? (
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSign(roleKey)}
                        className="print:hidden px-3 py-1 text-[10px] font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded transition-colors shadow-sm disabled:opacity-50 mb-0.5 cursor-pointer"
                    >
                        {isSubmitting ? "Submitting..." : "Approve & Sign"}
                    </button>
                ) : (
                    <span className="text-[10px] text-amber-700 italic font-medium mb-0.5 print:hidden">
                        {isSigned ? "Approved" : "Pending Signature"}
                    </span>
                )}
            </div>

            <span className="text-[10px] block mt-1 font-semibold text-slate-700">
                {label}
            </span>
        </div>
    );

    return (
        <div className="flex items-center flex-col justify-center w-full bg-slate-100 min-h-screen py-8 px-4 font-sans text-slate-900">
            <div className="w-full max-w-[850px] bg-white border border-slate-300 shadow-xl p-8 space-y-6 print:border-none print:shadow-none print:p-6 text-[11px] leading-relaxed">
                {/* Top Navigation Bar */}

                <div className="flex justify-between items-center print:hidden border-b border-slate-200 pb-4 mb-2">
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-300 shadow-sm transition-all"
                    >
                        <FiArrowLeft className="w-4 h-4" /> Go to Login
                    </Link>

                    {pip?.status === "Active PIP" || isEmployeeSigned ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200">
                            <FiCheckCircle className="w-4 h-4" />{" "}
                            {pip?.status || "Form Acknowledged"}
                        </span>
                    ) : pip?.status === "Awaiting Employee Acknowledgment" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
                            <FiCheckCircle className="w-4 h-4" /> {pip?.status}
                        </span>
                    ) : pip?.status === "Pending HR Approval" ? (
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                            {pip?.status}
                        </span>
                    ) : (
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200">
                            {pip?.status || "Pending Manager Approval"}
                        </span>
                    )}
                </div>

                {/* HEADER TABLE */}

                <div className="border border-black grid grid-cols-1 md:grid-cols-3">
                    <div className="p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-black">
                        <span className="text-2xl font-black tracking-tight text-blue-900">
                            <img
                                src="/images/E1CXlogo.png"
                                alt="E1CX Logo"
                                className="max-h-16 object-contain"
                            />
                        </span>
                    </div>

                    <div className="md:col-span-2 p-4 flex flex-col items-center justify-center text-center font-bold uppercase tracking-wide text-xs">
                        <p>Performance Improvement Plan (PIP)</p>
                        <p className="text-base font-extrabold mt-0.5">
                            Enrollment Form
                        </p>
                    </div>
                </div>

                <div className="text-center font-bold text-base underline uppercase tracking-wide pt-2">
                    Performance Improvement Plan Enrollment Form
                </div>

                {/* EMPLOYEE INFO TABLE */}

                <table className="w-full border-collapse border border-black text-xs">
                    <tbody>
                        <tr>
                            <td className="border border-black p-2 font-semibold w-1/2">
                                Employee Name:{" "}
                                <span className="font-normal">
                                    {details.employeeName || "Loading..."}
                                </span>
                            </td>

                            <td className="border border-black p-2 font-semibold w-1/2">
                                Employee Number:{" "}
                                <span className="font-normal">
                                    {details.employeeId}
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td className="border border-black p-2 font-semibold">
                                Position:{" "}
                                <span className="font-normal">
                                    {details.position}
                                </span>
                            </td>

                            <td className="border border-black p-2 font-semibold">
                                Manager:{" "}
                                <span className="font-normal">
                                    {details.managerName}
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td className="border border-black p-2 font-semibold">
                                PIP Start Date:{" "}
                                <span className="font-normal">
                                    {details.startDate}
                                </span>
                            </td>

                            <td className="border border-black p-2 font-semibold">
                                PIP End Date:{" "}
                                <span className="font-normal">
                                    {details.endDate}
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td className="border border-black p-2 font-semibold">
                                # of Enrollments:{" "}
                                <span className="font-normal">
                                    {details.pipCycle}
                                </span>
                            </td>

                            <td className="border border-black p-2 font-semibold">
                                Dates of Previous Enrollments:{" "}
                                <span className="font-normal">N/A</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* SECTION 1: PERFORMANCE HISTORY */}

                <div className="space-y-2">
                    <div className="font-bold text-xs uppercase">
                        1. Employee Performance History
                    </div>

                    <table className="w-full border-collapse border border-black text-center text-xs">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="border border-black p-2 font-bold w-1/3">
                                    KPI
                                </th>

                                <th className="border border-black p-2 font-bold w-1/3">
                                    TARGET
                                </th>

                                <th className="border border-black p-2 font-bold w-1/3">
                                    ACTUAL
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td className="border border-black p-2 text-left font-medium">
                                    {details.kpiGoal}
                                </td>

                                <td className="border border-black p-2">
                                    {details.kpiTarget}
                                </td>

                                <td className="border border-black p-2">
                                    {details.kpiActual}
                                </td>
                            </tr>

                            <tr>
                                <td
                                    className="border border-black p-1.5 text-left italic text-slate-500 text-[10px]"
                                    colSpan={3}
                                >
                                    (add as necessary)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* SECTION 2: REASONS FOR PERFORMANCE CHALLENGES */}

                <div className="space-y-2">
                    <div className="font-bold text-xs uppercase">
                        2. Reasons for Performance Challenges (based on Root
                        Cause Analysis)
                    </div>

                    <div className="border border-black p-3 min-h-[90px] text-xs text-slate-800 bg-slate-50/50 whitespace-pre-line">
                        {details.rootCause}
                    </div>
                </div>

                {/* SECTION 3: ACTION PLAN */}

                <div className="space-y-2">
                    <div className="font-bold text-xs uppercase">
                        3. Action Plan
                    </div>

                    <table className="w-full border-collapse border border-black text-center text-xs">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="border border-black p-2 font-bold w-1/3">
                                    KPI
                                </th>

                                <th className="border border-black p-2 font-bold w-1/3">
                                    TARGET
                                </th>

                                <th className="border border-black p-2 font-bold w-1/3">
                                    DATE
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td className="border border-black p-2 text-left font-medium">
                                    {details.actionKpi}
                                </td>

                                <td className="border border-black p-2">
                                    {details.actionTarget}
                                </td>

                                <td className="border border-black p-2">
                                    {details.actionDate}
                                </td>
                            </tr>

                            <tr>
                                <td
                                    className="border border-black p-1.5 text-left italic text-slate-500 text-[10px]"
                                    colSpan={3}
                                >
                                    (add as necessary)
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* SECTION 4: PERFORMANCE STANDARDS */}

                <div className="space-y-2">
                    <div className="font-bold text-xs uppercase">
                        4. Performance Standards (S.M.A.R.T.)
                    </div>

                    <div className="border border-black p-3 min-h-[80px] text-xs text-slate-800 bg-slate-50/50">
                        {pip?.history_target ||
                            "Specific, Measurable, Achievable, Relevant, and Time-bound standards set for the enrollment period."}
                    </div>
                </div>

                <div className="border-t-2 border-dashed border-black my-6"></div>

                {/* PAGE 2 / TERMS & CONDITIONS */}

                <div className="space-y-4 text-justify">
                    <p>
                        You are given{" "}
                        <span className="font-bold">30 days / 1 month</span>{" "}
                        from today an opportunity to improve on your
                        performance. You will be assessed every end of the week
                        with pertinent coaching and development from your
                        Manager while tracking progress. It is your
                        responsibility to contact me anytime during this period
                        regarding your performance and to seek assistance in
                        removing roadblock(s) you may come up against which may
                        impede your progress.
                    </p>

                    <p>
                        In addition to meeting the specific objectives outlined
                        in this plan, during your PIP period, and then
                        thereafter on an ongoing basis, you must demonstrate a
                        commitment to your job and to the Company's values. This
                        commitment must be reflected by continuing to perform
                        your job in a satisfactory fashion, and it must also
                        include working with enthusiasm, creativity and a
                        positive attitude.
                    </p>

                    <p>
                        If you fail to make the required improvement in the
                        areas identified, you will be subject to the appropriate
                        disciplinary sanction, up to and including termination
                        at any time during your plan period. Furthermore, the
                        Company reserves the right to terminate your employment
                        during the period if it becomes clear you are not making
                        sufficient progress, or for business reasons unrelated
                        to your performance (e.g. misconduct, lack of work). If
                        you make the required improvement, you must continue to
                        perform at a satisfactory level after the performance
                        plan period ends.
                    </p>
                </div>

                <div className="pt-2 font-semibold text-xs">
                    Target Improvement Date:{" "}
                    <span className="underline font-normal">
                        {details.endDate}
                    </span>
                </div>

                {/* SIGNATURE BLOCK */}

                <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <SignatureSlot
                        isSigned={isEmployeeSigned}
                        canSign={canEmployeeSign}
                        printedName={details.employeeName}
                        signatureImg={employeeSignature}
                        roleKey="is_employee_acknowledged"
                        label="Employee Name and Signature"
                    />

                    <SignatureSlot
                        isSigned={isHrSigned}
                        canSign={canHrSign}
                        printedName={details.hrName}
                        signatureImg={hrSignature}
                        roleKey="is_hr_approved"
                        label="HR Business Partner Name and Signature"
                    />

                    <SignatureSlot
                        isSigned={isManagerSigned}
                        canSign={canManagerSign}
                        printedName={details.managerName}
                        signatureImg={managerSignature}
                        roleKey="is_manager_approved"
                        label="Manager's Name and Signature"
                    />
                </div>
            </div>

            {/* PROGRESS REPORT SECTION */}
            {pip?.pip_end_date && isWithinOneWeekOfEnd(pip.pip_end_date) && (
                <ProgressReportSection
                    pip={pip}
                    user={user}
                    isSubmitting={isSubmitting}
                    onSign={handleSign}
                    data={data}
                    setData={setData}
                    processing={processing}
                    errors={errors}
                />
            )}
        </div>
    );
}
