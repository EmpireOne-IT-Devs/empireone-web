import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import React from "react";
import { TbTrash, TbPlus } from "react-icons/tb";

export default function WorkingExperienceSection({
    register,
    errors,
    appendExperience,
    experienceFields,
    removeExperience,
    watchedValues,
}) {
    return (
        <div className="space-y-6">
            {/* Header: Responsive flex direction for very small screens */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 gap-3">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                    Working Experience
                </h2>
                <button
                    type="button"
                    onClick={() =>
                        appendExperience({
                            company_name: "",
                            position: "",
                            start_date: "",
                            end_date: "",
                            job_description: "",
                        })
                    }
                    className="flex items-center gap-1 text-sm bg-blue-100 text-blue-600 px-3 py-1.5 rounded-md font-bold hover:bg-blue-200 transition w-full sm:w-auto justify-center"
                >
                    <TbPlus size={16} /> Add Job
                </button>
            </div>

            {experienceFields.map((field, index) => (
                <div
                    key={field.id}
                    className="p-4 border rounded-xl bg-gray-50 space-y-4 relative"
                >
                    {/* Grid for Company & Position: Stacks on mobile, side-by-side on tablet+ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Company Name"
                            name={`experiences.${index}.company_name`}
                            {...register(`experiences.${index}.company_name`, {
                                required: "Required",
                            })}
                            error={errors.experiences?.[index]?.company_name}
                            placeholder="e.g. Acme Corp"
                        />
                        <Input
                            label="Position"
                            name={`experiences.${index}.position`}
                            {...register(`experiences.${index}.position`, {
                                required: "Required",
                            })}
                            error={errors.experiences?.[index]?.position}
                            placeholder="e.g. Developer"
                        />
                    </div>

                    {/* Grid for Dates: Stacks on mobile, side-by-side on tablet+ */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Start Year"
                            name={`experiences.${index}.start_date`}
                            {...register(`experiences.${index}.start_date`, {
                                required: "Required",
                            })}
                            type="number"
                            min={1900}
                            max={new Date().getFullYear()}
                            placeholder="YYYY"
                            error={errors.experiences?.[index]?.start_date}
                        />
                        <Input
                            label="End Year"
                            name={`experiences.${index}.end_date`}
                            {...register(`experiences.${index}.end_date`, {
                                required: "Required",
                                validate: (val) =>
                                    parseInt(val, 10) >=
                                        parseInt(
                                            watchedValues?.experiences?.[index]
                                                ?.start_date || 0,
                                            10,
                                        ) || "Must be after Start year",
                            })}
                            type="number"
                            min={1900}
                            max={new Date().getFullYear()}
                            placeholder="YYYY"
                            error={errors.experiences?.[index]?.end_date}
                        />
                    </div>

                    {/* Job Description: Stays full width */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                            Job Description
                        </label>
                        <textarea
                            rows={3}
                            {...register(
                                `experiences.${index}.job_description`,
                                {
                                    required: "Required",
                                },
                            )}
                            placeholder="Describe your role..."
                            className={`p-3 border rounded-lg outline-none focus:ring-2 transition-all ${
                                errors.experiences?.[index]?.job_description
                                    ? "border-red-400 focus:ring-red-100"
                                    : "border-gray-200 focus:ring-blue-400"
                            }`}
                        />
                        {errors.experiences?.[index]?.job_description && (
                            <span className="text-xs text-red-500 ml-1">
                                Required
                            </span>
                        )}
                    </div>

                    {/* Trash Button: Responsive width on mobile */}
                    <div className="flex justify-end pt-2">
                        <Button
                            onClick={() => removeExperience(index)}
                            variant="danger"
                            outlined
                            className="w-full md:w-auto flex justify-center py-2"
                        >
                            <TbTrash className="text-xl" />
                            <span className="md:hidden ml-2 font-bold">
                                Remove Experience
                            </span>
                        </Button>
                    </div>
                </div>
            ))}

            {experienceFields.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed rounded-xl text-gray-400">
                    No work experience added yet.
                </div>
            )}
        </div>
    );
}
