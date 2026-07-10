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
import SetScheduleSection from "./set-schedule-section";

const TalentApplicationForm = () => {
    // ✅ Load saved step + data
    const savedData = JSON.parse(localStorage.getItem("talent_data") || "{}");
    const savedStep = parseInt(localStorage.getItem("talent_step") || "0");
    const { job_posting_id } = useSelector((store) => store.app);
    const { job_postings } = useSelector((store) => store.job_postings);
    const dispatch = useDispatch();
    const [step, setStep] = useState(savedStep);
    const [loading, setLoading] = useState(false);
    const { interviewer } = useSelector((store) => store.app);
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
            file_name: "",
            interview_type: "",
            is_previous_employee: false,
            gender: "",
            experiences: [],
            skills: [{ name: "", percentage: 0 }],
            region: "",
            province: "",
            city: "",
            barangay: "",
            zip_code: "",
            previous_employee_status: "",
            marital_status: "",
            cv: [],
            file: null,
            source: source,
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
                setValue('file_name', cvFile?.name)
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
        if (watchedValues.job_posting_id) {
            dispatch(setJobPostingId(watchedValues.job_posting_id));
        }
    }, [watchedValues.job_posting_id]);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            localStorage.setItem("talent_data", JSON.stringify(watchedValues));
        }, 500);
        return () => clearTimeout(timeout);
    }, [watchedValues, cvFile?.name, job_posting_id]);

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
            "department_id",
            "previous_employee_status",
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

    const prevStep = () => {
        setStep((curr) => curr - 1);
    };

    const onSubmit = async (data) => {
        const finalData = {
            ...data,
            referral_id: referral_id,
            source: data.source || source,
            position: position,
            interviewer_id: interviewer.interviewer_id,
            previous_employee_status: data.is_previous_employee == 'Yes' ? data.previous_employee_status : null
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

    const stepLabels = ["Position", "Schedule", "Review"];

    return (
        <div
            className="min-h-screen flex items-start justify-center md:p-6 font-sans"
            style={{
                backgroundImage: "url('/images/empireone-background.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background: `
                        linear-gradient(135deg, rgba(13,5,32,0.55) 0%, rgba(19,8,48,0.50) 50%, rgba(10,15,31,0.55) 100%),
                        radial-gradient(ellipse 60% 40% at 10% 80%, rgba(168,85,247,0.12) 0%, transparent 70%),
                        radial-gradient(ellipse 40% 50% at 90% 20%, rgba(59,130,246,0.09) 0%, transparent 70%),
                        radial-gradient(ellipse 30% 35% at 60% 90%, rgba(251,146,60,0.08) 0%, transparent 70%)
                    `,
                }}
            />

            <div
                className="relative z-10 max-w-4xl w-full min-h-screen md:min-h-0 md:rounded-2xl shadow-2xl transition-all duration-500"
                style={{
                    background: "rgba(255,255,255,0.92)",
                    border: "1px solid rgba(168,85,247,0.2)",
                    backdropFilter: "blur(20px)",
                    boxShadow:
                        "0 0 40px rgba(168,85,247,0.12), 0 25px 60px rgba(0,0,0,0.3)",
                }}
            >
                {/* Header */}
                <div
                    className="px-5 pt-6 pb-5 lg:px-10 border-b"
                    style={{ borderColor: "rgba(168,85,247,0.15)" }}
                >
                    {/* Back button */}
                    <button
                        type="button"
                        onClick={() => router.visit("/")}
                        className="mb-5 flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
                        style={{ color: "#9333ea" }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#6b21a8")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "#9333ea")
                        }
                    >
                        ← Back to careerpage
                    </button>

                    {/* Step dots + label */}
                    <div className="flex items-center mb-4">
                        <div className="flex items-center gap-2  justify-between w-full">
                            {stepLabels.map((label, i) => {
                                const idx = i; // step 0 = Position, 1 = Details, etc.
                                const isActive = step === idx;
                                const isDone = step > idx;
                                return (
                                    <div
                                        key={label}
                                        className="flex items-center gap-3 h-10 w-full"
                                    >
                                        <div
                                            className="flex w-10 h-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300"
                                            style={{
                                                background: isDone
                                                    ? "linear-gradient(135deg,#a855f7,#fb923c)"
                                                    : isActive
                                                        ? "rgba(168,85,247,0.15)"
                                                        : "rgba(168,85,247,0.07)",
                                                border: isActive
                                                    ? "1.5px solid rgba(168,85,247,0.8)"
                                                    : isDone
                                                        ? "1.5px solid transparent"
                                                        : "1.5px solid rgba(168,85,247,0.25)",
                                                color: isDone
                                                    ? "#fff"
                                                    : isActive
                                                        ? "#9333ea"
                                                        : "rgba(120,90,160,0.6)",
                                            }}
                                        >
                                            {isDone ? "✓" : idx + 1}
                                        </div>
                                        <span
                                            className="text-xs font-semibold hidden sm:block"
                                            style={{
                                                color: isActive
                                                    ? "#9333ea"
                                                    : isDone
                                                        ? "rgba(234,88,12,0.9)"
                                                        : "rgba(120,90,160,0.45)",
                                            }}
                                        >
                                            {label}
                                        </span>
                                        <div
                                            className="w-[80%] h-px mx-1 hidden sm:block"
                                            style={{
                                                background:
                                                    step > idx
                                                        ? "linear-gradient(90deg,#a855f7,#fb923c)"
                                                        : "rgba(168,85,247,0.15)",
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <span
                            className="text-xs font-bold tabular-nums"
                            style={{
                                background:
                                    "linear-gradient(90deg,#c084fc,#fb923c)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {Math.round((step / 3) * 100)}%
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div
                        className="w-full rounded-full h-1.5"
                        style={{ background: "rgba(168,85,247,0.1)" }}
                    >
                        <div
                            className="h-1.5 rounded-full transition-all duration-500 ease-out"
                            style={{
                                width: `${(step / 3) * 100}%`,
                                background:
                                    "linear-gradient(90deg,#a855f7 0%,#3b82f6 50%,#fb923c 100%)",
                                boxShadow: "0 0 10px rgba(168,85,247,0.5)",
                            }}
                        />
                    </div>
                </div>

                <form
                    className="p-5 lg:px-10 lg:py-8"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {step === 0 && <JobPostingSection setStep={setStep} />}

                    {step !== 0 && (
                        <div
                            className="flex items-center gap-3 pb-5 mb-6 rounded-xl px-4 py-3"
                            style={{
                                background: "rgba(168,85,247,0.08)",
                                border: "1px solid rgba(168,85,247,0.2)",
                            }}
                        >
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{
                                    background:
                                        "linear-gradient(135deg,rgba(168,85,247,0.3),rgba(59,130,246,0.2))",
                                    border: "1px solid rgba(168,85,247,0.3)",
                                }}
                            >
                                <BriefcaseIcon
                                    className="w-5 h-5"
                                    style={{ color: "#c084fc" }}
                                />
                            </div>
                            <div className="leading-tight">
                                <p
                                    className="text-xs font-semibold uppercase tracking-widest"
                                    style={{ color: "#9333ea" }}
                                >
                                    Applying for
                                </p>
                                <p
                                    className="text-lg font-bold uppercase tracking-wide"
                                    style={{
                                        background:
                                            "linear-gradient(90deg,#c084fc 0%,#93c5fd 55%,#fb923c 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
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
                        <SetScheduleSection
                            prevStep={prevStep}
                            register={register}
                            nextStep={nextStep}
                            setValue={setValue}
                            errors={errors}
                            watchedValues={watchedValues}
                        />
                    )}
                    {step === 3 && (
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
