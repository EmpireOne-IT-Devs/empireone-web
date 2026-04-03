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
        text: "EmpireOne transformed our legacy systems into a modern, scalable infrastructure. Their team's expertise and dedication are unmatched in the industry.",
        name: "Sarah Jenkins",
        title: "CTO, TechFlow Inc.",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        text: "The cybersecurity solutions provided by EmpireOne gave us peace of mind. We haven't had a single breach since partnering with them two years ago.",
        name: "Michael Chen",
        title: "Director of IT, GlobalBank",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        text: "Outstanding service and support. They don't just fix problems; they anticipate them and provide strategic guidance for our future growth.",
        name: "Emily Rodriguez",
        title: "Operations Manager, NexaCorp",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
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
                        className="mb-3 text-sm font-semibold tracking-wide text-blue-600 sm:text-base"
                    >
                        Testimonials
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

                <div className="mt-12 gap-4 flex flex-col md:flex-row">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.25 }}
                            variants={fadeUp}
                            custom={0.16 + index * 0.08}
                            className="flex-1"
                        >
                            <Card padding="p-8">
                                <div className="mb-8 flex items-start justify-between gap-4">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, index) => (
                                            <StarIcon key={index} />
                                        ))}
                                    </div>
                                    <QuoteIcon />
                                </div>

                                <p className="mb-10 flex-1 text-lg leading-9 text-slate-500">
                                    "{testimonial.text}"
                                </p>

                                <div className="mt-auto flex items-center gap-4">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="h-14 w-14 rounded-full object-cover shadow-md"
                                    />
                                    <div>
                                        <div className="text-xl font-semibold text-slate-800">
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
