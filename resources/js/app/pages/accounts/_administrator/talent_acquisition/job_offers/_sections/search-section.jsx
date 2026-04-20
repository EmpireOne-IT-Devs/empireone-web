import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { router } from "@inertiajs/react";
import React from "react";
import { useForm } from "react-hook-form";
import { TbSearch } from "react-icons/tb";

export default function SearchSection() {
    const params = new URLSearchParams(window.location.search);

    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            search: params.get("search") ?? "",
            role: params.get("role") ?? "",
            status: params.get("status") ?? "Pending",
        },
    });
    const watchedValues = watch();

    const onSubmit = (data) => {
        const query = new URLSearchParams(data).toString();
        router.visit(`/accounts/administrator/talent_acquisition/job_offers?${query}`);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white shadow-sm p-4 sm:p-5 border-2 rounded-2xl flex flex-col sm:flex-row gap-2 my-3"
        >
            <div className="w-full sm:flex-1">
                <Input
                    iconLeft={<TbSearch className="text-xl" />}
                    label="Search applicants..."
                    {...register("search")}
                />
            </div>

            <div className="w-full sm:w-auto">
                <Select
                    label="All Role"
                    options={[
                        { value: "", label: "All Role" },
                        { value: "Agent", label: "Agent" },
                        { value: "Support", label: "Support" },
                        { value: "Manager", label: "Manager" },
                    ]}
                    value={watchedValues.role}
                    {...register("role")}
                />
            </div>

            <div className="w-full sm:w-auto">
                <Select
                    label="All Status"
                    options={[
                        { value: "", label: "All Status" },
                        { value: "Pending", label: "Pending" },
                        { value: "Accepted", label: "Accepted" },
                        { value: "Declined", label: "Declined" },
                        { value: "Re-Offered", label: "Re-Offered" },
                    ]}
                    value={watchedValues.status}
                    {...register("status")}
                />
            </div>

            <div className="flex items-end w-full sm:w-auto">
                <Button type="submit" className="w-full sm:w-auto">Search</Button>
            </div>
        </form>
    );
}