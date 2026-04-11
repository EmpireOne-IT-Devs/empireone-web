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
        content: (
            <div className="space-y-3 mt-1">
                {CONTACT_DATA.addresses.map((loc, i) => (
                    <div key={i}>
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-0.5">
                            {loc.name}
                        </p>
                        <p className="text-sm text-slate-500 leading-relaxed">
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
        content: (
            <a
                href={`tel:${CONTACT_DATA.phone}`}
                className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
            >
                {CONTACT_DATA.phone}
            </a>
        ),
    },
    {
        icon: <IconMail />,
        label: "Email Address",
        content: (
            <div className="space-y-0.5">
                {CONTACT_DATA.emails.map((email, i) => (
                    <a
                        key={i}
                        href={`mailto:${email}`}
                        className="block text-sm text-slate-500 hover:text-blue-600 transition-colors"
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
        content: CONTACT_DATA.officeHours.map((h, i) => (
            <p key={i} className="text-sm text-slate-500">
                {h}
            </p>
        )),
    },
];

// ── Input / Textarea field ──────────────────────────────────
function Field({ label, required, error, children }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

const inputCls = (err) =>
    `w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 ${
        err
            ? "border-red-300 focus:ring-red-300"
            : "border-slate-200 focus:ring-blue-300 focus:border-blue-300"
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
        // TODO: wire up real submission
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
            className="relative min-h-screen overflow-hidden py-20 md:py-32"
        >
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(239,246,255,0.97) 0%, rgba(219,234,254,0.93) 30%, rgba(191,219,254,0.90) 40%)",
                }}
            />

            <div className="relative max-w-7xl mx-auto px-6 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    {/* ── LEFT: Form ── */}
                    <Reveal delay={50}>
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 md:p-10 shadow-sm shadow-slate-100">
                            <Reveal delay={100}>
                                <h2
                                    id="contact-heading"
                                    className="text-3xl font-black text-slate-900 mb-1.5 tracking-tight"
                                >
                                    Get In Touch
                                </h2>
                                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                    Fill out the form and our team will respond
                                    within 24 hours.
                                </p>
                            </Reveal>

                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="space-y-5"
                            >
                                {/* Name + Email */}
                                <Reveal delay={150}>
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
                                                className={inputCls(
                                                    errors.name,
                                                )}
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
                                                className={inputCls(
                                                    errors.email,
                                                )}
                                            />
                                        </Field>
                                    </div>
                                </Reveal>

                                {/* Subject */}
                                <Reveal delay={200}>
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
                                </Reveal>

                                {/* Message */}
                                <Reveal delay={250}>
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
                                </Reveal>

                                {/* Success banner */}
                                {status === "success" && (
                                    <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl">
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
                                <Reveal delay={300}>
                                    <button
                                        type="submit"
                                        disabled={status === "submitting"}
                                        className="w-full flex items-center justify-center gap-2.5 py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
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
                                </Reveal>
                            </form>
                        </div>
                    </Reveal>

                    {/* ── RIGHT: Info ── */}
                    <Reveal delay={120} from="right">
                        <div className="space-y-2">
                            {/* Badge */}
                            <div
                                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold tracking-widest uppercase mb-4"
                                style={{
                                    background: "rgba(59,130,246,0.08)",
                                    border: "1px solid rgba(59,130,246,0.2)",
                                    color: "#3b82f6",
                                }}
                            >
                                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse" />
                                Contact Information
                            </div>

                            {/* Info cards */}
                            <div className="space-y-3">
                                {INFO_ITEMS.map(
                                    ({ icon, label, content }, i) => (
                                        <Reveal
                                            key={label}
                                            delay={160 + i * 70}
                                        >
                                            <div className="flex items-start gap-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/70 p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 flex-shrink-0 mt-0.5">
                                                    {icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-slate-900 text-sm mb-1">
                                                        {label}
                                                    </p>
                                                    {content}
                                                </div>
                                            </div>
                                        </Reveal>
                                    ),
                                )}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
