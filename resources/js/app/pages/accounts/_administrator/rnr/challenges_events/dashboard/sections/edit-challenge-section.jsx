import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Building2, ImagePlus, Landmark, Pencil, Users, X } from "lucide-react";

import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import Select from "@/app/_components/select";
import TextArea from "@/app/_components/textarea";
import { setAlert } from "@/app/redux/app-slice";
import {
    update_engagement_reward_challenge_thunk,
    get_engagement_reward_challenge_options_thunk,
} from "@/app/redux/engagement-thunk";

const CHALLENGE_TYPES = ["Individual", "Team"];

const CATEGORIES = ["Wellness", "Sales", "Learning", "Teamwork", "Innovation"];
const CATEGORY_OPTIONS = CATEGORIES.map((cat) => ({ value: cat, label: cat }));

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

function buildDefaultValues(challenge) {
    return {
        title: challenge.title ?? "",
        description: challenge.description ?? "",
        type: challenge.type ?? "Individual",
        category: challenge.category ?? CATEGORIES[0],
        points: challenge.points ?? "",
        all_employees: challenge.all_employees ?? true,
        department_ids: (challenge.departments ?? []).map((d) => d.id),
        account_ids: (challenge.accounts ?? []).map((a) => a.id),
        max_participants: challenge.max_participants ?? "",
        start_date: challenge.start_date ?? "",
        deadline: challenge.deadline ?? "",
        card_color: challenge.card_color ?? CARD_COLORS[0],
    };
}

