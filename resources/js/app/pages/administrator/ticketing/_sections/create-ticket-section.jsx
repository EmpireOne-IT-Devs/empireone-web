import Button from "@/app/_components/button";
import ImageUpload from "@/app/_components/image-upload";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import Wysiwyg from "@/app/_components/wysiwyg";
import { setAlert } from "@/app/redux/app-slice";
import { get_my_tickets_thunk } from "@/app/redux/tickets-thunk";
import { create_tickets_service } from "@/app/services/tickets-service";
import store from "@/app/store/store";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function CreateTicketSection() {
    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState("");
    const dispatch = useDispatch();
    const { tables } = useSelector((store) => store.tickets);
    const [categories, setCategories] = useState([]);
    const [timeframe,setTimeframe]=useState('')
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

    console.log("categoriessssss", categories);

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
            await store.dispatch(get_my_tickets_thunk());
            await dispatch(
                setAlert({
                    type: "success",
                    title: "Ticket Created Successfully!",
                }),
            );
            reset();
            setOpen(false);
        } catch (error) {}
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <Button  onClick={() => setOpen(true)}>CREATE TICKET</Button>
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
                                        options={tables?.departments?.map(
                                            (res) => ({
                                                ...res,
                                                label: res.name,
                                                value: res.id,
                                            }),
                                        )}
                                        onSelect={(e) => setCategories(e)}
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
                                        disabled={categories.length == 0}
                                        label="Select Category"
                                        options={categories?.categories?.map(
                                            (res) => ({
                                                label: res.name,
                                                value: res.id,
                                            }),
                                        )}
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
                                        options={tables?.locations.map(
                                            (res) => ({
                                                label: res.name,
                                                value: res.id,
                                            }),
                                        )}
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
                                        options={tables?.sites.map((res) => ({
                                            label: res.name,
                                            value: res.id,
                                        }))}
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
                                            {
                                                value: "Low Priority",
                                                label: "Low Priority",
                                                timeframe: "72 Hours",
                                            },
                                            {
                                                value: "Medium Priority",
                                                label: "Medium Priority",
                                                timeframe: "48 Hours",
                                            },
                                            {
                                                value: "High Priority",
                                                label: "High Priority",
                                                timeframe: "24 Hours",
                                            },
                                            {
                                                value: "Critical Priority",
                                                label: "Critical Priority",
                                                timeframe: "15 Minutes",
                                            },
                                        ]}
                                        onSelect={(e)=>setTimeframe(e.timeframe)}
                                        error={errors.urgent_type}
                                        {...field} // passes value & onChange
                                    />
                                )}
                            />
                            <Input
                                label={timeframe??"Resolution Timeframe"}
                                name="timeframe"
                                value={timeframe}
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
