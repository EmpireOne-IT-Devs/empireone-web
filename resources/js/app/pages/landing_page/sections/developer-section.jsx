import React, { useEffect, useRef, useState } from "react";

// ============================================================
// 🔗 SOCIAL MEDIA LINKS
// ============================================================
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

// SVG Social Icons
const GithubIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);
const FacebookIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);
const InstagramIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);
const LinkedInIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
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
            className={`rounded-[18px] p-7 pt-7 pb-5 flex flex-col gap-4 w-[300px] transition-all duration-500 cursor-default font-['Montserrat']
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"}
                hover:-translate-y-2 hover:scale-[1.015] hover:shadow-[0_20px_48px_rgba(0,0,0,0.28)]`}
            style={{
                transitionDelay: `${index * 110}ms`,
                background: "rgba(255, 255, 255, 0.13)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
            }}
        >
            {/* Avatar + Name */}
            <div className="flex items-start gap-4">
                {!imgError ? (
                    <img
                        src={member.img}
                        alt={member.name}
                        onError={() => setImgError(true)}
                        className="w-20 h-20 rounded-[14px] object-cover shrink-0"
                        style={{ border: "1.5px solid rgba(255,255,255,0.3)" }}
                    />
                ) : (
                    <div
                        className="flex w-20 h-20 rounded-[14px] items-center justify-center font-black text-2xl text-white shrink-0"
                        style={{ background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.3)" }}
                    >
                        {member.initials}
                    </div>
                )}

                <div className="pt-1">
                    <p className="m-0 font-black text-base text-white leading-tight">
                        {member.name}
                    </p>
                    <span
                        className="inline-block mt-[7px] text-[10px] font-black tracking-wider uppercase rounded-md px-[10px] py-1 leading-normal"
                        style={{
                            background: "rgba(255,255,255,0.18)",
                            color: "rgba(255,255,255,0.92)",
                            border: "1px solid rgba(255,255,255,0.25)",
                        }}
                    >
                        {member.role}
                    </span>
                </div>
            </div>

            {/* Bio */}
            <p className="m-0 font-normal text-[12.5px] leading-relaxed flex-grow"
                style={{ color: "rgba(255,255,255,0.72)" }}>
                {member.bio}
            </p>

            {/* Socials */}
            <div
                className="flex gap-5 pt-3.5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.18)" }}
            >
                {[
                    { href: member.socials.github,    Icon: GithubIcon,    label: "GitHub"    },
                    { href: member.socials.facebook,  Icon: FacebookIcon,  label: "Facebook"  },
                    { href: member.socials.instagram, Icon: InstagramIcon, label: "Instagram" },
                    { href: member.socials.linkedin,  Icon: LinkedInIcon,  label: "LinkedIn"  },
                ].map(({ href, Icon, label }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="hover:scale-[1.35] hover:-translate-y-0.5 transition-all duration-200 flex items-center"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                        onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,1)"}
                        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
                    >
                        <Icon />
                    </a>
                ))}
            </div>
        </div>
    );
}

export default function DeveloperSection() {
    useGlobalStyles();

    return (
        <section
            className="py-16 px-10 min-h-10 font-['Montserrat'] bg-gradient-to-bl from-purple-400/100 via-blue-400/50 to-transparent"
           
        >
            {/* Section header */}
            <div className="text-center mb-12">
                <p className="mb-2.5 text-[11px] font-black tracking-[0.18em] uppercase animate-[ds-fadeDown_0.6s_ease_both]"
                    style={{ color: "rgba(255,255,255,0.75)" }}>
                    Developer Team
                </p>

                <h2 className="m-0 mb-4 font-black text-[clamp(26px,4vw,42px)] leading-[1.15] animate-[ds-fadeDown_0.65s_ease_0.1s_both]  ">
                    Meet the people behind the unified system
                </h2>

                <p className="mx-auto font-normal text-sm max-w-[500px] leading-relaxed animate-[ds-fadeIn_0.7s_ease_0.25s_both]"
                    style={{ color: "rgba(255,255,255,0.7)" }}>
                    A diverse team of specialists who bring deep expertise
                    across the full development lifecycle.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="flex flex-wrap gap-5 justify-center">
                {teamMembers.map((member, i) => (
                    <TeamCard key={member.name} member={member} index={i} />
                ))}
            </div>
        </section>
    );
}