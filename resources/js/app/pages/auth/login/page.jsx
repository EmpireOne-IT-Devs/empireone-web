import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaReact,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaCheckCircle,
    FaExclamationTriangle,
} from "react-icons/fa";
import { Link, useForm } from "@inertiajs/react";

const Page = ({ flash }) => {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    // Color Palette Constants
    const colors = {
        darkNavy: "#04042c",
        electricBlue: "#5170ff",
        cyan: "#4ed1f4",
        deepPurple: "#4b0082",
        mutedPurple: "#5e3984",
    };

    useEffect(() => {
        if (flash?.error || flash?.success) {
            setShowNotification(true);
            const timer = setTimeout(() => setShowNotification(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("auth.login"));
    };

    return (
        <div
            className={`min-h-screen flex items-center justify-center font-sans overflow-hidden relative`}
            style={{ backgroundColor: colors.darkNavy }}
        >
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

            {/* Flash Notification */}
            <AnimatePresence>
                {showNotification && (flash?.error || flash?.success) && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md border border-white/10 ${
                            flash?.error ? "bg-red-500/90" : "bg-emerald-500/90"
                        } text-white max-w-md`}
                    >
                        {flash?.error ? (
                            <FaExclamationTriangle />
                        ) : (
                            <FaCheckCircle />
                        )}
                        <span className="text-sm font-medium">
                            {flash?.error || flash?.success}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- LOGIN CARD --- */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-10 w-full max-w-md p-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
            >
                {/* Header */}
                <div className="flex flex-col items-center mb-10">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="text-5xl mb-6"
                        style={{
                            color: colors.cyan,
                            filter: `drop-shadow(0 0 15px ${colors.cyan}66)`,
                        }}
                    >
                        <FaReact />
                    </motion.div>

                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Log in to your{" "}
                        <span style={{ color: colors.cyan }}>EmpireOne</span>{" "}
                        account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="group space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[#4ed1f4] transition-colors">
                            Email Address
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#4ed1f4] transition-colors" />
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className={`w-full bg-white/5 border ${errors.email ? "border-red-500" : "border-white/10"} rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#5170ff] focus:ring-4 focus:ring-[#5170ff]/10 transition-all placeholder:text-slate-600`}
                                placeholder="sample@empireonegroup.com"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="group space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[#4ed1f4] transition-colors">
                            Secure Password
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#4ed1f4] transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className={`w-full bg-white/5 border ${errors.password ? "border-red-500" : "border-white/10"} rounded-xl py-4 pl-12 pr-14 text-white outline-none focus:border-[#5170ff] focus:ring-4 focus:ring-[#5170ff]/10 transition-all placeholder:text-slate-600`}
                                placeholder="••••••••"
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
                    </div>

                    <div className="flex items-center justify-between py-1">
                        <label className="flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData("remember", e.target.checked)
                                }
                                className="hidden"
                            />
                            <div
                                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${data.remember ? "bg-[#5170ff] border-[#5170ff]" : "border-white/20 bg-white/5"}`}
                            >
                                {data.remember && (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                            </div>
                            <span className="ml-3 text-xs text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-widest font-medium">
                                Remember Me
                            </span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        disabled={processing}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full relative py-4 rounded-xl font-black text-white uppercase tracking-[0.3em] overflow-hidden transition-all group"
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
                            "Login"
                        )}
                    </motion.button>
                </form>

                {/* Footer */}
                <div className="mt-10 flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                    <Link
                        href="/"
                        className="hover:text-[#4ed1f4] transition-colors underline decoration-[#4ed1f4]/30 underline-offset-4"
                    >
                        Homepage
                    </Link>
                    {/* <button className="hover:text-[#4ed1f4] transition-colors">Recover_Access?</button> */}
                </div>
            </motion.div>
        </div>
    );
};

export default Page;
