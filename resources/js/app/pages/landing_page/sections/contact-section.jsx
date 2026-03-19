export default function ContactSection() {
    const contactData = {
        address:
            "Don Juan Subd., Pres. Quirino St., Brgy. II, Barangay Hall, San Carlos City, Negros Occidental, Philippines",
        phone1: "729-8353",
        email: "barangay_two@yahoo.com",
        officeHours: [
            "Monday – Friday: 8:00 AM – 5:00 PM",
            "Saturday: 8:00 AM – 12:00 PM",
            "Sunday & Holidays: Closed",
        ],
        mapLink:
            "https://www.google.com/maps/search/?api=1&query=Don+Juan+Subd+Pres+Quirino+St+Brgy+II+Barangay+Hall+San+Carlos+City+Negros+Occidental+Philippines",
    };

    return (
        <section
            id="contact"
            aria-labelledby="contact-heading"
            className="relative min-h-screen py-20 md:py-32 overflow-hidden bg-gray-100 dark:bg-slate-950 text-slate-700 dark:text-slate-200"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* LEFT: Contact Form Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 md:p-10">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Get In Touch
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                            Fill out the form below and our team will get back to you within 24 hours.
                        </p>

                        <div className="space-y-5">
                            {/* Name + Email Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Juan dela Cruz"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="juan@example.com"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                    />
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    placeholder="How can we help you?"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Message
                                </label>
                                <textarea
                                    rows={5}
                                    placeholder="Write your message here..."
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition resize-none"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="button"
                                className="w-full py-4 bg-purple-700 hover:bg-purple-900 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 text-sm tracking-wide"
                            >
                                Send Message
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: Contact Information */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Contact Information
                        </h2>

                        {/* Info Items */}
                        <div className="space-y-5">
                            {/* Location */}
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                        <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                                        Our Location
                                    </div>
                                    <address className="not-italic text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                        {contactData.address}
                                    </address>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.86-1.84a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                                        Phone Number
                                    </div>
                                    <div className="space-y-0.5">
                                        <a href={`tel:${contactData.phone1}`} className="block text-slate-500 dark:text-slate-400 text-sm hover:text-yellow-500 transition-colors">
                                            {contactData.phone1}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                        <polyline points="22,6 12,13 2,6"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                                        Email Address
                                    </div>
                                    <a
                                        href={`mailto:${contactData.email}`}
                                        className="text-slate-500 dark:text-slate-400 text-sm hover:text-yellow-500 transition-colors"
                                    >
                                        {contactData.email}
                                    </a>
                                </div>
                            </div>

                            {/* Office Hours */}
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                                        Office Hours
                                    </div>
                                    <div className="space-y-0.5">
                                        {contactData.officeHours.map((hour, i) => (
                                            <div key={i} className="text-slate-500 dark:text-slate-400 text-sm">
                                                {hour}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 h-[220px]">
                            <iframe
                                title="Barangay II Hall Location"
                                src="https://maps.google.com/maps?q=Don+Juan+Subd+Pres+Quirino+St+Brgy+II+Barangay+Hall+San+Carlos+City+Negros+Occidental+Philippines&t=&z=16&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, position: "absolute", inset: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                            {/* View on Google Maps overlay */}
                            <a
                                href={contactData.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg shadow hover:bg-white dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                    <circle cx="12" cy="10" r="3"/>
                                </svg>
                                View on Google Maps
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}