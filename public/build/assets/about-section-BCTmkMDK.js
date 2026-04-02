import{j as e,r}from"./app-Bp4OeD2o.js";import{m as a}from"./proxy-CVqC3p3P.js";import{C as f}from"./circle-check-big-DR7bskRh.js";import"./createLucideIcon-jvQgoc0C.js";const l={hidden:{opacity:0,y:28},visible:(t=0)=>({opacity:1,y:0,transition:{duration:.7,delay:t,ease:[.22,1,.36,1]}})},v={hidden:{opacity:0,x:-36,scale:.98},visible:(t=0)=>({opacity:1,x:0,scale:1,transition:{duration:.8,delay:t,ease:[.22,1,.36,1]}})},g={hidden:{opacity:0,x:36},visible:(t=0)=>({opacity:1,x:0,transition:{duration:.75,delay:t,ease:[.22,1,.36,1]}})};function w(t,s,i=1600){const[n,c]=r.useState("0"),o=r.useRef(null);return r.useEffect(()=>{if(!s)return;const d=parseFloat(t.replace(/[^0-9.]/g,"")),m=t.replace(/[0-9.]/g,""),b=performance.now(),p=x=>{const u=Math.min((x-b)/i,1),h=1-Math.pow(1-u,3);c(Math.floor(h*d).toLocaleString()+m),u<1&&(o.current=requestAnimationFrame(p))};return o.current=requestAnimationFrame(p),()=>cancelAnimationFrame(o.current)},[s,t,i]),n}function y({value:t,label:s,delay:i}){const[n,c]=r.useState(!1),o=w(t,n);return r.useEffect(()=>{const d=setTimeout(()=>c(!0),i);return()=>clearTimeout(d)},[i]),e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
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
            `}),e.jsxs("div",{className:"sc",style:{animationDelay:`${i}ms`},children:[e.jsx("div",{className:"sc-val",children:n?o:"0"}),e.jsx("div",{className:"sc-lbl",children:s}),e.jsx("div",{className:"sc-accent"})]})]})}const j=[{value:"6,500+",label:"Satisfied Clients"},{value:"600+",label:"Finished Projects"},{value:"250+",label:"Skilled Experts"},{value:"1,000+",label:"Media Posts"}],k=["Innovative Technology Solutions","Expert Team of Professionals","Guaranteed Business Growth"];function F(){return e.jsxs("section",{id:"about-us",className:"relative overflow-hidden",style:{height:"100vh",display:"flex",flexDirection:"column"},children:[e.jsxs("div",{className:"absolute inset-0 z-0",children:[e.jsx("video",{src:"/video/about.mp4",autoPlay:!0,loop:!0,muted:!0,playsInline:!0,className:"absolute inset-0 w-full h-full object-cover"}),e.jsx("div",{className:"absolute inset-0",style:{background:"rgba(172,145,95,0.35)"}}),e.jsx("div",{className:"absolute inset-0 bg-black/40"})]}),e.jsxs("div",{className:"relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 pt-20 pb-4 grid md:grid-cols-2 gap-10 items-center",children:[e.jsx(a.div,{initial:"hidden",whileInView:"visible",viewport:{once:!1,amount:.3},variants:v,custom:.15,className:"flex justify-center md:justify-start",children:e.jsxs(a.div,{initial:{opacity:0,scale:1.05},whileInView:{opacity:1,scale:1},viewport:{once:!1,amount:.35},transition:{duration:1,delay:.28,ease:[.22,1,.36,1]},className:"relative rounded-2xl overflow-hidden shadow-2xl w-full",style:{maxWidth:580,border:"1px solid rgba(255,255,255,0.1)"},children:[e.jsx("img",{src:"https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",alt:"Team collaborating",className:"w-full object-cover",style:{height:"46vh",minHeight:260}}),e.jsx("div",{className:"absolute inset-0",style:{background:"linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)"}})]})}),e.jsxs("div",{className:"space-y-5",children:[e.jsx(a.span,{initial:"hidden",whileInView:"visible",viewport:{once:!1,amount:.8},variants:l,custom:.18,className:"text-xs font-semibold tracking-[.2em] uppercase",style:{color:"rgba(255,255,255,0.45)"},children:"About Company"}),e.jsxs(a.h2,{initial:"hidden",whileInView:"visible",viewport:{once:!1,amount:.6},variants:l,custom:.28,className:"text-4xl md:text-5xl font-bold text-white leading-tight",children:["We Help Clients With",e.jsx("span",{className:"block",style:{background:"linear-gradient(135deg, #a78bfa, #818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},children:"The Right Solutions"})]}),e.jsx(a.p,{initial:"hidden",whileInView:"visible",viewport:{once:!1,amount:.65},variants:l,custom:.38,className:"leading-relaxed max-w-lg text-sm",style:{color:"rgba(255,255,255,0.6)"},children:"At EmpireOne, we believe in the power of technology to transform businesses. Our mission is to provide scalable, secure, and innovative IT solutions that drive growth and efficiency globally."}),e.jsx("ul",{className:"space-y-2.5 pt-1",children:k.map((t,s)=>e.jsxs(a.li,{initial:"hidden",whileInView:"visible",viewport:{once:!1,amount:.7},variants:g,custom:.46+s*.08,className:"flex items-center gap-3 text-sm font-medium text-white",children:[e.jsx(f,{className:"w-4 h-4 flex-shrink-0",style:{color:"#a78bfa"}}),t]},t))}),e.jsxs(a.div,{initial:"hidden",whileInView:"visible",viewport:{once:!1,amount:.7},variants:l,custom:.72,className:"flex flex-wrap gap-3 pt-2",children:[e.jsx(a.button,{whileHover:{y:-3,scale:1.02},whileTap:{scale:.98},className:"px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 hover:brightness-110",style:{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.12)",backdropFilter:"blur(8px)"},children:"Explore More"}),e.jsx(a.button,{whileHover:{y:-3,scale:1.02},whileTap:{scale:.98},className:"px-7 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105",style:{background:"rgba(167,139,250,0.15)",border:"1px solid rgba(167,139,250,0.35)",color:"#c4b5fd",backdropFilter:"blur(8px)"},children:"Contact Us"})]})]})]}),e.jsx(a.div,{initial:"hidden",whileInView:"visible",viewport:{once:!1,amount:.3},variants:l,custom:.84,className:"relative z-10 max-w-7xl w-full mx-auto px-6 pb-10 grid grid-cols-2 md:grid-cols-4 gap-3",children:j.map((t,s)=>e.jsx(y,{value:t.value,label:t.label,delay:s*100},t.label))})]})}export{F as default};
