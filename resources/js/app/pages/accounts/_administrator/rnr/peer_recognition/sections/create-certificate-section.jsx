import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import moment from "moment";
import {
    FiAward as Award,
    FiLoader as Loader2,
    FiUser as User,
} from "react-icons/fi";
import { FaPaperPlane } from "react-icons/fa6";

import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Modal from "@/app/_components/modal";
import TextArea from "@/app/_components/textarea";
import useCurrentEmployee from "@/app/_hooks/use-current-employee";
import {
    create_engagement_reward_recognition_thunk,
    search_reward_recognition_employees_thunk,
} from "@/app/redux/engagement-thunk";
import { clearSearchResults } from "@/app/redux/engagement-slice";
import { setAlert } from "@/app/redux/app-slice";

import CertificateRewardSection, {
    AWARD_MESSAGES,
} from "./certificate-reward-section";
import { PEOPLE_AWARDS, VALUE_AWARDS } from "./award-options";

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

const AWARD_GROUPS = [
    { label: "Value Awards", options: VALUE_AWARDS },
    { label: "People Awards", options: PEOPLE_AWARDS },
];

const DEFAULT_VALUES = {
    recipient_name: "",
    award_title: "",
    company_value: "",
    points: "",
    message: "",
    issued_at: moment().format("YYYY-MM-DD"),
    left_side_name: "Giovanni Yap",
    left_side_title: "Executive Director",
    right_side_name: "Fawad Nasir",
    right_side_title: "Chief Executive Officer",
};

