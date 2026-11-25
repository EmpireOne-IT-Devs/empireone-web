import React, { useState } from "react";
import { useReducedMotion, motion } from "framer-motion";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, router, useForm } from "@inertiajs/react";
import { FcGoogle } from "react-icons/fc";
import { FaRegUserCircle } from "react-icons/fa";
import AuthLayout from "@/app/pages/auth/layout";

const Page = () => {
    const params = new URLSearchParams(location.search);
    const error_message = params.get("error_message");
    const reduceMotion = useReducedMotion();

    const { data, setData, post, processing, errors, reset } = useForm({
        login_id: "",
        password: "",
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("auth.login"), {
            onSuccess: () => reset("login_id"),
        });
    };

    return (
        <AuthLayout>
            <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
                className="w-full max-w-md"
            >
                            {/* Header */}
                            <header className="mb-8 flex flex-col items-center text-center">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-violet-300 bg-white shadow-sm">
                                    <img
                                        src="/images/E1Icon.png"
                                        alt=""
                                        className="h-12 w-12 object-contain"
                                    />
                                </div>

                                <h1 className="text-xl font-semibold text-violet-700 sm:text-2xl">
                                    Log in / Sign Up On EmpireOneCX
                                </h1>

                                <p className="mt-2 text-sm text-gray-500">
                                    Welcome back. Sign in to your account.
                                </p>
                            </header>

                            {/* Login Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Error Message */}
                                {error_message && (
                                    <div
                                        role="alert"
                                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                                    >
                                        {error_message}
                                    </div>
                                )}

                                {/* Employee ID / Email */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="login_id"
                                        className="ml-1 block text-xs font-medium text-violet-700"
                                    >
                                        Employee ID or Email Address
                                    </label>

                                    <div className="relative">
                                        <FaRegUserCircle
                                            aria-hidden="true"
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            id="login_id"
                                            name="login_id"
                                            type="text"
                                            autoComplete="username"
                                            value={data.login_id}
                                            onChange={(e) =>
                                                setData(
                                                    "login_id",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter your employee ID or email"
                                            aria-invalid={Boolean(
                                                errors.login_id,
                                            )}
                                            aria-describedby={
                                                errors.login_id
                                                    ? "login_id-error"
                                                    : undefined
                                            }
                                            className={`w-full rounded-xl border bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-violet-200 ${
                                                errors.login_id
                                                    ? "border-red-400 focus:border-red-500"
                                                    : "border-violet-200 focus:border-violet-500"
                                            }`}
                                        />
                                    </div>

                                    {errors.login_id && (
                                        <p
                                            id="login_id-error"
                                            className="ml-1 text-xs text-red-600"
                                        >
                                            {errors.login_id}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="password"
                                        className="ml-1 block text-xs font-medium text-violet-700"
                                    >
                                        Password
                                    </label>

                                    <div className="relative">
                                        <FaLock
                                            aria-hidden="true"
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter your password"
                                            aria-invalid={Boolean(
                                                errors.password,
                                            )}
                                            aria-describedby={
                                                errors.password
                                                    ? "password-error"
                                                    : undefined
                                            }
                                            className={`w-full rounded-xl border bg-white py-3 pl-11 pr-12 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-violet-200 ${
                                                errors.password
                                                    ? "border-red-400 focus:border-red-500"
                                                    : "border-violet-200 focus:border-violet-500"
                                            }`}
                                        />

                                        {/* Toggle Password Visibility */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    (visible) => !visible,
                                                )
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            aria-pressed={showPassword}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash />
                                            ) : (
                                                <FaEye />
                                            )}
                                        </button>
                                    </div>

                                    {errors.password && (
                                        <p
                                            id="password-error"
                                            className="ml-1 text-xs text-red-600"
                                        >
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Remember Me / Forgot Password */}
                                <div className="flex items-center justify-between gap-4 text-xs">
                                    <label className="flex cursor-pointer items-center gap-2 text-gray-600">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 rounded border-gray-300 accent-violet-600 focus:ring-violet-500"
                                        />
                                        Remember me
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.visit(
                                                "/auth/forgot_password",
                                            )
                                        }
                                        className="font-medium text-violet-600 transition hover:text-violet-800"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                {/* Login Button */}
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
                                    className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-blue-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {processing ? "Signing in..." : "Log in"}
                                </motion.button>

                                {/* Divider */}
                                <div className="flex items-center gap-3 pt-1">
                                    <span className="h-px flex-1 bg-violet-200" />

                                    <span className="text-xs text-gray-500">
                                        Or continue with
                                    </span>

                                    <span className="h-px flex-1 bg-violet-200" />
                                </div>

                                {/* Google Login */}
                                <a
                                    href="/api/auth/google/web"
                                    className="flex w-full items-center justify-center gap-3 rounded-xl border border-violet-200 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-500"
                                >
                                    <FcGoogle
                                        aria-hidden="true"
                                        className="text-xl"
                                    />
                                    Login With Google
                                </a>

                                {/* Register */}
                                <p className="pt-1 text-center text-sm text-gray-500">
                                    New to EmpireOneCX?{" "}
                                    <Link
                                        href={route("register")}
                                        className="font-medium text-violet-600 hover:text-violet-800"
                                    >
                                        Create an account
                                    </Link>
                                </p>
                            </form>
            </motion.div>
        </AuthLayout>
    );
};

export default Page;
