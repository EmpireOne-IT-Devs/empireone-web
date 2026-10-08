import{r as f,j as n}from"./app-Dptr1eOQ.js";import{f as y,c as E,s as D,h as M,p as $,v as q,e as J,i as K,j as _,k as Q,n as V,r as Z,l as ee,u as te,b as re,o as N,q as X,a as v,m as u}from"./proxy-C7XW7MQF.js";import{a as ie}from"./use-transform-BmzBl9Wx.js";import{A as ae}from"./index-C9_GkiCs.js";function Y(e,t){let i;const r=()=>{const{currentTime:a}=t,o=(a===null?0:a.value)/100;i!==o&&e(o),i=o};return y.preUpdate(r,!0),()=>E(r)}function k(e){return typeof window>"u"?!1:e?D():M()}const ne=50,C=()=>({current:0,offset:[],progress:0,scrollLength:0,targetOffset:0,targetLength:0,containerLength:0,velocity:0}),se=()=>({time:0,x:C(),y:C()}),oe={x:{length:"Width",position:"Left"},y:{length:"Height",position:"Top"}};function P(e,t,i,r){const a=i[t],{length:s,position:o}=oe[t],l=a.current,d=i.time;a.current=Math.abs(e[`scroll${o}`]),a.scrollLength=e[`scroll${s}`]-e[`client${s}`],a.offset.length=0,a.offset[0]=0,a.offset[1]=a.scrollLength,a.progress=$(0,a.scrollLength,a.current);const c=r-d;a.velocity=c>ne?0:q(a.current-l,c)}function le(e,t,i){P(e,"x",t,i),P(e,"y",t,i),t.time=i}function ce(e,t){const i={x:0,y:0};let r=e;for(;r&&r!==t;)if(J(r))i.x+=r.offsetLeft,i.y+=r.offsetTop,r=r.offsetParent;else if(r.tagName==="svg"){const a=r.getBoundingClientRect();r=r.parentElement;const s=r.getBoundingClientRect();i.x+=a.left-s.left,i.y+=a.top-s.top}else if(r instanceof SVGGraphicsElement){const{x:a,y:s}=r.getBBox();i.x+=a,i.y+=s;let o=null,l=r.parentNode;for(;!o;)l.tagName==="svg"&&(o=l),l=r.parentNode;r=o}else break;return i}const z={start:0,center:.5,end:1};function I(e,t,i=0){let r=0;if(e in z&&(e=z[e]),typeof e=="string"){const a=parseFloat(e);e.endsWith("px")?r=a:e.endsWith("%")?e=a/100:e.endsWith("vw")?r=a/100*document.documentElement.clientWidth:e.endsWith("vh")?r=a/100*document.documentElement.clientHeight:e=a}return typeof e=="number"&&(r=t*e),i+r}const de=[0,0];function pe(e,t,i,r){let a=Array.isArray(e)?e:de,s=0,o=0;return typeof e=="number"?a=[e,e]:typeof e=="string"&&(e=e.trim(),e.includes(" ")?a=e.split(" "):a=[e,z[e]?e:"0"]),s=I(a[0],i,r),o=I(a[1],t),s-o}const w={Enter:[[0,1],[1,1]],Exit:[[0,0],[1,0]],Any:[[1,0],[0,1]],All:[[0,0],[1,1]]},ge={x:0,y:0};function ue(e){return"getBBox"in e&&e.tagName!=="svg"?e.getBBox():{width:e.clientWidth,height:e.clientHeight}}function fe(e,t,i){const{offset:r=w.All}=i,{target:a=e,axis:s="y"}=i,o=s==="y"?"height":"width",l=a!==e?ce(a,e):ge,d=a===e?{width:e.scrollWidth,height:e.scrollHeight}:ue(a),c={width:e.clientWidth,height:e.clientHeight};t[s].offset.length=0;let p=!t[s].interpolate;const m=r.length;for(let g=0;g<m;g++){const x=pe(r[g],c[o],d[o],l[s]);!p&&x!==t[s].interpolatorOffsets[g]&&(p=!0),t[s].offset[g]=x}p&&(t[s].interpolate=K(t[s].offset,_(r),{clamp:!1}),t[s].interpolatorOffsets=[...t[s].offset]),t[s].progress=Q(0,1,t[s].interpolate(t[s].current))}function me(e,t=e,i){if(i.x.targetOffset=0,i.y.targetOffset=0,t!==e){let r=t;for(;r&&r!==e;)i.x.targetOffset+=r.offsetLeft,i.y.targetOffset+=r.offsetTop,r=r.offsetParent}i.x.targetLength=t===e?t.scrollWidth:t.clientWidth,i.y.targetLength=t===e?t.scrollHeight:t.clientHeight,i.x.containerLength=e.clientWidth,i.y.containerLength=e.clientHeight}function xe(e,t,i,r={}){return{measure:a=>{me(e,r.target,i),le(e,i,a),(r.offset||r.target)&&fe(e,i,r)},notify:()=>t(i)}}const h=new WeakMap,O=new WeakMap,S=new WeakMap,A=new WeakMap,j=new WeakMap,B=e=>e===document.scrollingElement?window:e;function G(e,{container:t=document.scrollingElement,trackContentSize:i=!1,...r}={}){if(!t)return V;let a=S.get(t);a||(a=new Set,S.set(t,a));const s=se(),o=xe(t,e,s,r);if(a.add(o),!h.has(t)){const d=()=>{for(const g of a)g.measure(ee.timestamp);y.preUpdate(c)},c=()=>{for(const g of a)g.notify()},p=()=>y.read(d);h.set(t,p);const m=B(t);window.addEventListener("resize",p),t!==document.documentElement&&O.set(t,Z(t,p)),m.addEventListener("scroll",p),p()}if(i&&!j.has(t)){const d=h.get(t),c={width:t.scrollWidth,height:t.scrollHeight};A.set(t,c);const p=()=>{const g=t.scrollWidth,x=t.scrollHeight;(c.width!==g||c.height!==x)&&(d(),c.width=g,c.height=x)},m=y.read(p,!0);j.set(t,m)}const l=h.get(t);return y.read(l,!1,!0),()=>{E(l);const d=S.get(t);if(!d||(d.delete(o),d.size))return;const c=h.get(t);h.delete(t),c&&(B(t).removeEventListener("scroll",c),O.get(t)?.(),window.removeEventListener("resize",c));const p=j.get(t);p&&(E(p),j.delete(t)),A.delete(t)}}const he=[[w.Enter,"entry"],[w.Exit,"exit"],[w.Any,"cover"],[w.All,"contain"]],L={start:0,end:1};function be(e){const t=e.trim().split(/\s+/);if(t.length!==2)return;const i=L[t[0]],r=L[t[1]];if(!(i===void 0||r===void 0))return[i,r]}function ye(e){if(e.length!==2)return;const t=[];for(const i of e)if(Array.isArray(i))t.push(i);else if(typeof i=="string"){const r=be(i);if(!r)return;t.push(r)}else return;return t}function we(e,t){const i=ye(e);if(!i)return!1;for(let r=0;r<2;r++){const a=i[r],s=t[r];if(a[0]!==s[0]||a[1]!==s[1])return!1}return!0}function T(e){if(!e)return{rangeStart:"contain 0%",rangeEnd:"contain 100%"};for(const[t,i]of he)if(we(e,t))return{rangeStart:`${i} 0%`,rangeEnd:`${i} 100%`}}const H=new Map;function W(e){const t={value:0},i=G(r=>{t.value=r[e.axis].progress*100},e);return{currentTime:t,cancel:i}}function F({source:e,container:t,...i}){const{axis:r}=i;e&&(t=e);let a=H.get(t);a||(a=new Map,H.set(t,a));const s=i.target??"self";let o=a.get(s);o||(o={},a.set(s,o));const l=r+(i.offset??[]).join(",");return o[l]||(i.target&&k(i.target)?T(i.offset)?o[l]=new ViewTimeline({subject:i.target,axis:r}):o[l]=W({container:t,...i}):k()?o[l]=new ScrollTimeline({source:t,axis:r}):o[l]=W({container:t,...i})),o[l]}function ve(e,t){const i=F(t),r=t.target?T(t.offset):void 0,a=t.target?k(t.target)&&!!r:k();return e.attachTimeline({timeline:a?i:void 0,...r&&a&&{rangeStart:r.rangeStart,rangeEnd:r.rangeEnd},observe:s=>(s.pause(),Y(o=>{s.time=s.iterationDuration*o},i))})}function je(e){return e&&(e.target||e.offset)}function ke(e){return e.length===2}function Se(e,t){return ke(e)||je(t)?G(i=>{e(i[t.axis].progress,i)},t):Y(e,F(t))}function U(e,{axis:t="y",container:i=document.scrollingElement,...r}={}){if(!i)return V;const a={axis:t,container:i,...r};return typeof e=="function"?Se(e,a):ve(e,a)}const Ee=()=>({scrollX:v(0),scrollY:v(0),scrollXProgress:v(0),scrollYProgress:v(0)}),b=e=>e?!e.current:!1;function R(e,t,i,r){return{factory:a=>{let s;const o=()=>{if(b(i)||b(r)){N.read(o);return}s=U(a,{...t,axis:e,container:i?.current||void 0,target:r?.current||void 0})};return N.read(o),()=>{X(o),s?.()}},times:[0,1],keyframes:[0,1],ease:a=>a,duration:1}}function Ne(e,t){return typeof window>"u"?!1:e?D()&&!!T(t):M()}function ze({container:e,target:t,...i}={}){const r=te(Ee);Ne(t,i.offset)&&(r.scrollXProgress.accelerate=R("x",i,e,t),r.scrollYProgress.accelerate=R("y",i,e,t));const a=f.useRef(null),s=f.useRef(!1),o=f.useCallback(()=>(a.current=U((l,{x:d,y:c})=>{r.scrollX.set(d.current),r.scrollXProgress.set(d.progress),r.scrollY.set(c.current),r.scrollYProgress.set(c.progress)},{...i,container:e?.current||void 0,target:t?.current||void 0}),()=>{a.current?.()}),[e,t,JSON.stringify(i.offset)]);return re(()=>{if(s.current=!1,b(e)||b(t)){s.current=!0;return}else return o()},[o]),f.useEffect(()=>{if(!s.current)return;let l;const d=()=>{const c=b(e),p=b(t);!c&&!p&&(l=o())};return N.read(d),()=>{X(d),l?.()}},[o]),r}function Te(e,t,i=1800){const[r,a]=f.useState("0"),s=f.useRef(null);return f.useEffect(()=>{if(!t)return;const o=parseFloat(e.replace(/[^0-9.]/g,"")),l=e.replace(/[0-9.]/g,""),d=performance.now(),c=p=>{const m=Math.min((p-d)/i,1),g=1-Math.pow(1-m,4),x=Math.floor(g*o);a(x.toLocaleString()+l),m<1&&(s.current=requestAnimationFrame(c))};return s.current=requestAnimationFrame(c),()=>cancelAnimationFrame(s.current)},[t,e,i]),r}const Ce=[{value:"800+",label:"Employees",icon:"◈"},{value:"10+",label:"Years of Experience",icon:"◇"}],Pe=[{label:"ISO Certified",img:"/images/ISO-Logo.png",title:"ISO 27001:2022",desc:"The ISO 27001:2022 badge is an internationally recognized certification that confirms our organization operates a world-class Information Security Management System (ISMS). This standard proves that we don't just use security tools—we have a comprehensive, board-led culture of risk management."},{label:"GDPR Compliant",img:"/images/GDPR-Logo.png",title:"GDPR",desc:"The GDPR badge signifies our adherence to the most stringent data protection framework in the world. Beyond mere security, GDPR compliance demonstrates our commitment to Data Privacy as a Human Right, ensuring that every individual's personal information is handled with transparency, purpose, and absolute care."},{label:"SOC 2 Type II",img:"/images/SOC2-Logo.png",title:"SOC2 TYPE2",desc:'The SOC 2 Type 2 badge is the gold standard for service organizations, representing a rigorous, independent audit of our internal controls. Unlike a "snapshot" audit, the Type 2 certification proves that our security protocols have been followed consistently and effectively over an extended period.'},{label:"HIPAA Ready",img:"/images/HIPAA-Logo.png",title:"HIPAA",desc:"As a HIPAA-compliant organization, we adhere to the highest federal standards for the protection of Protected Health Information (PHI). This certification signifies that we have implemented rigorous safeguards to ensure the confidentiality, integrity, and availability of sensitive healthcare data."},{label:"PCI DSS Certified",img:"/images/PCI-Logo.png",title:"PCI DSS",desc:"The PCI DSS badge signifies that our organization meets the rigorous security standards established by the world's leading financial institutions. This compliance ensures that every credit card transaction and financial record processed through our systems is handled with maximum security to prevent fraud and data theft."},{label:"BBB Accredited",img:"/images/BBB-logo.png",title:"BBB ACCREDITED BUSINESSES",desc:"The BBB Accredited Business seal is more than a rating; it is a public declaration of our commitment to ethical business practices. Accreditation signifies that we have been independently vetted and have pledged to uphold the BBB Standards for Trust—a comprehensive set of best practices for how businesses should treat their clients and the public."}],Ie=[{num:"01",title:"24/7 Customer Support",body:"Round-the-clock service teams fluent in your brand voice, resolving issues before they escalate."},{num:"02",title:"Expert CX & BPO Solutions",body:"End-to-end back-office operations engineered for precision, compliance, and cost efficiency."},{num:"03",title:"Scalable Process Management",body:"Elastic capacity that grows with you — no overhead, no delays, no limits."}];function Oe({value:e,label:t,icon:i,delay:r}){const[a,s]=f.useState(!1),o=Te(e,a),l=f.useRef(null);return f.useEffect(()=>{const d=new IntersectionObserver(([c])=>{c.isIntersecting&&setTimeout(()=>s(!0),r)},{threshold:.5});return l.current&&d.observe(l.current),()=>d.disconnect()},[r]),n.jsxs(u.div,{ref:l,initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.5},transition:{duration:.7,delay:r/1e3+.2,ease:[.22,1,.36,1]},className:"stat-chip",children:[n.jsx("span",{className:"stat-icon",children:i}),n.jsx("span",{className:"stat-val",children:a?o:"0"}),n.jsx("span",{className:"stat-label",children:t})]})}function Ae({num:e,title:t,body:i,index:r}){return n.jsxs(u.div,{className:"pillar-card",initial:{opacity:0,x:-20},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.4},transition:{duration:.65,delay:.15*r,ease:[.22,1,.36,1]},children:[n.jsx("span",{className:"pillar-num",children:e}),n.jsxs("div",{className:"pillar-body",children:[n.jsx("strong",{className:"pillar-title",children:t}),n.jsx("p",{className:"pillar-text",children:i})]}),n.jsx("div",{className:"pillar-arrow",children:"→"})]})}function Be({label:e,img:t,title:i,desc:r}){const[a,s]=f.useState(!1);return n.jsxs("span",{className:"strip-badge",onMouseEnter:()=>s(!0),onMouseLeave:()=>s(!1),children:[n.jsx("img",{src:t,alt:e,style:{height:50,width:"auto"}}),n.jsx("span",{children:e}),n.jsx(ae,{children:a&&n.jsxs(u.div,{className:"badge-tooltip",initial:{opacity:0,y:8,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:8,scale:.95},transition:{duration:.18,ease:"easeOut"},children:[n.jsx("div",{className:"badge-tooltip-title",children:i}),n.jsx("p",{className:"badge-tooltip-desc",children:r})]})})]})}function De(){const e=f.useRef(null),{scrollYProgress:t}=ze({target:e,offset:["start end","end start"]}),i=ie(t,[0,1],["-6%","6%"]);return n.jsxs("section",{id:"about-us",ref:e,className:"about-root",children:[n.jsx("style",{children:`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

                :root {
                    --ink:   #0b0b10;
                    --gold:  #c9a84c;
                    --gold2: #e8c97a;
                    --lilac: #8b7bb5;
                }

                .about-root {
                    position: relative;
                    overflow: hidden;
                    background: var(--ink);
                    font-family: 'Outfit', sans-serif;
                }

                /* video bg */
                .about-video-wrap { position: absolute; inset: 0; z-index: 0; }
                .about-video-wrap video { width: 100%; height: 100%; object-fit: cover; }
                .about-video-wrap::after {
                    content: '';
                    position: absolute; inset: 0;
                    background:
                        linear-gradient(to bottom, rgba(11,11,16,0.88) 0%, rgba(11,11,16,0.55) 50%, rgba(11,11,16,0.92) 100%),
                        linear-gradient(100deg, rgba(11,11,16,0.9) 0%, transparent 60%);
                }

                /* grain */
                .about-grain {
                    position: absolute; inset: 0; z-index: 1; pointer-events: none;
                    opacity: 0.035;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    background-size: 200px 200px;
                }

                /* layout */
                .about-inner {
                    position: relative; z-index: 2;
                    max-width: 1360px; margin: 0 auto;
                    padding: 100px 48px 80px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0 72px;
                    align-items: start;
                }

                /* eyebrow */
                .eyebrow {
                    display: inline-flex; align-items: center; gap: 10px;
                    font-size: 10px; font-weight: 600; letter-spacing: 0.22em;
                    text-transform: uppercase; color: var(--gold); margin-bottom: 22px;
                }
                .eyebrow-line {
                    display: block; width: 32px; height: 1px;
                    background: linear-gradient(90deg, var(--gold), transparent);
                }

                /* headline */
                .about-h2 {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(38px, 5vw, 72px);
                    font-weight: 700; line-height: 1.03;
                    color: #fff; margin: 0 0 6px;
                }
                .about-h2 em {
                    font-style: italic;
                    background: linear-gradient(120deg, var(--gold2), var(--lilac));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .about-sub {
                    font-size: 15px; font-weight: 300; line-height: 1.75;
                    color: rgba(255,255,255,0.52); max-width: 440px; margin-bottom: 40px;
                }

                /* pillars */
                .pillars { display: flex; flex-direction: column; gap: 2px; margin-bottom: 44px; }
                .pillar-card {
                    display: flex; align-items: flex-start; gap: 20px;
                    padding: 18px 20px; border-radius: 14px;
                    border: 1px solid transparent; cursor: default;
                    transition: background 0.25s, border-color 0.25s, transform 0.25s;
                }
                .pillar-card:hover {
                    background: rgba(255,255,255,0.04);
                    border-color: rgba(201,168,76,0.2);
                    transform: translateX(6px);
                }
                .pillar-num {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 11px; font-weight: 600; letter-spacing: 0.15em;
                    color: var(--gold); margin-top: 3px; flex-shrink: 0; min-width: 26px;
                }
                .pillar-body { flex: 1; min-width: 0; }
                .pillar-title {
                    display: block; font-size: 14px; font-weight: 600;
                    color: rgba(255,255,255,0.9); margin-bottom: 4px; letter-spacing: 0.01em;
                }
                .pillar-text {
                    font-size: 13px; font-weight: 300;
                    color: rgba(255,255,255,0.42); line-height: 1.65; margin: 0;
                }
                .pillar-arrow {
                    font-size: 16px; color: rgba(255,255,255,0.12);
                    margin-top: 2px; flex-shrink: 0;
                    transition: color 0.2s, transform 0.2s;
                }
                .pillar-card:hover .pillar-arrow { color: var(--gold); transform: translateX(4px); }

                /* CTA */
                .cta-row { display: flex; gap: 12px; flex-wrap: wrap; }
                .btn-primary {
                    padding: 13px 30px;
                    background: linear-gradient(135deg, var(--gold) 0%, #a8722a 100%);
                    border: none; border-radius: 10px;
                    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
                    color: #1a1000; cursor: pointer; letter-spacing: 0.03em;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 8px 28px rgba(201,168,76,0.28);
                }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(201,168,76,0.38); }
                .btn-ghost {
                    padding: 13px 30px; background: transparent;
                    border: 1px solid rgba(255,255,255,0.18); border-radius: 10px;
                    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500;
                    color: rgba(255,255,255,0.7); cursor: pointer; text-decoration: none;
                    display: inline-flex; align-items: center;
                    transition: border-color 0.2s, color 0.2s, transform 0.2s;
                }
                .btn-ghost:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }

                /* right col */
                .right-col { display: flex; flex-direction: column; gap: 28px; }

                /* image frame */
                .img-frame-outer { position: relative; }
                .img-frame {
                    position: relative; border-radius: 20px; overflow: hidden;
                    aspect-ratio: 4/3;
                    border: 1px solid rgba(255,255,255,0.08);
                    box-shadow: 0 40px 80px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.04);
                }
                .img-frame img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
                .img-frame::after {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(11,11,16,0.6) 0%, transparent 55%);
                    border-radius: inherit; pointer-events: none;
                }
                .img-corner {
                    position: absolute; width: 52px; height: 52px;
                    border-color: var(--gold); border-style: solid; border-width: 0; opacity: 0.6;
                }
                .img-corner.tl { top: -10px; left: -10px; border-top-width: 1px; border-left-width: 1px; border-top-left-radius: 6px; }
                .img-corner.br { bottom: -10px; right: -10px; border-bottom-width: 1px; border-right-width: 1px; border-bottom-right-radius: 6px; }

                /* badge */
                .img-badge {
                    position: absolute; bottom: 16px; left: 16px; z-index: 3;
                    background: rgba(11,11,16,0.82); backdrop-filter: blur(18px);
                    border: 1px solid rgba(201,168,76,0.25); border-radius: 14px;
                    padding: 12px 16px; display: flex; align-items: center; gap: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                    max-width: calc(100% - 32px);
                }
                .badge-dot {
                    width: 8px; height: 8px; border-radius: 50%; background: #4ade80;
                    flex-shrink: 0; box-shadow: 0 0 10px #4ade80;
                    animation: pulse-green 2.2s ease-out infinite;
                }
                @keyframes pulse-green {
                    0%,100% { box-shadow: 0 0 6px #4ade80; }
                    50% { box-shadow: 0 0 14px #4ade80, 0 0 24px rgba(74,222,128,0.3); }
                }
                .badge-text-top { font-size: 11px; font-weight: 300; color: rgba(255,255,255,0.45); margin-bottom: 1px; }
                .badge-text-bot { font-size: 14px; font-weight: 600; color: #fff; font-family: 'Outfit', sans-serif; }

                /* divider */
                .gold-rule {
                    width: 100%; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent);
                }

                /* stats grid */
                .stats-grid {
                    display: grid; grid-template-columns: repeat(2, 1fr);
                    gap: 1px; background: rgba(255,255,255,0.07);
                    border-radius: 18px; overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.07);
                }
                .stat-chip {
                    display: flex; flex-direction: column; align-items: flex-start;
                    gap: 4px; padding: 22px 20px 18px;
                    background: rgba(11,11,16,0.85);
                    transition: background 0.25s; cursor: default;
                }
                .stat-chip:hover { background: rgba(201,168,76,0.06); }
                .stat-icon { font-size: 12px; color: var(--gold); margin-bottom: 6px; }
                .stat-val {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(26px, 3.5vw, 42px);
                    font-weight: 700; color: #fff; line-height: 1; letter-spacing: -0.02em;
                }
                .stat-label {
                    font-size: 10px; font-weight: 500; letter-spacing: 0.14em;
                    text-transform: uppercase; color: rgba(255,255,255,0.38); margin-top: 2px;
                }

                /* bottom strip */
                .about-strip {
                    position: relative; z-index: 2;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    padding: 24px 48px;
                    display: flex; align-items: center; justify-content: space-between;
                    flex-wrap: wrap; gap: 16px;
                    max-width: 1360px; margin: 0 auto;
                }
                .strip-text {
                    font-size: 12px; font-weight: 400;
                    color: rgba(255,255,255,0.28); letter-spacing: 0.06em;
                }
                .strip-badges { display: flex; gap: 10px; flex-wrap: wrap; }
                .strip-badge {
                    padding: 6px 14px; border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 999px; font-size: 11px; font-weight: 500;
                    color: rgba(255,255,255,0.38); letter-spacing: 0.06em;
                    transition: border-color 0.2s, color 0.2s; cursor: default;
                    display: flex; align-items: center; gap: 6px;
                    position: relative;
                }
                .strip-badge:hover { border-color: var(--gold); color: var(--gold); }

                /* badge tooltip */
                .badge-tooltip {
                    position: absolute;
                    bottom: calc(100% + 14px);
                    left: 50%;
                    transform: translateX(-50%);
                    width: 270px;
                    background: rgba(11,11,16,0.97);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid rgba(201,168,76,0.35);
                    border-radius: 14px;
                    padding: 16px 18px;
                    pointer-events: none;
                    z-index: 200;
                    box-shadow: 0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.08) inset;
                }

                .badge-tooltip-title {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.16em;
                    color: var(--gold);
                    text-transform: uppercase;
                    margin-bottom: 8px;
                    font-family: 'Outfit', sans-serif;
                }
                .badge-tooltip-desc {
                    font-size: 12px;
                    font-weight: 300;
                    color: rgba(255,255,255,0.62);
                    line-height: 1.65;
                    margin: 0;
                    font-family: 'Outfit', sans-serif;
                }

                /* ── RESPONSIVE ─────────────────────────────────── */
                @media (max-width: 1024px) {
                    .about-inner { gap: 0 48px; padding: 80px 32px 60px; }
                }

                @media (max-width: 768px) {
                    .about-inner {
                        grid-template-columns: 1fr;
                        gap: 48px;
                        padding: 72px 20px 52px;
                    }
                    .about-h2 { font-size: clamp(32px, 9vw, 56px); }
                    .about-sub { font-size: 14px; max-width: 100%; margin-bottom: 28px; }
                    .pillars { margin-bottom: 32px; }
                    .pillar-card { padding: 14px 16px; gap: 14px; }
                    .cta-row { flex-direction: column; }
                    .btn-primary, .btn-ghost { width: 100%; text-align: center; justify-content: center; padding: 14px 24px; }
                    .right-col { gap: 20px; }
                    .stat-chip { padding: 18px 16px 14px; }
                    .about-strip {
                        flex-direction: column; align-items: flex-start;
                        padding: 20px 20px; gap: 14px;
                    }
                    .strip-badges { gap: 8px; }
                    .strip-badge { font-size: 10px; padding: 5px 10px; }
                    .strip-badge img { height: 40px !important; }
                }

                @media (max-width: 480px) {
                    .about-inner { padding: 64px 16px 44px; gap: 36px; }
                    .eyebrow { font-size: 9px; }
                    .about-h2 { font-size: clamp(28px, 10vw, 44px); }
                    .img-badge { padding: 10px 12px; gap: 8px; }
                    .badge-text-bot { font-size: 12px; }
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                    .stat-chip { padding: 14px 12px 12px; }
                    .stat-val { font-size: clamp(22px, 6vw, 32px); }
                    .stat-label { font-size: 9px; }
                    .strip-badge img { height: 30px !important; }
                }
            `}),n.jsx("div",{className:"about-video-wrap",children:n.jsx("video",{src:"/video/eo.mp4",autoPlay:!0,loop:!0,muted:!0,playsInline:!0})}),n.jsx("div",{className:"about-grain"}),n.jsxs("div",{className:"about-inner",children:[n.jsxs("div",{children:[n.jsxs(u.div,{className:"eyebrow",initial:{opacity:0,x:-16},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.7},transition:{duration:.6,ease:[.22,1,.36,1]},children:[n.jsx("span",{className:"eyebrow-line"}),"About EmpireOneCX"]}),n.jsxs(u.h2,{className:"about-h2",initial:{opacity:0,y:22},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.5},transition:{duration:.75,delay:.1,ease:[.22,1,.36,1]},children:["Your Trusted",n.jsx("br",{}),"Partner in",n.jsx("br",{}),n.jsx("em",{children:"Business Excellence"})]}),n.jsx(u.p,{className:"about-sub",initial:{opacity:0,y:16},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.5},transition:{duration:.7,delay:.22,ease:[.22,1,.36,1]},children:"At EmpireOneCX, we deliver world-class CX & BPO solutions that help businesses optimize operations, reduce costs, and scale efficiently — from customer support to back-office operations, across the globe."}),n.jsx("div",{className:"pillars",children:Ie.map((r,a)=>n.jsx(Ae,{...r,index:a},r.num))}),n.jsxs(u.div,{className:"cta-row",initial:{opacity:0,y:14},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.6},transition:{duration:.6,delay:.5,ease:[.22,1,.36,1]},children:[n.jsx(u.a,{href:"https://empireonecx.com/",target:"_blank",rel:"noopener noreferrer",className:"btn-primary",style:{textDecoration:"none",display:"inline-block"},whileHover:{y:-2},whileTap:{scale:.97},children:"Explore More"}),n.jsx(u.a,{href:"#contact",className:"btn-ghost",style:{textDecoration:"none",display:"inline-flex",alignItems:"center"},whileHover:{y:-2},whileTap:{scale:.97},children:"Contact Us →"})]})]}),n.jsxs("div",{className:"right-col",children:[n.jsxs(u.div,{className:"img-frame-outer",initial:{opacity:0,x:32},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.3},transition:{duration:.85,delay:.18,ease:[.22,1,.36,1]},children:[n.jsx("div",{className:"img-corner tl"}),n.jsx("div",{className:"img-corner br"}),n.jsxs("div",{className:"img-frame",children:[n.jsx(u.img,{src:"/images/image-200.png",alt:"Team collaborating",style:{y:i}}),n.jsxs("div",{className:"img-badge",children:[n.jsx("span",{className:"badge-dot"}),n.jsxs("div",{children:[n.jsx("div",{className:"badge-text-top",children:"Currently hiring"}),n.jsx("div",{className:"badge-text-bot",children:"Join our global team"})]})]})]})]}),n.jsx(u.div,{className:"gold-rule",initial:{scaleX:0},whileInView:{scaleX:1},viewport:{once:!0,amount:.5},transition:{duration:.9,delay:.3,ease:[.22,1,.36,1]},style:{transformOrigin:"left"}}),n.jsx(u.div,{className:"stats-grid",initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.3},transition:{duration:.7,delay:.32,ease:[.22,1,.36,1]},children:Ce.map((r,a)=>n.jsx(Oe,{...r,delay:a*120},r.label))})]})]}),n.jsxs(u.div,{className:"about-strip",initial:{opacity:0},whileInView:{opacity:1},viewport:{once:!0,amount:.5},transition:{duration:.8,delay:.2},children:[n.jsx("span",{className:"strip-text",children:"EmpireOneCX · Trusted Worldwide"}),n.jsx("div",{className:"strip-badges",children:Pe.map(r=>n.jsx(Be,{...r},r?.label))})]})]})}export{De as default};
