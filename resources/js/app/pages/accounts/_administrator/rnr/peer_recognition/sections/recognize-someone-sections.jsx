import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import TextArea from "@/app/_components/textarea";
import { HeartIcon, SparklesIcon, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaPaperPlane } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import {
    create_engagement_reward_recognition_thunk,
    search_reward_recognition_employees_thunk,
} from "@/app/redux/engagement-thunk";
import { clearSearchResults } from "@/app/redux/engagement-slice";

const COMPANY_VALUES = [
    "Innovation",
    "Teamwork",
    "Excellence",
    "Leadership",
    "Customer Focus",
    "Integrity",
    "Resilience",
    "Creativity",
];

const AWARD_POINT_PRESETS = [50, 100, 250, 500];

const VALUE_AWARDS = [
    {
        label: "RELIABILITY — We deliver on our promises.",
        value: "Reliability",
    },
    { label: "EXCELLENCE — We raise the standard.", value: "Excellence" },
    { label: "ADAPTABILITY — We evolve with purpose.", value: "Adaptability" },
    {
        label: "COLLABORATION — We achieve more together.",
        value: "Collaboration",
    },
    {
        label: "INTEGRITY — We protect trust and do what’s right.",
        value: "Integrity",
    },
];

const PEOPLE_AWARDS = [
    {
        label: "The Excellence Award — Raises the Bar",
        value: "The Excellence Award",
    },
    {
        label: "The One Team Award — Better Together",
        value: "The One Team Award",
    },
    { label: "The Empathy Award — People First", value: "The Empathy Award" },
    {
        label: "The Initiative Award — Makes It Happen",
        value: "The Initiative Award",
    },
    {
        label: "The Innovation Award — Thinks Different",
        value: "The Innovation Award",
    },
    {
        label: "The Customer Champion — Goes the Extra Mile",
        value: "The Customer Champion",
    },
    {
        label: "The Integrity Award — Leads with Trust",
        value: "The Integrity Award",
    },
    {
        label: "The Ownership Award — Owns It. Delivers It",
        value: "The Ownership Award",
    },
];

