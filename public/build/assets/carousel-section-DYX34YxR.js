import{r as i,j as e}from"./app-CldPQyC1.js";const s=[{id:1,name:"BBB",src:"/images/BBB-logo.png"},{id:2,name:"SOC2",src:"/images/SOC2-Logo.png"},{id:3,name:"PCI",src:"/images/PCI-Logo.png"},{id:4,name:"ISO",src:"/images/ISO-Logo.png"},{id:5,name:"HIPAA",src:"/images/HIPAA-Logo.png"},{id:6,name:"GDPR",src:"/images/GDPR-Logo.png"},{id:1,name:"BBB",src:"/images/BBB-logo.png"},{id:2,name:"SOC2",src:"/images/SOC2-Logo.png"},{id:3,name:"PCI",src:"/images/PCI-Logo.png"},{id:4,name:"ISO",src:"/images/ISO-Logo.png"},{id:5,name:"HIPAA",src:"/images/HIPAA-Logo.png"},{id:6,name:"GDPR",src:"/images/GDPR-Logo.png"}],o=[...s,...s,...s],c=32;function l(){const[n,r]=i.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        .carousel-section {
          width: 100%;
          background: linear-gradient(90deg, #e35619 0%, #9a3a7a 50%, #5e3984 100%);
          padding: 2px 0;
          position: relative;
        }
    
    
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
          animation: marquee ${c}s linear infinite;
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
      `}),e.jsx("div",{className:"carousel-section",children:e.jsx("div",{className:"carousel-inner",onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1),children:e.jsx("div",{className:`carousel-track ${n?"paused":""}`,children:o.map((a,t)=>e.jsx("div",{className:"carousel-logo",children:e.jsx("img",{src:a.src,alt:a.name})},`${a.id}-${t}`))})})})]})}export{l as default};
