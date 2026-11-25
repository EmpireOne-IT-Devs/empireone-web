import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { motion, useReducedMotion } from "framer-motion";
import {
    FiArrowLeft as ArrowLeft,
    FiArrowRight as ArrowRight,
    FiBriefcase as BriefcaseBusiness,
    FiMail as Mail,
    FiUser as UserRound,
} from "react-icons/fi";
import {
    FaIdCard as IdCard,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { get_location_thunk } from "@/app/redux/app-thunk";
import { submit_account_pending_thunk } from "@/app/redux/account-pending-thunk";
import { reset_account_pending_submission } from "@/app/redux/account-pending-slice";
import AuthLayout from "@/app/pages/auth/layout";

const FIELDS = [
    {
        name: "full_name",
        label: "Full Name",
        placeholder: "Enter your full name",
        autoComplete: "name",
        icon: UserRound,
        required: true,
    },
    {
        name: "eid",
        label: "EID / Employee ID",
        placeholder: "Enter your employee ID",
        autoComplete: "off",
        icon: IdCard,
        required: true,
    },
    {
        name: "employee_email",
        label: "Employee Email",
        placeholder: "Your work email address",
        type: "email",
        autoComplete: "off",
        icon: Mail,
        required: true,
    },
    {
        name: "position",
        label: "Position",
        placeholder: "Enter your position",
        autoComplete: "organization-title",
        icon: BriefcaseBusiness,
        required: true,
    },
];

export default function Page() {
    const reduceMotion = useReducedMotion();
    const dispatch = useDispatch();
    const locations = useSelector((state) => state.app.locations);
    const { isSubmitting, isSubmitted } = useSelector(
        (state) => state.account_pendings,
    );
    const [data, setData] = useState({
        location_id: "",
        full_name: "",
        eid: "",
        employee_email: "",
        position: "",
    });
    const [locationLoading, setLocationLoading] = useState(true);
    const [locationError, setLocationError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const [submitError, setSubmitError] = useState("");

    useEffect(() => {
        dispatch(reset_account_pending_submission());

        async function loadLocations() {
            setLocationLoading(true);
            setLocationError("");
            try {
                await dispatch(get_location_thunk());
            } catch (error) {
                setLocationError(
                    error.response?.data?.message ||
                        "Unable to load locations. Please try again.",
                );
            } finally {
                setLocationLoading(false);
            }
        }

        loadLocations();
    }, [dispatch]);

    const clearSubmissionFeedback = () => {
        setSubmitError("");
        setValidationErrors({});
        dispatch(reset_account_pending_submission());
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitError("");
        setValidationErrors({});

        try {
            await dispatch(submit_account_pending_thunk(data)).unwrap();
        } catch (error) {
            const errors = error?.errors || {};
            setValidationErrors(
                Object.fromEntries(
                    Object.entries(errors).map(([field, messages]) => [
                        field,
                        Array.isArray(messages) ? messages[0] : messages,
                    ]),
                ),
            );
            setSubmitError(
                Object.keys(errors).length
                    ? ""
                    : error?.message ||
                          "Unable to submit your registration. Please try again.",
            );
        }
    };

    return (
        <AuthLayout>
            <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
                className="w-full max-w-md"
            >
                    <header className="mb-8 flex flex-col items-center text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-violet-300 bg-white shadow-sm">
                            <img
                                src="/images/E1Icon.png"
                                alt=""
                                className="h-12 w-12 object-contain"
                            />
                        </div>
                        <h1 className="text-xl font-semibold text-violet-700 sm:text-2xl">
                            Create Account
                        </h1>
                        <p className="mt-2 text-center text-sm text-gray-500">
                            Register your employee account for review.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label
                                htmlFor="location_id"
                                className="ml-1 block text-xs font-medium text-violet-700"
                            >
                                Location
                            </label>
                            <div>
                                <Select
                                    placeholder="Select your location"
                                    name="location_id"
                                    required
                                    disabled={
                                        locationLoading ||
                                        locations.length === 0 ||
                                        isSubmitted
                                    }
                                    value={data.location_id}
                                    onChange={(value) => {
                                        setData((current) => ({
                                            ...current,
                                            location_id: value,
                                        }));
                                        setValidationErrors((current) => ({
                                            ...current,
                                            location_id: "",
                                        }));
                                        clearSubmissionFeedback();
                                    }}
                                    options={locations.map((location) => ({
                                        label: location.name,
                                        value: String(location.id),
                                    }))}
                                    error={validationErrors.location_id}
                                    aria-invalid={Boolean(
                                        validationErrors.location_id,
                                    )}
                                    aria-describedby="location-help"
                                    className="!rounded-xl !border-violet-200 !bg-white !py-3 !text-gray-900 focus:!border-violet-500 focus:!ring-violet-200 disabled:cursor-not-allowed"
                                />
                            </div>
                            <p
                                id="location-help"
                                className="ml-1 text-xs text-gray-500"
                                role={locationError ? "alert" : undefined}
                            >
                                {locationError ||
                                    (locationLoading
                                        ? "Loading available locations..."
                                        : locations.length === 0
                                          ? "No locations are available right now."
                                          : "Choose the location where you work.")}
                            </p>
                        </div>

                        {FIELDS.map(({ name, label, icon: Icon, ...props }) => (
                            <div key={name} className="group space-y-2">
                                <label
                                    htmlFor={name}
                                    className="ml-1 block text-xs font-medium text-violet-700"
                                >
                                    {label}
                                </label>
                                <div className="[&_label]:hidden">
                                    <Input
                                        {...props}
                                        name={name}
                                        value={data[name]}
                                        onChange={(event) => {
                                            setData((current) => ({
                                                ...current,
                                                [name]: event.target.value,
                                            }));
                                            setValidationErrors((current) => ({
                                                ...current,
                                                [name]: "",
                                            }));
                                            clearSubmissionFeedback();
                                        }}
                                        error={validationErrors[name]}
                                        aria-invalid={Boolean(
                                            validationErrors[name],
                                        )}
                                        iconLeft={
                                            <Icon
                                                aria-hidden="true"
                                                className="h-5 w-5 text-gray-400"
                                            />
                                        }
                                        className="!rounded-xl !border-violet-200 !bg-white !py-3 !pl-11 !text-gray-900 placeholder:text-gray-400 focus:!border-violet-500 focus:!ring-violet-200"
                                    />
                                </div>
                            </div>
                        ))}

                        <div
                            role="status"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {isSubmitted && (
                                <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                                    Registration submitted. Your account is
                                    pending review by the HR team for your
                                    selected location.
                                </p>
                            )}
                        </div>

                        {submitError && (
                            <p
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                            >
                                {submitError}
                            </p>
                        )}

                        <Button
                            type="submit"
                            loading={isSubmitting}
                            disabled={
                                isSubmitting ||
                                isSubmitted ||
                                locationLoading ||
                                locations.length === 0
                            }
                            className="!w-full gap-3 !rounded-xl !bg-gradient-to-r from-purple-600 via-violet-600 to-blue-500 !py-3.5 !text-sm !font-semibold !normal-case !tracking-normal !text-white shadow-md shadow-violet-200 transition hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 motion-safe:active:scale-[0.98]"
                        >
                            {isSubmitted
                                ? "Submitted for Review"
                                : "Create Account"}
                            {!isSubmitted && (
                                <ArrowRight
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                />
                            )}
                        </Button>

                        <div className="border-t border-violet-100 pt-5 text-center">
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-violet-600 transition-colors hover:text-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-500"
                            >
                                <ArrowLeft
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                />
                                Back to Login
                            </Link>
                        </div>
                    </form>
            </motion.div>
        </AuthLayout>
    );
}
