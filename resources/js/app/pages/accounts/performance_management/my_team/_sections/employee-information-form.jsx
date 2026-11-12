import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
    FiBriefcase as Briefcase,
    FiHome as Building2,
    FiHash as Hash,
    FiMail as Mail,
} from "react-icons/fi";

import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";

import { setAlert } from "@/app/redux/app-slice";
import { get_employees_thunk } from "@/app/redux/employee-relation-thunk";
import { update_employee_information_service } from "@/app/services/account-service";
import store from "@/app/store/store";
import { get_my_team_thunk } from "@/app/redux/department-thunk";

export default function EmployeeInformationForm({ props_data, open, setOpen }) {
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.app);
    const EMPLOYMENT_STATUS_OPTIONS = [
        { label: "Probationary", value: "Probationary" },
        { label: "Regular", value: "Regular" },
    ];
    console.log("props_datasssss", data);
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: {} });

    // Memoized options for drop-down performance
    const leaderOptions = useMemo(
        () =>
            data?.leaders?.map((item) => ({
                label: item?.user?.name || "",
                value: item.id,
            })) || [],
        [data?.leaders],
    );

    const accountOptions = useMemo(
        () =>
            data?.accounts?.map((item) => ({
                label: item.name,
                value: item.id,
            })) || [],
        [data?.accounts],
    );

    const departmentOptions = useMemo(
        () =>
            data?.departments?.map((item) => ({
                label: item.name,
                value: item.id,
            })) || [],
        [data?.departments],
    );

    useEffect(() => {
        if (open && props_data) {
            reset({
                ...props_data,
                started_at: props_data?.started_at
                    ? moment(props_data.started_at).format("YYYY-MM-DD")
                    : "",
                skills: data?.user?.skills,
                experiences: data?.user?.working_experience,
            });
        }
    }, [open, props_data, data?.user, reset]);

    const onSubmit = async (formData) => {
        try {
            await update_employee_information_service(formData);
            await store.dispatch(get_my_team_thunk());

            dispatch(
                setAlert({
                    type: "success",
                    title: "Information saved successfully!",
                    message: "Your profile has been updated.",
                    open: true,
                }),
            );
            setOpen(false);
        } catch (error) {
            console.error("Failed to update employee:", error);
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-3 w-full px-3"
            >
                <div className="grid grid-cols-1 gap-x-6 gap-y-4">
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select
                                label="Employment Status"
                                options={EMPLOYMENT_STATUS_OPTIONS}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    <Controller
                        name="e_r_leader_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Immediate Supervisor"
                                options={leaderOptions}
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.e_r_leader_id}
                            />
                        )}
                    />

                    <Controller
                        name="department_manager_id"
                        control={control}
                        rules={{ required: "Department Manager is required" }}
                        render={({ field }) => (
                            <Select
                                label="Next Level Manager"
                                required
                                options={leaderOptions}
                                value={field.value}
                                onChange={(val) => field.onChange(val)}
                                error={errors.department_manager_id?.message}
                                className="w-full"
                            />
                        )}
                    />

                    <Controller
                        name="account_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Account"
                                options={accountOptions}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        name="department_id"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Department"
                                options={departmentOptions}
                                value={field.value}
                                onChange={field.onChange}
                                iconLeft={<Building2 size={14} />}
                            />
                        )}
                    />

                    <Input
                        label="EOGS Email"
                        name="eogs_email"
                        placeholder="eogs.yourname@gmail.com"
                        type="email"
                        {...register("eogs_email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                            },
                        })}
                        iconLeft={<Mail size={14} />}
                        error={errors.eogs_email}
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
        </>
    );
}
