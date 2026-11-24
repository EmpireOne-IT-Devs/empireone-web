import Button from "@/app/_components/button";
import { setAlert } from "@/app/redux/app-slice";
import { get_app_data_thunk, get_user_by_id_thunk } from "@/app/redux/app-thunk";
import { create_performance_evaluation_service } from "@/app/services/performance-evaluation-service";
import store from "@/app/store/store";
import { router } from "@inertiajs/react";
import moment from "moment";
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const CreatePEFSection = () => {
    const { user } = useSelector((store) => store.app);
    const dispatch = useDispatch();
    const params = new URLSearchParams(window.location.search);
    const evaluation_period = params.get("evaluation_period");

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            employee_name: "",
            supervisor_name: "",
            user_id: "",
            supervisor_id: "",
            date_of_assessment: moment().format("YYYY-MM-DD"),
            objectives: [
                { title: "", action_items: "", outcomes: "", mgr_rating: "" },
            ],
            // CHANGED: performance is now an array of objects matching your backend
            performances: [
                {
                    title: "Job Knowledge",
                    action_items:
                        "Application, Technical and Professional skills",
                    mgr_rating: "",
                },
                {
                    title: "Communication Skills",
                    action_items:
                        "Communicates effectively to clients/individuals",
                    mgr_rating: "",
                },
                {
                    title: "Management Skills",
                    action_items: "Leads team to get desired results",
                    mgr_rating: "",
                },
                {
                    title: "Organizing Skills",
                    action_items: "Sets priorities for tasks and commitments",
                    mgr_rating: "",
                },
                {
                    title: "Initiative",
                    action_items: "Commitment to seek improvements",
                    mgr_rating: "",
                },
                {
                    title: "Discipline",
                    action_items: "Adherence to provisions in Code of Conduct",
                    mgr_rating: "",
                },
                {
                    title: "Attendance",
                    action_items:
                        "Adherence to provisions in Attendance policy",
                    mgr_rating: "",
                },
            ],
            remarks: "",
            recommendation: "",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "objectives",
    });

    // Watch form values for real-time calculations
    const watchedObjectives = watch("objectives");
    const watchedPerformances = watch("performances");

    useEffect(() => {
        setValue(
            "employee_name",
            `${user?.personal_information?.first_name} ${user?.personal_information?.last_name}`,
        );
        setValue(
            "supervisor_name",
            `${user?.subordinate?.leader?.user?.personal_information?.first_name} ${user?.subordinate?.leader?.user?.personal_information?.last_name}`,
        );
        setValue("user_id", user?.personal_information?.user_id);
        setValue(
            "supervisor_id",
            user?.subordinate?.leader?.user?.personal_information?.user_id,
        );
    }, [user?.subordinate]);

    // --- INTERACTIVE CALCULATION LOGIC ---
    const getSection1Score = () => {
        const ratings = watchedObjectives
            .map((obj) => parseFloat(obj.mgr_rating))
            .filter((val) => !isNaN(val) && val > 0);

        if (ratings.length === 0) return 0;
        return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
    };

    const getSection2Score = () => {
        // CHANGED: watchedPerformances is now an array, we map over mgr_rating
        const ratings = watchedPerformances
            .map((item) => parseFloat(item.mgr_rating))
            .filter((val) => !isNaN(val) && val > 0);

        if (ratings.length === 0) return 0;
        return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
    };

    const section1Score = getSection1Score();
    const section2Score = getSection2Score();
    const totalScore =
        section1Score > 0 && section2Score > 0
            ? (
                (parseFloat(section1Score) + parseFloat(section2Score)) /
                2
            ).toFixed(2)
            : 0;

    const getScoreColor = (score) => {
        if (score >= 4.5) return "text-green-600 bg-green-50";
        if (score >= 3.5) return "text-blue-600 bg-blue-50";
        if (score >= 2.5) return "text-yellow-600 bg-yellow-50";
        if (score > 0) return "text-red-600 bg-red-50";
        return "text-gray-800 bg-gray-100";
    };

    const onSubmit = async (data) => {
        const finalPayload = {
            ...data,
            evaluation_period:evaluation_period,
            calculated_scores: {
                section_1: section1Score,
                section_2: section2Score,
                total_average: totalScore,
            },
        };
        console.log("Submitting Form Data:", finalPayload);
        try {
            await create_performance_evaluation_service(finalPayload);
            await store.dispatch(get_app_data_thunk());
            dispatch(
                setAlert({
                    type: "success",
                    title: "Evaluation Submitted Successfully!",
                    message:
                        "The Evaluation has been created and is ready for review.",
                    open: true,
                }),
            );
            reset();
            router.visit(
                `/accounts/${window.location.pathname.split("/")[2]}/my_team/team`,
            );
        } catch (error) { }
    };

    // --- REUSABLE COMPONENTS ---
    const SectionHeader = ({ title }) => (
        <div className="bg-gray-800 text-white p-2 font-bold uppercase mt-8 mb-4 shadow-sm rounded-t-sm">
            {title}
        </div>
    );

    const RatingRadioGroup = ({ name, hasError }) => (
        <div
            className={`flex justify-between w-full px-2 max-w-md mx-auto rounded-md transition-colors ${hasError ? "bg-red-50 ring-1 ring-red-400 py-1" : ""}`}
        >
            {[1, 2, 3, 4, 5].map((val) => (
                <label
                    key={val}
                    className="flex flex-col items-center cursor-pointer group"
                >
                    <span className="text-[10px] font-bold mb-1 text-blue-800 group-hover:text-blue-500 transition-colors">
                        {val}
                    </span>
                    <input
                        type="radio"
                        value={val}
                        {...register(name, { required: true })}
                        className="w-4 h-4 cursor-pointer accent-blue-600"
                    />
                </label>
            ))}
        </div>
    );

    const inputStyles =
        "w-full p-2 border-b-2 border-transparent bg-yellow-50 hover:bg-yellow-100 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none rounded-sm";

    const getErrorStyle = (error) =>
        error ? "ring-2 ring-red-500 bg-red-50" : "";

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl border border-gray-200 my-10 rounded-lg">
            <div className="flex justify-between items-center mb-8 border-b-4 border-blue-600 pb-4">
                <div className="text-3xl font-black text-blue-900 tracking-tighter">
                    <img src="/images/E1CXlogo2.png" className="w-52" />
                </div>
                <div className="text-right">
                    <h1 className="font-bold text-xl uppercase tracking-wider text-gray-800">
                        Performance Evaluation Form
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        (Probationary Employee)
                    </p>
                </div>
            </div>

            {Object.keys(errors).length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-medium text-sm rounded">
                    Please fill out all required fields marked in red before
                    submitting.
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-[1px] bg-gray-300 border border-gray-300 rounded-sm overflow-hidden shadow-sm">
                    <div className="p-3 font-semibold bg-gray-100 flex items-center">
                        Employee Name:{" "}
                        <span className="text-red-500 ml-1">*</span>
                    </div>
                    <input
                        disabled
                        {...register("employee_name", { required: true })}
                        className={`${inputStyles} ${getErrorStyle(errors.employee_name)} bg-white m-[1px] w-[calc(100%-2px)]`}
                        placeholder="John Doe"
                    />

                    <div className="p-3 font-semibold bg-gray-100 flex items-center">
                        Supervisor Name:{" "}
                        <span className="text-red-500 ml-1">*</span>
                    </div>
                    <input
                        disabled
                        {...register("supervisor_name", { required: true })}
                        className={`${inputStyles} ${getErrorStyle(errors.supervisor_name)} bg-white m-[1px] w-[calc(100%-2px)]`}
                        placeholder="Jane Smith"
                    />

                    <div className="p-3 font-semibold bg-gray-100 flex items-center">
                        Date of Assessment:{" "}
                        <span className="text-red-500 ml-1">*</span>
                    </div>
                    <input
                        disabled
                        type="date"
                        {...register("date_of_assessment", {
                            required: true,
                        })}
                        className={`${inputStyles} ${getErrorStyle(errors.date_of_assessment)} bg-white m-[1px] w-[calc(100%-2px)]`}
                    />
                </div>

                {/* Legend */}
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm">
                    <p className="font-bold text-blue-900 mb-1">
                        Rating Scale:
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-blue-800">
                        <span>
                            <strong>5</strong> - Excellent
                        </span>
                        <span>
                            <strong>4</strong> - Outstanding
                        </span>
                        <span>
                            <strong>3</strong> - Satisfactory
                        </span>
                        <span>
                            <strong>2</strong> - Needs Improvement
                        </span>
                        <span>
                            <strong>1</strong> - Unacceptable
                        </span>
                    </div>
                </div>

                {/* SECTION 1 */}
                <SectionHeader title="Section 1: Objectives (50%)" />
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="border border-gray-200 p-4 rounded-md bg-gray-50 shadow-sm relative group hover:border-blue-300 transition-colors"
                        >
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="flex flex-col">
                                    <label className="text-xs font-bold uppercase text-gray-600 mb-1">
                                        Objective{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register(
                                            `objectives.${index}.title`,
                                            { required: true },
                                        )}
                                        className={`${inputStyles} ${getErrorStyle(errors.objectives?.[index]?.title)}`}
                                        rows="2"
                                        placeholder="Describe objective..."
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-bold uppercase text-gray-600 mb-1">
                                        Action Items{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register(
                                            `objectives.${index}.action_items`,
                                            { required: true },
                                        )}
                                        className={`${inputStyles} ${getErrorStyle(errors.objectives?.[index]?.action_items)}`}
                                        rows="2"
                                        placeholder="Steps taken..."
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-xs font-bold uppercase text-gray-600 mb-1">
                                        Outcomes{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register(
                                            `objectives.${index}.outcomes`,
                                            { required: true },
                                        )}
                                        className={`${inputStyles} ${getErrorStyle(errors.objectives?.[index]?.outcomes)}`}
                                        rows="2"
                                        placeholder="Results..."
                                    />
                                </div>
                            </div>

                            <div className="bg-white p-3 border border-gray-100 rounded">
                                <div className="flex flex-col gap-1 justify-center">
                                    <label className="text-xs font-bold text-blue-900 text-center mb-1">
                                        Manager Rating{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <RatingRadioGroup
                                        name={`objectives.${index}.mgr_rating`}
                                        hasError={
                                            !!errors.objectives?.[index]
                                                ?.mgr_rating
                                        }
                                    />
                                </div>
                            </div>

                            {fields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="absolute -top-3 -right-3 bg-red-100 text-red-600 rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-md"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            append({
                                title: "",
                                action_items: "",
                                outcomes: "",
                                mgr_rating: "",
                            })
                        }
                        className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:text-blue-800 transition-colors p-2 border border-dashed border-blue-300 rounded w-full justify-center hover:bg-blue-50"
                    >
                        + Add Another Objective
                    </button>
                </div>

                {/* SECTION 2 */}
                <SectionHeader title="Section 2: General Performance Requirements (50%)" />
                <div className="border border-gray-300 rounded-md overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 uppercase">
                            <tr>
                                <th className="px-4 py-3 border-b w-3/4">
                                    Requirement
                                </th>
                                <th className="px-4 py-3 border-b border-l text-center w-1/4 bg-blue-50">
                                    Mgr. Rating{" "}
                                    <span className="text-red-500">*</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {/* CHANGED: We now map over the watched performance array */}
                            {watchedPerformances?.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <span className="font-bold text-gray-800 block">
                                            {item.title}
                                        </span>
                                        <span className="text-xs text-gray-500 italic">
                                            {item.action_items}
                                        </span>
                                        {/* Hidden inputs to ensure these fields get sent in the payload */}
                                        <input
                                            type="hidden"
                                            {...register(
                                                `performances.${index}.title`,
                                            )}
                                        />
                                        <input
                                            type="hidden"
                                            {...register(
                                                `performances.${index}.action_items`,
                                            )}
                                        />
                                    </td>
                                    <td className="border-l p-2 align-middle bg-blue-50/30">
                                        <RatingRadioGroup
                                            name={`performances.${index}.mgr_rating`}
                                            hasError={
                                                !!errors.performances?.[index]
                                                    ?.mgr_rating
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* INTERACTIVE SCORING TABLE */}
                <SectionHeader title="Over-all Rating" />
                <div className="flex justify-end">
                    <table className="w-1/2 border-collapse border border-gray-300 text-sm shadow-sm rounded-md overflow-hidden">
                        <tbody>
                            <tr className="border-b border-gray-200">
                                <td className="p-3 font-semibold bg-gray-100 w-2/3">
                                    Section 1 (50%) Average:
                                </td>
                                <td className="p-3 text-center font-mono font-bold">
                                    {section1Score > 0 ? section1Score : "-"}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-200">
                                <td className="p-3 font-semibold bg-gray-100">
                                    Section 2 (50%) Average:
                                </td>
                                <td className="p-3 text-center font-mono font-bold">
                                    {section2Score > 0 ? section2Score : "-"}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3 font-black bg-gray-800 text-white uppercase tracking-wider">
                                    Total Average Score:
                                </td>
                                <td
                                    className={`p-3 text-center font-mono font-black text-lg ${getScoreColor(totalScore)} transition-colors duration-500`}
                                >
                                    {totalScore > 0 ? totalScore : "-"}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Remarks Section */}
                <div
                    className={`mt-8 p-4 rounded border transition-colors ${errors.remarks ? "bg-red-50 border-red-300" : "bg-gray-50 border-gray-200"}`}
                >
                    <label className="font-bold block mb-2 text-gray-800 uppercase tracking-wide">
                        Remarks / Comments:{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        {...register("remarks", { required: true })}
                        className={`w-full p-3 border rounded outline-none transition-all min-h-[120px] ${getErrorStyle(errors.remarks) || "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"}`}
                        placeholder="Add your evaluation remarks here..."
                    />
                </div>

                {/* Signatures & Recommendations */}
                <div className="mt-12 grid grid-cols-2 gap-12 px-6">
                    {
                        evaluation_period != "3 Months" && <div
                            className={`flex flex-col gap-3 p-4 rounded-md transition-colors ${errors.recommendation ? "bg-red-50 ring-1 ring-red-300" : ""}`}
                        >
                            <p className="text-sm font-bold uppercase text-gray-800  ">
                                Recommendation{" "}
                                <span className="text-red-500">*</span>
                            </p>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    value="Regular"
                                    {...register("recommendation", {
                                        required: true,
                                    })}
                                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                    Regular
                                </span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    value="Extended Probationary"
                                    {...register("recommendation", {
                                        required: true,
                                    })}
                                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                    Extended Probationary
                                </span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    value="End of Contract"
                                    {...register("recommendation", {
                                        required: true,
                                    })}
                                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                    End of Contract
                                </span>
                            </label>
                        </div>
                    }

                    <div className="flex flex-col items-center justify-end h-full w-full max-w-sm mx-auto">
                        <div className="relative flex flex-col items-center justify-end w-full">
                            {user?.subordinate?.leader?.user?.account_employee
                                ?.signature && (
                                    <img
                                        src={
                                            user?.subordinate?.leader?.user
                                                ?.account_employee?.signature
                                        }
                                        alt="Supervisor Signature"
                                        className="h-96 object-contain absolute -bottom-[160px] pointer-events-none mix-blend-multiply"
                                    />
                                )}
                            <span className="font-bold text-gray-900 text-lg mb-1 relative z-10">
                                {watch("supervisor_name")}
                            </span>
                        </div>
                        <div className="border-t-2 border-gray-800 pt-2 text-center group cursor-pointer hover:bg-gray-50 rounded transition-colors pb-4 flex flex-col items-center justify-center w-full">
                            <p className="text-sm font-bold uppercase text-gray-800">
                                Immediate Superior Name & Signature
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-10 pt-6 border-t border-gray-200">
                    <Button type="submit" size="lg" loading={isSubmitting}>
                        SUBMIT EVALUATION
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreatePEFSection;
