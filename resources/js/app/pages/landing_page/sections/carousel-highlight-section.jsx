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

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 2000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const handlePrev = () => { goTo(current - 1); resetTimer(); };
  const handleNext = () => { goTo(current + 1); resetTimer(); };
  const handleDot = (i) => { goTo(i); resetTimer(); };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      goTo(dx < 0 ? current + 1 : current - 1);
      resetTimer();
    }
  };

  return (
    <div style={{ padding: "1rem 0" }}>
      <div style={{ position: "relative", overflow: "hidden", borderRadius: "12px" }}>
        <div
          style={{
            display: "flex",
            transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: `translateX(-${current * 100}%)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Slide ${i + 1}`}
              style={{ minWidth: "100%", height: "580px", objectFit: "cover", display: "block" }}
            />
          ))}
        </div>

        <button onClick={handlePrev} style={btnStyle("left")}><ChevronLeft /></button>
        <button onClick={handleNext} style={btnStyle("right")}><ChevronRight /></button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "6px", paddingTop: "14px" }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            style={{
              width: i === current ? "20px" : "6px",
              height: "6px",
              borderRadius: i === current ? "3px" : "50%",
              background: i === current ? "#111" : "#ccc",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function btnStyle(side) {
  return {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    [side]: "14px",
    background: "#fff",
    border: "0.5px solid rgba(0,0,0,0.15)",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
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