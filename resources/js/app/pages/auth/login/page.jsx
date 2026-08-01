import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, router, useForm } from "@inertiajs/react";
import { FcGoogle } from "react-icons/fc";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setAlert } from "@/app/redux/app-slice";
import NavFooterSection from "../../landing_page/sections/nav-footer-section";

const Page = ({ flash }) => {
    const params = new URLSearchParams(location.search);
    const error_message = params.get("error_message");
    const dispatch = useDispatch();

    // Backend Logic & Form States Left Intact
    const { data, setData, post, processing, errors, reset } = useForm({
        login_id: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const colors = {
        darkNavy: "#1a0b3b",
        electricBlue: "#e85c0d",
        cyan: "#00FFFF",
        deepPurple: "#5a3d9a",
        mutedPurple: "#7b52c8",
        blue: "#3b82f6",
        orange: "#e85c0d",
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("auth.login"), {
            onSuccess: async () => {
                reset("login_id");
                await dispatch(
                    setAlert({
                        type: "success",
                        title: "Login successfully!",
                    }),
                );
            },
        });
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center font-sans overflow-hidden relative"
            style={{
                background: `linear-gradient(135deg, ${colors.deepPurple} 0%, #0d1b4b 50%, #0a0a2e 50%, ${colors.orange} 150%)`,
            }}
        >
            {/* --- INTERACTIVE BACKGROUND --- */}
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
                <motion.div
                    animate={{ x: [0, 30, 0], y: [0, -50, 0] }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full blur-[120px] opacity-30"
                    style={{ backgroundColor: colors.blue }}
                />
            </div>

            {/* --- CENTERING CONTAINER FOR CARD --- */}
            <div className="flex-1 flex items-center justify-center w-full z-10 px-4 py-8">
                {/* --- LOGIN CARD --- */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full max-w-md px-9 py-8 md:bg-white/5 md:backdrop-blur-2xl border-0 md:border md:border-white/50 md:rounded-[2rem] md:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.3)]"
                >
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-slate-300 text-md flex items-center gap-1">
                            Log in to your{" "}
                            <span className="inline-flex items-center">
                                <img
                                    src="/images/E1CXlogo.png"
                                    alt="EmpireOne Logo"
                                    className="h-4 w-auto mt-0.5 object-contain"
                                />
                            </span>{" "}
                            account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {error_message && (
                            <div className="text-red-500 text-center">
                                {error_message}
                            </div>
                        )}

                        {/* Email / Employee ID */}
                        <div className="group space-y-2 mb-8">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[#e85c0d] transition-colors">
                                Employee ID | Email Address
                            </label>
                            <div className="relative">
                                <FaRegUserCircle className="absolute text-xl left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#e85c0d] transition-colors" />
                                <input
                                    type="text"
                                    value={data.login_id}
                                    onChange={(e) => setData("login_id", e.target.value)}
                                    placeholder="22****01"
                                    className={`w-full bg-white/5 border ${errors.login_id ? "border-red-500" : "border-white/10"} rounded-xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#e85c0d] focus:ring-4 focus:ring-[#e85c0d]/10 transition-all placeholder:text-slate-600`}
                                />
                            </div>
                            {errors.login_id && (
                                <p className="text-red-500 text-xs mt-1 ml-1">
                                    {errors.login_id}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="group space-y-2">
                            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] ml-1 group-focus-within:text-[#e85c0d] transition-colors">
                                Secure Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#e85c0d] transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    className={`w-full bg-white/5 border ${errors.password ? "border-red-500" : "border-white/10"} rounded-xl py-4 pl-12 pr-14 text-white outline-none focus:border-[#e85c0d] focus:ring-4 focus:ring-[#e85c0d]/10 transition-all placeholder:text-slate-600`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1 ml-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between py-1">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData("remember", e.target.checked)}
                                    className="hidden"
                                />
                                <div
                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${data.remember ? "bg-[#e85c0d] border-[#e85c0d]" : "border-white/20 bg-white/5"}`}
                                >
                                    {data.remember && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className="ml-3 text-xs text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-widest font-medium">
                                    Remember Me
                                </span>
                            </label>
                            <button
                                type="button"
                                onClick={() => router.visit("/auth/forgot_password")}
                                className="text-xs text-slate-400 hover:text-[#e85c0d] transition-colors uppercase tracking-widest font-medium"
                            >
                                Forgot?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            disabled={processing}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full relative flex items-center justify-center gap-3 py-4 rounded-xl font-black text-white uppercase tracking-[0.2em] overflow-hidden transition-all group"
                            style={{
                                background: `linear-gradient(135deg, ${colors.electricBlue}, #7c3aed, ${colors.blue})`,
                            }}
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
                                <span>Login</span>
                            )}
                        </motion.button>

                        {/* --- DIVIDER --- */}
                        <div className="flex items-center gap-3 mb-6 mt-4">
                            <div className="flex-1 h-[1px] bg-white/10"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                Or continue with
                            </span>
                            <div className="flex-1 h-[1px] bg-white/10"></div>
                        </div>

                        {/* --- SSO LOGIN BUTTONS --- */}
                        <div className="flex gap-4 mb-6">
                            <a
                                href="/api/auth/google/web"
                                className="flex-1 flex items-center justify-center hover:bg-gray-200 gap-2 py-4 shadow-lg rounded-xl text-black font-black border border-white bg-white hover:border-white transition-all text-sm"
                            >
                                <FcGoogle className="text-lg" />
                                LOGIN WITH GOOGLE
                            </a>
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* --- STICKY FOOTER IN THE PARENT CONTAINER --- */}
            <NavFooterSection />
        </div>
    );
};

export default Page;