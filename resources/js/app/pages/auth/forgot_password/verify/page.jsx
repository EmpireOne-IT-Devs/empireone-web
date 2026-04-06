import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaEnvelope,
    FaKey,
    FaCheckCircle,
    FaExclamationTriangle,
} from "react-icons/fa";
import { Head, Link, useForm } from "@inertiajs/react";
import { useDispatch } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";

export default function ForgotPassword({ status, flash }) {
    const dispatch = useDispatch();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
    });

    const colors = {
        darkNavy: "#04042c",
        electricBlue: "#5170ff",
        cyan: "#4ed1f4",
        deepPurple: "#4b0082",
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"), {
            onSuccess: async () => {
                reset("email"); // Clear the email input
                await dispatch(
                    setAlert({
                        type: "success",
                        title: "Password reset link sent successfully!",
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
            className="min-h-screen flex items-center justify-center font-sans overflow-hidden relative"
            style={{ backgroundColor: colors.darkNavy }}
        >
            <Head title="Forgot Password" />

            {/* --- Background Effects --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

            {/* --- Forgot Password Card --- */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-10 w-full max-w-md p-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
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
                        <FaKey />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2 text-center">
                        Forgot Password?
                    </h2>
                    <p className="text-slate-400 text-sm text-center leading-relaxed mt-2">
                        No problem. Just let us know your email address and we
                        will email you a password reset link.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={submit} className="space-y-6">
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
                                className={`w-full bg-white/5 border ${
                                    errors.email
                                        ? "border-red-500"
                                        : "border-white/10"
                                } rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#5170ff] focus:ring-4 focus:ring-[#5170ff]/10 transition-all placeholder:text-slate-600`}
                                placeholder="sample@empireonegroup.com"
                                autoFocus
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 ml-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={processing}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full relative flex items-center justify-center gap-3 py-4 rounded-xl font-black text-white uppercase tracking-[0.2em] overflow-hidden transition-all group mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
                            <span>Email Reset Link</span>
                        )}
                    </motion.button>
                </form>

                {/* Footer */}
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
