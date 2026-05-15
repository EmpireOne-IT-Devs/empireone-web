import { Facebook, Github, Instagram, Linkedin } from "@thesvg/react";
import React, { useEffect, useRef, useState } from "react";
import { FaFacebook } from "react-icons/fa6";

const teamMembers = [
    {
        name: "Quickly De Guzman",
        role: "Full-Stack Developer",
        bio: "Building scalable, high-performance systems with seamless user experiences. With a strong focus on clean architecture and modern technologies, I turn complex ideas into reliable and intuitive digital solutions.",
        img: "/images/2.png",
        initials: "QD",
        socials: {
            github: "https://github.com/",
            facebook: "https://facebook.com/",
            instagram: "https://instagram.com/",
            linkedin: "https://linkedin.com/",
        },
    },
    {
        name: "Wacky Hojilla",
        role: "Web Developer",
        bio: "I build modern web experiences that are fast, functional, and designed to stand out focused on performance, clean code, and seamless user interactions.",
        img: "/images/4.png",
        initials: "WH",
        socials: {
            github: "https://github.com/",
            facebook: "https://facebook.com/",
            instagram: "https://instagram.com/",
            linkedin: "https://linkedin.com/",
        },
    },
    {
        name: "Marlou Pepito",
        role: "Senior Full-Stack Developer",
        bio: "Specializing in crafting robust, scalable applications from end to end. I combine technical expertise with thoughtful design to deliver systems that are fast, reliable, and built for real-world impact.",
        img: "/images/1.png",
        initials: "MP",
        socials: {
            github: "https://github.com/",
            facebook: "https://facebook.com/",
            instagram: "https://instagram.com/",
            linkedin: "https://linkedin.com/",
        },
    },
    {
        name: "Christ Vein Cabalida",
        role: "UX/UI Designer",
        bio: "Turning ideas into seamless, visually compelling experiences where simplicity, function, and style all work together to create intuitive and engaging user journeys.",
        img: "/images/3.png",
        initials: "CC",
        socials: {
            github: "https://github.com/",
            facebook: "https://facebook.com/",
            instagram: "https://instagram.com/",
            linkedin: "https://linkedin.com/",
        },
    },
    {
        name: "Snickers Jay Magbanua",
        role: "Mobile Developer",
        bio: "Building mobile experiences that combine performance, clean design, and usability crafted for users on the go with a focus on speed, scalability, and intuitive user flows.",
        img: "/images/5.png",
        initials: "SM",
        socials: {
            github: "https://github.com/",
            facebook: "https://facebook.com/",
            instagram: "https://instagram.com/",
            linkedin: "https://linkedin.com/",
        },
    },
];

const GithubIcon = () => <Github width="18" height="18" fill="currentColor" />;
const FacebookIcon = () => (
    <FaFacebook width="18" height="18" fill="currentColor" />
);
const InstagramIcon = () => (
    <Instagram width="18" height="18" fill="currentColor" />
);
const LinkedInIcon = () => (
    <Linkedin width="18" height="18" fill="currentColor" />
);

