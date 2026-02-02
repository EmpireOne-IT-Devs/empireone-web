import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import React, { useState } from "react";
import { Controller, get, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { create_users_service } from "@/app/services/user-service";

export default function AddUserSection({ data, onUserAdded }) {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const {
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            first_name: "",
            middle_name: "",
            last_name: "",
            suffix: "",
            email: "",
            gender: "",
            department_id: data.id || "",
            site: "",
            role: "",
        },
    });

    console.log("Department ID in AddUserSection:", data.id);

    async function onSubmit(data) {
        try {
            console.log("Form data:", data);

            // Convert role to integer based on User model constants
            const roleMap = {
                1: 1, // Admin
                2: 2, // Employee
                3: 3, // HR
                4: 4, // Manager
            };

            const formattedData = {
                ...data,
                role: parseInt(data.role),
            };

            const response = await create_users_service(formattedData);

            dispatch(
                setAlert({
                    type: "success",
                    title: "User Created Successfully!",
                    message: `The user has been created. Default password: ${response.data.default_password}`,
                    open: true,
                }),
            );
            
            // Call the callback to refresh the users data
            if (onUserAdded) {
                onUserAdded();
            }
            
            reset();
            setOpen(false);
        } catch (error) {
            console.error("Error creating user:", error);
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to create user",
                    message:
                        error.response?.data?.message ||
                        error.message ||
                        "Something went wrong",
                    open: true,
                }),
            );
        }
    }
    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm flex items-center space-x-1"
            >
                <span className="text-lg">+</span>
                <span>Add User</span>
            </button>
            <Modal
                width="max-w-4xl"
                className="rounded-lg"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Add New User"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Controller
                                name="first_name"
                                control={control}
                                rules={{
                                    required: "First name is required",
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="First Name"
                                        placeholder="e.g. John"
                                        error={errors.first_name?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="middle_name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Middle Name"
                                        placeholder="e.g. Michael"
                                        error={errors.middle_name?.message}
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Controller
                                name="last_name"
                                control={control}
                                rules={{
                                    required: "Last name is required",
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Last Name"
                                        placeholder="e.g. Doe"
                                        error={errors.last_name?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="suffix"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Suffix (Optional)"
                                        placeholder="e.g. Jr., Sr., III"
                                        error={errors.suffix?.message}
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                        message: "Invalid email address",
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Email Address"
                                        placeholder="e.g. john.doe@example.com"
                                        error={errors.email?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Gender"
                                        options={[
                                            {
                                                value: "",
                                                label: "Select Gender",
                                            },
                                            { value: "male", label: "Male" },
                                            {
                                                value: "female",
                                                label: "Female",
                                            },
                                            { value: "other", label: "Other" },
                                        ]}
                                        error={errors.gender?.message}
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* <Controller
                                name="department_id"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Department ID (Optional)"
                                        placeholder="e.g. 1"
                                        type="number"
                                        error={errors.department_id?.message}
                                    />
                                )}
                            /> */}
                            <Controller
                                name="site"
                                control={control}
                                rules={{
                                    required: "Site is required",
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Site"
                                        placeholder="e.g. New York"
                                        error={errors.site?.message}
                                    />
                                )}
                            />
                        </div>
                        <div className="mb-4">
                            <Controller
                                name="role"
                                control={control}
                                rules={{
                                    required: "Role is required",
                                }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Role Type"
                                        options={[
                                            { value: "", label: "Select Role" },
                                            {
                                                value: "1",
                                                label: "Administrator",
                                            },
                                            { value: "2", label: "Employee" },
                                            {
                                                value: "3",
                                                label: "HR",
                                            },
                                            {
                                                value: "4",
                                                label: "Manager",
                                            },
                                        ]}
                                        error={errors.role?.message}
                                    />
                                )}
                            />
                        </div>
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

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create User"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
