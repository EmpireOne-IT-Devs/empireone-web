import { useState, useEffect, useRef } from "react";

// ── Intersection Observer hook ──────────────────────────────
function useInView(threshold = 0.18) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setInView(true);
                    obs.disconnect();
                }
            },
            { threshold },
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, inView];
}

// ── Animated wrapper ────────────────────────────────────────
function Reveal({ children, delay = 0, from = "bottom", className = "" }) {
    const [ref, inView] = useInView();
    const base = "transition-all duration-700 ease-out";
    const hidden =
        from === "right"
            ? "opacity-0 translate-x-8"
            : "opacity-0 translate-y-6";
    const visible =
        from === "right"
            ? "opacity-100 translate-x-0"
            : "opacity-100 translate-y-0";
    return (
        <div
            ref={ref}
            className={`${base} ${inView ? visible : hidden} ${className}`}
            style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
        >
            {children}
        </div>
    );
}

// ── SVG Icons ───────────────────────────────────────────────
const IconPin = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);
const IconPhone = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.69 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l1.28-1.28a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);
const IconMail = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);
const IconClock = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);
const IconSend = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
    </svg>
);

// ── Data ────────────────────────────────────────────────────
const CONTACT_DATA = {
    addresses: [
        {
            name: "Negros Occidental",
            address:
                "S.Carmona Barangay 6, San Carlos City, Negros Occidental, Philippines",
        },
        {
            name: "Carcar, Cebu",
            address:
                "EmpireOne Building, Gen. Luna St., Poblacion II, Carcar City, Cebu, 6019",
        },
        { name: "Cebu City", address: "Cebu City, Philippines" },
    ],
    phone: "729-8353",
    emails: ["hiring@empireonegroup.com", "career@empireonegroup.com"],
    officeHours: ["Open 24 Hours a Day, 7 Days a Week"],
};

const INFO_ITEMS = [
    {
        icon: <IconPin />,
        label: "Our Locations",
        color: "from-purple-500 to-indigo-600",
        content: (
            <div className="space-y-3 mt-1">
                {CONTACT_DATA.addresses.map((loc, i) => (
                    <div key={i}>
                        <p className="text-xs font-bold text-purple-400 uppercase tracking-wide mb-0.5">
                            {loc.name}
                        </p>
                        <p className="text-sm text-white/50 leading-relaxed">
                            {loc.address}
                        </p>
                    </div>
                ))}
            </div>
        ),
    },
    {
        icon: <IconPhone />,
        label: "Phone Number",
        color: "from-orange-500 to-pink-500",
        content: (
            <a
                href={`tel:${CONTACT_DATA.phone}`}
                className="text-sm text-white/50 hover:text-orange-400 transition-colors"
            >
                {CONTACT_DATA.phone}
            </a>
        ),
    },
    {
        icon: <IconMail />,
        label: "Email Address",
        color: "from-sky-500 to-blue-600",
        content: (
            <div className="space-y-0.5">
                {CONTACT_DATA.emails.map((email, i) => (
                    <a
                        key={i}
                        href={`mailto:${email}`}
                        className="block text-sm text-white/50 hover:text-sky-400 transition-colors break-all"
                    >
                        {email}
                    </a>
                ))}
            </div>
        ),
    },
    {
        icon: <IconClock />,
        label: "Office Hours",
        color: "from-emerald-500 to-teal-600",
        content: CONTACT_DATA.officeHours.map((h, i) => (
            <p key={i} className="text-sm text-white/50">
                {h}
            </p>
        )),
    },
];

// ── Input / Textarea field ──────────────────────────────────
function Field({ label, required, error, children }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-white/70 mb-1.5">
                {label} {required && <span className="text-orange-400">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
    );
}

const inputCls = (err) =>
    `w-full px-4 py-3 rounded-xl border bg-white/5 text-white placeholder-white/25 text-sm focus:outline-none focus:ring-2 focus:bg-white/8 transition-all duration-200 ${
        err
            ? "border-red-500/50 focus:ring-red-500/30"
            : "border-white/10 focus:ring-purple-500/40 focus:border-purple-500/50"
    }`;