export default function CreateCertificateSection() {
    const { isReady, isContentManager } = useCurrentEmployee();
    const dispatch = useDispatch();
    const { rewardSearchResults, rewardSearching, rewardCreating } =
        useSelector((state) => state.engagement);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [awardDropdownOpen, setAwardDropdownOpen] = useState(false);
    const [awardHighlight, setAwardHighlight] = useState(-1);
    const awardContainerRef = useRef(null);

    const { register, reset, setValue, watch } = useForm({
        defaultValues: DEFAULT_VALUES,
    });

    const recipientName = watch("recipient_name") || "";
    const awardTitle = watch("award_title") || "";
    const companyValue = watch("company_value") || "";
    const points = watch("points");
    const message = watch("message") || "";
    const issuedAt = watch("issued_at");
    const leftSideName = watch("left_side_name");
    const leftSideTitle = watch("left_side_title");
    const rightSideName = watch("right_side_name");
    const rightSideTitle = watch("right_side_title");

    // Debounced employee auto-detect while typing a name.
    useEffect(() => {
        if (!isOpen || selectedEmployee) return;

        if (recipientName.trim().length < 2) {
            dispatch(clearSearchResults());
            return;
        }

        const timer = setTimeout(() => {
            dispatch(
                search_reward_recognition_employees_thunk(recipientName.trim()),
            );
        }, 250);

        return () => clearTimeout(timer);
    }, [dispatch, isOpen, recipientName, selectedEmployee]);

    const departmentName = selectedEmployee
        ? (typeof selectedEmployee.department === "string"
              ? selectedEmployee.department
              : selectedEmployee.department?.name) ||
          selectedEmployee.account?.name ||
          ""
        : "";

    const effectiveAwardTitle = awardTitle.trim();

    // Filtered preset groups for the award combobox.
    const filteredAwardGroups = useMemo(() => {
        const term = awardTitle.trim().toLowerCase();

        return AWARD_GROUPS.map((group) => ({
            ...group,
            options: term
                ? group.options.filter(
                      (option) =>
                          option.label.toLowerCase().includes(term) ||
                          option.value.toLowerCase().includes(term),
                  )
                : group.options,
        })).filter((group) => group.options.length > 0);
    }, [awardTitle]);

    const flatAwardOptions = useMemo(
        () => filteredAwardGroups.flatMap((group) => group.options),
        [filteredAwardGroups],
    );

    const hasExactPreset = flatAwardOptions.some(
        (option) => option.value.toLowerCase() === awardTitle.trim().toLowerCase(),
    );

    // Close the award dropdown on outside click.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                awardContainerRef.current &&
                !awardContainerRef.current.contains(event.target)
            ) {
                setAwardDropdownOpen(false);
            }
        };

        window.addEventListener("mousedown", handleClickOutside, true);
        return () =>
            window.removeEventListener("mousedown", handleClickOutside, true);
    }, []);

    const canPreview =
        recipientName.trim().length > 0 && effectiveAwardTitle.length > 0;

    const draft = useMemo(
        () => ({
            id: "draft",
            certificate_number: "DRAFT",
            recipient_name: recipientName.trim(),
            department: departmentName,
            award_title: effectiveAwardTitle,
            custom_message: message.trim() || null,
            message: message.trim(),
            issued_at: issuedAt,
            left_side_name: leftSideName,
            left_side_title: leftSideTitle,
            right_side_name: rightSideName,
            right_side_title: rightSideTitle,
            pointsAwarded: points ? Number(points) : 0,
        }),
        [
            recipientName,
            departmentName,
            effectiveAwardTitle,
            message,
            issuedAt,
            leftSideName,
            leftSideTitle,
            rightSideName,
            rightSideTitle,
            points,
        ],
    );

    const handleSelectAward = (value) => {
        setValue("award_title", value);
        setAwardDropdownOpen(false);
        setAwardHighlight(-1);

        if (AWARD_MESSAGES[value]) {
            setValue("message", AWARD_MESSAGES[value].join("\n\n"));
        }
    };

    const handleAwardKeyDown = (event) => {
        if (event.key === "Escape") {
            setAwardDropdownOpen(false);
            setAwardHighlight(-1);
            return;
        }

        if (!awardDropdownOpen) {
            if (event.key === "ArrowDown" || event.key === "Enter") {
                setAwardDropdownOpen(true);
            }
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setAwardHighlight((prev) =>
                prev < flatAwardOptions.length - 1 ? prev + 1 : 0,
            );
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setAwardHighlight((prev) =>
                prev > 0 ? prev - 1 : flatAwardOptions.length - 1,
            );
        } else if (event.key === "Enter") {
            event.preventDefault();
            if (
                awardHighlight >= 0 &&
                awardHighlight < flatAwardOptions.length
            ) {
                handleSelectAward(flatAwardOptions[awardHighlight].value);
            } else {
                setAwardDropdownOpen(false);
            }
        }
    };

    const handleSelectEmployee = (employee) => {
        setSelectedEmployee(employee);
        setValue(
            "recipient_name",
            `${employee.first_name} ${employee.last_name}`.trim(),
        );
        dispatch(clearSearchResults());
    };

    const handleClearEmployee = () => {
        setSelectedEmployee(null);
        setValue("recipient_name", "");
        dispatch(clearSearchResults());
    };

    const resetForm = () => {
        reset(DEFAULT_VALUES);
        setSelectedEmployee(null);
        setFieldErrors({});
        setFormError("");
        dispatch(clearSearchResults());
    };

    const handleClose = () => {
        setIsOpen(false);
        resetForm();
    };

    const handleSave = async () => {
        setFieldErrors({});
        setFormError("");

        const errors = {};

        if (!selectedEmployee) {
            errors.recipient_name =
                "Please select an employee from the search results.";
        }
        if (!effectiveAwardTitle) {
            errors.award_title = "Please enter or select an award category.";
        }
        if (message.trim().length < 5) {
            errors.message = "Message must be at least 5 characters.";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        const payload = {
            employee_id: selectedEmployee.id,
            award_category: effectiveAwardTitle,
            company_value: companyValue || null,
            award_point: points ? Number(points) : null,
            message: message.trim(),
        };

        const result = await dispatch(
            create_engagement_reward_recognition_thunk(payload),
        );

        if (result.error) {
            const serverErrors = result.payload?.errors;
            if (serverErrors) {
                setFieldErrors(
                    Object.fromEntries(
                        Object.entries(serverErrors).map(([key, value]) => [
                            key,
                            Array.isArray(value) ? value[0] : value,
                        ]),
                    ),
                );
            }
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
                message: "The certificate was issued and posted to the recognitions feed.",
                open: true,
            }),
        );

        handleClose();
    };

    if (!isReady) {
        return (
            <div className="h-10 w-44 shrink-0 animate-pulse rounded-full bg-gray-200" />
        );
    }

    if (!isContentManager) {
        return null;
    }

    return (
        <>
            <Button
                variant="engagement"
                onClick={() => setIsOpen(true)}
                className="shrink-0 rounded-full"
            >
                <Award className="mr-2 h-4 w-4" />
                Create Certificate
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                width="max-w-6xl"
                title={
                    <div>
                        <h2 className="text-[15px] font-semibold leading-snug text-neutral-800">
                            Create Certificate
                        </h2>
                        <p className="mt-0.5 text-xs text-gray-400">
                            Recognize an employee with a printable certificate —
                            it posts to the recognitions feed when saved.
                        </p>
                    </div>
                }
            >
                <div className="mt-4 grid grid-cols-1 gap-6 p-2 lg:grid-cols-12">
                    {/* ================================================
                        EDITABLE FORM
                    ================================================ */}
                    <div className="flex flex-col gap-4 lg:col-span-5">
                        {/* Recipient with employee auto-detect */}
                        <div>
                            <Input
                                label="Recipient name"
                                name="recipient_name"
                                placeholder="Search employee by name..."
                                value={recipientName}
                                onChange={(e) => {
                                    setValue("recipient_name", e.target.value);
                                    if (selectedEmployee) {
                                        setSelectedEmployee(null);
                                    }
                                }}
                                autoComplete="off"
                                iconLeft={<User size={16} />}
                                error={fieldErrors.recipient_name}
                            />

                            {selectedEmployee ? (
                                <div className="mt-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                                    <div className="font-medium">
                                        {selectedEmployee.first_name}{" "}
                                        {selectedEmployee.last_name}
                                    </div>
                                    {departmentName && (
                                        <div className="text-xs text-green-700">
                                            {departmentName}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleClearEmployee}
                                        className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-green-700 shadow-sm hover:bg-green-100"
                                    >
                                        Change selection
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    {(rewardSearching ||
                                        (recipientName.trim().length >= 2 &&
                                            rewardSearchResults.length ===
                                                0)) && (
                                        <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-sm">
                                            {rewardSearching ? (
                                                <span className="inline-flex items-center gap-2">
                                                    <Loader2
                                                        size={14}
                                                        className="animate-spin"
                                                    />
                                                    Searching employees...
                                                </span>
                                            ) : (
                                                "No employees found. A certificate needs a system employee — try another spelling."
                                            )}
                                        </div>
                                    )}

                                    {rewardSearchResults.length > 0 && (
                                        <div
                                            role="listbox"
                                            aria-label="Employee search results"
                                            className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg"
                                        >
                                            {rewardSearchResults.map(
                                                (employee) => (
                                                    <button
                                                        key={employee.id}
                                                        type="button"
                                                        role="option"
                                                        aria-selected="false"
                                                        onClick={() =>
                                                            handleSelectEmployee(
                                                                employee,
                                                            )
                                                        }
                                                        className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                                                    >
                                                        <div className="font-medium">
                                                            {
                                                                employee.first_name
                                                            }{" "}
                                                            {employee.last_name}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {employee.department
                                                                ?.name ||
                                                                "No department"}
                                                        </div>
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Award category — combobox: pick a preset or type your own */}
                        <div ref={awardContainerRef} className="relative">
                            <div
                                role="combobox"
                                aria-expanded={awardDropdownOpen}
                                aria-haspopup="listbox"
                                aria-owns="award-category-listbox"
                            >
                                <Input
                                    label="Award Category"
                                    name="award_title"
                                    placeholder="Select or type an award title..."
                                    value={awardTitle}
                                    onChange={(e) => {
                                        setValue("award_title", e.target.value);
                                        setAwardDropdownOpen(true);
                                        setAwardHighlight(-1);
                                    }}
                                    onFocus={() => setAwardDropdownOpen(true)}
                                    onKeyDown={handleAwardKeyDown}
                                    autoComplete="off"
                                    iconLeft={<Award size={16} />}
                                    error={fieldErrors.award_title}
                                />
                            </div>

                            {awardDropdownOpen && (
                                <div
                                    id="award-category-listbox"
                                    role="listbox"
                                    aria-label="Award categories"
                                    className="absolute z-10 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-lg"
                                >
                                    {filteredAwardGroups.map((group) => (
                                        <div key={group.label}>
                                            <div className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                                                {group.label}
                                            </div>
                                            {group.options.map((option) => {
                                                const flatIndex =
                                                    flatAwardOptions.indexOf(
                                                        option,
                                                    );
                                                const highlighted =
                                                    flatIndex ===
                                                    awardHighlight;
                                                const selected =
                                                    option.value ===
                                                    awardTitle.trim();

                                                return (
                                                    <button
                                                        key={option.value}
                                                        type="button"
                                                        role="option"
                                                        aria-selected={selected}
                                                        onMouseDown={(e) =>
                                                            e.preventDefault()
                                                        }
                                                        onClick={() =>
                                                            handleSelectAward(
                                                                option.value,
                                                            )
                                                        }
                                                        onMouseEnter={() =>
                                                            setAwardHighlight(
                                                                flatIndex,
                                                            )
                                                        }
                                                        className={`w-full px-4 py-2.5 text-left text-sm ${
                                                            highlighted
                                                                ? "bg-purple-50 text-purple-700"
                                                                : selected
                                                                  ? "bg-purple-50/50 font-medium text-purple-700"
                                                                  : "text-slate-700 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ))}

                                    {awardTitle.trim() && !hasExactPreset && (
                                        <button
                                            type="button"
                                            onMouseDown={(e) =>
                                                e.preventDefault()
                                            }
                                            onClick={() =>
                                                setAwardDropdownOpen(false)
                                            }
                                            className="w-full border-t border-gray-100 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                                        >
                                            Use{" "}
                                            <span className="font-semibold text-purple-700">
                                                “{awardTitle.trim()}”
                                            </span>{" "}
                                            as a custom award
                                        </button>
                                    )}
                                </div>
                            )}

                            <p className="mt-1 text-xs text-gray-400">
                                Pick a preset or type your own award title.
                            </p>
                        </div>

                        {/* Company value */}
                        <div>
                            <div className="mb-1 text-sm font-semibold text-gray-900">
                                Company Value{" "}
                                <span className="font-normal text-gray-400">
                                    (optional)
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {COMPANY_VALUES.map((value) => {
                                    const selected = companyValue === value;
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
                                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                                selected
                                                    ? "border-indigo-600 bg-indigo-100 text-indigo-800"
                                                    : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                                            }`}
                                        >
                                            {value}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Points & issue date */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Input
                                label="Points (optional)"
                                name="points"
                                type="number"
                                min="0"
                                placeholder="0"
                                {...register("points")}
                            />
                            <Input
                                label="Issue date"
                                name="issued_at"
                                type="date"
                                {...register("issued_at")}
                            />
                        </div>

                        {/* Citation message */}
                        <div>
                            <TextArea
                                label="Citation message"
                                name="message"
                                placeholder="Tell them what they did and why it matters..."
                                rows={5}
                                {...register("message")}
                                error={fieldErrors.message}
                            />
                            <p className="mt-1 text-xs text-gray-400">
                                Separate paragraphs with a blank line.
                            </p>
                        </div>
                    </div>

                    {/* ================================================
                        LIVE PREVIEW
                    ================================================ */}
                    <div className="lg:col-span-7">
                        {canPreview ? (
                            <CertificateRewardSection
                                certificates={[draft]}
                                hideList
                            />
                        ) : (
                            <div className="flex h-96 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white">
                                <div className="px-6 text-center">
                                    <Award
                                        className="mx-auto mb-2 text-gray-300"
                                        size={32}
                                    />
                                    <p className="text-sm font-medium text-gray-600">
                                        Live certificate preview
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        Select an employee and an award category
                                        to see the certificate
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 p-2 pt-4">
                    {formError && (
                        <p className="text-xs text-red-500">{formError}</p>
                    )}
                    <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                        <p className="text-xs text-gray-400">
                            Saving posts the recognition to the feed. Print /
                            Download PDF are available on the preview.
                        </p>
                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                            <Button
                                onClick={handleClose}
                                variant="secondary"
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                variant="engagement"
                                disabled={rewardCreating}
                                loading={rewardCreating}
                                className="w-full sm:w-auto"
                            >
                                <FaPaperPlane className="mr-2 h-4 w-4" />
                                {rewardCreating
                                    ? "Sending..."
                                    : "Send Recognition"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}