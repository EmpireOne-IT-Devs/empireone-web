import { setSearchApplicantStatus } from "@/app/redux/job-posting-slice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const StatusSelect = ({ label, value, options, onChange }) => (
    <div className="relative min-w-[180px]">
        <label className="absolute -top-2 left-2 bg-white px-1 text-[11px] font-medium text-blue-600 z-10">
            {label}
        </label>

        <div className="relative">
            <select
                value={value || "All"}
                onChange={onChange}
                className="block w-full px-3 py-2.5 text-sm text-gray-700 bg-transparent border border-blue-500 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
            >
                {options.map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

export default function SearchStatusSection() {
    const dispatch = useDispatch();
    const { search_applicant_status } = useSelector(
        (store) => store.job_postings,
    );

    const screening_status = [
        "All",
        "New",
        "Conducted",
        "Screened Passed",
        "Screened Failed",
        "No Response",
    ];
    const interview_status = [
        "All",
        "Scheduled",
        "Not Scheduled",
        "Passed",
        "Failed",
        "No Show",
    ];
    const final_status = [
        "All",
        "Passed",
        "Failed",
        "Withdrawn",
        "Pooled",
        "Accepted Job Offer",
        "Hired",
        "Rejected",
        "No Show",
    ];

    const handleStatusChange = (key, value) => {
        dispatch(
            setSearchApplicantStatus({
                ...search_applicant_status,
                [key]: value === "All" ? "" : value,
            }),
        );
    };

    return (
        <div className="p-6 border-b border-gray-100 flex justify-end items-center bg-white">
            <div className="flex flex-wrap gap-4">
                <StatusSelect
                    label="Screening Status"
                    value={search_applicant_status.screening_status}
                    options={screening_status}
                    onChange={(e) =>
                        handleStatusChange("screening_status", e.target.value)
                    }
                />

                <StatusSelect
                    label="Interview Status"
                    value={search_applicant_status.interview_status}
                    options={interview_status}
                    onChange={(e) =>
                        handleStatusChange("interview_status", e.target.value)
                    }
                />

                <StatusSelect
                    label="Final Status"
                    value={search_applicant_status.final_status}
                    options={final_status}
                    onChange={(e) =>
                        handleStatusChange("final_status", e.target.value)
                    }
                />
            </div>
        </div>
    );
}
