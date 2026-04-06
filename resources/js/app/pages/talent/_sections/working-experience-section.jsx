import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import React from "react";
import { TbTrash } from "react-icons/tb";

export default function WorkingExperienceSection({
    register,
    errors,
    nextStep,
    prevStep,
    appendExperience,
    experienceFields,
    removeExperience,
    watchedValues,
}) {
    return (
        <div className="space-y-6">
            {/* Header: Stacks title and button on extra small screens */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-2 gap-2">
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
                    className="text-sm bg-blue-100 text-blue-600 px-3 py-2 rounded-md font-bold hover:bg-blue-200 transition w-fit"
                >
                    + Add Job
                </button>
            </div>

            {experienceFields.map((field, index) => (
                <div
                    key={field.id}
                    className="p-4 border rounded-xl bg-gray-50 space-y-4 relative"
                >
                    {/* Row 1: Company and Position */}
                    <div className="flex flex-wrap w-full gap-4">
                        <div className="flex flex-col w-full md:flex-1">
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
                        <div className="flex flex-col w-full md:flex-1">
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

                    {/* Row 2: Years */}
                    <div className="flex flex-wrap w-full gap-4">
                        <div className="flex flex-col w-full md:flex-1">
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
                        <div className="flex flex-col w-full md:flex-1">
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

                    {/* Row 3: Description */}
                    <div className="flex flex-col w-full">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1">
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
                            placeholder="Describe your responsibilities"
                            className={`p-3 border rounded-lg outline-none focus:ring-2 w-full ${
                                errors.experiences?.[index]?.job_description
                                    ? "border-red-400"
                                    : "focus:ring-blue-400"
                            }`}
                        />
                    </div>

                    {/* Action Row */}
                    <div className="flex justify-end pt-2">
                        <Button
                            onClick={() => removeExperience(index)}
                            variant="danger"
                            outlined
                            className="flex items-center gap-2"
                        >
                            <TbTrash className="text-lg" />
                            <span className="md:hidden text-sm font-bold">
                                Remove
                            </span>
                        </Button>
                    </div>
                </div>
            ))}

            {/* Footer Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                    type="button"
                    outlined
                    variant="secondary"
                    onClick={prevStep}
                    className="w-full sm:w-1/2"
                >
                    Back
                </Button>
                <Button
                    outlined
                    type="button"
                    onClick={nextStep}
                    className="w-full sm:w-1/2"
                >
                    Continue To Skills
                </Button>
            </div>
        </div>
    );
}
