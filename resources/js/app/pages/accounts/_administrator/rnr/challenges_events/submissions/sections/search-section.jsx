import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import React, { useMemo, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { TbSearch } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import { export_reward_challenge_submissions_service } from "@/app/services/engagement-service";

export default function SearchSection({ filters, setFilters }) {
    const dispatch = useDispatch();
    const { challengeSubmissions } = useSelector((state) => state.engagement);
    const [exporting, setExporting] = useState(false);

    const challengeOptions = useMemo(() => {
        const map = new Map();
        challengeSubmissions.forEach((submission) => {
            if (submission.challenge?.id && !map.has(submission.challenge.id)) {
                map.set(submission.challenge.id, submission.challenge.title);
            }
        });
        return Array.from(map, ([value, label]) => ({ value, label }));
    }, [challengeSubmissions]);

    // Derive the location list from the actual employees who submitted proof
    // (same approach as the post_event_survey export) instead of the
    // generic Site master list, which can contain unrelated/duplicate entries.
    const locationOptions = useMemo(() => {
        const map = new Map();
        challengeSubmissions.forEach((submission) => {
            const locationId = submission.employee?.location_id;
            const locationName = submission.employee?.location_name;
            if (locationId && locationName && !map.has(locationId)) {
                map.set(locationId, locationName);
            }
        });

        return [
            { value: "", label: "All Locations" },
            ...Array.from(map, ([value, label]) => ({ value, label })).sort(
                (a, b) => a.label.localeCompare(b.label),
            ),
        ];
    }, [challengeSubmissions]);

    const statusOptions = [
        { value: "", label: "All Status" },
        { value: "submitted", label: "Pending Review" },
        { value: "approved", label: "Approved" },
        { value: "declined", label: "Declined" },
    ];

    const safeFilters = {
        status: filters?.status ?? "",
        challenge_id: filters?.challenge_id ?? "",
        location_id: filters?.location_id ?? "",
        search: filters?.search ?? "",
    };

    const handleFilterChange = (key, value) => {
        setFilters((current) => ({
            ...current,
            [key]: value ?? "",
        }));
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const params = {};
            if (safeFilters.status) params.status = safeFilters.status;
            if (safeFilters.challenge_id) {
                params.challenge_id = safeFilters.challenge_id;
            }
            if (safeFilters.location_id) params.location_id = safeFilters.location_id;
            if (safeFilters.search.trim())
                params.search = safeFilters.search.trim();

            const response =
                await export_reward_challenge_submissions_service(params);
            const blob = new Blob([response.data], {
                type: "application/vnd.ms-excel;charset=utf-8;",
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            link.href = url;
            link.setAttribute(
                "download",
                `challenge-submissions-${timestamp}.xls`,
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Export failed",
                    message:
                        error?.response?.data?.message ??
                        "Unable to export challenge submissions.",
                    open: true,
                }),
            );
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="bg-white shadow-sm p-5 border-2 rounded-2xl flex flex-wrap gap-2 my-3">
            <div className="flex-1">
                <Input
                    iconLeft={<TbSearch className="text-xl" />}
                    label="Search employees..."
                    name="search"
                    value={safeFilters.search}
                    onChange={(event) =>
                        handleFilterChange("search", event.target.value)
                    }
                />
            </div>

            <div className="w-full sm:w-44">
                <Select
                    label="All Status"
                    options={statusOptions}
                    value={safeFilters.status}
                    onChange={(value) => handleFilterChange("status", value)}
                />
            </div>

            <div className="w-full sm:w-52">
                <Select
                    label="All Challenges"
                    options={[
                        { value: "", label: "All Challenges" },
                        ...challengeOptions,
                    ]}
                    value={safeFilters.challenge_id}
                    onChange={(value) =>
                        handleFilterChange("challenge_id", value)
                    }
                />
            </div>

            <div className="w-full sm:w-44">
                <Select
                    name="location_filter"
                    label="Location"
                    options={locationOptions}
                    value={safeFilters.location_id}
                    onChange={(value) => handleFilterChange("location_id", value)}
                />
            </div>
            <div>
                <Button
                    variant="engagement"
                    outlined
                    onClick={handleExport}
                    loading={exporting}
                    disabled={exporting}
                >
                    <FaDownload className="text-lg mr-2" />
                    Export
                </Button>
            </div>
        </div>
    );
}
