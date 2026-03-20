import { useState } from "react";

const logos = [
    { id: 1, name: "EmpireOne", src: "/images/eo-full-logo.png" },
    { id: 2, name: "EmpireOne", src: "/images/eo-full-logo.png" },
    { id: 3, name: "EmpireOne", src: "/images/eo-full-logo.png" },
    { id: 4, name: "EmpireOne", src: "/images/eo-full-logo.png" },
    { id: 5, name: "EmpireOne", src: "/images/eo-full-logo.png" },
    { id: 6, name: "EmpireOne", src: "/images/eo-full-logo.png" },
    { id: 7, name: "EmpireOne", src: "/images/eo-full-logo.png" },
    { id: 8, name: "EmpireOne", src: "/images/eo-full-logo.png" },
];

const track = [...logos, ...logos, ...logos];

const SPEED = 35;

export default function CarouselSection() {
    const [paused, setPaused] = useState(false);

    return (
        <>
            <style>{`
                .slim-track {
                    display: flex;
                    align-items: center;
                    width: max-content;
                    animation: slim-marquee ${SPEED}s linear infinite;
                }
                .slim-track.paused {
                    animation-play-state: paused;
                }
                @keyframes slim-marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-${100 / 3}%); }
                }

                .slim-logo {
                    flex-shrink: 0;
                    margin: 0 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: default;
                    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
                                opacity 0.3s ease;
                    opacity: 0.85;
                }
                .slim-logo:hover {
                    transform: scale(1.12);
                    opacity: 1;
                }
                .slim-logo img {
                    height: 48px;
                    width: auto;
                    object-fit: contain;
                    display: block;
                }

                .slim-wrap {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    padding: 20px 0;
                }
                .slim-wrap::before,
                .slim-wrap::after {
                    content: '';
                    position: absolute;
                    top: 0; bottom: 0;
                    width: 120px;
                    z-index: 2;
                    pointer-events: none;
                }
                .slim-wrap::before {
                    left: 0;
                    background: linear-gradient(to right, #e35619, transparent);
                }
                .slim-wrap::after {
                    right: 0;
                    background: linear-gradient(to left, #5e3984, transparent);
                }
            `}</style>

            <div
                style={{
                    background: "linear-gradient(135deg, #e35619 0%, #9a3a7a 50%, #5e3984 100%)",
                    padding: "18px 0",
                    width: "100%",
                }}
            >
                <div
                    className="slim-wrap"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div className={`slim-track ${paused ? "paused" : ""}`}>
                        {track.map((logo, i) => (
                            <div key={`${logo.id}-${i}`} className="slim-logo">
                                <img src={logo.src} alt={logo.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}