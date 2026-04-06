import{r as c,j as e}from"./app-Cr-9_y6R.js";import{m as a}from"./proxy-Da3uyKDY.js";const t={hidden:{opacity:0,y:26},visible:(i=0)=>({opacity:1,y:0,transition:{duration:.68,delay:i,ease:[.22,1,.36,1]}})},r=[{id:1,name:"BBB",src:"/images/BBB-logo.png"},{id:2,name:"SOC2",src:"/images/SOC2-Logo.png"},{id:3,name:"PCI",src:"/images/PCI-Logo.png"},{id:4,name:"ISO",src:"/images/ISO-Logo.png"},{id:5,name:"HIPAA",src:"/images/HIPAA-Logo.png"},{id:6,name:"GDPR",src:"/images/GDPR-Logo.png"}],d=[...r,...r,...r],l=38;function x(){const[i,n]=c.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

        .cs-root {
          width: 100%;
          padding: 100px 0 90px;
          background: #eef5ff;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
        }

        /* Subtle dot grid */
        .cs-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(59,130,246,0.18) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse 85% 70% at 50% 50%, black 20%, transparent 100%);
          pointer-events: none;
        }

        /* Top center radial glow */
        .cs-glow {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 480px;
          background: radial-gradient(ellipse at center, rgba(59,130,246,0.18) 0%, transparent 68%);
          pointer-events: none;
        }

        /* Bottom wave decoration */
        .cs-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(to top, rgba(59,130,246,0.06), transparent);
          pointer-events: none;
        }

        /* ── Header ── */
        .cs-header {
          position: relative;
          text-align: center;
          margin-bottom: 20px;
          z-index: 2;
        }

        .cs-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 18px;
          border-radius: 100px;
          border: 1px solid rgba(59,130,246,0.3);
          background: rgba(59,130,246,0.08);
          color: #1d4ed8;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          margin-bottom: 22px;
        }

        .cs-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3b82f6;
          box-shadow: 0 0 8px rgba(59,130,246,0.7);
          animation: cs-pulse 2s ease-in-out infinite;
        }

        @keyframes cs-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        .cs-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin: 0 0 14px;
        }

        .cs-title span {
          background: linear-gradient(100deg, #2563eb 0%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cs-rule {
          width: 48px;
          height: 3px;
          background: linear-gradient(90deg, #2563eb, #93c5fd);
          border-radius: 99px;
          margin: 16px auto 28px;
        }

        .cs-subtitle {
          color: #64748b;
          font-size: 1rem;
          max-width: 420px;
          margin: 0 auto 60px;
          line-height: 1.65;
        }

        /* ── Carousel track ── */
        .cs-track-wrap {
          position: relative;
          height: 148px;
          display: flex;
          align-items: center;
          z-index: 2;
        }

        .cs-track-wrap::before,
        .cs-track-wrap::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 180px;
          z-index: 4;
          pointer-events: none;
        }
        .cs-track-wrap::before {
          left: 0;
          background: linear-gradient(to right, #eef5ff 0%, transparent 100%);
        }
        .cs-track-wrap::after {
          right: 0;
          background: linear-gradient(to left, #eef5ff 0%, transparent 100%);
        }

        .cs-track {
          display: flex;
          align-items: center;
          width: max-content;
          gap: 18px;
          padding: 12px 18px;
          animation: cs-marquee ${l}s linear infinite;
          will-change: transform;
        }

        .cs-track.paused { animation-play-state: paused; }

        @keyframes cs-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        /* ── Badge card ── */
        .cs-badge {
          flex-shrink: 0;
          position: relative;
          width: 164px;
          height: 124px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 20px;
          cursor: pointer;
          background: #ffffff;
          border: 1px solid rgba(59,130,246,0.15);
          box-shadow:
            0 2px 8px rgba(59,130,246,0.06),
            0 1px 2px rgba(0,0,0,0.04);
          transition:
            transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
            box-shadow 0.35s ease,
            border-color 0.35s ease;
          overflow: hidden;
        }

        /* Shimmer sweep */
        .cs-badge::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -75%;
          width: 50%;
          height: 200%;
          background: linear-gradient(
            120deg,
            transparent 30%,
            rgba(255,255,255,0.7) 50%,
            transparent 70%
          );
          transform: skewX(-15deg);
          pointer-events: none;
        }
        .cs-badge:hover::after {
          left: 150%;
          transition: left 0.55s ease;
        }

        .cs-badge:hover {
          transform: translateY(-10px) scale(1.06);
          border-color: rgba(59,130,246,0.45);
          box-shadow:
            0 0 0 3px rgba(59,130,246,0.1),
            0 20px 40px rgba(59,130,246,0.15),
            0 4px 10px rgba(0,0,0,0.06);
        }

        /* Top-edge color accent on hover */
        .cs-badge-accent {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #2563eb, #60a5fa);
          border-radius: 20px 20px 0 0;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .cs-badge:hover .cs-badge-accent { transform: scaleX(1); }

        /* Inner top glow */
        .cs-badge-glow {
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: radial-gradient(ellipse at 50% -10%, rgba(59,130,246,0.09) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .cs-badge:hover .cs-badge-glow { opacity: 1; }

        .cs-badge img {
          height: 58px;
          width: auto;
          object-fit: contain;
          filter: opacity(0.65) saturate(0.5);
          transition: filter 0.35s ease, transform 0.35s ease;
          position: relative;
          z-index: 1;
        }
        .cs-badge:hover img {
          filter: opacity(1) saturate(1.1);
          transform: scale(1.05);
        }

        .cs-badge-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #94a3b8;
          transition: color 0.3s ease;
          position: relative;
          z-index: 1;
        }
        .cs-badge:hover .cs-badge-label { color: #2563eb; }

        /* ── Stats row ── */
        .cs-stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0;
          margin-top: 64px;
          position: relative;
          z-index: 2;
          max-width: 640px;
          margin-left: auto;
          margin-right: auto;
          background: #ffffff;
          border: 1px solid rgba(59,130,246,0.15);
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(59,130,246,0.08);
          overflow: hidden;
        }

        .cs-stat {
          flex: 1;
          text-align: center;
          padding: 24px 16px;
          position: relative;
        }

        .cs-stat + .cs-stat::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          height: 60%;
          width: 1px;
          background: rgba(59,130,246,0.15);
        }

        .cs-stat-number {
          font-family: 'Syne', sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
          line-height: 1;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cs-stat-label {
          font-size: 11px;
          font-weight: 500;
          color: #94a3b8;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 5px;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .cs-root { padding: 72px 0 60px; }
          .cs-badge { width: 132px; height: 104px; }
          .cs-badge img { height: 46px; }
          .cs-track-wrap { height: 114px; }
          .cs-track-wrap::before,
          .cs-track-wrap::after { width: 80px; }
          .cs-stats { margin: 48px 16px 0; }
          .cs-stat-number { font-size: 1.35rem; }
        }
      `}),e.jsxs("section",{className:"cs-root",children:[e.jsx("div",{className:"cs-glow"}),e.jsx("div",{className:"cs-wave"}),e.jsxs(a.div,{initial:"hidden",whileInView:"visible",viewport:{once:!1,amount:.4},variants:t,custom:.05,className:"cs-header",children:[e.jsxs(a.div,{initial:"hidden",whileInView:"visible",viewport:{once:!1,amount:.7},variants:t,custom:.1,className:"cs-eyebrow",children:[e.jsx("span",{className:"cs-eyebrow-dot"}),"Compliance & Trust"]}),e.jsxs(a.h2,{initial:"hidden",whileInView:"visible",viewport:{once:!1,amount:.6},variants:t,custom:.16,className:"cs-title",children:["Built on a foundation of ",e.jsx("span",{children:"certified trust"})]}),e.jsx("div",{className:"cs-rule"}),e.jsx(a.p,{initial:"hidden",whileInView:"visible",viewport:{once:!1,amount:.6},variants:t,custom:.22,className:"cs-subtitle",children:"Every credential earned, every standard exceeded — so your data stays protected."})]}),e.jsx(a.div,{initial:"hidden",whileInView:"visible",viewport:{once:!1,amount:.25},variants:t,custom:.28,className:"cs-track-wrap",onMouseEnter:()=>n(!0),onMouseLeave:()=>n(!1),children:e.jsx("div",{className:`cs-track ${i?"paused":""}`,children:d.map((s,o)=>e.jsxs("div",{className:"cs-badge",children:[e.jsx("div",{className:"cs-badge-accent"}),e.jsx("div",{className:"cs-badge-glow"}),e.jsx("img",{src:s.src,alt:s.name}),e.jsx("span",{className:"cs-badge-label",children:s.name})]},`${s.id}-${o}`))})})]})]})}export{x as default};
