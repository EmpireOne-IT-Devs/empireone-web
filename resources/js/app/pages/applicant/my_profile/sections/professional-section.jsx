import { User, Calendar, Building2, Award, GraduationCap } from "lucide-react";
import React from "react";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import WorkingExperienceSection from "./working-experience-section";
import SkillsSection from "./skills-section";

export default function ProfessionalSection({
    form,
    set,
    editing,
    watchedValues,
    register,
    appendExperience,
    experienceFields,
    removeExperience,
    errors,
    appendSkill,
    skillFields,
    removeSkill,
    watch
}) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 bg-purple-50 border border-purple-200 rounded-xl px-6 py-4">
                <WorkingExperienceSection
                    register={register}
                    errors={errors}
                    appendExperience={appendExperience}
                    experienceFields={experienceFields}
                    removeExperience={removeExperience}
                    watchedValues={watchedValues}
                />
            </div>

            <div className="flex flex-col gap-3 bg-orange-50 border border-orange-300 rounded-xl px-6 py-4">
                <SkillsSection
                    register={register}
                    errors={errors}
                    appendSkill={appendSkill}
                    skillFields={skillFields}
                    watch={watch}
                    removeSkill={removeSkill}
                />
            </div>

            <div className="flex flex-col gap-3 bg-blue-50 border border-blue-200 rounded-xl px-6 py-4">
                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <GraduationCap size={15} /> Educational Background
                </span>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <Input
                        label="School Name *"
                        name="schoolName"
                        value={form.schoolName}
                        onChange={set("schoolName")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Select
                        label="Degree Level"
                        name="degreeLevel"
                        value={form.degreeLevel}
                        onChange={set("degreeLevel")}
                        disabled={!editing}
                        options={[
                            { label: "High School", value: "high_school" },
                            {
                                label: "Vocational / TESDA",
                                value: "vocational",
                            },
                            { label: "Associate", value: "associate" },
                            { label: "Bachelor's", value: "bachelors" },
                            { label: "Master's", value: "masters" },
                            { label: "Doctorate", value: "doctorate" },
                        ]}
                    />
                    <Input
                        label="Course / Program"
                        name="course"
                        value={form.course}
                        onChange={set("course")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                    <Input
                        label="Year Graduated"
                        name="yearGraduated"
                        type="number"
                        value={form.yearGraduated}
                        onChange={set("yearGraduated")}
                        iconLeft={<Calendar size={14} />}
                        disabled={!editing}
                    />
                    <Select
                        label="Award / Honors"
                        name="awardHonors"
                        value={form.awardHonors}
                        onChange={set("awardHonors")}
                        disabled={!editing}
                        options={[
                            { label: "Summa Cum Laude", value: "summa" },
                            { label: "Magna Cum Laude", value: "magna" },
                            { label: "Cum Laude", value: "cum_laude" },
                            { label: "With Distinction", value: "distinction" },
                            { label: "None", value: "none" },
                        ]}
                    />
                    <Input
                        label="School Address"
                        name="schoolAddress"
                        value={form.schoolAddress}
                        onChange={set("schoolAddress")}
                        iconLeft={<User size={14} />}
                        disabled={!editing}
                    />
                </div>
            </div>
        </div>
    );
}
