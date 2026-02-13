import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaReact, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useForm } from "@inertiajs/react";

const Page = ({ flash }) => {
    // 1. Single source of truth using Inertia's useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    // Handle flash messages
    useEffect(() => {
        if (flash?.error || flash?.success) {
            setShowNotification(true);
            const timer = setTimeout(() => setShowNotification(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Use Inertia's post method
        post(route('auth.login'), {
            onFinish: () => {
                console.log('success');
            },
            onError: (errors) => {
                // Errors will be automatically handled by Inertia and shown in the form
                console.error('Login failed:', errors);
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d1117] font-sans overflow-hidden">
            {/* Background Decorative Circles */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px]" />

            {/* Flash Notification */}
            <AnimatePresence>
                {showNotification && (flash?.error || flash?.success) && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
                            flash?.error ? 'bg-red-600' : 'bg-green-600'
                        } text-white flex items-center gap-2 max-w-md`}
                    >
                        {flash?.error ? <FaExclamationTriangle /> : <FaCheckCircle />}
                        <span className="text-sm">{flash?.error || flash?.success}</span>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        className="text-blue-600 text-6xl mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
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
                        <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider ml-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="email"
                                name="email"
                                autoComplete="off"
                                // Bound to Inertia data
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                className={`w-full bg-[#0d1117] border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg py-3 pl-10 pr-4 text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all placeholder:text-gray-600`}
                                placeholder="sample@empireonegroup.com"
                            />
                        </div>
                        {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-blue-600 uppercase tracking-wider ml-1">
                            Password
                        </label>
                        <div className="relative group">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                autoComplete="off"
                                // Bound to Inertia data
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                className={`w-full bg-[#0d1117] border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-lg py-3 pl-10 pr-12 text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all`}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-[#0d1117] border-gray-700 rounded focus:ring-blue-600 focus:ring-2"
                        />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                            Remember me
                        </label>
                    </div>

                    {/* General Error Message */}
                    {(errors.email || errors.password) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm"
                        >
                            <div className="flex items-center gap-2">
                                <FaExclamationTriangle className="flex-shrink-0" />
                                <span>
                                    {errors.email || errors.password || 'Please check your credentials and try again.'}
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {/* Submit Button - Linked to 'processing' state */}
                    <motion.button
                        disabled={processing}
                        whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34,211,238,0.2)" }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full ${processing ? 'opacity-70 cursor-not-allowed' : ''} bg-blue-500 hover:bg-blue-600 text-[#0d1117] font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2`}
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
                    <span className="hover:text-blue-600 cursor-pointer transition-colors">Register</span>
                    <span className="hover:text-blue-600 cursor-pointer transition-colors">Forgot_Password?</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Page;