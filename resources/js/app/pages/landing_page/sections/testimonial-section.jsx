import React from "react";
import Card from "@/app/_components/card";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

/* =========================
   ANIMATION
========================= */
const fadeUp = {
    hidden: { opacity: 0, y: 28 },
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

/* =========================
   DATA
========================= */
const testimonials = [
    {
        text: "EmpireOne's IT team worked seamlessly with ours to modernize our entire infrastructure. Their technical depth and hands-on approach made a complex migration feel effortless.",
        name: "Amado C. Serrano",
        title: "IT Specialist.",
        avatar: "/images/image-3.png",
    },
    {
        text: "Partnering with EmpireOne has been a game-changer for our hiring process. Their platform helped us attract top-tier talent faster and smarter than ever before.",
        name: "Jona Mae Tanchico",
        title: "Talent Acquisition",
        avatar: "/images/image-2.png",
    },
    {
        text: "EmpireOne truly understands the creative process. They gave our team the tools and space to bring bold ideas to life — our campaigns have never looked better.",
        name: "Cyrus Sy",
        title: "Creative Team",
        avatar: "/images/image-1.png",
    },
];

/* =========================
   ICONS
========================= */
function StarIcon() {
    return <Star size={18} className="text-yellow-400" />;
}

function QuoteIcon() {
    return <Quote size={20} className="text-white" />;
}

/* =========================
   MAIN
========================= */
export default function TestimonialSection() {
    return (
        <section
            id="testimonial"
            className="relative px-6 py-20 lg:py-28 overflow-hidden"
            style={{
                background: `linear-gradient(135deg,rgba(13,5,32,0.92) 0%,rgba(19,8,48,0.92) 50%,rgba(10,15,31,0.96) 100%), url('/images/empireone-background.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* BACKGROUND ORBS */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(circle at 20% 80%, rgba(168,85,247,0.15), transparent 60%),
                        radial-gradient(circle at 80% 20%, rgba(59,130,246,0.12), transparent 60%)
                    `,
                }}
            />

            <div className="relative z-10 mx-auto max-w-7xl">
                {/* HEADER */}
                <div className="text-center mb-14">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeUp}
                        className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-4"
                        style={{
                            background: "rgba(168,85,247,0.12)",
                            border: "1px solid rgba(168,85,247,0.3)",
                            color: "#c084fc",
                        }}
                    >
                        <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#a855f7]" />
                        Testimonials
                    </motion.div>

                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeUp}
                        custom={0.1}
                        className="text-4xl sm:text-5xl font-extrabold"
                        style={{
                            background:
                                "linear-gradient(90deg,#c084fc 0%,#93c5fd 55%,#fb923c 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        What Our Clients Say
                    </motion.h2>
                </div>

                {/* GRID */}
                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={t.name}
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeUp}
                            custom={0.15 + index * 0.1}
                        >
                            <Card
                                padding="p-7"
                                className="relative h-full flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white hover:border-purple-400/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300"
                            >
                                {/* FLOATING QUOTE */}
                                <div className="absolute -top-4 right-4 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                                    <QuoteIcon />
                                </div>

                                {/* STARS */}
                                <div className="flex gap-1 mb-5">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon key={i} />
                                    ))}
                                </div>

                                {/* TEXT */}
                                <p className="text-sm leading-7 text-white/70 mb-8">
                                    "{t.text}"
                                </p>

                                {/* USER */}
                                <div className="flex items-center gap-4 mt-auto">
                                    <img
                                        src={t.avatar}
                                        alt={t.name}
                                        className="w-12 h-12 rounded-full object-cover border border-white/20"
                                    />
                                    <div>
                                        <p className="font-semibold text-white">
                                            {t.name}
                                        </p>
                                        <p className="text-xs text-white/50">
                                            {t.title}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
