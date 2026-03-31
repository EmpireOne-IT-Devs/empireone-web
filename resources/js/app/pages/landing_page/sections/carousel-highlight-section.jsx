import React, { useState, useRef, useEffect } from "react";

const slides = [
  "images/empireone-background.jpg",
  "images/empireone-background.jpg",
  "images/empireone-background.jpg",
  "images/empireone-background.jpg",
  "images/empireone-background.jpg",
];

export default function CarouselHighlightSection() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const timerRef = useRef(null);

  const goTo = (i) => setCurrent((i + slides.length) % slides.length);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 3500);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const handlePrev = () => { goTo(current - 1); startTimer(); };
  const handleNext = () => { goTo(current + 1); startTimer(); };
  const handleDot = (i) => { goTo(i); startTimer(); };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      goTo(dx < 0 ? current + 1 : current - 1);
      startTimer();
    }
  };

  return (
    <div style={{ padding: "0.5rem 0" }}>
      {/* Carousel Track */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 7",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#e5e7eb",
      }}>
        <div
          style={{
            display: "flex",
            height: "100%",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: `translateX(-${current * 100}%)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((src, i) => (
            <div key={i} style={{ minWidth: "100%", height: "100%", flexShrink: 0 }}>
              <img
                src={src}
                alt={`Slide ${i + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            </div>
          ))}
        </div>

        {/* Prev / Next Buttons */}
        <button onClick={handlePrev} style={navBtnStyle("left")}>
          <ChevronLeft />
        </button>
        <button onClick={handleNext} style={navBtnStyle("right")}>
          <ChevronRight />
        </button>

        {/* Slide Counter */}
        <div style={{
          position: "absolute",
          bottom: "14px",
          right: "16px",
          background: "rgba(0,0,0,0.45)",
          color: "#fff",
          fontSize: "12px",
          padding: "3px 10px",
          borderRadius: "20px",
          letterSpacing: "0.03em",
          pointerEvents: "none",
        }}>
          {current + 1} / {slides.length}
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", paddingTop: "12px" }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            style={{
              width: i === current ? "22px" : "7px",
              height: "7px",
              borderRadius: "20px",
              background: i === current ? "#111" : "#d1d5db",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function navBtnStyle(side) {
  return {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    [side]: "14px",
    background: "rgba(255,255,255,0.85)",
    border: "0.5px solid rgba(0,0,0,0.12)",
    borderRadius: "50%",
    width: "42px",
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 10,
  };
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}