import { Sparkles } from "lucide-react";
import React from "react";
import WorkingExperienceSection from "./working-experience-section";
import SkillsSection from "./skills-section";

export default function ProfessionalSection({
    watchedValues,
    register,
    appendExperience,
    experienceFields,
    removeExperience,
    errors,
    appendSkill,
    skillFields,
    removeSkill,
    watch,
    submitForm,
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
                    submitForm={submitForm}
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
                    submitForm={submitForm}
                />
            </div>
        </div>
    );
}