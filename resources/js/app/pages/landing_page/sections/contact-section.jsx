import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

const fadeUp = {
    hidden: { opacity: 0, y: 26 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.68,
            delay,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

const fadeSide = {
    hidden: { opacity: 0, x: 32 },
    visible: (delay = 0) => ({
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.72,
            delay,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const contactData = {
        addresses: [
            {
                name: "Negros Occidental Office",
                address: "S.Carmona Barangay 6, San Carlos City, Negros Occidental, Philippines",
            },
            {
                name: "Carcar, Cebu Office",
                address: "EmpireOne Building, Gen. Luna St., Poblacion II, Carcar City, Cebu, 6019.",
            },
            {
                name: "Cebu City Office",
                address: "Cebu City, Philippines",
            },
        ],
        phone: "729-8353",
        emails: [
            "hiring@empireonegroup.com",
            "career@empireonegroup.com",
        ],
        officeHours: [
            "Open 24 Hours a Day, 7 Days a Week",
        ],
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.subject.trim()) newErrors.subject = "Subject is required";
        if (!formData.message.trim()) newErrors.message = "Message is required";
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setIsSubmitting(true);
        // TODO: Implement form submission logic
        console.log("Form submitted:", formData);
        setTimeout(() => {
            setIsSubmitting(false);
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 1000);
    };

    return (
        <section
            id="contact"
            aria-labelledby="contact-heading"
            className="relative min-h-screen overflow-hidden py-20 text-slate-700 md:py-32"
        >
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/images/building.jpg')" }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.92) 50%, rgba(241, 245, 249, 0.88) 100%)"
                }}
            />

            <div className="relative max-w-7xl mx-auto px-6 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* LEFT: Contact Form Card */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.25 }}
                        variants={fadeUp}
                        custom={0.05}
                        className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm md:p-10"
                    >
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.6 }}
                            variants={fadeUp}
                            custom={0.12}
                            className="text-3xl font-bold text-slate-900 mb-2"
                        >
                            Get In Touch
                        </motion.h2>
                        <motion.p
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.6 }}
                            variants={fadeUp}
                            custom={0.18}
                            className="text-slate-500 text-sm mb-8 leading-relaxed"
                        >
                            Fill out the form below and our team will get back
                            to you within 24 hours.
                        </motion.p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name + Email Row */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.5 }}
                                variants={fadeUp}
                                custom={0.24}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-slate-700 mb-1.5"
                                    >
                                        Your Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Juan dela Cruz"
                                        className={`w-full px-4 py-3 rounded-lg border bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition ${
                                            errors.name
                                                ? "border-red-300 focus:ring-red-400"
                                                : "border-slate-200 focus:ring-purple-400"
                                        }`}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-slate-700 mb-1.5"
                                    >
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="juan@example.com"
                                        className={`w-full px-4 py-3 rounded-lg border bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition ${
                                            errors.email
                                                ? "border-red-300 focus:ring-red-400"
                                                : "border-slate-200 focus:ring-purple-400"
                                        }`}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Subject */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.6 }}
                                variants={fadeUp}
                                custom={0.3}
                            >
                                <label
                                    htmlFor="subject"
                                    className="block text-sm font-medium text-slate-700 mb-1.5"
                                >
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="How can we help you?"
                                    className={`w-full px-4 py-3 rounded-lg border bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition ${
                                        errors.subject
                                            ? "border-red-300 focus:ring-red-400"
                                            : "border-slate-200 focus:ring-purple-400"
                                    }`}
                                />
                                {errors.subject && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.subject}
                                    </p>
                                )}
                            </motion.div>

                            {/* Message */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.6 }}
                                variants={fadeUp}
                                custom={0.36}
                            >
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium text-slate-700 mb-1.5"
                                >
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Write your message here..."
                                    className={`w-full px-4 py-3 rounded-lg border bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition resize-none ${
                                        errors.message
                                            ? "border-red-300 focus:ring-red-400"
                                            : "border-slate-200 focus:ring-purple-400"
                                    }`}
                                />
                                {errors.message && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {errors.message}
                                    </p>
                                )}
                            </motion.div>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.8 }}
                                variants={fadeUp}
                                custom={0.42}
                                whileHover={!isSubmitting ? { y: -2, scale: 1.01 } : {}}
                                whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                                className="w-full py-4 bg-purple-700 hover:bg-purple-900 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* RIGHT: Contact Information */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.25 }}
                        variants={fadeSide}
                        custom={0.12}
                        className="space-y-6"
                    >
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.6 }}
                            variants={fadeUp}
                            custom={0.2}
                            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-[.12em] uppercase mb-2"
                            style={{
                                background: "rgba(99,102,241,0.08)",
                                border: "1px solid rgba(99,102,241,0.2)",
                                color: "#6366f1",
                            }}
                        >
                            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" style={{ boxShadow: "0 0 8px rgba(99,102,241,0.6)" }} />
                            Contact Information
                        </motion.div>

                        {/* Info Items */}
                        <div className="space-y-5">
                            {/* Location */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.5 }}
                                variants={fadeUp}
                                custom={0.26}
                                className="flex items-start gap-4"
                            >
                                <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <MapPin size={18} color="#3b82f6" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-slate-900 text-sm mb-2">
                                        Our Locations
                                    </div>
                                    <div className="space-y-3">
                                        {contactData.addresses.map((location, i) => (
                                            <address key={i} className="not-italic">
                                                <div className="font-semibold text-slate-700 text-xs mb-0.5">
                                                    {location.name}
                                                </div>
                                                <div className="text-slate-500 text-sm leading-relaxed">
                                                    {location.address}
                                                </div>
                                            </address>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Phone */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.5 }}
                                variants={fadeUp}
                                custom={0.34}
                                className="flex items-start gap-4"
                            >
                                <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Phone size={18} color="#3b82f6" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm mb-1">
                                        Phone Number
                                    </div>
                                    <a
                                        href={`tel:${contactData.phone}`}
                                        className="text-slate-500 hover:text-blue-600 transition-colors text-sm"
                                    >
                                        {contactData.phone}
                                    </a>
                                </div>
                            </motion.div>

                            {/* Email */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.5 }}
                                variants={fadeUp}
                                custom={0.42}
                                className="flex items-start gap-4"
                            >
                                <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Mail size={18} color="#3b82f6" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm mb-1">
                                        Email Address
                                    </div>
                                    <div className="space-y-0.5">
                                        {contactData.emails.map((email, i) => (
                                            <a
                                                key={i}
                                                href={`mailto:${email}`}
                                                className="block text-slate-500 hover:text-blue-600 transition-colors text-sm"
                                            >
                                                {email}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Office Hours */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: false, amount: 0.5 }}
                                variants={fadeUp}
                                custom={0.5}
                                className="flex items-start gap-4"
                            >
                                <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Clock size={18} color="#3b82f6" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm mb-1">
                                        Office Hours
                                    </div>
                                    <div className="space-y-0.5">
                                        {contactData.officeHours.map((hour, i) => (
                                            <div
                                                key={i}
                                                className="text-slate-500 text-sm"
                                            >
                                                {hour}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