// ── Main Component ──────────────────────────────────────────
export default function ContactSection() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("idle"); // idle | submitting | success

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email is invalid";
        if (!form.subject.trim()) e.subject = "Subject is required";
        if (!form.message.trim()) e.message = "Message is required";
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            return;
        }
        setStatus("submitting");
        setTimeout(() => {
            setStatus("success");
            setForm({ name: "", email: "", subject: "", message: "" });
            setTimeout(() => setStatus("idle"), 3500);
        }, 1000);
    };

    return (
        <section
            id="contact"
            aria-labelledby="contact-heading"
            className="relative overflow-hidden py-20 md:py-32 bg-[#0a0a14] text-white"
        >
            {/* Background glows */}
            <div className="absolute w-[600px] h-[600px] bg-purple-600/20 blur-3xl rounded-full -top-40 -left-32 pointer-events-none" />
            <div className="absolute w-[500px] h-[500px] bg-orange-500/15 blur-3xl rounded-full top-20 -right-24 pointer-events-none" />
            <div className="absolute w-[400px] h-[400px] bg-sky-500/10 blur-3xl rounded-full bottom-10 left-1/3 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
                {/* Section heading */}
                <Reveal delay={0}>
                    <div className="text-center mb-12 sm:mb-16">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
                            style={{
                                background: "rgba(168,85,247,0.12)",
                                border: "1px solid rgba(168,85,247,0.3)",
                                color: "#c084fc",
                            }}
                        >
                            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                            Get In Touch
                        </div>
                        <h2
                            id="contact-heading"
                            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight"
                        >
                            <span className="bg-gradient-to-r from-purple-400 to-orange-400 text-transparent bg-clip-text">
                                Contact Us
                            </span>
                        </h2>
                        <p className="text-white/50 mt-3 text-sm sm:text-base max-w-md mx-auto">
                            Fill out the form and our team will respond within
                            24 hours.
                        </p>
                    </div>
                </Reveal>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
                    {/* ── LEFT: Form ── */}
                    <Reveal delay={80}>
                        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl">
                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="space-y-5 p-7"
                            >
                                {/* Name + Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field
                                        label="Your Name"
                                        required
                                        error={errors.name}
                                    >
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Juan dela Cruz"
                                            className={inputCls(errors.name)}
                                        />
                                    </Field>
                                    <Field
                                        label="Email Address"
                                        required
                                        error={errors.email}
                                    >
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="juan@example.com"
                                            className={inputCls(errors.email)}
                                        />
                                    </Field>
                                </div>

                                {/* Subject */}
                                <Field
                                    label="Subject"
                                    required
                                    error={errors.subject}
                                >
                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        value={form.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help you?"
                                        className={inputCls(errors.subject)}
                                    />
                                </Field>

                                {/* Message */}
                                <Field
                                    label="Message"
                                    required
                                    error={errors.message}
                                >
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Write your message here..."
                                        className={`${inputCls(errors.message)} resize-none`}
                                    />
                                </Field>

                                {/* Success banner */}
                                {status === "success" && (
                                    <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium px-4 py-3 rounded-xl">
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                        Message sent! We'll get back to you
                                        soon.
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 active:scale-[0.99] text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/20 text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {status === "submitting" ? (
                                        <>
                                            <svg
                                                className="animate-spin"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                            >
                                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                            </svg>
                                            Sending…
                                        </>
                                    ) : (
                                        <>
                                            <IconSend /> Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </Reveal>

                    {/* ── RIGHT: Info ── */}
                    <Reveal delay={140} from="right">
                        <div className="flex flex-col gap-3">
                            {INFO_ITEMS.map(
                                ({ icon, label, color, content }, i) => (
                                    <Reveal key={label} delay={160 + i * 60}>
                                        <div className="flex items-start gap-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-5 hover:border-white/20 hover:bg-white/5 transition-all duration-200">
                                            <div
                                                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-lg`}
                                            >
                                                {icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-white/90 text-sm mb-1">
                                                    {label}
                                                </p>
                                                {content}
                                            </div>
                                        </div>
                                    </Reveal>
                                ),
                            )}
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
