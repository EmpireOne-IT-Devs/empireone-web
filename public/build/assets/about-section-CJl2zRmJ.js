import{j as e,r as l}from"./app-Dbqew1bx.js";import{C as m}from"./circle-check-big-DhLRlzki.js";import"./createLucideIcon-DrM8czFQ.js";function h(t,s,a=1600){const[o,i]=l.useState("0"),r=l.useRef(null);return l.useEffect(()=>{if(!s)return;const n=parseFloat(t.replace(/[^0-9.]/g,"")),b=t.replace(/[0-9.]/g,""),u=performance.now(),c=p=>{const d=Math.min((p-u)/a,1),x=1-Math.pow(1-d,3);i(Math.floor(x*n).toLocaleString()+b),d<1&&(r.current=requestAnimationFrame(c))};return r.current=requestAnimationFrame(c),()=>cancelAnimationFrame(r.current)},[s,t,a]),o}function f({value:t,label:s,delay:a}){const[o,i]=l.useState(!1),r=h(t,o);return l.useEffect(()=>{const n=setTimeout(()=>i(!0),a);return()=>clearTimeout(n)},[a]),e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
                .sc {
                    position: relative;
                    border-radius: 18px;
                    padding: 26px 16px 22px;
                    text-align: center;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    overflow: hidden;
                    transition: transform .35s cubic-bezier(.34,1.56,.64,1),
                                border-color .3s ease,
                                background .3s ease,
                                box-shadow .3s ease;
                    animation: sc-in .6s cubic-bezier(.22,1,.36,1) both;
                }
                .sc::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    background: radial-gradient(ellipse at 50% 0%, rgba(168,85,247,.1) 0%, transparent 70%);
                    opacity: 0;
                    transition: opacity .3s ease;
                    pointer-events: none;
                }
                .sc:hover { transform: translateY(-5px); border-color: rgba(255,255,255,.13); background: rgba(255,255,255,.055); box-shadow: 0 16px 48px rgba(0,0,0,.45), 0 0 0 1px rgba(168,85,247,.1); }
                .sc:hover::before { opacity: 1; }
                .sc-accent {
                    position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
                    width: 28px; height: 2px; border-radius: 999px;
                    background: linear-gradient(to right, rgba(168,85,247,.7), rgba(99,102,241,.7));
                    transition: width .3s ease, opacity .3s ease; opacity: 0;
                }
                .sc:hover .sc-accent { width: 52px; opacity: 1; }
                .sc-val { font-size: clamp(1.6rem, 2.5vw, 2.4rem); font-weight: 700; color: #fff; letter-spacing: -.02em; line-height: 1; margin-bottom: 7px; }
                .sc-lbl { font-size: .68rem; font-weight: 500; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.36); }
                @keyframes sc-in { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
            `}),e.jsxs("div",{className:"sc",style:{animationDelay:`${a}ms`},children:[e.jsx("div",{className:"sc-val",children:o?r:"0"}),e.jsx("div",{className:"sc-lbl",children:s}),e.jsx("div",{className:"sc-accent"})]})]})}const g=[{value:"6,500+",label:"Satisfied Clients"},{value:"600+",label:"Finished Projects"},{value:"250+",label:"Skilled Experts"},{value:"1,000+",label:"Media Posts"}],v=["Innovative Technology Solutions","Expert Team of Professionals","Guaranteed Business Growth"];function k(){return e.jsxs("section",{id:"about-us",className:"relative overflow-hidden",style:{height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{className:"absolute inset-0 z-0",children:[e.jsx("video",{src:"/video/about.mp4",autoPlay:!0,loop:!0,muted:!0,playsInline:!0,className:"absolute inset-0 w-full h-full object-cover"}),e.jsx("div",{className:"absolute inset-0",style:{background:"rgba(172,145,95,0.35)"}}),e.jsx("div",{className:"absolute inset-0 bg-black/40"})]}),e.jsxs("div",{className:"relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 pt-20 pb-4 grid md:grid-cols-2 gap-10 items-center",children:[e.jsx("div",{className:"flex justify-center md:justify-start",children:e.jsxs("div",{className:"relative rounded-2xl overflow-hidden shadow-2xl w-full",style:{maxWidth:580,border:"1px solid rgba(255,255,255,0.1)"},children:[e.jsx("img",{src:"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",alt:"Team collaborating",className:"w-full object-cover",style:{height:"46vh",minHeight:260}}),e.jsx("div",{className:"absolute inset-0",style:{background:"linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)"}})]})}),e.jsxs("div",{className:"space-y-5",children:[e.jsx("span",{className:"text-xs font-semibold tracking-[.2em] uppercase",style:{color:"rgba(255,255,255,0.45)"},children:"About Company"}),e.jsxs("h2",{className:"text-4xl md:text-5xl font-bold text-white leading-tight",children:["We Help Clients With",e.jsx("span",{className:"block",style:{background:"linear-gradient(135deg, #a78bfa, #818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},children:"The Right Solutions"})]}),e.jsx("p",{className:"leading-relaxed max-w-lg text-sm",style:{color:"rgba(255,255,255,0.6)"},children:"At EmpireOne, we believe in the power of technology to transform businesses. Our mission is to provide scalable, secure, and innovative IT solutions that drive growth and efficiency globally."}),e.jsx("ul",{className:"space-y-2.5 pt-1",children:v.map(t=>e.jsxs("li",{className:"flex items-center gap-3 text-sm font-medium text-white",children:[e.jsx(m,{className:"w-4 h-4 flex-shrink-0",style:{color:"#a78bfa"}}),t]},t))}),e.jsxs("div",{className:"flex flex-wrap gap-3 pt-2",children:[e.jsx("button",{className:"px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 hover:brightness-110",style:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",backdropFilter:"blur(8px)"},children:"Explore More"}),e.jsx("button",{className:"px-7 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105",style:{background:"rgba(167,139,250,0.15)",border:"1px solid rgba(167,139,250,0.35)",color:"#c4b5fd",backdropFilter:"blur(8px)"},children:"Contact Us"})]})]})]}),e.jsx("div",{className:"relative z-10 max-w-7xl w-full mx-auto px-6 pb-10 grid grid-cols-2 md:grid-cols-4 gap-3",children:g.map((t,s)=>e.jsx(f,{value:t.value,label:t.label,delay:s*100},t.label))})]})}export{k as default};
