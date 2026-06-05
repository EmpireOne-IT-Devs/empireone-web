import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import Button from "@/app/_components/button";
import React from "react";
import { useForm } from "react-hook-form";
import { TbSearch } from "react-icons/tb";
import { router } from "@inertiajs/react";

export default function SearchSection({ onSearch }) {
    const params = new URLSearchParams(window.location.search);

    const { register, handleSubmit, watch } = useForm({
        defaultValues: {
            search: params.get("search") ?? "",
            status: params.get("status") ?? "all",
        },
    });
    const watchedValues = watch();

    const onSubmit = (data) => {
        // Build query parameters
        const queryParams = {};
        if (data.search) queryParams.search = data.search;
        if (data.status && data.status !== "all") queryParams.status = data.status;
        
        // Update URL
        router.get(window.location.pathname, queryParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onSuccess: () => {
                // Trigger data refresh in parent component
                if (onSearch) onSearch();
            },
        });
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white shadow-md rounded-md p-4 sm:p-5 border-2 flex flex-col sm:flex-row gap-2 my-3"
        >
            <div className="w-full sm:flex-1">
                <Input
                    iconLeft={<TbSearch className="text-xl" />}
                    label="Search by role or position..."
                    {...register("search")}
                />
            </div>
            <div className="w-full sm:w-auto">
                <Select
                    label="All Status"
                    options={[
                        { value: "all", label: "All Status" },
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
                <Button type="submit" className="w-full sm:w-auto">
                    Search
                </Button>
            </div>
        </form>
    );
}
