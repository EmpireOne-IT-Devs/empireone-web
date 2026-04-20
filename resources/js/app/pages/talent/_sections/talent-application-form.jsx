import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import JobPostingSection from "./job-posting-section";
import PersonalInformationSection from "./personal-information-section";
import AddressInformationSection from "./address-information-section";
import UploadCvSection from "./upload-cv-section";
import FinalReviewSection from "./final-review-section";
import file_convert_blob from "@/app/lib/file-convert-blob";
import { apply_job_application_service } from "@/app/services/job-application-service";
import { setAlert, setJobPostingId } from "@/app/redux/app-slice";
import { useDispatch, useSelector } from "react-redux";
import store from "@/app/store/store";
import { router } from "@inertiajs/react";
import { BriefcaseIcon } from "lucide-react";

const TalentApplicationForm = () => {
    // ✅ Load saved step + data
    const savedData = JSON.parse(localStorage.getItem("talent_data") || "{}");
    const savedStep = parseInt(localStorage.getItem("talent_step") || "0");
    const { job_posting_id } = useSelector((store) => store.app);
    const { job_postings } = useSelector((store) => store.job_postings);
    const dispatch = useDispatch();
    const [step, setStep] = useState(savedStep);
    const [loading, setLoading] = useState(false);
    const referral_id = new URLSearchParams(window.location.search).get(
        "referral_id",
    );
    const job_post_id = new URLSearchParams(window.location.search).get(
        "job_posting_id",
    );
    const source =
        new URLSearchParams(window.location.search).get("source") ??
        "Online Application";
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

    const watchedValues = watch();
    let cvFile = watchedValues.cv?.[0];
    let base64File = file_convert_blob(cvFile);
    const position = job_postings.find(
        (res) => res.id == watchedValues.job_posting_id,
    )?.job_requisition?.title;

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
            if (source) {
                setValue("source", source);
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

    useEffect(() => {
        if (job_post_id && step <= 0) {
            dispatch(setJobPostingId(job_post_id));
            setStep(1);
        }
    }, [step]);

    const nextStep = async () => {
        const fieldsToValidate = [
            "first_name",
            "last_name",
            "middle_name",
            "email",
            "contact",
            "date_of_birth",
            "gender",
            "school_name",
            "nationality",
            "birth_place",
            "course",
            "marital_status",
            "year_graduated",
            "degree",
            "cv",
            "region",
            "province",
            "city",
            "barangay",
            "zip_code",
            "street",
        ];

        const isValid = await trigger(fieldsToValidate);
        if (isValid) setStep((curr) => curr + 1);
    };

    const prevStep = () => setStep((curr) => curr - 1);

    const onSubmit = async (data) => {
        const finalData = {
            ...data,
            referral_id: referral_id,
            source: source,
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
        <div className="min-h-screen bg-blue-50 flex items-start justify-center md:p-6 font-sans    ">
            <div className="max-w-4xl w-full min-h-screen bg-white md:rounded-xl shadow-lg transition-all duration-500 p-4 lg:p-8">
                {/* Progress Bar */}
                <div className="px-3 py-3 lg:px-8">
                    <div>
                        <button
                            type="button"
                            onClick={() => router.visit("/")}
                            className="mb-4 text-gray-400 hover:text-gray-900 text-sm transition-colors duration-200"
                        >
                            ← Back to homepage
                        </button>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-blue-600 uppercase">
                            Job Posting - Step {step} of 2
                        </span>
                        <span className="text-xs font-bold text-blue-600">
                            {Math.round((step / 2) * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(step / 2) * 100}%` }}
                        />
                    </div>
                </div>

                <form className="p-2 lg:px-8" onSubmit={handleSubmit(onSubmit)}>
                    {step === 0 && <JobPostingSection setStep={setStep} />}
                    {step !== 0 && (
                        <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-200">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                                <BriefcaseIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="leading-tight">
                                <p className="text-xs text-gray-500">
                                    Applying for
                                </p>
                                <p className="text-xl font-semibold text-blue-500">
                                    {position}
                                </p>
                            </div>
                        </div>
                    )}
                    {step === 1 && (
                        <>
                            <PersonalInformationSection
                                prevStep={prevStep}
                                nextStep={nextStep}
                                register={register}
                                errors={errors}
                                watchedValues={watchedValues}
                            />
                            <AddressInformationSection
                                watchedValues={watchedValues}
                                register={register}
                                errors={errors}
                            />
                            <UploadCvSection
                                prevStep={prevStep}
                                nextStep={nextStep}
                                register={register}
                                errors={errors}
                                watchedValues={watchedValues}
                            />
                        </>
                    )}

                    {step === 2 && (
                        <FinalReviewSection
                            prevStep={prevStep}
                            watchedValues={watchedValues}
                            loading={loading}
                        />
                    )}
                </form>
            </div>
        </div>
    );
};

export default TalentApplicationForm;
