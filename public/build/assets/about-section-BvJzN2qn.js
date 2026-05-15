import{r as u,j as a}from"./app-Dkh-cg7x.js";import{f as b,c as S,d as F,s as G,e as Y,p as Z,v as ee,i as te,g as re,h as ie,n as X,r as ne,j as se,u as v,b as U,k as C,l as y,M as ae,o as N,m as g}from"./proxy-Cb2j9DnM.js";import{A as oe}from"./index-CZTxd86d.js";function $(e,t){let r;const i=()=>{const{currentTime:n}=t,o=(n===null?0:n.value)/100;r!==o&&e(o),r=o};return b.preUpdate(i,!0),()=>S(i)}function le(...e){const t=!Array.isArray(e[0]),r=t?0:-1,i=e[0+r],n=e[1+r],s=e[2+r],o=e[3+r],l=F(n,s,o);return t?l(i):l}function E(e){return typeof window>"u"?!1:e?G():Y()}const ce=50,I=()=>({current:0,offset:[],progress:0,scrollLength:0,targetOffset:0,targetLength:0,containerLength:0,velocity:0}),de=()=>({time:0,x:I(),y:I()}),pe={x:{length:"Width",position:"Left"},y:{length:"Height",position:"Top"}};function T(e,t,r,i){const n=r[t],{length:s,position:o}=pe[t],l=n.current,d=r.time;n.current=Math.abs(e[`scroll${o}`]),n.scrollLength=e[`scroll${s}`]-e[`client${s}`],n.offset.length=0,n.offset[0]=0,n.offset[1]=n.scrollLength,n.progress=Z(0,n.scrollLength,n.current);const c=i-d;n.velocity=c>ce?0:ee(n.current-l,c)}function ue(e,t,r){T(e,"x",t,r),T(e,"y",t,r),t.time=r}function fe(e,t){const r={x:0,y:0};let i=e;for(;i&&i!==t;)if(te(i))r.x+=i.offsetLeft,r.y+=i.offsetTop,i=i.offsetParent;else if(i.tagName==="svg"){const n=i.getBoundingClientRect();i=i.parentElement;const s=i.getBoundingClientRect();r.x+=n.left-s.left,r.y+=n.top-s.top}else if(i instanceof SVGGraphicsElement){const{x:n,y:s}=i.getBBox();r.x+=n,r.y+=s;let o=null,l=i.parentNode;for(;!o;)l.tagName==="svg"&&(o=l),l=i.parentNode;i=o}else break;return r}const A={start:0,center:.5,end:1};function O(e,t,r=0){let i=0;if(e in A&&(e=A[e]),typeof e=="string"){const n=parseFloat(e);e.endsWith("px")?i=n:e.endsWith("%")?e=n/100:e.endsWith("vw")?i=n/100*document.documentElement.clientWidth:e.endsWith("vh")?i=n/100*document.documentElement.clientHeight:e=n}return typeof e=="number"&&(i=t*e),r+i}const ge=[0,0];function me(e,t,r,i){let n=Array.isArray(e)?e:ge,s=0,o=0;return typeof e=="number"?n=[e,e]:typeof e=="string"&&(e=e.trim(),e.includes(" ")?n=e.split(" "):n=[e,A[e]?e:"0"]),s=O(n[0],r,i),o=O(n[1],t),s-o}const w={Enter:[[0,1],[1,1]],Exit:[[0,0],[1,0]],Any:[[1,0],[0,1]],All:[[0,0],[1,1]]},xe={x:0,y:0};function he(e){return"getBBox"in e&&e.tagName!=="svg"?e.getBBox():{width:e.clientWidth,height:e.clientHeight}}function be(e,t,r){const{offset:i=w.All}=r,{target:n=e,axis:s="y"}=r,o=s==="y"?"height":"width",l=n!==e?fe(n,e):xe,d=n===e?{width:e.scrollWidth,height:e.scrollHeight}:he(n),c={width:e.clientWidth,height:e.clientHeight};t[s].offset.length=0;let p=!t[s].interpolate;const m=i.length;for(let f=0;f<m;f++){const x=me(i[f],c[o],d[o],l[s]);!p&&x!==t[s].interpolatorOffsets[f]&&(p=!0),t[s].offset[f]=x}p&&(t[s].interpolate=F(t[s].offset,re(i),{clamp:!1}),t[s].interpolatorOffsets=[...t[s].offset]),t[s].progress=ie(0,1,t[s].interpolate(t[s].current))}function ye(e,t=e,r){if(r.x.targetOffset=0,r.y.targetOffset=0,t!==e){let i=t;for(;i&&i!==e;)r.x.targetOffset+=i.offsetLeft,r.y.targetOffset+=i.offsetTop,i=i.offsetParent}r.x.targetLength=t===e?t.scrollWidth:t.clientWidth,r.y.targetLength=t===e?t.scrollHeight:t.clientHeight,r.x.containerLength=e.clientWidth,r.y.containerLength=e.clientHeight}function we(e,t,r,i={}){return{measure:n=>{ye(e,i.target,r),ue(e,r,n),(i.offset||i.target)&&be(e,r,i)},notify:()=>t(r)}}const h=new WeakMap,B=new WeakMap,z=new WeakMap,L=new WeakMap,j=new WeakMap,H=e=>e===document.scrollingElement?window:e;function q(e,{container:t=document.scrollingElement,trackContentSize:r=!1,...i}={}){if(!t)return X;let n=z.get(t);n||(n=new Set,z.set(t,n));const s=de(),o=we(t,e,s,i);if(n.add(o),!h.has(t)){const d=()=>{for(const f of n)f.measure(se.timestamp);b.preUpdate(c)},c=()=>{for(const f of n)f.notify()},p=()=>b.read(d);h.set(t,p);const m=H(t);window.addEventListener("resize",p),t!==document.documentElement&&B.set(t,ne(t,p)),m.addEventListener("scroll",p),p()}if(r&&!j.has(t)){const d=h.get(t),c={width:t.scrollWidth,height:t.scrollHeight};L.set(t,c);const p=()=>{const f=t.scrollWidth,x=t.scrollHeight;(c.width!==f||c.height!==x)&&(d(),c.width=f,c.height=x)},m=b.read(p,!0);j.set(t,m)}const l=h.get(t);return b.read(l,!1,!0),()=>{S(l);const d=z.get(t);if(!d||(d.delete(o),d.size))return;const c=h.get(t);h.delete(t),c&&(H(t).removeEventListener("scroll",c),B.get(t)?.(),window.removeEventListener("resize",c));const p=j.get(t);p&&(S(p),j.delete(t)),L.delete(t)}}const ve=[[w.Enter,"entry"],[w.Exit,"exit"],[w.Any,"cover"],[w.All,"contain"]],V={start:0,end:1};function je(e){const t=e.trim().split(/\s+/);if(t.length!==2)return;const r=V[t[0]],i=V[t[1]];if(!(r===void 0||i===void 0))return[r,i]}function ke(e){if(e.length!==2)return;const t=[];for(const r of e)if(Array.isArray(r))t.push(r);else if(typeof r=="string"){const i=je(r);if(!i)return;t.push(i)}else return;return t}function Se(e,t){const r=ke(e);if(!r)return!1;for(let i=0;i<2;i++){const n=r[i],s=t[i];if(n[0]!==s[0]||n[1]!==s[1])return!1}return!0}function P(e){if(!e)return{rangeStart:"contain 0%",rangeEnd:"contain 100%"};for(const[t,r]of ve)if(Se(e,t))return{rangeStart:`${r} 0%`,rangeEnd:`${r} 100%`}}const W=new Map;function M(e){const t={value:0},r=q(i=>{t.value=i[e.axis].progress*100},e);return{currentTime:t,cancel:r}}function J({source:e,container:t,...r}){const{axis:i}=r;e&&(t=e);let n=W.get(t);n||(n=new Map,W.set(t,n));const s=r.target??"self";let o=n.get(s);o||(o={},n.set(s,o));const l=i+(r.offset??[]).join(",");return o[l]||(r.target&&E(r.target)?P(r.offset)?o[l]=new ViewTimeline({subject:r.target,axis:i}):o[l]=M({container:t,...r}):E()?o[l]=new ScrollTimeline({source:t,axis:i}):o[l]=M({container:t,...r})),o[l]}function Ee(e,t){const r=J(t),i=t.target?P(t.offset):void 0,n=t.target?E(t.target)&&!!i:E();return e.attachTimeline({timeline:n?r:void 0,...i&&n&&{rangeStart:i.rangeStart,rangeEnd:i.rangeEnd},observe:s=>(s.pause(),$(o=>{s.time=s.iterationDuration*o},r))})}function Ne(e){return e.length===2}function ze(e,t){return Ne(e)?q(r=>{e(r[t.axis].progress,r)},t):$(e,J(t))}function K(e,{axis:t="y",container:r=document.scrollingElement,...i}={}){if(!r)return X;const n={axis:t,container:r,...i};return typeof e=="function"?ze(e,n):Ee(e,n)}const Ae=()=>({scrollX:y(0),scrollY:y(0),scrollXProgress:y(0),scrollYProgress:y(0)}),k=e=>e?!e.current:!1;function D(e,t,r,i){return{factory:n=>K(n,{...t,axis:e,container:r?.current||void 0,target:i?.current||void 0}),times:[0,1],keyframes:[0,1],ease:n=>n,duration:1}}function Pe(e,t){return typeof window>"u"?!1:e?G()&&!!P(t):Y()}function Ce({container:e,target:t,...r}={}){const i=v(Ae);Pe(t,r.offset)&&(i.scrollXProgress.accelerate=D("x",r,e,t),i.scrollYProgress.accelerate=D("y",r,e,t));const n=u.useRef(null),s=u.useRef(!1),o=u.useCallback(()=>(n.current=K((l,{x:d,y:c})=>{i.scrollX.set(d.current),i.scrollXProgress.set(d.progress),i.scrollY.set(c.current),i.scrollYProgress.set(c.progress)},{...r,container:e?.current||void 0,target:t?.current||void 0}),()=>{n.current?.()}),[e,t,JSON.stringify(r.offset)]);return U(()=>{if(s.current=!1,k(e)||k(t)){s.current=!0;return}else return o()},[o]),u.useEffect(()=>{if(s.current)return C(!k(e)),C(!k(t)),o()},[o]),i}function Ie(e){const t=v(()=>y(e)),{isStatic:r}=u.useContext(ae);if(r){const[,i]=u.useState(e);u.useEffect(()=>t.on("change",i),[])}return t}function _(e,t){const r=Ie(t()),i=()=>r.set(t());return i(),U(()=>{const n=()=>b.preRender(i,!1,!0),s=e.map(o=>o.on("change",n));return()=>{s.forEach(o=>o()),S(i)}}),r}function Te(e){N.current=[],e();const t=_(N.current,e);return N.current=void 0,t}function Q(e,t,r,i){if(typeof e=="function")return Te(e);if(r!==void 0&&!Array.isArray(r)&&typeof t!="function")return Oe(e,t,r,i);const o=typeof t=="function"?t:le(t,r,i),l=Array.isArray(e)?R(e,o):R([e],([c])=>o(c)),d=Array.isArray(e)?void 0:e.accelerate;return d&&!d.isTransformed&&typeof t!="function"&&Array.isArray(r)&&i?.clamp!==!1&&(l.accelerate={...d,times:t,keyframes:r,isTransformed:!0}),l}function R(e,t){const r=v(()=>[]);return _(e,()=>{r.length=0;const i=e.length;for(let n=0;n<i;n++)r[n]=e[n].get();return t(r)})}function Oe(e,t,r,i){const n=v(()=>Object.keys(r)),s=v(()=>({}));for(const o of n)s[o]=Q(e,t,r[o],i);return s}function Be(e,t,r=1800){const[i,n]=u.useState("0"),s=u.useRef(null);return u.useEffect(()=>{if(!t)return;const o=parseFloat(e.replace(/[^0-9.]/g,"")),l=e.replace(/[0-9.]/g,""),d=performance.now(),c=p=>{const m=Math.min((p-d)/r,1),f=1-Math.pow(1-m,4),x=Math.floor(f*o);n(x.toLocaleString()+l),m<1&&(s.current=requestAnimationFrame(c))};return s.current=requestAnimationFrame(c),()=>cancelAnimationFrame(s.current)},[t,e,r]),i}const Le=[{value:"1000+",label:"Employees",icon:"◈"},{value:"250+",label:"Skilled Experts",icon:"◆"},{value:"10+",label:"Finished Projects",icon:"◉"},{value:"1000+",label:"Media Posts",icon:"◇"}],He=[{label:"ISO Certified",img:"/images/ISO-Logo.png",title:"ISO 27001:2022",desc:"The ISO 27001:2022 badge is an internationally recognized certification that confirms our organization operates a world-class Information Security Management System (ISMS). This standard proves that we don't just use security tools—we have a comprehensive, board-led culture of risk management."},{label:"GDPR Compliant",img:"/images/GDPR-Logo.png",title:"GDPR",desc:"The GDPR badge signifies our adherence to the most stringent data protection framework in the world. Beyond mere security, GDPR compliance demonstrates our commitment to Data Privacy as a Human Right, ensuring that every individual's personal information is handled with transparency, purpose, and absolute care."},{label:"SOC 2 Type II",img:"/images/SOC2-Logo.png",title:"SOC2 TYPE2",desc:'The SOC 2 Type 2 badge is the gold standard for service organizations, representing a rigorous, independent audit of our internal controls. Unlike a "snapshot" audit, the Type 2 certification proves that our security protocols have been followed consistently and effectively over an extended period.'},{label:"HIPAA Ready",img:"/images/HIPAA-Logo.png",title:"HIPAA",desc:"As a HIPAA-compliant organization, we adhere to the highest federal standards for the protection of Protected Health Information (PHI). This certification signifies that we have implemented rigorous safeguards to ensure the confidentiality, integrity, and availability of sensitive healthcare data."},{label:"PCI DSS Certified",img:"/images/PCI-Logo.png",title:"PCI DSS",desc:"The PCI DSS badge signifies that our organization meets the rigorous security standards established by the world's leading financial institutions. This compliance ensures that every credit card transaction and financial record processed through our systems is handled with maximum security to prevent fraud and data theft."},{label:"BBB Accredited",img:"/images/BBB-Logo.png",title:"BBB ACCREDITED BUSINESSES",desc:"The BBB Accredited Business seal is more than a rating; it is a public declaration of our commitment to ethical business practices. Accreditation signifies that we have been independently vetted and have pledged to uphold the BBB Standards for Trust—a comprehensive set of best practices for how businesses should treat their clients and the public."}],Ve=[{num:"01",title:"24/7 Customer Support",body:"Round-the-clock service teams fluent in your brand voice, resolving issues before they escalate."},{num:"02",title:"Expert BPO Solutions",body:"End-to-end back-office operations engineered for precision, compliance, and cost efficiency."},{num:"03",title:"Scalable Process Management",body:"Elastic capacity that grows with you — no overhead, no delays, no limits."}];function We({value:e,label:t,icon:r,delay:i}){const[n,s]=u.useState(!1),o=Be(e,n),l=u.useRef(null);return u.useEffect(()=>{const d=new IntersectionObserver(([c])=>{c.isIntersecting&&setTimeout(()=>s(!0),i)},{threshold:.5});return l.current&&d.observe(l.current),()=>d.disconnect()},[i]),a.jsxs(g.div,{ref:l,initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.5},transition:{duration:.7,delay:i/1e3+.2,ease:[.22,1,.36,1]},className:"stat-chip",children:[a.jsx("span",{className:"stat-icon",children:r}),a.jsx("span",{className:"stat-val",children:n?o:"0"}),a.jsx("span",{className:"stat-label",children:t})]})}function Me({num:e,title:t,body:r,index:i}){return a.jsxs(g.div,{className:"pillar-card",initial:{opacity:0,x:-20},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.4},transition:{duration:.65,delay:.15*i,ease:[.22,1,.36,1]},children:[a.jsx("span",{className:"pillar-num",children:e}),a.jsxs("div",{className:"pillar-body",children:[a.jsx("strong",{className:"pillar-title",children:t}),a.jsx("p",{className:"pillar-text",children:r})]}),a.jsx("div",{className:"pillar-arrow",children:"→"})]})}function De({label:e,img:t,title:r,desc:i}){const[n,s]=u.useState(!1);return a.jsxs("span",{className:"strip-badge",onMouseEnter:()=>s(!0),onMouseLeave:()=>s(!1),children:[a.jsx("img",{src:t,alt:e,style:{height:50,width:"auto"}}),a.jsx("span",{children:e}),a.jsx(oe,{children:n&&a.jsxs(g.div,{className:"badge-tooltip",initial:{opacity:0,y:8,scale:.95},animate:{opacity:1,y:0,scale:1},exit:{opacity:0,y:8,scale:.95},transition:{duration:.18,ease:"easeOut"},children:[a.jsx("div",{className:"badge-tooltip-title",children:r}),a.jsx("p",{className:"badge-tooltip-desc",children:i})]})})]})}function Ye(){const e=u.useRef(null),{scrollYProgress:t}=Ce({target:e,offset:["start end","end start"]}),r=Q(t,[0,1],["-6%","6%"]);return a.jsxs("section",{id:"about-us",ref:e,className:"about-root",children:[a.jsx("style",{children:`
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
            `}),a.jsx("div",{className:"about-video-wrap",children:a.jsx("video",{src:"/video/about.mp4",autoPlay:!0,loop:!0,muted:!0,playsInline:!0})}),a.jsx("div",{className:"about-grain"}),a.jsxs("div",{className:"about-inner",children:[a.jsxs("div",{children:[a.jsxs(g.div,{className:"eyebrow",initial:{opacity:0,x:-16},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.7},transition:{duration:.6,ease:[.22,1,.36,1]},children:[a.jsx("span",{className:"eyebrow-line"}),"About EmpireOne BPO Solutions Inc."]}),a.jsxs(g.h2,{className:"about-h2",initial:{opacity:0,y:22},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.5},transition:{duration:.75,delay:.1,ease:[.22,1,.36,1]},children:["Your Trusted",a.jsx("br",{}),"Partner in",a.jsx("br",{}),a.jsx("em",{children:"Business Excellence"})]}),a.jsx(g.p,{className:"about-sub",initial:{opacity:0,y:16},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.5},transition:{duration:.7,delay:.22,ease:[.22,1,.36,1]},children:"At EmpireOne, we deliver world-class BPO solutions that help businesses optimize operations, reduce costs, and scale efficiently — from customer support to back-office operations, across the globe."}),a.jsx("div",{className:"pillars",children:Ve.map((i,n)=>a.jsx(Me,{...i,index:n},i.num))}),a.jsxs(g.div,{className:"cta-row",initial:{opacity:0,y:14},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.6},transition:{duration:.6,delay:.5,ease:[.22,1,.36,1]},children:[a.jsx(g.button,{className:"btn-primary",whileHover:{y:-2},whileTap:{scale:.97},children:"Explore More"}),a.jsx(g.a,{href:"#contact",className:"btn-ghost",style:{textDecoration:"none",display:"inline-flex",alignItems:"center"},whileHover:{y:-2},whileTap:{scale:.97},children:"Contact Us →"})]})]}),a.jsxs("div",{className:"right-col",children:[a.jsxs(g.div,{className:"img-frame-outer",initial:{opacity:0,x:32},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.3},transition:{duration:.85,delay:.18,ease:[.22,1,.36,1]},children:[a.jsx("div",{className:"img-corner tl"}),a.jsx("div",{className:"img-corner br"}),a.jsxs("div",{className:"img-frame",children:[a.jsx(g.img,{src:"/images/image-200.png",alt:"Team collaborating",style:{y:r}}),a.jsxs("div",{className:"img-badge",children:[a.jsx("span",{className:"badge-dot"}),a.jsxs("div",{children:[a.jsx("div",{className:"badge-text-top",children:"Currently hiring"}),a.jsx("div",{className:"badge-text-bot",children:"Join our global team"})]})]})]})]}),a.jsx(g.div,{className:"gold-rule",initial:{scaleX:0},whileInView:{scaleX:1},viewport:{once:!0,amount:.5},transition:{duration:.9,delay:.3,ease:[.22,1,.36,1]},style:{transformOrigin:"left"}}),a.jsx(g.div,{className:"stats-grid",initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.3},transition:{duration:.7,delay:.32,ease:[.22,1,.36,1]},children:Le.map((i,n)=>a.jsx(We,{...i,delay:n*120},i.label))})]})]}),a.jsxs(g.div,{className:"about-strip",initial:{opacity:0},whileInView:{opacity:1},viewport:{once:!0,amount:.5},transition:{duration:.8,delay:.2},children:[a.jsx("span",{className:"strip-text",children:"EmpireOne BPO · Trusted Worldwide"}),a.jsx("div",{className:"strip-badges",children:He.map(i=>a.jsx(De,{...i},i.label))})]})]})}export{Ye as default};
