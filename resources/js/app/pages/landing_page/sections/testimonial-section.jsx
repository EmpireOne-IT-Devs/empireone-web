import React from "react";
import Card from "@/app/_components/card";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

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

function StarIcon() {
    return <Star size={20} className="text-yellow-400" />;
}

function QuoteIcon() {
    return <Quote size={24} className="text-blue-700" />;
}

export default function TestimonialSection() {
    return (
        <section
            id="testimonial"
            className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >
            <div className="mx-auto max-w-7xl">
                <div className="text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.8 }}
                        variants={fadeUp}
                        custom={0.05}
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-[.12em] uppercase mb-4"
                        style={{
                            background: "rgba(59,130,246,0.08)",
                            border: "1px solid rgba(59,130,246,0.2)",
                            color: "#2563eb",
                        }}
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" style={{ boxShadow: "0 0 8px rgba(59,130,246,0.6)" }} />
                        Client Testimonials
                    </motion.div>
                    <motion.h2
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.6 }}
                        variants={fadeUp}
                        custom={0.14}
                        className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl lg:text-5xl"
                    >
                        What Our Clients Say About Us
                    </motion.h2>
                </div>

                <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-stretch">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.25 }}
                            variants={fadeUp}
                            custom={0.16 + index * 0.08}
                            className="flex-1 flex"
                        >
                            <Card padding="p-6 sm:p-8" className="flex w-full flex-col">
                                <div className="mb-8 flex items-start justify-between gap-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, index) => (
                                            <StarIcon key={index} />
                                        ))}
                                    </div>
                                    <QuoteIcon />
                                </div>

                                <p className="mb-8 flex-1 text-base leading-8 text-slate-500 sm:mb-10 sm:text-lg sm:leading-9">
                                    "{testimonial.text}"
                                </p>

                                <div className="mt-auto flex items-center gap-4">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="h-14 w-14 rounded-full object-cover shadow-md"
                                    />
                                    <div>
                                        <div className="text-lg font-semibold text-slate-800 sm:text-xl">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            {testimonial.title}
                                        </div>
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
