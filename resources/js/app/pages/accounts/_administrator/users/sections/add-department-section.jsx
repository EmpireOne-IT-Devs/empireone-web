import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import { setAlert } from "@/app/redux/app-slice";
import { create_department_service_thunk } from "@/app/redux/department-slice";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

export default function AddDepartmentSection() {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const {
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: "",
        },
    });

    async function onSubmit(data) {
        try {
            console.log("Form data:", data);
            await dispatch(create_department_service_thunk(data)).unwrap();
            dispatch(
                setAlert({
                    type: "success",
                    title: "Department Created Successfully!",
                    message:
                        "The department has been created and is ready for review.",
                    open: true,
                }),
            );
            reset();
            setOpen(false);
        } catch (error) {
            console.error("Error creating department:", error);
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to create department",
                    message: error.message || "Something went wrong",
                    open: true,
                }),
            );
            setOpen(false);
        }
    }
    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
                <span className="text-xl">+</span>
                <span>Add Department</span>
            </button>
            <Modal
                width="max-w-4xl"
                isOpen={open}
                onClose={() => setOpen(false)}
                title="Create New Department"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <div className="mb-4">
                            <Controller
                                name="name"
                                control={control}
                                rules={{
                                    required: "Department name is required",
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label="Department Name"
                                        placeholder="e.g. Human Resources"
                                        error={errors.name?.message}
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
                            {isSubmitting ? "Creating..." : "Create Department"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
