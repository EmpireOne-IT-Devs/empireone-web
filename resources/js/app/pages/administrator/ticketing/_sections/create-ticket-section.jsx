import Button from "@/app/_components/button";
import ImageUpload from "@/app/_components/image-upload";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import Wysiwyg from "@/app/_components/wysiwyg";
import { setAlert } from "@/app/redux/app-slice";
import { create_tickets_service } from "@/app/services/tickets-service";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

export default function CreateTicketSection() {
    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState("");
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            department_id: "",
            ticket_category_id: "",
            urgent_type: "",
            details: "",
            image: "",
        },
    });

    console.log("details", details);

    async function onSubmit(data) {
        if (details == "") return "error";
        try {
            const formData = new FormData();
            const { image, ...fields } = {
                ...data,
                details: details,
            };
            console.log("fields", fields);
            Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Append image if exists
            if (image?.length) {
                formData.append("image", image[0]);
            }
            await create_tickets_service(formData);
            await dispatch(
                setAlert({
                    type: "success",
                    title: "Ticket Created Successfully!",
                })
            );
            reset();
            setOpen(false);
        } catch (error) {}
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <Button onClick={() => setOpen(true)}>CREATE TICKET</Button>
            <Modal
                isOpen={open}
                onClose={() => setOpen(false)}
                width="max-w-4xl"
                title="Create Ticket Section"
            >
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        <div className="w-2/6 flex flex-col gap-3">
                            <Controller
                                name="department_id"
                                control={control}
                                rules={{ required: "Department is required" }}
                                render={({ field }) => (
                                    <Select
                                        label="Select Department"
                                        options={[
                                            { value: 1, label: "Hello" },
                                            { value: 2, label: "World" },
                                        ]}
                                        error={errors.department_id}
                                        {...field} // passes value & onChange
                                    />
                                )}
                            />
                            <Controller
                                name="ticket_category_id"
                                control={control}
                                rules={{ required: "Category is required" }}
                                render={({ field }) => (
                                    <Select
                                        label="Select Category"
                                        options={[
                                            { value: 1, label: "Hello" },
                                            { value: 2, label: "World" },
                                        ]}
                                        error={errors.ticket_category_id}
                                        {...field} // passes value & onChange
                                    />
                                )}
                            />
                            <Controller
                                name="location_id"
                                control={control}
                                rules={{ required: "Location is required" }}
                                render={({ field }) => (
                                    <Select
                                        label="Select Location"
                                        options={[
                                            { value: 1, label: "San Carlos" },
                                            { value: 2, label: "Carcar" },
                                        ]}
                                        error={errors.location_id}
                                        {...field} // passes value & onChange
                                    />
                                )}
                            />
                            <Controller
                                name="site_id"
                                control={control}
                                rules={{ required: "Site is required" }}
                                render={({ field }) => (
                                    <Select
                                        label="Select Site"
                                        options={[
                                            { value: 1, label: "Site 1" },
                                            { value: 2, label: "Site 2" },
                                            { value: 3, label: "Site 3" },
                                        ]}
                                        error={errors.site_id}
                                        {...field} // passes value & onChange
                                    />
                                )}
                            />
                            <Controller
                                name="urgent_type"
                                control={control}
                                rules={{ required: "Urgent Type is required" }}
                                render={({ field }) => (
                                    <Select
                                        label="Select Urgent Type"
                                        options={[
                                            { value: 1, label: "Hello" },
                                            { value: 2, label: "World" },
                                        ]}
                                        error={errors.urgent_type}
                                        {...field} // passes value & onChange
                                    />
                                )}
                            />
                            <Input
                                label="Resolution Timeframe"
                                name="timeframe"
                                disabled
                            />
                        </div>
                        <div className="flex-1">
                            <Wysiwyg
                                label="Ticket Details"
                                onChange={setDetails}
                                error={
                                    details ? "" : "Ticket Details is Required"
                                }
                            />
                        </div>
                    </div>
                    <div className="flex w-full ">
                        <ImageUpload
                            label="Upload Image"
                            {...register("image")}
                            error={errors.image}
                        />
                        {/* <ImageUpload
                            label="Upload Image"
                            {...register("image", {
                                required: "Image is required",
                                validate: {
                                    lessThan5MB: (files) =>
                                        files[0]?.size < 5000000 ||
                                        "Max size 5MB",
                                    acceptedFormats: (files) =>
                                        ["image/jpeg", "image/png"].includes(
                                            files[0]?.type
                                        ) || "Only PNG/JPG allowed",
                                },
                            })}
                            error={errors.image}
                        /> */}
                    </div>
                    <Button
                        loading={isSubmitting}
                        type="submit"
                        className="mt-5"
                    >
                        SUBMIT
                    </Button>
                </div>
            </Modal>
        </form>
    );
}
