import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import JobPostingSection from "./job-posting-section";
import PersonalInformationSection from "./personal-information-section";
import AddressInformationSection from "./address-information-section";
import WorkingExperienceSection from "./working-experience-section";
import SkillsSection from "./skills-section";
import UploadCvSection from "./upload-cv-section";
import FinalReviewSection from "./final-review-section";
import file_convert_blob from "@/app/lib/file-convert-blob";
import { apply_job_application_service } from "@/app/services/job-application-service";
import { setAlert } from "@/app/redux/app-slice";
import { useDispatch, useSelector } from "react-redux";
import store from "@/app/store/store";

const TalentFormSection = () => {
    // ✅ Load saved step + data
    const savedData = JSON.parse(localStorage.getItem("talent_data") || "{}");
    const savedStep = parseInt(localStorage.getItem("talent_step") || "0");
    const { job_posting_id } = useSelector((store) => store.app);
    const dispatch = useDispatch();
    const [step, setStep] = useState(savedStep);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        trigger,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            position: "",
            gender: "",
            experiences: [],
            skills: [{ name: "", percentage: 0 }],
            region: "",
            province: "",
            city: "",
            barangay: "",
            zip_code: "",
            marital_status: "",
            cv: [],
            file: null,
            job_posting_id: job_posting_id ?? savedData.job_posting_id,
            ...savedData, // ✅ restore saved values
        },
    });
    // alert(localStorage.getItem("job_posting_id"))
    const {
        fields: experienceFields,
        append: appendExperience,
        remove: removeExperience,
    } = useFieldArray({ control, name: "experiences" });

    const {
        fields: skillFields,
        append: appendSkill,
        remove: removeSkill,
    } = useFieldArray({ control, name: "skills" });

    const watchedValues = watch();
    let cvFile = watchedValues.cv?.[0];
    let base64File = file_convert_blob(cvFile);
    useEffect(() => {
        async function load_data() {
            if (cvFile?.name) {
                setValue("file", await base64File);
            }
            if (job_posting_id || savedData.job_posting_id) {
                setValue(
                    "job_posting_id",
                    job_posting_id ?? savedData.job_posting_id,
                );
            }
        }
        load_data();
    }, [cvFile?.name, job_posting_id]);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            localStorage.setItem("talent_data", JSON.stringify(watchedValues));
        }, 500);
        return () => clearTimeout(timeout);
    }, [watchedValues, cvFile?.name, job_posting_id]);
    console.log("watchedValuesssssssss", watchedValues);

    // ✅ Save current step
    useEffect(() => {
        localStorage.setItem("talent_step", step);
    }, [step]);

    const getName = (list, code) =>
        list.find((item) => item.code === code)?.name || code;

    const nextStep = async () => {
        const fieldsToValidate =
            step == 1
                ? [
                      "first_name",
                      "last_name",
                      "middle_name",
                      "email",
                      "contact",
                      "date_of_birth",
                      "gender",
                      "school_name",
                      "course",
                      "marital_status",
                      "year_graduated",
                      "degree",
                  ]
                : step == 2
                  ? ["region", "province", "city", "barangay", "zip_code"]
                  : step == 3
                    ? ["experiences"]
                    : step == 4
                      ? ["skills"]
                      : watchedValues
                        ? ""
                        : ["cv"];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) setStep((curr) => curr + 1);
    };

    const prevStep = () => setStep((curr) => curr - 1);

    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const onSubmit = async (data) => {
        const finalData = {
            ...data,
            region: getName(regions, data.region),
            province: getName(provinces, data.province),
            city: getName(cities, data.city),
            barangay: getName(barangays, data.barangay),
        };
        try {
            setLoading(true);
            await apply_job_application_service(finalData);

            await dispatch(
                setAlert({
                    type: "success",
                    title: "Talent Application Submitted Successfully!",
                    message: "Please review your email.",
                    open: true,
                }),
            );
            setLoading(false);
            localStorage.clear();
            reset({
                position: "",
                gender: "",
                experiences: [],
                skills: [{ name: "", percentage: 0 }],
                region: "",
                province: "",
                city: "",
                barangay: "",
                zip_code: "",
                cv: [],
                file: null,
                marital_status: "",
                job_posting_id: "",
            });
            setStep(0);
        } catch (error) {
            setLoading(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8 transition-all duration-500">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-blue-600 uppercase">
                            Job Posting #:{watchedValues.job_posting_id} - Step{" "}
                            {step} of 6
                        </span>
                        <span className="text-xs font-bold text-blue-600">
                            {Math.round((step / 6) * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(step / 6) * 100}%` }}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {step === 0 && <JobPostingSection setStep={setStep} />}

                    {step === 1 && (
                        <PersonalInformationSection
                            prevStep={prevStep}
                            nextStep={nextStep}
                            register={register}
                            errors={errors}
                            watchedValues={watchedValues}
                        />
                    )}

                    {step === 2 && (
                        <AddressInformationSection
                            prevStep={prevStep}
                            nextStep={nextStep}
                            register={register}
                            errors={errors}
                            setValue={setValue}
                            watch={watch}
                            barangays={barangays}
                            setBarangays={setBarangays}
                            regions={regions}
                            setRegions={setRegions}
                            provinces={provinces}
                            setProvinces={setProvinces}
                            cities={cities}
                            setCities={setCities}
                        />
                    )}

                    {step === 3 && (
                        <WorkingExperienceSection
                            prevStep={prevStep}
                            nextStep={nextStep}
                            register={register}
                            errors={errors}
                            appendExperience={appendExperience}
                            experienceFields={experienceFields}
                            removeExperience={removeExperience}
                            watchedValues={watchedValues}
                        />
                    )}

                    {step === 4 && (
                        <SkillsSection
                            prevStep={prevStep}
                            nextStep={nextStep}
                            register={register}
                            errors={errors}
                            appendSkill={appendSkill}
                            skillFields={skillFields}
                            watch={watch}
                            removeSkill={removeSkill}
                        />
                    )}

                    {step === 5 && (
                        <UploadCvSection
                            prevStep={prevStep}
                            nextStep={nextStep}
                            register={register}
                            errors={errors}
                            watchedValues={watchedValues}
                        />
                    )}

                    {step === 6 && (
                        <FinalReviewSection
                            prevStep={prevStep}
                            watchedValues={watchedValues}
                            getName={getName}
                            barangays={barangays}
                            regions={regions}
                            provinces={provinces}
                            cities={cities}
                            loading={loading}
                        />
                    )}
                </form>
            </div>
        </div>
    );
};

export default TalentFormSection;