export default function EditChallengeSection({ challenge }) {
    const dispatch = useDispatch();
    const {
        rewardChallengeDepartments,
        rewardChallengeAccounts,
        rewardChallengeTotalEmployees,
        rewardChallengeUpdating,
    } = useSelector((state) => state.engagement);

    const [isOpen, setIsOpen] = useState(false);
    const [bannerFile, setBannerFile] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(challenge.banner_url ?? null);
    const [participantsError, setParticipantsError] = useState("");

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({ defaultValues: buildDefaultValues(challenge) });

    const formValues = watch();
    const {
        type: selectedType,
        department_ids: selectedDepartmentIds,
        account_ids: selectedAccountIds,
        all_employees: allEmployees,
        card_color: selectedCardColor,
        title: previewTitle,
        category: previewCategory,
        points: previewPoints,
    } = formValues;

    useEffect(() => {
        return () => {
            if (bannerPreview && bannerFile) {
                URL.revokeObjectURL(bannerPreview);
            }
        };
    }, [bannerPreview, bannerFile]);

    useEffect(() => {
        if (isOpen && rewardChallengeDepartments.length === 0 && rewardChallengeAccounts.length === 0) {
            dispatch(get_engagement_reward_challenge_options_thunk());
        }
    }, [isOpen, dispatch, rewardChallengeDepartments.length, rewardChallengeAccounts.length]);

    const handleClose = () => {
        setIsOpen(false);
        setParticipantsError("");
        reset(buildDefaultValues(challenge));
        if (bannerFile && bannerPreview) URL.revokeObjectURL(bannerPreview);
        setBannerFile(null);
        setBannerPreview(challenge.banner_url ?? null);
    };

    const handleBannerChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (bannerFile && bannerPreview) URL.revokeObjectURL(bannerPreview);

        setBannerFile(file);
        setBannerPreview(URL.createObjectURL(file));
    };

    const removeBanner = () => {
        if (bannerFile && bannerPreview) URL.revokeObjectURL(bannerPreview);
        setBannerFile(null);
        setBannerPreview(null);
    };

    const toggleAllEmployees = () => {
        setParticipantsError("");
        setValue("all_employees", true, { shouldValidate: true });
        setValue("department_ids", [], { shouldValidate: true });
        setValue("account_ids", [], { shouldValidate: true });
    };

    const toggleDepartment = (deptId) => {
        const current = selectedDepartmentIds || [];
        const updated = current.includes(deptId)
            ? current.filter((id) => id !== deptId)
            : [...current, deptId];

        setParticipantsError("");
        setValue("all_employees", false, { shouldValidate: true });
        setValue("account_ids", [], { shouldValidate: true });
        setValue("department_ids", updated, { shouldValidate: true });
    };

    const toggleAccount = (accountId) => {
        const current = selectedAccountIds || [];
        const updated = current.includes(accountId)
            ? current.filter((id) => id !== accountId)
            : [...current, accountId];

        setParticipantsError("");
        setValue("all_employees", false, { shouldValidate: true });
        setValue("department_ids", [], { shouldValidate: true });
        setValue("account_ids", updated, { shouldValidate: true });
    };

    const onSubmit = async (data) => {
        if (
            !data.all_employees &&
            data.department_ids.length === 0 &&
            data.account_ids.length === 0
        ) {
            setParticipantsError("Select at least one department or account, or choose All Employees.");
            return;
        }
        setParticipantsError("");

        const payload = {
            title: data.title,
            description: data.description,
            type: data.type,
            category: data.category,
            points: Number(data.points),
            all_employees: data.all_employees,
            account_ids: data.all_employees ? [] : data.account_ids,
            department_ids: data.all_employees ? [] : data.department_ids,
            max_participants: data.max_participants ? Number(data.max_participants) : null,
            start_date: data.start_date,
            deadline: data.deadline,
            card_color: data.card_color,
            banner: bannerFile,
        };

        const result = await dispatch(
            update_engagement_reward_challenge_thunk({ id: challenge.id, data: payload }),
        );

        if (result.error) {
            const msg =
                result.payload?.message ||
                result.error?.message ||
                "Failed to update challenge. Please try again.";
            dispatch(
                setAlert({
                    type: "danger",
                    title: "Failed to update challenge",
                    message: msg,
                    open: true,
                }),
            );
            return;
        }

        dispatch(
            setAlert({
                type: "success",
                title: "Challenge updated",
                message: "Your changes have been saved.",
                open: true,
            }),
        );

        setIsOpen(false);
    };

    return (
        <div>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="p-1 rounded-full bg-blue-50 text-blue-400 hover:bg-blue-100 transition-colors"
                aria-label="Edit challenge"
            >
                <Pencil className="w-3.5 h-3.5" />
            </button>

            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                width="max-w-xl"
                title={
                    <div>
                        <h2 className="text-[15px] font-semibold text-neutral-800 leading-snug">
                            Edit challenge
                        </h2>
                        <p className="mt-0.5 text-xs text-gray-400">
                            Update the details for this challenge.
                        </p>
                    </div>
                }
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-4 flex flex-col gap-4 p-2 pb-2"
                >
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

                    <Input
                        label="Challenge Title"
                        placeholder="e.g. 30 Day Wellness Streak"
                        error={errors.title?.message}
                        {...register("title", {
                            required: "Challenge title is required.",
                        })}
                    />

                    <Controller
                        name="description"
                        control={control}
                        rules={{ required: "Description is required." }}
                        render={({ field, fieldState }) => (
                            <TextArea
                                label="Description"
                                placeholder="Describe what participants need to do and how to complete the challenge..."
                                rows={3}
                                {...field}
                                error={fieldState.error?.message}
                            />
                        )}
                    />

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

                    <div>
                        <span className="mb-1 block text-sm font-semibold text-gray-900">
                            Eligible Participants
                        </span>

                        <button
                            type="button"
                            aria-pressed={allEmployees}
                            onClick={toggleAllEmployees}
                            className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition ${
                                allEmployees
                                    ? "border-orange-400 bg-orange-50"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                        >
                            <span className="flex items-center gap-2.5 text-sm font-medium text-gray-800">
                                <span
                                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                        allEmployees
                                            ? "bg-orange-100 text-orange-600"
                                            : "bg-gray-100 text-gray-500"
                                    }`}
                                >
                                    <Users className="h-4 w-4" />
                                </span>
                                All Employees
                            </span>
                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                                {rewardChallengeTotalEmployees} employees
                            </span>
                        </button>

                        <div className="my-2 flex items-center gap-2 text-xs text-gray-400">
                            <span className="h-px flex-1 bg-gray-200" />
                            or select departments
                            <span className="h-px flex-1 bg-gray-200" />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {rewardChallengeDepartments.map((dept) => {
                                const isSelected =
                                    selectedDepartmentIds?.includes(dept.id);
                                return (
                                    <button
                                        key={dept.id}
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() =>
                                            toggleDepartment(dept.id)
                                        }
                                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                            isSelected
                                                ? "border-orange-400 bg-orange-50 text-orange-700"
                                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                        }`}
                                    >
                                        <Building2 className="h-3.5 w-3.5" />
                                        {dept.name}{" "}
                                        <span className="text-gray-400">
                                            {dept.employees_count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {rewardChallengeAccounts.length > 0 && (
                            <>
                                <div className="my-2 flex items-center gap-2 text-xs text-gray-400">
                                    <span className="h-px flex-1 bg-gray-200" />
                                    or select accounts
                                    <span className="h-px flex-1 bg-gray-200" />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {rewardChallengeAccounts.map((account) => {
                                        const isSelected =
                                            selectedAccountIds?.includes(account.id);
                                        return (
                                            <button
                                                key={account.id}
                                                type="button"
                                                aria-pressed={isSelected}
                                                onClick={() =>
                                                    toggleAccount(account.id)
                                                }
                                                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                                    isSelected
                                                        ? "border-orange-400 bg-orange-50 text-orange-700"
                                                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                                }`}
                                            >
                                                <Landmark className="h-3.5 w-3.5" />
                                                {account.name}{" "}
                                                <span className="text-gray-400">
                                                    {account.employees_count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                        {participantsError && (
                            <p className="mt-2 text-sm text-red-500">{participantsError}</p>
                        )}
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
                            disabled={isSubmitting || rewardChallengeUpdating}
                        >
                            {isSubmitting || rewardChallengeUpdating
                                ? "Saving..."
                                : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
