import { useState } from "react";

const logos = [
    { id: 1, name: "BBB", src: "/images/BBB-logo.png" },
    { id: 2, name: "SOC2", src: "/images/SOC2-Logo.png" },
    { id: 3, name: "PCI", src: "/images/PCI-Logo.png" },
    { id: 4, name: "ISO", src: "/images/ISO-Logo.png" },
    { id: 5, name: "HIPAA", src: "/images/HIPAA-Logo.png" },
    { id: 6, name: "GDPR", src: "/images/GDPR-Logo.png" },
    { id: 1, name: "BBB", src: "/images/BBB-logo.png" },
    { id: 2, name: "SOC2", src: "/images/SOC2-Logo.png" },
    { id: 3, name: "PCI", src: "/images/PCI-Logo.png" },
    { id: 4, name: "ISO", src: "/images/ISO-Logo.png" },
    { id: 5, name: "HIPAA", src: "/images/HIPAA-Logo.png" },
    { id: 6, name: "GDPR", src: "/images/GDPR-Logo.png" },
];

const track = [...logos, ...logos, ...logos];
const SPEED = 32;

export default function CarouselSection() {
    const [paused, setPaused] = useState(false);

    return (
        <>
            <style>{`
        .carousel-section {
          width: 100%;
          background: linear-gradient(90deg, #e35619 0%, #9a3a7a 50%, #5e3984 100%);
          padding: 2px 0;
          position: relative;
        }
    
        .carousel-inner {
          background: rgba(0,0,0,0.18);
          backdrop-filter: blur(2px);
          padding: 10px 0;
          position: relative;
          overflow: hidden;
        }
        .carousel-inner::before,
        .carousel-inner::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 100px;
          z-index: 3;
          pointer-events: none;
        }
        .carousel-inner::before {
          left: 0;
          background: linear-gradient(to right, rgba(20,6,30,0.92), transparent);
        }
        .carousel-inner::after {
          right: 0;
          background: linear-gradient(to left, rgba(20,6,30,0.92), transparent);
        }
        .carousel-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: marquee ${SPEED}s linear infinite;
        }
        .carousel-track.paused {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .carousel-logo {
          flex-shrink: 0;
          margin: 0 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), filter 0.3s ease;
          filter: brightness(0.82) saturate(0.7);
          cursor: default;
        }
        .carousel-logo:hover {
          transform: scale(1.15) translateY(-1px);
          filter: brightness(1.1) saturate(1.1) drop-shadow(0 0 8px rgba(255,255,255,0.3));
        }
        .carousel-logo img {
          height: 90px;
          width: auto;
          object-fit: contain;
          display: block;
        }
      `}</style>

            <div className="carousel-section">
                <div
                    className="carousel-inner"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    <div className={`carousel-track ${paused ? "paused" : ""}`}>
                        {track.map((logo, i) => (
                            <div
                                key={`${logo.id}-${i}`}
                                className="carousel-logo"
                            >
                                <img src={logo.src} alt={logo.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