function useGlobalStyles() {
    useEffect(() => {
        const id = "dev-section-styles";
        if (document.getElementById(id)) return;
        const style = document.createElement("style");
        style.id = id;
        style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;900&display=swap');
      @keyframes ds-fadeDown {
        from { opacity: 0; transform: translateY(-20px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes ds-fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      .ds-card-flip:hover .ds-card-flip-inner {
        transform: rotateY(180deg);
        -webkit-transform: rotateY(180deg);
      }
      .ds-gradient-text {
        background: linear-gradient(90deg, #c084fc 0%, #60a5fa 50%, #fb923c 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .ds-label-gradient {
        background: linear-gradient(90deg, #a78bfa, #f97316);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    `;
        document.head.appendChild(style);
    }, []);
}

function TeamCard({ member, index }) {
    const [isVisible, setIsVisible] = useState(false);
    const [imgError, setImgError] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12 },
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 font-['Montserrat'] ${
                isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-7"
            }`}
            style={{ transitionDelay: `${index * 110}ms` }}
        >
            <div
                className="ds-card-flip"
                style={{
                    width: "280px",
                    height: "360px",
                    perspective: "1200px",
                    cursor: "default",
                }}
            >
                <div
                    className="ds-card-flip-inner relative w-full h-full"
                    style={{
                        transformStyle: "preserve-3d",
                        WebkitTransformStyle: "preserve-3d",
                        transition:
                            "transform 0.75s cubic-bezier(0.4, 0.2, 0.2, 1)",
                        WebkitTransition:
                            "-webkit-transform 0.75s cubic-bezier(0.4, 0.2, 0.2, 1)",
                        willChange: "transform",
                    }}
                >
                    <div
                        className="absolute inset-0 rounded-[20px] flex flex-col justify-end"
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(0deg)",
                            WebkitTransform: "rotateY(0deg)",
                            pointerEvents: "none",
                            overflow: "hidden",
                            boxShadow:
                                "0 8px 40px rgba(5,8,22,0.65), 0 0 0 1px rgba(124,58,237,0.25)",
                        }}
                    >
                        {!imgError ? (
                            <img
                                src={member.img}
                                alt={member.name}
                                onError={() => setImgError(true)}
                                className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
                            />
                        ) : (
                            <div
                                className="absolute inset-0 flex items-center justify-center font-black text-6xl text-white"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(124,58,237,0.75) 0%, rgba(59,130,246,0.55) 55%, rgba(249,115,22,0.55) 100%)",
                                }}
                            >
                                {member.initials}
                            </div>
                        )}
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    "linear-gradient(to top, rgba(5,8,22,0.97) 0%, rgba(10,5,28,0.62) 50%, rgba(5,8,22,0.1) 100%)",
                            }}
                        />
                        <div
                            className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
                            style={{
                                background:
                                    "radial-gradient(ellipse at 50% 110%, rgba(124,58,237,0.45) 0%, transparent 70%)",
                            }}
                        />
                        <div className="relative z-10 px-5 pb-6 text-center">
                            <p className="m-0 font-black text-[15px] text-white leading-tight tracking-wide">
                                {member.name}
                            </p>
                            <span
                                className="inline-block mt-2 text-[9px] font-black tracking-[0.14em] uppercase rounded-full px-3 py-[5px]"
                                style={{
                                    background:
                                        "linear-gradient(90deg, rgba(124,58,237,0.45), rgba(249,115,22,0.35))",
                                    color: "rgba(255,255,255,0.95)",
                                    border: "1px solid rgba(168,85,247,0.55)",
                                    boxShadow: "0 0 14px rgba(124,58,237,0.3)",
                                }}
                            >
                                {member.role}
                            </span>
                        </div>
                    </div>
                    <div
                        className="absolute inset-0 rounded-[20px] flex flex-col p-5 gap-3"
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            WebkitTransform: "rotateY(180deg)",
                            background:
                                "linear-gradient(145deg, #07041a 0%, #0b0620 50%, #050d1e 100%)",
                            boxShadow:
                                "0 0 0 1px rgba(124,58,237,0.5), 0 0 45px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                        }}
                    >
                        <div className="flex items-center gap-3">
                            {!imgError ? (
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-14 h-14 rounded-[10px] object-cover shrink-0"
                                    style={{
                                        border: "1.5px solid rgba(168,85,247,0.65)",
                                        boxShadow:
                                            "0 0 14px rgba(124,58,237,0.4)",
                                    }}
                                />
                            ) : (
                                <div
                                    className="flex w-14 h-14 rounded-[10px] items-center justify-center font-black text-xl text-white shrink-0"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(249,115,22,0.25))",
                                        border: "1.5px solid rgba(168,85,247,0.55)",
                                        boxShadow:
                                            "0 0 12px rgba(124,58,237,0.3)",
                                    }}
                                >
                                    {member.initials}
                                </div>
                            )}
                            <div>
                                <p className="m-0 font-black text-[13px] text-white leading-tight">
                                    {member.name}
                                </p>
                                <span
                                    className="inline-block mt-1.5 text-[9px] font-black tracking-[0.1em] uppercase rounded-full px-2.5 py-1"
                                    style={{
                                        background:
                                            "linear-gradient(90deg, rgba(124,58,237,0.25), rgba(249,115,22,0.2))",
                                        color: "rgb(251,146,60)",
                                        border: "1px solid rgba(249,115,22,0.45)",
                                        boxShadow:
                                            "0 0 8px rgba(249,115,22,0.2)",
                                    }}
                                >
                                    {member.role}
                                </span>
                            </div>
                        </div>
                        <div
                            style={{
                                height: "1px",
                                background:
                                    "linear-gradient(90deg, transparent, rgba(124,58,237,0.7), rgba(59,130,246,0.6), rgba(249,115,22,0.5), transparent)",
                            }}
                        />
                        <p
                            className="m-0 font-normal text-[11.5px] leading-relaxed flex-grow overflow-hidden"
                            style={{ color: "rgba(255,255,255,0.72)" }}
                        >
                            {member.bio}
                        </p>
                        <div
                            className="flex gap-4 pt-3"
                            style={{
                                borderTop: "1px solid transparent",
                                boxShadow:
                                    "inset 0 1px 0 rgba(124,58,237,0.35)",
                            }}
                        >
                            {[
                                {
                                    href: member.socials.github,
                                    Icon: GithubIcon,
                                    label: "GitHub",
                                },
                                {
                                    href: member.socials.facebook,
                                    Icon: FacebookIcon,
                                    label: "Facebook",
                                },
                                {
                                    href: member.socials.instagram,
                                    Icon: InstagramIcon,
                                    label: "Instagram",
                                },
                                {
                                    href: member.socials.linkedin,
                                    Icon: LinkedInIcon,
                                    label: "LinkedIn",
                                },
                            ].map(({ href, Icon, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="hover:scale-[1.3] hover:-translate-y-0.5 transition-all duration-200 flex items-center"
                                >
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DeveloperSection() {
    useGlobalStyles();

    return (
        <section
            className="relative py-16 px-10 min-h-10 font-['Montserrat'] overflow-hidden"
            style={{
                colorScheme: "dark",
                background: "#050816",
            }}
        >
            <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
            >
                <div
                    style={{
                        position: "absolute",
                        top: "-15%",
                        left: "-8%",
                        width: "55%",
                        height: "65%",
                        background:
                            "radial-gradient(circle, rgba(124,58,237,0.32) 0%, transparent 65%)",
                        filter: "blur(55px)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: "20%",
                        right: "-10%",
                        width: "45%",
                        height: "55%",
                        background:
                            "radial-gradient(circle, rgba(249,115,22,0.22) 0%, transparent 65%)",
                        filter: "blur(55px)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-15%",
                        left: "25%",
                        width: "55%",
                        height: "55%",
                        background:
                            "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 65%)",
                        filter: "blur(55px)",
                    }}
                />
            </div>
            <div className="relative z-10 text-center mb-12">
                <p className="ds-label-gradient mb-2.5 text-[11px] font-black tracking-[0.18em] uppercase animate-[ds-fadeDown_0.6s_ease_both]">
                    Developer Team
                </p>

                <h2 className="ds-gradient-text m-0 mb-4 font-black text-[clamp(26px,4vw,42px)] leading-[1.15] animate-[ds-fadeDown_0.65s_ease_0.1s_both]">
                    Meet the people behind the unified system
                </h2>

                <p
                    className="mx-auto font-normal text-sm max-w-[500px] leading-relaxed animate-[ds-fadeIn_0.7s_ease_0.25s_both]"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                >
                    A diverse team of specialists who bring deep expertise
                    across the full development lifecycle.
                </p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-5 justify-center">
                {teamMembers.map((member, i) => (
                    <TeamCard key={member.name} member={member} index={i} />
                ))}
            </div>
        </section>
    );
}
