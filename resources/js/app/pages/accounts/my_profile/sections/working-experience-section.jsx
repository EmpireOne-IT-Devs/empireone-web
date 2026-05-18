import Input from "@/app/_components/input";
import React, { useState } from "react";
import {
    TbTrash,
    TbPlus,
    TbPencil,
    TbCheck,
    TbBuilding,
    TbCalendar,
    TbBriefcase,
} from "react-icons/tb";

export default function WorkingExperienceSection({
    register,
    errors,
    appendExperience,
    experienceFields,
    removeExperience,
    watchedValues,
    submitForm,
}) {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleAdd = () => {
        const newIndex = experienceFields.length;
        appendExperience({
            company_name: "",
            position: "",
            start_date: "",
            end_date: "",
            job_description: "",
        });
        setExpandedIndex(newIndex);
    };

    const handleSave = async () => {
        setExpandedIndex(null);
        await submitForm();
    };

    const handleRemove = async (index) => {
        removeExperience(index);
        setExpandedIndex(null);
        await submitForm();
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-purple-100">
                <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                        Working Experience
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {experienceFields.length} work experience
                        {experienceFields.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity shadow-sm w-full sm:w-auto justify-center"
                >
                    <TbPlus size={15} /> Add job
                </button>
            </div>

            {/* Cards list */}
            <div className="space-y-3 overflow-auto max-h-[400px] pr-1">
                {experienceFields.map((field, index) => {
                    const exp = watchedValues?.experiences?.[index];
                    const isExpanded = expandedIndex === index;

                    return (
                        <div key={field.id}>
                            {!isExpanded ? (
                                /* Collapsed card */
                                <div className="flex items-start gap-4 p-4 bg-white border border-purple-100 rounded-2xl hover:border-purple-200 hover:shadow-sm transition-all group">
                                    {/* Icon */}
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mt-0.5">
                                        <TbBuilding
                                            size={18}
                                            className="text-purple-500"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">
                                            {exp?.position || (
                                                <span className="text-gray-400 font-normal italic">
                                                    No position
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {exp?.company_name || (
                                                <span className="italic">
                                                    No company
                                                </span>
                                            )}
                                        </p>
                                        {exp?.job_description && (
                                            <p className="text-xs text-gray-400 truncate mt-0.5">
                                                {exp.job_description}
                                            </p>
                                        )}
                                        {(exp?.start_date || exp?.end_date) && (
                                            <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                                                <TbCalendar size={11} />
                                                {exp?.start_date} –{" "}
                                                {exp?.end_date || "Present"}
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setExpandedIndex(index)
                                            }
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-purple-400 bg-purple-50 hover:bg-purple-100 hover:text-purple-600 transition"
                                            title="Edit"
                                        >
                                            <TbPencil size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(index)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-400 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 transition"
                                            title="Remove"
                                        >
                                            <TbTrash size={14} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Expanded form */
                                <div className="border-2 border-violet-300 rounded-2xl bg-violet-50/40 overflow-hidden">
                                    {/* Form header bar */}
                                    <div className="flex items-center gap-2.5 px-5 py-3.5 bg-white border-b border-violet-100">
                                        <div className="w-6 h-6 rounded-md bg-violet-100 flex items-center justify-center">
                                            <TbBriefcase
                                                size={13}
                                                className="text-violet-600"
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-violet-700">
                                            Editing job
                                        </span>
                                        <span className="ml-auto text-xs text-violet-400 bg-violet-100 px-2.5 py-0.5 rounded-full font-medium">
                                            Entry {index + 1}
                                        </span>
                                    </div>

                                    <div className="p-5 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Company Name"
                                                name={`experiences.${index}.company_name`}
                                                {...register(
                                                    `experiences.${index}.company_name`,
                                                    { required: "Required" },
                                                )}
                                                error={
                                                    errors.experiences?.[index]
                                                        ?.company_name
                                                }
                                                placeholder="e.g. Acme Corp"
                                            />
                                            <Input
                                                label="Position"
                                                name={`experiences.${index}.position`}
                                                {...register(
                                                    `experiences.${index}.position`,
                                                    { required: "Required" },
                                                )}
                                                error={
                                                    errors.experiences?.[index]
                                                        ?.position
                                                }
                                                placeholder="e.g. Developer"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Input
                                                label="Start Year"
                                                name={`experiences.${index}.start_date`}
                                                {...register(
                                                    `experiences.${index}.start_date`,
                                                    { required: "Required" },
                                                )}
                                                type="number"
                                                min={1900}
                                                max={new Date().getFullYear()}
                                                placeholder="YYYY"
                                                error={
                                                    errors.experiences?.[index]
                                                        ?.start_date
                                                }
                                            />
                                            <Input
                                                label="End Year"
                                                name={`experiences.${index}.end_date`}
                                                {...register(
                                                    `experiences.${index}.end_date`,
                                                    {
                                                        required: "Required",
                                                        validate: (val) =>
                                                            parseInt(val, 10) >=
                                                                parseInt(
                                                                    watchedValues
                                                                        ?.experiences?.[
                                                                        index
                                                                    ]
                                                                        ?.start_date ||
                                                                        0,
                                                                    10,
                                                                ) ||
                                                            "Must be after Start year",
                                                    },
                                                )}
                                                type="number"
                                                min={1900}
                                                max={new Date().getFullYear()}
                                                placeholder="YYYY"
                                                error={
                                                    errors.experiences?.[index]
                                                        ?.end_date
                                                }
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide ml-0.5">
                                                Job Description
                                            </label>
                                            <textarea
                                                rows={3}
                                                {...register(
                                                    `experiences.${index}.job_description`,
                                                    { required: "Required" },
                                                )}
                                                placeholder="Describe your role and key achievements..."
                                                className={`p-3 border rounded-xl outline-none focus:ring-2 transition-all resize-none text-sm ${
                                                    errors.experiences?.[index]
                                                        ?.job_description
                                                        ? "border-red-300 focus:ring-red-100 bg-red-50/30"
                                                        : "border-gray-200 focus:ring-violet-200 focus:border-violet-400 bg-white"
                                                }`}
                                            />
                                            {errors.experiences?.[index]
                                                ?.job_description && (
                                                <span className="text-xs text-red-500 ml-0.5">
                                                    Required
                                                </span>
                                            )}
                                        </div>

                                        {/* Footer actions */}
                                        <div className="flex justify-between items-center pt-2 border-t border-violet-100">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemove(index)
                                                }
                                                className="flex items-center gap-1.5 text-sm text-rose-500 hover:text-rose-700 px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition"
                                            >
                                                <TbTrash size={14} /> Remove
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleSave}
                                                className="flex items-center gap-1.5 text-sm font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                                            >
                                                <TbCheck size={15} /> Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Empty state */}
            {experienceFields.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-purple-100 rounded-2xl text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3">
                        <TbBriefcase size={22} className="text-purple-300" />
                    </div>
                    <p className="text-gray-400 text-sm">
                        No work experience added yet.
                    </p>
                    <p className="text-gray-300 text-xs mt-1">
                        Click "Add job" to get started.
                    </p>
                </div>
            )}
        </div>
    );
}
