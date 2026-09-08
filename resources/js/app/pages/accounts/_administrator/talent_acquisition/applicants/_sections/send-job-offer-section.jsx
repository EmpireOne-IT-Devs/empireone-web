import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import allowances from "@/app/lib/allowance";
import { setAlert } from "@/app/redux/app-slice";
import { get_applicants_thunk, get_job_posting_by_id_thunk } from "@/app/redux/job-posting-thunk";
import { send_job_offer_service } from "@/app/services/job-posting-service";

export default function SendJobOfferSection({ data }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Tracking active states for the interactive pills
    const [upon, setUpon] = useState("Hire");
    const [activeLimit, setActiveLimit] = useState("80,000");
    const [activeRoomBoard, setActiveRoomBoard] = useState("Regular Private");
    const [activeDependent, setActiveDependent] = useState("Entitled to 1 free dependent");
    const [activeMedical, setActiveMedical] = useState([]);

    const dispatch = useDispatch();
    const { job_posting } = useSelector((store) => store.job_postings);

    const applicantInfo = data?.applicant?.personal_information;
    const reqInfo = data?.job_posting?.job_requisition;

    const {
        register,
        handleSubmit,
        reset,
        control,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            job_posting_id: data?.job_posting?.id,
            salary: "",
            annual_leave: "",
            allowances: [],
            start_date: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "allowances",
    });

    const toggleMedicalBenefit = (benefit) => {
        setActiveMedical((prev) =>
            prev.includes(benefit) ? prev.filter((b) => b !== benefit) : [...prev, benefit]
        );
    };

    async function handleOpenModal() {
        try {
            setLoading(true);
            const jobId = getValues("job_posting_id") || data?.job_posting?.id;
            await dispatch(get_job_posting_by_id_thunk(jobId));
            setOpen(true);
        } catch (error) {
            console.error("Failed to fetch job posting details:", error);
            dispatch(setAlert({
                type: "error",
                title: "Error",
                message: "Could not load job posting details.",
                open: true,
            }));
        } finally {
            setLoading(false);
        }
    }

    const handleCloseModal = () => {
        setOpen(false);
        reset();
        // Reset interactive pills to default states
        setUpon("Hire");
        setActiveLimit("80,000");
        setActiveRoomBoard("Regular Private");
        setActiveDependent("Entitled to 1 free dependent");
        setActiveMedical([]);
    };

    const onSubmit = async (formData) => {
        try {
            const formattedDate = new Date(formData.start_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            await send_job_offer_service({
                ...data,
                ...formData,
                medical_benefits: activeMedical,
                // Only send these details if their respective parent medical benefit is selected
                room: activeMedical.includes("Hospitalization") ? activeRoomBoard : null,
                benefit_limit: activeMedical.includes("Hospitalization") ? activeLimit : null,
                dependent: activeMedical.includes("Dependent") ? activeDependent : null,
                effective_period: activeMedical.length > 0 ? upon : null,
                start_date: formattedDate,
                job_application_id: data.id,
                status: "In Review",
            });

            await dispatch(get_applicants_thunk());

            dispatch(
                setAlert({
                    type: "success",
                    title: "Job Offer Created Successfully!",
                    message: "Please review your email.",
                    open: true,
                })
            );
            handleCloseModal();
        } catch (error) {
            console.error("Submission error:", error);
            dispatch(
                setAlert({
                    type: "error",
                    title: "Submission Failed",
                    message: "An error occurred while sending the job offer.",
                    open: true,
                })
            );
        }
    };

    return (
        <>
            <Button
                loading={loading}
                className="h-full"
                onClick={handleOpenModal}
            >
                SEND&nbsp;JOB&nbsp;OFFER
            </Button>

            <Modal
                width="max-w-4xl"
                isOpen={open}
                onClose={handleCloseModal}
                title="Send Job Offer"
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-gray-50 p-6 rounded-xl space-y-6 text-sm text-gray-700 border border-gray-100"
                >
                    <div>
                        <p className="font-bold text-blue-600 uppercase text-xs tracking-wider mb-2">
                            Position Details
                        </p>
                        <div className="grid grid-cols-2 gap-y-1">
                            <p>
                                <strong>Full Name:</strong>{" "}
                                {applicantInfo?.first_name} {applicantInfo?.last_name}
                            </p>
                            <p>
                                <strong>Department:</strong> {reqInfo?.department?.name}
                            </p>
                            <p>
                                <strong>Account:</strong> {reqInfo?.account?.name}
                            </p>
                            <p>
                                <strong>Location:</strong> {reqInfo?.location?.name}
                            </p>
                            <p>
                                <strong>Current Title:</strong> {reqInfo?.title}
                            </p>
                        </div>
                        <div className="mt-6" />
                        <div className="mb-3">
                            <Input
                                label="Start Date"
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                {...register("start_date", { required: "Start date is required" })}
                                error={errors.start_date}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-y-5 gap-5">
                            <Input
                                label="Position"
                                type="text"
                                disabled
                                value={job_posting?.job_requisition?.title || ""}
                            />
                            <Input
                                label="Monthly Salary"
                                type="number"
                                placeholder="e.g. 50000"
                                {...register("salary", { required: "Salary is required" })}
                                error={errors.salary}
                            />
                        </div>
                    </div>

                    <div className="font-black mt-4">
                        SCHEDULE OF BENEFITS
                    </div>

                    <Input
                        label="Annual Leave"
                        type="number"
                        placeholder="e.g. 1"
                        min="1"
                        {...register("annual_leave", { required: "Annual Leave is required" })}
                        error={errors.annual_leave}
                    />

                    {/* Interactive Benefits Guide */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 shadow-sm flex flex-col gap-4">
                        <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold uppercase tracking-wider border-b border-blue-200 pb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                            </svg>
                            Quick Update Benefits Guide
                        </div>

                        <div className="text-blue-700">
                            Government Mandated Benefits  ---- as applicable
                        </div>

                        <div>
                            <p className="text-[11px] text-blue-800 font-bold mb-1.5">Medical Benefits:</p>
                            <div className="flex flex-wrap gap-2">
                                {['Hospitalization', 'Dental', 'Dependent', 'Group Life Insurance'].map((res) => (
                                    <button
                                        type="button"
                                        key={res}
                                        onClick={() => toggleMedicalBenefit(res)}
                                        className={`px-3 py-1.5 text-[10px] font-bold rounded-full shadow-sm transition-all cursor-pointer border ${activeMedical.includes(res)
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100"
                                            }`}
                                    >
                                        {res}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Shows if ANY Medical Benefit is selected */}
                        {activeMedical.length > 0 && (
                            <div>
                                <p className="text-[11px] text-blue-800 font-bold mb-1.5">Effective period of coverage is upon:</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Hire', 'Regularization'].map((res) => (
                                        <button
                                            type="button"
                                            key={res}
                                            onClick={() => setUpon(res)}
                                            className={`px-3 py-1.5 text-[10px] font-bold rounded-full shadow-sm transition-all cursor-pointer border ${upon === res
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100"
                                                }`}
                                        >
                                            {res}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Shows ONLY if 'Hospitalization' is selected */}
                        {activeMedical.includes("Hospitalization") && (
                            <>
                                <div>
                                    <p className="text-[11px] text-blue-800 font-bold mb-1.5">HMO Maximum Benefit Limit:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['300,000', '110,000', '80,000', '70,000', '50,000'].map((amount) => (
                                            <button
                                                type="button"
                                                key={amount}
                                                onClick={() => setActiveLimit(amount)}
                                                className={`px-3 py-1.5 text-[10px] font-bold rounded-full shadow-sm transition-all cursor-pointer border ${activeLimit === amount
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100"
                                                    }`}
                                            >
                                                {amount}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[11px] text-blue-800 font-bold mb-1.5">Room and Board:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Open Private', 'Regular Private', 'Ward'].map((room) => (
                                            <button
                                                type="button"
                                                key={room}
                                                onClick={() => setActiveRoomBoard(room)}
                                                className={`px-3 py-1.5 text-[10px] font-bold rounded-full shadow-sm transition-all cursor-pointer border ${activeRoomBoard === room
                                                        ? "bg-blue-600 text-white border-blue-600"
                                                        : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100"
                                                    }`}
                                            >
                                                {room}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Shows ONLY if 'Dependent' is selected */}
                        {activeMedical.includes("Dependent") && (
                            <div>
                                <p className="text-[11px] text-blue-800 font-bold mb-1.5">Dependent Coverage:</p>
                                <div className="flex flex-wrap gap-2">
                                    {['No free dependent', 'Entitled to 1 free dependent', 'Entitled to 2 free dependents'].map((dep) => (
                                        <button
                                            type="button"
                                            key={dep}
                                            onClick={() => setActiveDependent(dep)}
                                            className={`px-3 py-1.5 text-[10px] font-bold rounded-full shadow-sm transition-all cursor-pointer border ${activeDependent === dep
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100"
                                                }`}
                                        >
                                            {dep}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 w-full">
                        <div className="space-y-4 w-full">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-blue-600 text-xs uppercase">
                                    Allowances
                                </p>
                                <Button
                                    type="button"
                                    onClick={() =>
                                        append({
                                            allowance_type: "",
                                            allowance: "",
                                        })
                                    }
                                >
                                    + ADD ALLOWANCE
                                </Button>
                            </div>

                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex gap-4 items-start justify-center"
                                >
                                    <div className="flex-1 flex flex-col space-y-1">
                                        <select
                                            {...register(`allowances.${index}.allowance_type`, {
                                                required: "Type required",
                                            })}
                                            className={`w-full border rounded-lg p-2.5 text-sm bg-white focus:ring-blue-500 focus:border-blue-500 outline-none ${errors.allowances?.[index]?.allowance_type ? "border-red-500" : "border-gray-300"
                                                }`}
                                        >
                                            <option value="">Select type</option>
                                            {allowances.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.allowances?.[index]?.allowance_type && (
                                            <span className="text-red-500 text-xs mt-1">
                                                {errors.allowances[index].allowance_type.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <Input
                                            label="Amount"
                                            type="number"
                                            placeholder="0.00"
                                            {...register(`allowances.${index}.allowance`, {
                                                required: "Amount required",
                                            })}
                                            error={errors.allowances?.[index]?.allowance}
                                        />
                                    </div>
                                    <div className="flex-none pt-6">
                                        <Button
                                            type="button"
                                            variant="danger"
                                            onClick={() => remove(index)}
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full flex justify-center items-center"
                        loading={isSubmitting}
                    >
                        CREATE JOB OFFER
                    </Button>
                </form>
            </Modal>
        </>
    );
}