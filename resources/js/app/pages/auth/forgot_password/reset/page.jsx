import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaShieldAlt,
    FaCheckCircle,
    FaExclamationTriangle,
} from "react-icons/fa";
import { Head, useForm, Link } from "@inertiajs/react";
import { useDispatch } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";

export default function ResetPassword({ token, email, flash }) {
    const dispatch = useDispatch();
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Color Palette Constants
    const colors = {
        darkNavy: "#04042c",
        electricBlue: "#5170ff",
        cyan: "#4ed1f4",
        deepPurple: "#4b0082",
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("password.store"), {
            onFinish: async () => {
                reset("password", "password_confirmation");
                await dispatch(
                    setAlert({
                        type: "success",
                        title: "Password reset successfully!",
                    }),
                );
            },
            onError: async (errors) => {
                // Optionally, you can pass the server validation errors to your alert
                const message =
                    errors.email || "Something went wrong. Please try again.";
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
        <div
            className="min-h-screen flex items-center justify-center font-sans overflow-hidden relative py-12"
            style={{ backgroundColor: colors.darkNavy }}
        >
            <Head title="Reset Password" />

            {/* --- INTERACTIVE BACKGROUND --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Large Blurred Orbs */}
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[130px] opacity-20"
                    style={{ backgroundColor: colors.deepPurple }}
                />
                <motion.div
                    animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[130px] opacity-20"
                    style={{ backgroundColor: colors.electricBlue }}
                />
            </div>

            {/* --- RESET PASSWORD CARD --- */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                // Changed border and rounded classes here for mobile responsiveness
                className="relative z-10 w-full max-w-md p-10 md:bg-white/5 md:backdrop-blur-2xl border-0 md:border md:border-white/10  md:rounded-[2rem] md:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
            >
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="text-5xl mb-6"
                        style={{
                            color: colors.cyan,
                            filter: `drop-shadow(0 0 15px ${colors.cyan}66)`,
                        }}
                    >
                        <FaShieldAlt />
                    </motion.div>

                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2 text-center">
                        Secure Account
                    </h2>
                    <p className="text-slate-400 text-sm text-center">
                        Create a new, strong password.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* Email (Usually Read-only in Reset context, but kept editable as per standard Breeze) */}
                    <div className="group space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[#4ed1f4] transition-colors">
                            Email Address
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#4ed1f4] transition-colors" />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className={`w-full bg-white/5 border ${errors.email ? "border-red-500" : "border-white/10"} rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#5170ff] focus:ring-4 focus:ring-[#5170ff]/10 transition-all placeholder:text-slate-600`}
                                placeholder="sample@empireonegroup.com"
                                readOnly // Optional: Usually you don't want them changing the email on the reset token page
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs ml-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="group space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[#4ed1f4] transition-colors">
                            New Password
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#4ed1f4] transition-colors" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className={`w-full bg-white/5 border ${errors.password ? "border-red-500" : "border-white/10"} rounded-xl py-4 pl-12 pr-14 text-white outline-none focus:border-[#5170ff] focus:ring-4 focus:ring-[#5170ff]/10 transition-all placeholder:text-slate-600`}
                                placeholder="••••••••"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <FaEyeSlash size={18} />
                                ) : (
                                    <FaEye size={18} />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs ml-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="group space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[#4ed1f4] transition-colors">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#4ed1f4] transition-colors" />
                            <input
                                id="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value,
                                    )
                                }
                                className={`w-full bg-white/5 border ${errors.password_confirmation ? "border-red-500" : "border-white/10"} rounded-xl py-4 pl-12 pr-14 text-white outline-none focus:border-[#5170ff] focus:ring-4 focus:ring-[#5170ff]/10 transition-all placeholder:text-slate-600`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <FaEyeSlash size={18} />
                                ) : (
                                    <FaEye size={18} />
                                )}
                            </button>
                        </div>
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-xs ml-1">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        disabled={processing}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full relative flex items-center justify-center gap-3 py-4 rounded-xl font-black text-white uppercase tracking-[0.2em] overflow-hidden transition-all group mt-6"
                        style={{ backgroundColor: colors.electricBlue }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        {processing ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1,
                                    ease: "linear",
                                }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                            />
                        ) : (
                            <span>Reset Password</span>
                        )}
                    </motion.button>
                </form>

                {/* Return Link */}
                <div className="mt-8 flex justify-center text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                    <Link
                        href={route("login")}
                        className="hover:text-[#4ed1f4] transition-colors underline decoration-[#4ed1f4]/30 underline-offset-4"
                    >
                        Return to Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