export default function RecognizeSomeoneSections({ onCategoryChange }) {
    const { data } = useSelector((store) => store.app);
    const dispatch = useDispatch();
    const { rewardSearchResults, rewardSearching, rewardCreating } =
        useSelector((state) => state.engagement);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [formError, setFormError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            search_term: "",
            employee_id: "",
            award_category: "",
            company_value: "",
            message: "",
        },
    });

    const searchTerm = watch("search_term");
    const selectedCategory = watch("award_category");
    const selectedCompanyValue = watch("company_value");

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (searchTerm.trim().length < 2) {
            dispatch(clearSearchResults());
            return;
        }

        const timer = setTimeout(() => {
            if (!selectedEmployee) {
                dispatch(
                    search_reward_recognition_employees_thunk(
                        searchTerm.trim(),
                    ),
                );
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [dispatch, isOpen, searchTerm, selectedEmployee]);

    useEffect(() => {
        if (
            selectedEmployee &&
            searchTerm.trim() !==
                `${selectedEmployee.first_name} ${selectedEmployee.last_name}`.trim()
        ) {
            setSelectedEmployee(null);
            setValue("employee_id", "");
        }
    }, [searchTerm, selectedEmployee, setValue]);

    const resetForm = () => {
        reset();
        setSelectedEmployee(null);
        setFormError("");
        dispatch(clearSearchResults());
    };

    const handleClose = () => {
        setIsOpen(false);
        resetForm();
    };

    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee);
        setValue("employee_id", employee.id);
        setValue("search_term", `${employee.first_name} ${employee.last_name}`);
        dispatch(clearSearchResults());
    };

    const onSubmit = async (formData) => {
        setFormError("");

        if (!selectedEmployee) {
            setError("search_term", {
                type: "required",
                message: "Please select a colleague to recognize.",
            });
            return;
        }

        const payload = {
            employee_id: selectedEmployee.id,
            award_category: formData.award_category.trim() || null,
            company_value: formData.company_value || null,
            message: formData.message.trim(),
        };

        const result = await dispatch(
            create_engagement_reward_recognition_thunk(payload),
        );

        if (result.error) {
            const msg =
                result.payload?.message ||
                result.error?.message ||
                "Failed to send recognition. Please try again.";
            setFormError(msg);
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to send recognition",
                    message: msg,
                    open: true,
                }),
            );
            return;
        }

        dispatch(
            setAlert({
                type: "success",
                title: "Recognition sent",
                message: "Your recognition was delivered successfully.",
                open: true,
            }),
        );

        handleClose();
    };

    return (
        <div>
            <div className="mt-4 flex items-center justify-between gap-4 border-b border-gray-100 p-2 pb-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500">
                        <SparklesIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Recognize a Colleague
                        </h2>
                        <p className="text-sm text-gray-500">
                            Give a shoutout to someone who made your week better
                        </p>
                    </div>
                </div>
                {[1, 11].includes(
                    data?.user?.account_employee?.department_id,
                ) && (
                    <Button
                        variant="engagement"
                        onClick={() => setIsOpen(true)}
                        className="shrink-0 rounded-full"
                    >
                        <HeartIcon className="mr-2 h-4 w-4" />
                        Recognize Someone
                    </Button>
                )}
            </div>

            <div className="flex justify-end items-end p-3">
                <Modal
                    isOpen={isOpen}
                    onClose={handleClose}
                    width="max-w-xl"
                    title={
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                                    Recognize Someone
                                </h2>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    Show appreciation to your colleagues by
                                    recognizing their hard work and
                                    contributions.
                                </p>
                            </div>
                        </div>
                    }
                >
                    <div className="flex flex-col gap-4 pb-2 p-2 mt-4">
                        <Input
                            label="Recognize a colleague"
                            name="recognize_employee"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => {
                                setValue("search_term", e.target.value);
                                if (selectedEmployee) {
                                    setSelectedEmployee(null);
                                }
                            }}
                            autoComplete="off"
                            error={errors.search_term}
                        />

                        {selectedEmployee ? (
                            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                                <div className="font-medium">
                                    {selectedEmployee.first_name}{" "}
                                    {selectedEmployee.last_name}
                                </div>
                                {((typeof selectedEmployee.department ===
                                "string"
                                    ? selectedEmployee.department
                                    : selectedEmployee.department?.name) ||
                                    selectedEmployee.account?.name) && (
                                    <div className="text-xs text-green-700">
                                        {(typeof selectedEmployee.department ===
                                        "string"
                                            ? selectedEmployee.department
                                            : selectedEmployee.department
                                                  ?.name) ||
                                            selectedEmployee.account?.name}
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedEmployee(null);
                                        setValue("search_term", "");
                                        setValue("employee_id", "");
                                        dispatch(clearSearchResults());
                                    }}
                                    className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-green-700 shadow-sm hover:bg-green-100"
                                >
                                    Change selection
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="min-h-[50px] rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
                                    {rewardSearching ? (
                                        <p className="text-sm text-gray-500">
                                            Searching employees...
                                        </p>
                                    ) : searchTerm.trim().length >= 2 &&
                                      rewardSearchResults.length === 0 ? (
                                        <p className="text-sm text-gray-500">
                                            No colleagues found.
                                        </p>
                                    ) : null}
                                </div>
                                {rewardSearchResults.length > 0 && (
                                    <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                                        {rewardSearchResults.map((employee) => (
                                            <button
                                                key={employee.id}
                                                type="button"
                                                onClick={() =>
                                                    handleSelectEmployee(
                                                        employee,
                                                    )
                                                }
                                                className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                                            >
                                                <div className="font-medium">
                                                    {employee.first_name}{" "}
                                                    {employee.last_name}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {employee.department
                                                        ?.name ||
                                                        "No department"}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-1">
                                Category
                            </label>
                            <select
                                name="award_category"
                                value={selectedCategory}
                                onChange={(e) => {
                                    setValue("award_category", e.target.value);
                                }}
                                className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="">
                                    Select an Award Category
                                </option>
                                <optgroup label="VALUE AWARDS — Recognition tied to company values">
                                    {VALUE_AWARDS.map((award) => (
                                        <option
                                            key={award.value}
                                            value={award.value}
                                        >
                                            {award.label}
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="PEOPLE AWARDS — Recognition for how someone makes others feel">
                                    {PEOPLE_AWARDS.map((award) => (
                                        <option
                                            key={award.value}
                                            value={award.value}
                                        >
                                            {award.label}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                            {errors.award_category && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.award_category.message}
                                </p>
                            )}
                        </div>

                        <div className="mt-2 text-sm font-semibold text-gray-900">
                            Company Value
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {COMPANY_VALUES.map((value) => {
                                const selected = selectedCompanyValue === value;
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() =>
                                            setValue(
                                                "company_value",
                                                selected ? "" : value,
                                            )
                                        }
                                        className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                                            selected
                                                ? "border-indigo-600 bg-indigo-100 text-indigo-800"
                                                : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                                        }`}
                                    >
                                        {value}
                                    </button>
                                );
                            })}
                        </div>

                        <Controller
                            name="message"
                            control={control}
                            rules={{
                                required:
                                    "Please write a message for your recognition.",
                                minLength: {
                                    value: 5,
                                    message:
                                        "Message must be at least 5 characters.",
                                },
                            }}
                            render={({ field }) => (
                                <TextArea
                                    label="Your message"
                                    name="recognition_message"
                                    placeholder="Tell them what they did and why it matters..."
                                    {...field}
                                    rows={4}
                                    error={errors.message?.message}
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col justify-end gap-2 mt-4 sm:flex-row">
                        <Button
                            onClick={handleClose}
                            className="w-full sm:w-auto"
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            className="w-full sm:w-auto"
                            disabled={rewardCreating || isSubmitting}
                        >
                            <FaPaperPlane className="w-4 h-4 mr-2" />
                            {rewardCreating || isSubmitting
                                ? "Sending..."
                                : "Send Recognition"}
                        </Button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
