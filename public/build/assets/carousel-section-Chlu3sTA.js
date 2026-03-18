import{r as t,j as e}from"./app-CS9HVgpl.js";const r=[{id:1,name:"EmpireOne",src:"/images/empireone.png"},{id:2,name:"EmpireOne",src:"/images/empireone.png"},{id:3,name:"EmpireOne",src:"/images/empireone.png"},{id:4,name:"EmpireOne",src:"/images/empireone.png"},{id:5,name:"EmpireOne",src:"/images/empireone.png"},{id:6,name:"EmpireOne",src:"/images/empireone.png"},{id:7,name:"EmpireOne",src:"/images/empireone.png"},{id:8,name:"EmpireOne",src:"/images/empireone.png"}],o=[...r,...r,...r];function c(){const[i,n]=t.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        .logo-track {
          display: flex;
          align-items: center;
          gap: 0;
          width: max-content;
          animation: marquee 42s linear infinite;
        }
        .logo-track.paused {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${100/3}%); }
        }

        .logo-card {
          flex-shrink: 0;
          width: 220px;
          height: 130px;
          margin: 0 14px;
          background: rgba(255,255,255,0.82);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 16px rgba(120,140,160,0.12), 0 1px 4px rgba(120,140,160,0.08);
          border: 1px solid rgba(255,255,255,0.9);
          cursor: default;
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.28s ease,
                      background 0.2s;
          backdrop-filter: blur(6px);
          padding: 20px 24px;
        }
        .logo-card:hover {
          transform: translateY(-6px) scale(1.05);
          box-shadow: 0 16px 40px rgba(120,140,180,0.20), 0 2px 10px rgba(120,140,180,0.10);
          background: rgba(255,255,255,0.97);
        }

        .logo-card img {
          max-width: 100%;
          max-height: 64px;
          width: auto;
          height: auto;
          object-fit: contain;
          transition: filter 0.2s;
        }

        .carousel-wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 32px 0;
        }

        .carousel-wrap::before,
        .carousel-wrap::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 140px;
          z-index: 2;
          pointer-events: none;
        }
        .carousel-wrap::before {
          left: 0;
          background: linear-gradient(to right, #c03d27, transparent);
        }
        .carousel-wrap::after {
          right: 0;
          background: linear-gradient(to left, #7a3d9e, transparent);
        }
      `}),e.jsx("div",{style:{background:"linear-gradient(135deg, #e35619 0%, #9a3a7a 50%, #5e3984 100%)",padding:"60px 0 52px",width:"100%"},children:e.jsx("div",{className:"carousel-wrap",onMouseEnter:()=>n(!0),onMouseLeave:()=>n(!1),children:e.jsx("div",{className:`logo-track ${i?"paused":""}`,children:o.map((a,s)=>e.jsx("div",{className:"logo-card",children:e.jsx("img",{src:a.src,alt:a.name})},`${a.id}-${s}`))})})})]})}export{c as default};
