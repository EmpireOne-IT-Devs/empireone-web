import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaReact, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "@inertiajs/react";

const Page = () => {
    // 1. Single source of truth using Inertia's useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use Inertia's post method
        post(route('login.auth'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d1117] font-sans overflow-hidden">
            {/* Background Decorative Circles */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px]" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 w-full max-w-md p-8 bg-[#161b22]/80 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl"
            >
                {/* Header Section */}
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="text-cyan-400 text-6xl mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                    >
                        <FaReact />
                    </motion.div>
                    
                    {/* Fixed Image Tag - Added dimensions */}
                    <img
                        src="/images/logo.png"
                        alt="Company Logo"
                        className="h-12 w-auto object-contain mb-2"
                    />
                    
                    <p className="text-gray-400 text-sm">
                        Authenticate to access the dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type="email"
                                name="email"
                                autoComplete="off"
                                // Bound to Inertia data
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                className={`w-full bg-[#0d1117] border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg py-3 pl-10 pr-4 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-gray-600`}
                                placeholder="sample@empireonegroup.com"
                            />
                        </div>
                        {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                autoComplete="off"
                                // Bound to Inertia data
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                className={`w-full bg-[#0d1117] border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-lg py-3 pl-10 pr-12 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                    </div>

                    {/* Submit Button - Linked to 'processing' state */}
                    <motion.button
                        disabled={processing}
                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34,211,238,0.2)" }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full ${processing ? 'opacity-70 cursor-not-allowed' : ''} bg-cyan-500 hover:bg-cyan-400 text-[#0d1117] font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2`}
                    >
                        {processing ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-5 h-5 border-2 border-[#0d1117] border-t-transparent rounded-full"
                            />
                        ) : (
                            "SUBMIT"
                        )}
                    </motion.button>
                </form>

                {/* Footer */}
                <div className="mt-6 flex justify-between text-[11px] text-gray-500 font-mono uppercase tracking-widest">
                    <span className="hover:text-cyan-400 cursor-pointer transition-colors">Register</span>
                    <span className="hover:text-cyan-400 cursor-pointer transition-colors">Forgot_Password?</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Page;