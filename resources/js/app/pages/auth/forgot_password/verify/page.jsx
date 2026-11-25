import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";
import { Head, Link, useForm } from "@inertiajs/react";
import { useDispatch } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import AuthLayout from "@/app/pages/auth/layout";

export default function ForgotPassword() {
    const dispatch = useDispatch();
    const reduceMotion = useReducedMotion();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"), {
            onSuccess: async () => {
                reset("email");
                await dispatch(
                    setAlert({
                        type: "success",
                        title: "Password reset link sent successfully!",
                    }),
                );
            },
            onError: async (formErrors) => {
                const message =
                    formErrors.email || "Something went wrong. Please try again.";

                await dispatch(
                    setAlert({
                        type: "error",
                        title: message,
                    }),
                );
            },
        });
    };

    return (
        <AuthLayout>
            <Head title="Forgot Password" />
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
                        Forgot Password?
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                        No problem. Enter your email address and we will send
                        you a password reset link.
                    </p>
                </header>

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="ml-1 block text-xs font-medium text-violet-700"
                        >
                            Email Address
                        </label>
                        <div className="relative">
                            <FaEnvelope
                                aria-hidden="true"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={
                                    errors.email ? "email-error" : undefined
                                }
                                className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-violet-200 ${
                                    errors.email
                                        ? "border-red-400 focus:border-red-500"
                                        : "border-violet-200 focus:border-violet-500"
                                }`}
                                placeholder="sample@empireonegroup.com"
                                autoFocus
                            />
                        </div>
                        {errors.email && (
                            <p
                                id="email-error"
                                className="ml-1 text-xs text-red-600"
                            >
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <motion.button
                        type="submit"
                        disabled={processing}
                        whileHover={
                            reduceMotion || processing
                                ? undefined
                                : { scale: 1.01 }
                        }
                        whileTap={
                            reduceMotion || processing
                                ? undefined
                                : { scale: 0.98 }
                        }
                        aria-busy={processing}
                        className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-blue-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {processing ? (
                            <>
                                <motion.span
                                    aria-hidden="true"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 1,
                                        ease: "linear",
                                    }}
                                    className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                                />
                                Sending...
                            </>
                        ) : (
                            "Email Reset Link"
                        )}
                    </motion.button>
                </form>

                <div className="mt-6 border-t border-violet-100 pt-5 text-center">
                    <Link
                        href={route("login")}
                        className="text-sm font-medium text-violet-600 transition-colors hover:text-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
                    >
                        Return to Login
                    </Link>
                </div>
            </motion.div>
        </AuthLayout>
    );
}
