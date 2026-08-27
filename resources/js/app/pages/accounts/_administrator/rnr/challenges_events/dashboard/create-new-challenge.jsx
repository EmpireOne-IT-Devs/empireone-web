import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ImagePlus, PlusCircleIcon, X } from "lucide-react";

import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import TextArea from "@/app/_components/textarea";
import TabsSection from "../sections/tabs-section";

const CHALLENGE_TYPES = ["Individual", "Team"];

const CATEGORIES = ["Wellness", "Sales", "Learning", "Teamwork", "Innovation"];
const CATEGORY_OPTIONS = CATEGORIES.map((cat) => ({ value: cat, label: cat }));

const DEPARTMENTS = [
    { name: "Operations", count: 24 },
    { name: "Admins", count: 8 },
    { name: "Facilities", count: 12 },
    { name: "Compliance", count: 10 },
    { name: "IT", count: 18 },
    { name: "WebDev", count: 15 },
];

const CARD_COLORS = [
    "#F59E0B",
    "#2563EB",
    "#16A34A",
    "#7C3AED",
    "#0D9488",
    "#DC2626",
    "#DB2777",
    "#4338CA",
];

const TOTAL_EMPLOYEES = 87;

const DEFAULT_VALUES = {
    title: "",
    description: "",
    type: "Individual",
    category: CATEGORIES[0],
    points: "",
    account_id: [],
    department_id: [],
    max_participants: "",
    start_date: "",
    deadline: "",
    card_color: CARD_COLORS[0],
};

