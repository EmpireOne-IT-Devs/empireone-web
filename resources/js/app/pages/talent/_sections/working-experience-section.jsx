import React from "react";

export default function WorkingExperienceSection({
    register,
    errors,
    nextStep,
    prevStep,
    appendExperience,
    experienceFields,
    removeExperience,
    watchedValues 
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
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md font-bold hover:bg-blue-100 transition"
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
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                Company Name
                            </label>
                            <input
                                {...register(
                                    `experiences.${index}.company_name`,
                                    {
                                        required: "Required",
                                    },
                                )}
                                placeholder="e.g. Acme Corp"
                                className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                    errors.experiences?.[index]?.company_name
                                        ? "border-red-400"
                                        : "focus:ring-blue-400"
                                }`}
                            />
                        </div>
                        <div className="flex flex-1 flex-col">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                Position
                            </label>
                            <input
                                {...register(`experiences.${index}.position`, {
                                    required: "Required",
                                })}
                                placeholder="e.g. Developer"
                                className={`p-3 border rounded-lg outline-none focus:ring-2 ${
                                    errors.experiences?.[index]?.position
                                        ? "border-red-400"
                                        : "focus:ring-blue-400"
                                }`}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap w-full gap-4">
                        <div className="flex flex-1 flex-col">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                Start Year
                            </label>
                            <input
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
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                                End Year
                            </label>
                            <input
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
                        <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="text-red-500 hover:text-red-700 font-bold text-sm mb-2"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
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
            >
                + Add Job
            </button>

            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={prevStep}
                    className="w-1/2 text-gray-500 font-bold hover:bg-gray-300 bg-gray-100 py-3 rounded-lg transition"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={nextStep}
                    className="w-1/2 bg-blue-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-blue-700 transition"
                >
                    Continue To Skill
                </button>
            </div>
        </div>
    );
}
