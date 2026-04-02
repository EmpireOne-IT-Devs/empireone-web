import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import React from "react";
import { TbTrash } from "react-icons/tb";

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
            <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-2xl font-bold text-gray-800">
                    Working Experience
                </h2>
                <button
                    type="button"
                    onClick={() =>
                        appendExperience({
                            company_name: "",
                            position: "",
                            start_at: "",
                            end_at: "",
                            job_description: "",
                        })
                    }
                    className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-md font-bold hover:bg-blue-100 transition"
                >
                    + Add Job
                </button>
            </div>

            {experienceFields.map((field, index) => (
                <div
                    key={field.id}
                    className="p-4 border rounded-xl bg-gray-50 space-y-4 relative"
                >
                    <div className="flex flex-wrap w-full gap-4">
                        <div className="flex flex-1 flex-col">
                            <Input
                                label="Company Name"
                                name={`experiences.${index}.company_name`}
                                {...register(
                                    `experiences.${index}.company_name`,
                                    {
                                        required: "Required",
                                    },
                                )}
                                error={
                                    errors.experiences?.[index]?.company_name
                                }
                                placeholder="e.g. Acme Corp"
                            />
                        </div>
                        <div className="flex flex-1 flex-col">
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
                    </div>

                    <div className="flex flex-wrap w-full gap-4">
                        <div className="flex flex-1 flex-col">
                            <Input
                                label="Start Year"
                                name={`experiences.${index}.start_at`}
                                {...register(`experiences.${index}.start_at`, {
                                    required: "Required",
                                })}
                                type="number"
                                min={1900}
                                max={new Date().getFullYear()}
                                placeholder="YYYY"
                                className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                    errors.experiences?.[index]?.start_at
                                        ? "border-red-400"
                                        : "focus:ring-blue-400"
                                }`}
                            />
                        </div>
                        <div className="flex flex-1 flex-col">
                            <Input
                                label="End Year"
                                name={`experiences.${index}.end_at`}
                                {...register(`experiences.${index}.end_at`, {
                                    required: "Required",
                                    validate: (val) =>
                                        parseInt(val, 10) >=
                                            parseInt(
                                                watchedValues.experiences[index]
                                                    .start_at || 0,
                                                10,
                                            ) ||
                                        "End year must be after Start year",
                                })}
                                type="number"
                                min={1900}
                                max={new Date().getFullYear()}
                                placeholder="YYYY"
                                className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                    errors.experiences?.[index]?.end_at
                                        ? "border-red-400"
                                        : "focus:ring-blue-400"
                                }`}
                            />
                        </div>
                    </div>

                    <div className="flex items-end gap-4">
                        <div className="flex flex-col flex-1">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                Job Description
                            </label>
                            <textarea
                                rows={3}
                                {...register(
                                    `experiences.${index}.job_description`,
                                    { required: true },
                                )}
                                placeholder="Job description"
                                className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                    errors.experiences?.[index]?.job_description
                                        ? "border-red-400"
                                        : "focus:ring-blue-400"
                                }`}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={() => removeExperience(index)}
                            variant="danger"
                            outlined
                        >
                            <TbTrash className="text-lg" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