export default function CreateNewChallenge() {
    const [isOpen, setIsOpen] = useState(false);
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: DEFAULT_VALUES });

    // Watch form values for real-time card preview and dynamic styling
    const formValues = watch();
    const {
        type: selectedType,
        departments: selectedDepartments,
        card_color: selectedCardColor,
        title: previewTitle,
        category: previewCategory,
        points: previewPoints,
    } = formValues;

    // Clean up object URL when component unmounts or banner changes
    useEffect(() => {
        return () => {
            if (bannerPreview) {
                URL.revokeObjectURL(bannerPreview);
            }
        };
    }, [bannerPreview]);

    const handleClose = () => {
        setIsOpen(false);
        reset(DEFAULT_VALUES);
        removeBanner();
    };

    const handleBannerChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (bannerPreview) URL.revokeObjectURL(bannerPreview);

        setBannerFile(file);
        setBannerPreview(URL.createObjectURL(file));
    };

    const removeBanner = () => {
        if (bannerPreview) URL.revokeObjectURL(bannerPreview);
        setBannerFile(null);
        setBannerPreview(null);
    };

    const toggleDepartment = (deptName) => {
        const current = selectedDepartments || [];
        const updated = current.includes(deptName)
            ? current.filter((d) => d !== deptName)
            : [...current, deptName];

        setValue("departments", updated, { shouldValidate: true });
    };

    const onSubmit = async (data) => {
        try {
            const payload = { ...data, banner: bannerFile };
            console.log("Creating challenge:", payload);
            // Execute mutation/action here...
            handleClose();
        } catch (error) {
            console.error("Failed to create challenge:", error);
        }
    };

    return (
        <div>
            {/* Header Section */}
            <div className="mt-4 flex items-start justify-between gap-4 p-2">
              
                <Button
                    variant="engagement"
                    className="shrink-0 rounded-full"
                    onClick={() => setIsOpen(true)}
                >
                    <PlusCircleIcon className="mr-2 h-4 w-4" />
                    Add new challenge
                </Button>
            </div>

            {/* Modal Container */}
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                width="max-w-xl"
                title={
                    <div>
                        <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                            Add new challenge
                        </h2>
                        <p className="mt-0.5 text-xs text-gray-400">
                            Set up a challenge for your team to complete
                            together and track their progress.
                        </p>
                    </div>
                }
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-4 flex flex-col gap-4 p-2 pb-2"
                >
                    {/* Banner Upload Section */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Challenge Banner{" "}
                            <span className="text-gray-400">(optional)</span>
                        </label>

                        {bannerPreview ? (
                            <div className="relative overflow-hidden rounded-2xl border border-gray-200">
                                <img
                                    src={bannerPreview}
                                    alt="Challenge banner preview"
                                    className="h-32 w-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeBanner}
                                    className="absolute right-2 top-2 rounded-full bg-white/90 p-1 shadow transition hover:bg-white"
                                    aria-label="Remove banner image"
                                >
                                    <X className="h-4 w-4 text-gray-600" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-400 transition hover:border-gray-300 hover:bg-gray-50">
                                <ImagePlus className="h-5 w-5" />
                                <span className="text-xs">
                                    Upload banner image
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleBannerChange}
                                />
                            </label>
                        )}
                    </div>

                    {/* Title Input */}
                    <Input
                        label="Challenge Title"
                        placeholder="e.g. 30 Day Wellness Streak"
                        error={errors.title?.message}
                        {...register("title", {
                            required: "Challenge title is required.",
                        })}
                    />

                    {/* Description */}
                    <TextArea
                        label="Description"
                        placeholder="Describe what participants need to do and how to complete the challenge..."
                        rows={3}
                        error={errors.description?.message}
                        {...register("description", {
                            required: "Description is required.",
                        })}
                    />

                    {/* Type & Category Options */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <span className="mb-1 block text-sm font-semibold text-gray-900">
                                Type
                            </span>
                            <div className="flex gap-2">
                                {CHALLENGE_TYPES.map((type) => {
                                    const isSelected = selectedType === type;
                                    return (
                                        <button
                                            key={type}
                                            type="button"
                                            aria-pressed={isSelected}
                                            onClick={() =>
                                                setValue("type", type)
                                            }
                                            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                                                isSelected
                                                    ? "border-orange-500 bg-orange-50 text-orange-600"
                                                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <Controller
                            name="category"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Select
                                    label="Category"
                                    name={field.name}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    error={fieldState.error?.message}
                                    options={CATEGORY_OPTIONS}
                                />
                            )}
                        />
                    </div>

                    {/* Points Reward */}
                    <Input
                        label="Points Reward"
                        type="number"
                        min={1}
                        placeholder="e.g. 300"
                        error={errors.points?.message}
                        {...register("points", {
                            required: "Points reward is required.",
                            min: {
                                value: 1,
                                message: "Points must be greater than 0.",
                            },
                        })}
                    />

                    {/* Department Selection & Participants */}
                    <div>
                        <span className="mb-1 block text-sm font-semibold text-gray-900">
                            Eligible Participants
                        </span>

                        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                            <span>All Employees</span>
                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                                {TOTAL_EMPLOYEES} employees
                            </span>
                        </div>

                        <div className="my-2 flex items-center gap-2 text-xs text-gray-400">
                            <span className="h-px flex-1 bg-gray-200" />
                            or select departments
                            <span className="h-px flex-1 bg-gray-200" />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {DEPARTMENTS.map((dept) => {
                                const isSelected =
                                    selectedDepartments?.includes(dept.name);
                                return (
                                    <button
                                        key={dept.name}
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() =>
                                            toggleDepartment(dept.name)
                                        }
                                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                            isSelected
                                                ? "border-orange-400 bg-orange-50 text-orange-700"
                                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                        }`}
                                    >
                                        {dept.name}{" "}
                                        <span className="text-gray-400">
                                            {dept.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-6 text-xs text-gray-400">
                            <Input
                                label="Max Participants"
                                type="number"
                                min={1}
                                placeholder="Enter a custom number"
                                className="mt-3"
                                {...register("max_participants")}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input
                            label="Start Date"
                            type="date"
                            error={errors.start_date?.message}
                            {...register("start_date", {
                                required: "Start date is required.",
                            })}
                        />
                        <Input
                            label="Deadline"
                            type="date"
                            error={errors.deadline?.message}
                            {...register("deadline", {
                                required: "Deadline is required.",
                                validate: (value, formValues) =>
                                    !formValues.start_date ||
                                    value >= formValues.start_date ||
                                    "Deadline must be after the start date.",
                            })}
                        />
                    </div>

                    <div>
                        <span className="mb-2 block text-sm font-semibold text-gray-900">
                            Card Color
                        </span>
                        <div className="flex gap-2">
                            {CARD_COLORS.map((color) => {
                                const isSelected = selectedCardColor === color;
                                return (
                                    <button
                                        key={color}
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() =>
                                            setValue("card_color", color)
                                        }
                                        style={{ backgroundColor: color }}
                                        className={`h-7 w-7 rounded-full transition ${
                                            isSelected
                                                ? "ring-2 ring-gray-400 ring-offset-2"
                                                : "hover:opacity-80"
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div
                        className="flex items-center justify-between rounded-2xl px-4 py-3 transition-colors"
                        style={{
                            backgroundColor: selectedCardColor,
                        }}
                    >
                        <div>
                            <div className="text-sm font-semibold text-white">
                                {previewTitle || "Challenge title preview"}
                            </div>
                            <div className="text-xs text-white">
                                {selectedType} · {previewCategory}
                            </div>
                        </div>
                        <span
                            className="rounded-full px-2.5 py-1 text-xs font-semibold text-white transition-colors"
                            style={{ backgroundColor: selectedCardColor }}
                        >
                            +{previewPoints || 0} pts
                        </span>
                    </div>

                    <div className="mt-4 flex flex-col justify-end gap-2 sm:flex-row">
                        <Button
                            type="button"
                            onClick={handleClose}
                            className="w-full sm:w-auto"
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Publishing..."
                                : "Publish Challenge"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
