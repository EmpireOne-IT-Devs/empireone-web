export default function ContactSection() {
    const contact = [
        { label: "Email", value: "support@empireone.com" },
        { label: "Phone", value: "+63 900 000 0000" },
        { label: "Availability", value: "24/7 Support" },
    ];

    return (
        <section
            id="contact"
            className="py-20 md:py-28 bg-white dark:bg-slate-950"
        >
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="max-w-2xl mb-12">
                    <span className="text-xs font-bold tracking-widest text-blue-500 uppercase">
                        Contact
                    </span>

                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mt-2">
                        Get in Touch
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 mt-4">
                        Have questions or need support? Reach out to us and our
                        team will assist you as soon as possible.
                    </p>
                </div>

                {/* CONTENT */}
                <div className="grid md:grid-cols-2 gap-10">

                    {/* CONTACT INFO */}
                    <div className="space-y-4">
                        {contact.map((item) => (
                            <div
                                key={item.label}
                                className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                            >
                                <div className="text-xs font-mono text-blue-500 uppercase mb-1">
                                    {item.label}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-300">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SIMPLE CONTACT BOX */}
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/10 border border-blue-500/20">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                            Need Help?
                        </h3>

                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                            Our support team is ready to assist you with any
                            concerns regarding the EmpireOne Unified System.
                        </p>

                        <a
                            href="mailto:support@empireone.com"
                            className="inline-block px-5 py-3 rounded-xl bg-blue-500 text-black text-sm font-medium hover:bg-blue-400 transition"
                        >
                            Contact Support
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
}