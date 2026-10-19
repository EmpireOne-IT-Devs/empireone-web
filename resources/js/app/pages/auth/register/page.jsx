import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { motion, useReducedMotion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    IdCard,
    Mail,
    UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@/app/_components/button";
import Input from "@/app/_components/input";
import Select from "@/app/_components/select";
import { get_location_thunk } from "@/app/redux/app-thunk";
import { submit_account_pending_thunk } from "@/app/redux/account-pending-thunk";
import { reset_account_pending_submission } from "@/app/redux/account-pending-slice";
import NavFooterSection from "../../landing_page/sections/nav-footer-section";

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
        <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[linear-gradient(135deg,#5a3d9a_0%,#0d1b4b_50%,#0a0a2e_50%,#e85c0d_150%)] font-sans">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                {[
                    "left-1/4 top-1/4 bg-purple-600",
                    "bottom-1/4 right-1/4 bg-orange-600",
                    "right-1/3 top-1/2 bg-blue-500",
                ].map((className, index) => (
                    <motion.div
                        key={className}
                        animate={
                            reduceMotion
                                ? undefined
                                : {
                                      x: [0, index === 1 ? -40 : 40, 0],
                                      y: [0, 30, 0],
                                  }
                        }
                        transition={{
                            duration: 10 + index * 2,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className={`absolute h-80 w-80 rounded-full opacity-20 blur-[120px] ${className}`}
                    />
                ))}
            </div>

            <main className="relative z-10 flex w-full flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
                <motion.div
                    initial={reduceMotion ? false : { y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full max-w-md px-4 py-6 sm:px-9 sm:py-8 md:rounded-[2rem] md:border md:border-white/50 md:bg-white/5 md:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.3)] md:backdrop-blur-2xl"
                >
                    <header className="mb-8 flex flex-col items-center text-center">
                        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
                            Create Account
                        </h1>
                        <p className="flex flex-wrap items-center justify-center gap-1 text-sm text-slate-300">
                            Join your
                            <img
                                src="/images/E1CXlogo.png"
                                alt="EmpireOne"
                                className="h-4 w-auto object-contain"
                            />
                            team
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="location_id"
                                className="ml-1 block text-xs font-bold uppercase tracking-widest text-slate-300"
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
                                    className="!rounded-xl !border-white/10 !bg-white/5 !py-4 !text-white disabled:cursor-not-allowed"
                                />
                            </div>
                            <p
                                id="location-help"
                                className="ml-1 text-xs text-slate-400"
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
                                    className="ml-1 block text-xs font-bold uppercase tracking-widest text-slate-300 transition-colors group-focus-within:text-orange-400"
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
                                                className="h-5 w-5 text-slate-400"
                                            />
                                        }
                                        className="!rounded-xl !border-white/10 !bg-white/5 !py-4 !pl-11 !text-white placeholder:text-slate-400 focus:!border-orange-500 focus:!ring-orange-500/20"
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
                                <p className="rounded-xl border border-orange-400/30 bg-orange-400/10 p-3 text-sm text-orange-100">
                                    Registration submitted. Your account is
                                    pending review by the HR team for your
                                    selected location.
                                </p>
                            )}
                        </div>

                        {submitError && (
                            <p
                                role="alert"
                                className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-100"
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
                            className="!w-full gap-3 !rounded-xl !bg-gradient-to-br from-orange-600 via-violet-600 to-blue-500 !py-4 !font-bold uppercase tracking-widest !text-white transition-transform hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400 motion-safe:active:scale-[0.98]"
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

                        <div className="border-t border-white/10 pt-5 text-center">
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-slate-300 transition-colors hover:text-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400"
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
            </main>
            <NavFooterSection />
        </div>
    );
}
