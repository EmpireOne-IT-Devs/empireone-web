import Input from "@/app/_components/input";
import React, { useState } from "react";
import { TbTrash, TbPlus, TbPencil, TbCheck, TbCode } from "react-icons/tb";

const getProficiencyLabel = (pct) => {
    const val = parseInt(pct, 10) || 0;
    if (val <= 33)
        return {
            label: "Beginner",
            color: "text-amber-700 bg-amber-50",
            barColor: "from-amber-300 to-amber-400",
        };
    if (val <= 66)
        return {
            label: "Intermediate",
            color: "text-blue-700 bg-blue-50",
            barColor: "from-blue-400 to-blue-500",
        };
    return {
        label: "Expert",
        color: "text-emerald-700 bg-emerald-50",
        barColor: "from-emerald-400 to-emerald-500",
    };
};

export default function SkillsSection({
    register,
    errors,
    appendSkill,
    skillFields,
    watch,
    removeSkill,
    submitForm,
}) {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const handleAdd = () => {
        const newIndex = skillFields.length;
        appendSkill({ skill: "", percentage: 0 });
        setExpandedIndex(newIndex);
    };

    const handleSave = async () => {
        setExpandedIndex(null);
        await submitForm();
    };

    const handleRemove = async (index) => {
        removeSkill(index);
        setExpandedIndex(null);
        await submitForm();
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex justify-between items-start gap-3 pb-4 border-b border-orange-100">
                <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                        Skills
                    </h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {skillFields.length} skill
                        {skillFields.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleAdd}
                    className="flex mt-2 items-center gap-2 text-sm font-medium bg-orange-500 text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
                >
                    <TbPlus size={15} />
                    Add skill
                </button>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2.5 overflow-auto max-h-[400px] pr-1">
                {skillFields.map((field, index) => {
                    const skillName = watch(`skills.${index}.skill`);
                    const pct = watch(`skills.${index}.percentage`) || 0;
                    const { label, color, barColor } = getProficiencyLabel(pct);
                    const isExpanded = expandedIndex === index;

                    return (
                        <div key={field.id}>
                            {!isExpanded ? (
                                /* Collapsed card */
                                <div className="flex items-center gap-3 px-4 py-3 bg-white border border-orange-100 rounded-2xl hover:border-orange-200 hover:shadow-sm transition-all group">
                                    {/* Icon */}
                                    <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                                        <TbCode
                                            size={16}
                                            className="text-orange-500"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm mb-1.5 truncate">
                                            {skillName || (
                                                <span className="italic font-normal text-gray-400">
                                                    Unnamed skill
                                                </span>
                                            )}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-300`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-semibold text-orange-500 min-w-[30px] text-right">
                                                {pct}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Badge */}
                                    <span
                                        className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${color}`}
                                    >
                                        {label}
                                    </span>

                                    {/* Actions */}
                                    <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setExpandedIndex(index)
                                            }
                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-orange-400 bg-orange-50 hover:bg-orange-100 hover:text-orange-600 transition"
                                            title="Edit"
                                        >
                                            <TbPencil size={13} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(index)}
                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-400 bg-rose-50 hover:bg-rose-100 hover:text-rose-600 transition"
                                            title="Remove"
                                        >
                                            <TbTrash size={13} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* Expanded form */
                                <div className="border-2 border-orange-200 rounded-2xl bg-orange-50/30 overflow-hidden">
                                    {/* Form header */}
                                    <div className="flex items-center gap-2.5 px-5 py-3 bg-white border-b border-orange-100">
                                        <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center">
                                            <TbCode
                                                size={13}
                                                className="text-orange-600"
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-orange-700">
                                            {skillFields[index]?.skill === ""
                                                ? "Add skill"
                                                : "Edit skill"}
                                        </span>
                                        <span className="ml-auto text-xs text-orange-500 bg-orange-50 px-2.5 py-0.5 rounded-full font-medium border border-orange-100">
                                            Entry {index + 1}
                                        </span>
                                    </div>

                                    <div className="p-5 space-y-5">
                                        <Input
                                            label="Skill Name"
                                            name={`skills.${index}.skill`}
                                            {...register(
                                                `skills.${index}.skill`,
                                                {
                                                    required: "Required",
                                                },
                                            )}
                                            error={
                                                errors.skills?.[index]?.skill
                                            }
                                            placeholder="e.g. JavaScript"
                                        />

                                        {/* Proficiency slider */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                                    Proficiency level
                                                </label>
                                                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                                                    {watch(
                                                        `skills.${index}.percentage`,
                                                    ) || 0}
                                                    %
                                                </span>
                                            </div>

                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                step="5"
                                                {...register(
                                                    `skills.${index}.percentage`,
                                                    {
                                                        required: "Required",
                                                    },
                                                )}
                                                className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-orange-500"
                                            />

                                            <div className="flex justify-between text-[10px] font-medium text-gray-300 uppercase tracking-wider px-0.5">
                                                <span>Beginner</span>
                                                <span>Intermediate</span>
                                                <span>Expert</span>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex justify-between items-center pt-2 border-t border-orange-100">
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
                                                className="flex items-center gap-1.5 text-sm font-medium bg-orange-500 text-white px-5 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                                            >
                                                <TbCheck size={14} /> Save
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
            {skillFields.length === 0 && (
                <div className="flex flex-col items-center bg-gray-50 justify-center py-12 border-2 border-dashed border-orange-200 rounded-2xl text-center">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                        <TbCode size={22} className="text-orange-300" />
                    </div>
                    <p className="text-gray-600 text-sm">
                        No skills added yet.
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                        Click "Add skill" to get started.
                    </p>
                </div>
            )}
        </div>
    );
}
