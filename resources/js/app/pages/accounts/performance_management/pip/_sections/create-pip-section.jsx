import React, {
    useState,
    useMemo,
    useEffect,
    useCallback,
    useRef,
} from "react";
import { useForm } from "react-hook-form";
import { FcComboChart } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";

import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import TextArea from "@/app/_components/textarea";
import InputSearch from "@/app/_components/input-search";
import { setAlert } from "@/app/redux/app-slice";
import {
    get_pip_thunk,
    search_employee_thunk,
} from "@/app/redux/employee-relation-thunk";
import { create_pip_service } from "@/app/services/human-resources-service";
import store from "@/app/store/store";
// Import your PIP service here once created
// import { create_pip_service } from '@/app/services/human-resources-service'

export default function CreatePIPSection() {
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const dispatch = useDispatch();

    const searchTimeoutRef = useRef(null);
    const { employee } = useSelector((state) => state.human_resources);

    // Employee Data Extraction
    const personalInfo = selectedUser?.personal_information;
    const employeeId = selectedUser?.employee_id ?? "";
    const firstName = personalInfo?.first_name ?? "";
    const lastName = personalInfo?.last_name ?? "";
    const employeeEmail =
        selectedUser?.eogs_email || personalInfo?.contact || "";
    const position = selectedUser?.job_title ?? selectedUser?.position ?? "";

    // Supervisor Details
    const leader = selectedUser?.er_leader?.employee ?? selectedUser?.er_leader;
    const supervisorInfo = leader?.personal_information;
    const supervisorName = supervisorInfo
        ? `${supervisorInfo.first_name ?? ""} ${supervisorInfo.last_name ?? ""}`.trim()
        : (leader?.name ?? "");
    const supervisorEmail = leader?.eogs_email ?? leader?.email ?? "";

    // Next Level Manager Details
    const manager =
        selectedUser?.department_manager?.second_level_manager ??
        selectedUser?.department_manager;
    const managerInfo = manager?.personal_information;
    const managerName = managerInfo
        ? `${managerInfo.first_name ?? ""} ${managerInfo.last_name ?? ""}`.trim()
        : (manager?.name ?? "");
    const managerEmail = manager?.eogs_email ?? manager?.email ?? "";

    const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);

    const pipCycleOptions = [
        { label: "PIP 1", value: "PIP 1" },
        { label: "PIP 2", value: "PIP 2" },
        { label: "PIP 3", value: "PIP 3" },
    ];

    const employeeOptions = useMemo(() => {
        return (
            employee?.data?.map((emp) => {
                const name =
                    emp.name ||
                    (emp.personal_information
                        ? `${emp.personal_information.first_name} ${emp.personal_information.last_name}`
                        : `Employee #${emp.employee_id || emp.id}`);
                return {
                    label: `${name} (${emp.employee_id || "N/A"})`,
                    value: emp.id,
                    data: emp,
                };
            }) || []
        );
    }, [employee?.data]);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            employee_id: "",
            first_name: "",
            last_name: "",
            position: "",
            employee_email: "",
            supervisor_name: "",
            supervisor_email: "",
            manager_name: "",
            manager_email: "",
            pip_start_date: "",
            pip_end_date: "",
            pip_cycle: "PIP 1",
            history_kpi: "",
            history_target: "",
            history_actual: "",
            root_cause_analysis: "",
            action_kpi_goal: "",
            action_target_action: "",
            action_date: "",
            supervisor_id: "",
            supervisor_user_id: "",
            manager_id: "",
            manager_user_id: "",
            account_id: "",
        },
    });
    const watchedValues = watch();
    // console.log('selectedUser',selectedUser?.account_id?.name)
    useEffect(() => {
        if (!selectedUser) return;

        setValue("supervisor_id", leader?.employee_id);
        setValue("account_id", selectedUser?.account?.id);
        setValue("supervisor_user_id", leader?.user_id);
        setValue(
            "manager_id",
            selectedUser?.department_manager?.second_level_manager?.employee_id,
        );
        setValue("manager_user_id", selectedUser?.department_manager?.user_id);

        setValue("employee_id", employeeId);
        setValue("first_name", firstName);
        setValue("last_name", lastName);
        setValue("position", position);
        setValue("employee_email", employeeEmail);
        setValue("supervisor_name", supervisorName);
        setValue("supervisor_email", supervisorEmail);
        setValue("manager_name", managerName);
        setValue("manager_email", managerEmail);
    }, [
        selectedUser,
        setValue,
        employeeId,
        firstName,
        lastName,
        position,
        employeeEmail,
        supervisorName,
        supervisorEmail,
        managerName,
        managerEmail,
    ]);

    const onSubmit = async (formData) => {
        try {
            await create_pip_service({
                ...formData,
                user_id: selectedUser?.user_id,
            });
            await store.dispatch(get_pip_thunk());
            console.log("PIP Payload:", formData);
            dispatch(
                setAlert({
                    type: "success",
                    title: "PIP Enrollment Created Successfully!",
                    message:
                        "The Performance Improvement Plan has been submitted.",
                    open: true,
                }),
            );
            setOpen(false);
            setSelectedUser(null);
            reset();
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearchEmployee = useCallback(
        (query) => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            searchTimeoutRef.current = setTimeout(() => {
                dispatch(search_employee_thunk(query));
            }, 400);
        },
        [dispatch],
    );

    const handleSelectEmployee = (selectedVal) => {
        const matched = employee?.data?.find(
            (e) =>
                e.id === selectedVal ||
                e.id === selectedVal?.value ||
                e === selectedVal,
        );
        if (matched) {
            setSelectedUser(matched);
        }
    };

    return (
        <div>
            <Button variant="secondary" onClick={() => setOpen(true)}>
                <FcComboChart size={20} /> PIP ENROLLMENT
            </Button>

            <Modal
                width="max-w-7xl"
                isOpen={open}
                onClose={() => {
                    setOpen(false);
                    setSelectedUser(null);
                    reset();
                }}
                title="PERFORMANCE IMPROVEMENT PLAN (PIP) ENROLLMENT FORM"
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-8 p-4 text-slate-800"
                >
                    <input type="hidden" {...register("employee_id")} />
                    <input type="hidden" {...register("first_name")} />
                    <input type="hidden" {...register("last_name")} />
                    <input type="hidden" {...register("supervisor_name")} />
                    <input type="hidden" {...register("manager_name")} />

                    {/* Employee Search Field */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <InputSearch
                            label="SEARCH EMPLOYEE"
                            name="name"
                            className="w-full"
                            options={employeeOptions}
                            onSearch={handleSearchEmployee}
                            onChange={(val) => {
                                handleSearchEmployee(val);
                                handleSelectEmployee(val);
                            }}
                            onSelect={(item) => handleSelectEmployee(item)}
                        />
                    </div>

                    {/* READ-ONLY DISPLAY SECTION */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
                            {/* Employee Info Card */}
                            <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-1 rounded">
                                    Employee Info
                                </span>
                                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase">
                                            Employee Name
                                        </p>
                                        <p className="font-medium text-slate-800">
                                            {firstName} {lastName || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase">
                                            Employee ID
                                        </p>
                                        <p className="font-medium text-slate-800">
                                            {employeeId || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase">
                                            Position
                                        </p>
                                        <p className="font-medium text-slate-800">
                                            {position || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase">
                                            Employee Email
                                        </p>
                                        <p className="font-medium text-slate-800">
                                            {employeeEmail || "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Leadership Info Card */}
                            <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                    Leadership Info
                                </span>
                                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase">
                                            Immediate Supervisor Name
                                        </p>
                                        <p className="font-medium text-slate-800">
                                            {supervisorName || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase">
                                            Next Level Manager Name
                                        </p>
                                        <p className="font-medium text-slate-800">
                                            {managerName || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase">
                                            Supervisor Email
                                        </p>
                                        <p className="font-medium text-slate-800">
                                            {supervisorEmail || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase">
                                            Manager Email
                                        </p>
                                        <p className="font-medium text-slate-800">
                                            {managerEmail || "—"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PIP Cycle Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            <Input
                                label="PIP Start Date *"
                                type="date"
                                {...register("pip_start_date", {
                                    required: "Start Date is required",
                                })}
                                error={errors.pip_start_date?.message}
                            />
                            <Input
                                label="PIP End Date *"
                                type="date"
                                min={todayDate}
                                {...register("pip_end_date", {
                                    required: "End Date is required",
                                })}
                                error={errors.pip_end_date?.message}
                            />
                            <Select
                                label="Current PIP Cycle *"
                                name="pip_cycle"
                                options={pipCycleOptions}
                                {...register("pip_cycle", {
                                    required: "End Date is required",
                                })}
                                value={watchedValues?.pip_cycle}
                                error={errors?.pip_cycle?.message ?? ""}
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* 1. Employee Performance History */}
                    <div className="space-y-4 pt-6 border-t border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900">
                            1. Employee Performance History
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="KPI *"
                                placeholder="Enter KPI"
                                {...register("history_kpi", {
                                    required: "KPI is required",
                                })}
                                error={errors.history_kpi?.message}
                            />
                            <Input
                                label="TARGET *"
                                placeholder="Enter Target"
                                {...register("history_target", {
                                    required: "Target is required",
                                })}
                                error={errors.history_target?.message}
                            />
                            <Input
                                label="ACTUAL *"
                                placeholder="Enter Actual"
                                {...register("history_actual", {
                                    required: "Actual is required",
                                })}
                                error={errors.history_actual?.message}
                            />
                        </div>
                    </div>

                    {/* 2. Reasons for Performance Challenges */}
                    <div className="space-y-4 pt-6 border-t border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900">
                            2. Reasons for Performance Challenges (Root Cause
                            Analysis)
                        </h2>
                        <TextArea
                            label="Root Cause Analysis *"
                            placeholder="Describe reasons for performance challenges..."
                            {...register("root_cause_analysis", {
                                required: "Root cause analysis is required",
                            })}
                            className="bg-transparent w-full outline-none text-black h-32"
                            error={errors?.root_cause_analysis?.message ?? ""}
                        />
                    </div>

                    {/* 3. Action Plan (S.M.A.R.T.) */}
                    <div className="space-y-4 pt-6 border-t border-slate-200">
                        <h2 className="text-lg font-bold text-slate-900">
                            3. Action Plan (S.M.A.R.T.)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input
                                label="KPI / Goal *"
                                placeholder="Enter Goal"
                                {...register("action_kpi_goal", {
                                    required: "KPI / Goal is required",
                                })}
                                error={errors.action_kpi_goal?.message}
                            />
                            <Input
                                label="Target Action *"
                                placeholder="Enter Target Action"
                                {...register("action_target_action", {
                                    required: "Target Action is required",
                                })}
                                error={errors.action_target_action?.message}
                            />
                            <Input
                                label="Date *"
                                type="date"
                                {...register("action_date", {
                                    required: "Date is required",
                                })}
                                error={errors.action_date?.message}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <Button
                            type="submit"
                            loading={isSubmitting}
                            variant="primary" // Changed to primary to match the blue button in the reference
                        >
                            Submit Enrollment
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
