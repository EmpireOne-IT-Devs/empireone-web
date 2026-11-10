import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import Button from "@/app/_components/button";
import {
    FiBriefcase as Briefcase,
    FiHash as Hash,
    FiHome as Building2,
    FiMail as Mail,
} from "react-icons/fi";
import { FaUserCircle as UserCircle } from "react-icons/fa";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { router } from "@inertiajs/react";
import { edit_information_service } from "@/app/services/account-service";
import store from "@/app/store/store";
import { get_app_data_thunk } from "@/app/redux/app-thunk";
import { setAlert } from "@/app/redux/app-slice";

const getName = (list, code) =>
    list.find((item) => item.code === code)?.name || code;

export default function FormSection() {
    const { data } = useSelector((store) => store.app);
    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: {} });

    const dispatch = useDispatch();
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const form = watch();

    useEffect(() => {
        if (data?.user?.personal_information) {
            reset({
                ...data?.user?.personal_information,
                e_r_leader_id: data?.user?.account_employee?.e_r_leader_id,
                department_manager_id:
                    data?.user?.account_employee?.department_manager_id,
                started_at: data?.user?.account_employee?.started_at
                    ? moment(data.user.account_employee.started_at).format(
                          "YYYY-MM-DD",
                      )
                    : "",
                position_level: data?.user?.account_employee?.position_level,
                employee_id: data?.user?.account_employee?.employee_id,
                department_id: data?.user?.account_employee?.department_id,
                account_id: data?.user?.account_employee?.account_id,
                site_id: data?.user?.account_employee?.site_id,
                position: data?.user?.account_employee?.position,
                eogs_email: data?.user?.account_employee?.eogs_email,
                status: data?.user?.account_employee?.status,
                skills: data?.user?.skills,
                experiences: data?.user?.working_experience,
            });
        }
    }, [
        data?.user?.personal_information,
        data?.user?.skills,
        data?.user?.working_experience,
        reset,
    ]);

    const onSubmit = async (formData) => {
        const finalData = {
            ...formData,
            started_at: moment(formData.started_at).format("LL"),
            region: getName(regions, formData.region),
            province: getName(provinces, formData.province),
            city: getName(cities, formData.city),
            barangay: getName(barangays, formData.barangay),
        };
        try {
            await edit_information_service(finalData);
            await store.dispatch(get_app_data_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Information saved successfully!",
                    message: "Your profile has been updated.",
                    open: true,
                }),
            );
            router.visit("/dashboard");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-x-6 gap-y-4">
                {/* Employee ID */}
                <Input
                    label="Employee ID"
                    name="employee_id"
                    required
                    {...register("employee_id", {
                        required: "Employee ID is required",
                    })}
                    error={errors.employee_id?.message}
                    iconLeft={<Hash size={14} />}
                />

                {/* Started At */}
                <Input
                    label="Started At"
                    name="started_at"
                    type="date"
                    required
                    {...register("started_at", {
                        required: "Start date is required",
                    })}
                    error={errors.started_at?.message}
                />

                {/* Level of Position */}
                <Controller
                    name="position_level"
                    control={control}
                    rules={{ required: "Position level is required" }}
                    render={({ field }) => (
                        <Select
                            label="Level of Position"
                            required
                            options={[
                                {
                                    label: "Rank and File (Agent, Support Etc.)",
                                    value: "Rank and File",
                                },
                                { label: "Supervisor", value: "Supervisor" },
                                { label: "Manager", value: "Manager" },
                                { label: "Executive", value: "Executive" },
                            ]}
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                            error={errors.position_level?.message}
                        />
                    )}
                />

                {/* Immediate Supervisor */}
                <Controller
                    name="e_r_leader_id"
                    control={control}
                    rules={{ required: "Immediate Supervisor is required" }}
                    render={({ field }) => (
                        <Select
                            label="Immediate Supervisor"
                            required
                            options={
                                data?.leaders?.map((res) => ({
                                    ...res,
                                    label: `${res?.user?.name} - ${res?.location?.name}`,
                                    value: res.id,
                                })) || []
                            }
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                            error={errors.e_r_leader_id?.message}
                        />
                    )}
                />

                {/* Next Level Manager */}
                <Controller
                    name="department_manager_id"
                    control={control}
                    rules={{ required: "Next Level Manager is required" }}
                    render={({ field }) => (
                        <Select
                            label="Next Level Manager"
                            required
                            options={
                                data?.leaders?.map((res) => ({
                                    ...res,
                                    label: `${res?.user?.name} - ${res?.location?.name}`,
                                    value: res.id,
                                })) || []
                            }
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                            error={errors.department_manager_id?.message}
                            className="w-full"
                        />
                    )}
                />

                {/* Account */}
                <Controller
                    name="account_id"
                    control={control}
                    rules={{ required: "Account is required" }}
                    render={({ field }) => (
                        <Select
                            label="Account"
                            required
                            options={
                                data?.accounts?.map((res) => ({
                                    ...res,
                                    label: res.name,
                                    value: res.id,
                                })) || []
                            }
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                            error={errors.account_id?.message}
                        />
                    )}
                />

                {/* Department */}
                <Controller
                    name="department_id"
                    control={control}
                    rules={{ required: "Department is required" }}
                    render={({ field }) => (
                        <Select
                            label="Department"
                            required
                            options={
                                data?.departments?.map((res) => ({
                                    ...res,
                                    label: res.name,
                                    value: res.id,
                                })) || []
                            }
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                            error={errors.department_id?.message}
                            iconLeft={<Building2 size={14} />}
                        />
                    )}
                />

                {/* Position */}
                <Input
                    label="Position"
                    name="position"
                    required
                    {...register("position", {
                        required: "Position is required",
                    })}
                    iconLeft={<Briefcase size={14} />}
                    error={errors.position?.message}
                />

                {/* EOGS Email */}
                <Input
                    label="EOGS Email"
                    name="eogs_email"
                    required
                    placeholder="eogs.yourname@gmail.com"
                    type="email"
                    {...register("eogs_email", {
                        required: "EOGS Email is required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email format",
                        },
                    })}
                    iconLeft={<Mail size={14} />}
                    error={errors.eogs_email?.message}
                />

                {/* Employment Status */}
                <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Employment status is required" }}
                    render={({ field }) => (
                        <Select
                            label="Employment Status"
                            required
                            options={[
                                {
                                    label: "Probationary",
                                    value: "Probationary",
                                },
                                { label: "Regular", value: "Regular" },
                                { label: "AWOL", value: "AWOL" },
                                { label: "Contractual", value: "Contractual" },
                                {
                                    label: "End of Contract",
                                    value: "End of Contract",
                                },
                                { label: "EOPE", value: "EOPE" },
                                {
                                    label: "Extended Probationary",
                                    value: "Extended Probationary",
                                },
                                { label: "Resigned", value: "Resigned" },
                                { label: "Terminated", value: "Terminated" },
                                {
                                    label: "Trainee Fallout",
                                    value: "Trainee Fallout",
                                },
                            ]}
                            value={field.value}
                            onChange={(val) => field.onChange(val)}
                            error={errors.status?.message}
                        />
                    )}
                />

                <Button
                    type="submit"
                    variant="secondary"
                    loading={isSubmitting}
                >
                    SAVE CHANGES
                </Button>
            </div>
        </form>
    );
}
