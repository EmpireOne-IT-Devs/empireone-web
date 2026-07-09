import{r as l,j as e}from"./app-Dr2s5l3K.js";import"./index-B5DtptB9.js";const t=[{role:"UI/UX Designer",type:"Remote",color:"#7c3aed"},{role:"Customer Support",type:"Full-time",color:"#0ea5e9"},{role:"Data Analyst",type:"Contract",color:"#10b981"},{role:"Sales Rep",type:"Remote",color:"#f97316"},{role:"Administrative Assistant",type:"Part-time",color:"#ec4899"},{role:"TA Staff",type:"Freelance",color:"#f59e0b"},{role:"Account Manager",type:"Remote",color:"#6366f1"}];function o(){const[r,i]=l.useState(850);return l.useEffect(()=>{const s=setInterval(()=>{i(a=>a+Math.floor(Math.random()*3))},3e3);return()=>clearInterval(s)},[]),e.jsxs("section",{className:"relative sm:min-h-screen w-full overflow-hidden bg-[#0a0a14] text-white flex flex-col",id:"home",children:[e.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .font-syne { font-family: 'Syne', sans-serif; }
        .font-dm { font-family: 'DM Sans', sans-serif; }

        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .ticker-left { animation: scrollLeft 35s linear infinite; }
        .ticker-right { animation: scrollRight 28s linear infinite; }

        .ticker-left:hover,
        .ticker-right:hover { animation-play-state: paused; }

        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .float { animation: float 4s ease-in-out infinite; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(48px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-48px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes scalePop {
          0%   { opacity: 0; transform: scale(0.85); }
          70%  { transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes orbPulse {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50%     { opacity: 1;   transform: scale(1.08); }
        }

        .anim-fade-up   { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-fade-in   { animation: fadeIn 0.8s ease both; }
        .anim-slide-right { animation: slideInRight 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-slide-left  { animation: slideInLeft 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-scale-pop { animation: scalePop 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-orb       { animation: orbPulse 6s ease-in-out infinite; }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
      `}),e.jsx("div",{className:"absolute inset-0 bg-[#0a0a14]"}),e.jsx("div",{className:"absolute w-[700px] h-[700px] bg-purple-600/30 blur-3xl rounded-full -top-40 -left-32 anim-orb"}),e.jsx("div",{className:"absolute w-[600px] h-[600px] bg-orange-500/20 blur-3xl rounded-full top-20 -right-24 anim-orb delay-300"}),e.jsx("div",{className:"absolute w-[400px] h-[400px] bg-sky-500/20 blur-3xl rounded-full bottom-10 left-1/3 anim-orb delay-600"}),e.jsxs("div",{className:"relative z-10 sm:flex-1 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-20 flex flex-col lg:flex-row items-center gap-6 lg:gap-10 pt-20 sm:pt-24 lg:pt-10 pb-8 sm:pb-0",children:[e.jsxs("div",{className:"w-full lg:w-[55%] font-dm space-y-4 sm:space-y-5 lg:space-y-6 mt-0 sm:mt-4 lg:mt-14 text-center lg:text-left",children:[e.jsxs("div",{className:"flex gap-2 sm:gap-3 flex-wrap justify-center lg:justify-start anim-fade-up",children:[e.jsxs("div",{className:"flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-[10px] sm:text-xs font-semibold",children:[e.jsx("span",{className:"w-2 h-2 bg-emerald-400 rounded-full animate-ping"}),r.toLocaleString()," Employees"]}),e.jsx("div",{className:"px-2.5 sm:px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-400/30 text-orange-400 text-[10px] sm:text-xs font-semibold",children:"🔥 10+ new this week"})]}),e.jsxs("h1",{className:"font-syne text-[clamp(32px,8vw,88px)] anim-fade-up delay-200 sm:text-[clamp(40px,7vw,88px)] lg:text-[clamp(48px,6vw,88px)] leading-[1.1] sm:leading-[1.05] lg:leading-[1.02]",children:["Your Next ",e.jsx("br",{}),e.jsx("span",{className:"bg-gradient-to-r from-purple-400 to-orange-400 text-transparent bg-clip-text",children:"Dream Career"}),e.jsx("br",{})," Starts Here."]}),e.jsx("p",{className:"text-white/60 max-w-md mx-auto lg:mx-0 text-base sm:text-lg px-4 sm:px-0 anim-fade-up delay-300",children:"Join the leading BPO platform of independent professionals. Get hired faster, work smarter, earn more."})]}),e.jsxs("div",{className:"hidden sm:flex w-full lg:w-[45%] relative items-end justify-center z-10 lg:self-end anim-slide-right delay-300",children:[e.jsx("img",{src:"/images/mmm.png",className:"max-w-[480px] sm:max-w-[700px] md:max-w-[960px] lg:max-w-none lg:w-[130%] object-contain w-full",alt:"",draggable:"false",onDragStart:s=>s.preventDefault(),style:{userSelect:"none",WebkitUserDrag:"none"}}),e.jsx("div",{className:"hidden sm:block absolute top-[8%] right-[-2%] lg:right-[-2%] md:right-[2%] z-20 bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 shadow-xl float max-w-[180px] sm:max-w-none animate-bounce",children:e.jsxs("div",{className:"flex items-center gap-2 sm:gap-3",children:[e.jsx("div",{className:"w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0",children:e.jsx("svg",{width:"16",height:"16",className:"sm:w-5 sm:h-5",fill:"white",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"})})}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"text-[10px] sm:text-xs text-white/40",children:"New Offer!"}),e.jsx("p",{className:"font-bold text-xs sm:text-sm truncate",children:"🎉 Congratulations!"}),e.jsx("p",{className:"text-xs sm:text-sm text-purple-400 truncate",children:"You've been hired"})]})]})}),e.jsx("div",{className:" hidden md:block absolute top-[2%] left-[-2%] lg:left-[-8%] md:left-[-4%] z-20 bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl px-3 sm:px-5 py-3 sm:py-4 shadow-xl float max-w-[180px] sm:max-w-none animate-bounce",children:e.jsxs("div",{className:"flex items-center gap-2 sm:gap-3 ",children:[e.jsx("div",{className:"w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0",children:e.jsx("svg",{width:"14",height:"14",className:"sm:w-[18px] sm:h-[18px]",fill:"white",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 2L2 12h7v8l10-10h-7z"})})}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"text-[10px] sm:text-xs text-white/40",children:"Quick Apply"}),e.jsx("p",{className:"font-bold text-xs sm:text-sm truncate",children:"Apply Now!"}),e.jsx("p",{className:"text-[10px] sm:text-xs text-green-400 truncate",children:"Fast hiring process"})]})]})})]})]}),e.jsxs("div",{className:"relative z-20 py-3 sm:py-4 border-y border-white/10 anim-fade-in delay-700",children:[e.jsx("div",{className:"overflow-hidden mb-1.5 sm:mb-2",children:e.jsx("div",{className:"flex w-max ticker-left gap-2 sm:gap-3 lg:gap-4",children:[...t,...t].map((s,a)=>e.jsxs("div",{className:"flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 whitespace-nowrap",children:[e.jsx("div",{className:"w-2 h-2 sm:w-2.5 sm:h-2.5 rounded flex-shrink-0",style:{background:s.color}}),e.jsx("span",{className:"text-xs sm:text-sm font-semibold text-white/85",children:s.role}),e.jsx("span",{className:"text-[10px] sm:text-[11px] text-white/40 bg-white/5 px-1.5 sm:px-2 py-0.5 rounded hidden md:inline",children:s.type})]},a))})}),e.jsx("div",{className:"overflow-hidden",children:e.jsx("div",{className:"flex w-max ticker-right gap-2 sm:gap-3 lg:gap-4",children:[...t.slice(4),...t,...t.slice(0,4)].map((s,a)=>e.jsxs("div",{className:"flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 whitespace-nowrap",children:[e.jsx("div",{className:"w-2 h-2 sm:w-2.5 sm:h-2.5 rounded flex-shrink-0",style:{background:s.color}}),e.jsx("span",{className:"text-xs sm:text-sm font-semibold text-white/85",children:s.role}),e.jsx("span",{className:"text-[10px] sm:text-xs text-white/40 hidden sm:inline",children:s.company}),e.jsx("span",{className:"text-[10px] sm:text-[11px] text-white/40 bg-white/5 px-1.5 sm:px-2 py-0.5 rounded hidden md:inline",children:s.type})]},a))})})]})]})}export{o as default};
