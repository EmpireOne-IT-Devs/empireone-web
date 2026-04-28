import{r as p,j as s}from"./app-Cq9PO5hi.js";import{r as $,c as q,f as w,d as L,e as V,p as J,v as K,i as _,g as Q,h as Z,n as M,j as ee,s as te,u as y,b as R,k as S,l as b,M as re,o as z,m as u}from"./proxy-CQOxTNPo.js";const E=new WeakMap;let k;const F=(e,t,n)=>(r,i)=>i&&i[0]?i[0][e+"Size"]:q(r)&&"getBBox"in r?r.getBBox()[t]:r[n],ne=F("inline","width","offsetWidth"),ie=F("block","height","offsetHeight");function se({target:e,borderBoxSize:t}){E.get(e)?.forEach(n=>{n(e,{get width(){return ne(e,t)},get height(){return ie(e,t)}})})}function oe(e){e.forEach(se)}function ae(){typeof ResizeObserver>"u"||(k=new ResizeObserver(oe))}function le(e,t){k||ae();const n=$(e);return n.forEach(r=>{let i=E.get(r);i||(i=new Set,E.set(r,i)),i.add(t),k?.observe(r)}),()=>{n.forEach(r=>{const i=E.get(r);i?.delete(t),i?.size||k?.unobserve(r)})}}const N=new Set;let x;function ce(){x=()=>{const e={get width(){return window.innerWidth},get height(){return window.innerHeight}};N.forEach(t=>t(e))},window.addEventListener("resize",x)}function de(e){return N.add(e),x||ce(),()=>{N.delete(e),!N.size&&typeof x=="function"&&(window.removeEventListener("resize",x),x=void 0)}}function pe(e,t){return typeof e=="function"?de(e):le(e,t)}function D(e,t){let n;const r=()=>{const{currentTime:i}=t,a=(i===null?0:i.value)/100;n!==a&&e(a),n=a};return w.preUpdate(r,!0),()=>L(r)}function ue(...e){const t=!Array.isArray(e[0]),n=t?0:-1,r=e[0+n],i=e[1+n],o=e[2+n],a=e[3+n],l=V(i,o,a);return t?l(r):l}const fe=50,I=()=>({current:0,offset:[],progress:0,scrollLength:0,targetOffset:0,targetLength:0,containerLength:0,velocity:0}),ge=()=>({time:0,x:I(),y:I()}),me={x:{length:"Width",position:"Left"},y:{length:"Height",position:"Top"}};function A(e,t,n,r){const i=n[t],{length:o,position:a}=me[t],l=i.current,d=n.time;i.current=e[`scroll${a}`],i.scrollLength=e[`scroll${o}`]-e[`client${o}`],i.offset.length=0,i.offset[0]=0,i.offset[1]=i.scrollLength,i.progress=J(0,i.scrollLength,i.current);const c=r-d;i.velocity=c>fe?0:K(i.current-l,c)}function xe(e,t,n){A(e,"x",t,n),A(e,"y",t,n),t.time=n}function he(e,t){const n={x:0,y:0};let r=e;for(;r&&r!==t;)if(_(r))n.x+=r.offsetLeft,n.y+=r.offsetTop,r=r.offsetParent;else if(r.tagName==="svg"){const i=r.getBoundingClientRect();r=r.parentElement;const o=r.getBoundingClientRect();n.x+=i.left-o.left,n.y+=i.top-o.top}else if(r instanceof SVGGraphicsElement){const{x:i,y:o}=r.getBBox();n.x+=i,n.y+=o;let a=null,l=r.parentNode;for(;!a;)l.tagName==="svg"&&(a=l),l=r.parentNode;r=a}else break;return n}const O={start:0,center:.5,end:1};function P(e,t,n=0){let r=0;if(e in O&&(e=O[e]),typeof e=="string"){const i=parseFloat(e);e.endsWith("px")?r=i:e.endsWith("%")?e=i/100:e.endsWith("vw")?r=i/100*document.documentElement.clientWidth:e.endsWith("vh")?r=i/100*document.documentElement.clientHeight:e=i}return typeof e=="number"&&(r=t*e),n+r}const be=[0,0];function we(e,t,n,r){let i=Array.isArray(e)?e:be,o=0,a=0;return typeof e=="number"?i=[e,e]:typeof e=="string"&&(e=e.trim(),e.includes(" ")?i=e.split(" "):i=[e,O[e]?e:"0"]),o=P(i[0],n,r),a=P(i[1],t),o-a}const ye={All:[[0,0],[1,1]]},ve={x:0,y:0};function je(e){return"getBBox"in e&&e.tagName!=="svg"?e.getBBox():{width:e.clientWidth,height:e.clientHeight}}function Ee(e,t,n){const{offset:r=ye.All}=n,{target:i=e,axis:o="y"}=n,a=o==="y"?"height":"width",l=i!==e?he(i,e):ve,d=i===e?{width:e.scrollWidth,height:e.scrollHeight}:je(i),c={width:e.clientWidth,height:e.clientHeight};t[o].offset.length=0;let g=!t[o].interpolate;const f=r.length;for(let m=0;m<f;m++){const v=we(r[m],c[a],d[a],l[o]);!g&&v!==t[o].interpolatorOffsets[m]&&(g=!0),t[o].offset[m]=v}g&&(t[o].interpolate=V(t[o].offset,Q(r),{clamp:!1}),t[o].interpolatorOffsets=[...t[o].offset]),t[o].progress=Z(0,1,t[o].interpolate(t[o].current))}function ke(e,t=e,n){if(n.x.targetOffset=0,n.y.targetOffset=0,t!==e){let r=t;for(;r&&r!==e;)n.x.targetOffset+=r.offsetLeft,n.y.targetOffset+=r.offsetTop,r=r.offsetParent}n.x.targetLength=t===e?t.scrollWidth:t.clientWidth,n.y.targetLength=t===e?t.scrollHeight:t.clientHeight,n.x.containerLength=e.clientWidth,n.y.containerLength=e.clientHeight}function Ne(e,t,n,r={}){return{measure:i=>{ke(e,r.target,n),xe(e,n,i),(r.offset||r.target)&&Ee(e,n,r)},notify:()=>t(n)}}const h=new WeakMap,T=new WeakMap,C=new WeakMap,H=e=>e===document.scrollingElement?window:e;function G(e,{container:t=document.scrollingElement,...n}={}){if(!t)return M;let r=C.get(t);r||(r=new Set,C.set(t,r));const i=ge(),o=Ne(t,e,i,n);if(r.add(o),!h.has(t)){const l=()=>{for(const f of r)f.measure(ee.timestamp);w.preUpdate(d)},d=()=>{for(const f of r)f.notify()},c=()=>w.read(l);h.set(t,c);const g=H(t);window.addEventListener("resize",c,{passive:!0}),t!==document.documentElement&&T.set(t,pe(t,c)),g.addEventListener("scroll",c,{passive:!0}),c()}const a=h.get(t);return w.read(a,!1,!0),()=>{L(a);const l=C.get(t);if(!l||(l.delete(o),l.size))return;const d=h.get(t);h.delete(t),d&&(H(t).removeEventListener("scroll",d),T.get(t)?.(),window.removeEventListener("resize",d))}}const B=new Map;function ze(e){const t={value:0},n=G(r=>{t.value=r[e.axis].progress*100},e);return{currentTime:t,cancel:n}}function Y({source:e,container:t,...n}){const{axis:r}=n;e&&(t=e);const i=B.get(t)??new Map;B.set(t,i);const o=n.target??"self",a=i.get(o)??{},l=r+(n.offset??[]).join(",");return a[l]||(a[l]=!n.target&&te()?new ScrollTimeline({source:t,axis:r}):ze({container:t,...n})),a[l]}function Ce(e,t){const n=Y(t);return e.attachTimeline({timeline:t.target?void 0:n,observe:r=>(r.pause(),D(i=>{r.time=r.iterationDuration*i},n))})}function Oe(e){return e.length===2}function Le(e,t){return Oe(e)?G(n=>{e(n[t.axis].progress,n)},t):D(e,Y(t))}function Se(e,{axis:t="y",container:n=document.scrollingElement,...r}={}){if(!n)return M;const i={axis:t,container:n,...r};return typeof e=="function"?Le(e,i):Ce(e,i)}const Ie=()=>({scrollX:b(0),scrollY:b(0),scrollXProgress:b(0),scrollYProgress:b(0)}),j=e=>e?!e.current:!1;function Ae({container:e,target:t,...n}={}){const r=y(Ie),i=p.useRef(null),o=p.useRef(!1),a=p.useCallback(()=>(i.current=Se((l,{x:d,y:c})=>{r.scrollX.set(d.current),r.scrollXProgress.set(d.progress),r.scrollY.set(c.current),r.scrollYProgress.set(c.progress)},{...n,container:e?.current||void 0,target:t?.current||void 0}),()=>{i.current?.()}),[e,t,JSON.stringify(n.offset)]);return R(()=>{if(o.current=!1,j(e)||j(t)){o.current=!0;return}else return a()},[a]),p.useEffect(()=>{if(o.current)return S(!j(e)),S(!j(t)),a()},[a]),r}function Pe(e){const t=y(()=>b(e)),{isStatic:n}=p.useContext(re);if(n){const[,r]=p.useState(e);p.useEffect(()=>t.on("change",r),[])}return t}function X(e,t){const n=Pe(t()),r=()=>n.set(t());return r(),R(()=>{const i=()=>w.preRender(r,!1,!0),o=e.map(a=>a.on("change",i));return()=>{o.forEach(a=>a()),L(r)}}),n}function Te(e){z.current=[],e();const t=X(z.current,e);return z.current=void 0,t}function U(e,t,n,r){if(typeof e=="function")return Te(e);if(n!==void 0&&!Array.isArray(n)&&typeof t!="function")return He(e,t,n,r);const a=typeof t=="function"?t:ue(t,n,r);return Array.isArray(e)?W(e,a):W([e],([l])=>a(l))}function W(e,t){const n=y(()=>[]);return X(e,()=>{n.length=0;const r=e.length;for(let i=0;i<r;i++)n[i]=e[i].get();return t(n)})}function He(e,t,n,r){const i=y(()=>Object.keys(n)),o=y(()=>({}));for(const a of i)o[a]=U(e,t,n[a],r);return o}function Be(e,t,n=1800){const[r,i]=p.useState("0"),o=p.useRef(null);return p.useEffect(()=>{if(!t)return;const a=parseFloat(e.replace(/[^0-9.]/g,"")),l=e.replace(/[0-9.]/g,""),d=performance.now(),c=g=>{const f=Math.min((g-d)/n,1),m=1-Math.pow(1-f,4),v=Math.floor(m*a);i(v.toLocaleString()+l),f<1&&(o.current=requestAnimationFrame(c))};return o.current=requestAnimationFrame(c),()=>cancelAnimationFrame(o.current)},[t,e,n]),r}const We=[{value:"1000+",label:"Employees",icon:"◈"},{value:"250+",label:"Skilled Experts",icon:"◆"},{value:"10+",label:"Finished Projects",icon:"◉"},{value:"1000+",label:"Media Posts",icon:"◇"}],Ve=[{num:"01",title:"24/7 Customer Support",body:"Round-the-clock service teams fluent in your brand voice, resolving issues before they escalate."},{num:"02",title:"Expert BPO Solutions",body:"End-to-end back-office operations engineered for precision, compliance, and cost efficiency."},{num:"03",title:"Scalable Process Management",body:"Elastic capacity that grows with you — no overhead, no delays, no limits."}];function Me({value:e,label:t,icon:n,delay:r}){const[i,o]=p.useState(!1),a=Be(e,i),l=p.useRef(null);return p.useEffect(()=>{const d=new IntersectionObserver(([c])=>{c.isIntersecting&&setTimeout(()=>o(!0),r)},{threshold:.5});return l.current&&d.observe(l.current),()=>d.disconnect()},[r]),s.jsxs(u.div,{ref:l,initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.5},transition:{duration:.7,delay:r/1e3+.2,ease:[.22,1,.36,1]},className:"stat-chip",children:[s.jsx("span",{className:"stat-icon",children:n}),s.jsx("span",{className:"stat-val",children:i?a:"0"}),s.jsx("span",{className:"stat-label",children:t})]})}function Re({num:e,title:t,body:n,index:r}){return s.jsxs(u.div,{className:"pillar-card",initial:{opacity:0,x:-20},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.4},transition:{duration:.65,delay:.15*r,ease:[.22,1,.36,1]},children:[s.jsx("span",{className:"pillar-num",children:e}),s.jsxs("div",{className:"pillar-body",children:[s.jsx("strong",{className:"pillar-title",children:t}),s.jsx("p",{className:"pillar-text",children:n})]}),s.jsx("div",{className:"pillar-arrow",children:"→"})]})}function Ge(){const e=p.useRef(null),{scrollYProgress:t}=Ae({target:e,offset:["start end","end start"]}),n=U(t,[0,1],["-6%","6%"]);return s.jsxs("section",{id:"about-us",ref:e,className:"about-root",children:[s.jsx("style",{children:`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

                :root {
                    --ink:    #0b0b10;
                    --paper:  #f5f0e8;
                    --cream:  #ede7d9;
                    --gold:   #c9a84c;
                    --gold2:  #e8c97a;
                    --lilac:  #8b7bb5;
                    --mist:   rgba(255,255,255,0.06);
                    --rule:   rgba(255,255,255,0.1);
                }

                .about-root {
                    position: relative;
                    overflow: hidden;
                    background: var(--ink);
                    font-family: 'Outfit', sans-serif;
                }

                /* ── video bg ── */
                .about-video-wrap {
                    position: absolute; inset: 0; z-index: 0;
                }
                .about-video-wrap video {
                    width: 100%; height: 100%; object-fit: cover;
                }
                .about-video-wrap::after {
                    content: '';
                    position: absolute; inset: 0;
                    background:
                        linear-gradient(to bottom, rgba(11,11,16,0.88) 0%, rgba(11,11,16,0.55) 50%, rgba(11,11,16,0.92) 100%),
                        linear-gradient(100deg, rgba(11,11,16,0.9) 0%, transparent 60%);
                }

                /* noise grain */
                .about-grain {
                    position: absolute; inset: 0; z-index: 1; pointer-events: none;
                    opacity: 0.035;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    background-size: 200px 200px;
                }

                /* ── layout ── */
                .about-inner {
                    position: relative; z-index: 2;
                    max-width: 1360px;
                    margin: 0 auto;
                    padding: 100px 48px 80px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0 72px;
                    align-items: start;
                }
                @media (max-width: 900px) {
                    .about-inner { grid-template-columns: 1fr; gap: 56px; padding: 72px 24px 60px; }
                }

                /* ── eyebrow ── */
                .eyebrow {
                    display: inline-flex; align-items: center; gap: 10px;
                    font-size: 10px; font-weight: 600; letter-spacing: 0.22em;
                    text-transform: uppercase;
                    color: var(--gold);
                    margin-bottom: 22px;
                }
                .eyebrow-line {
                    display: block; width: 32px; height: 1px;
                    background: linear-gradient(90deg, var(--gold), transparent);
                }

                /* ── headline ── */
                .about-h2 {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(42px, 5vw, 72px);
                    font-weight: 700;
                    line-height: 1.03;
                    color: #fff;
                    margin: 0 0 6px;
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
                    color: rgba(255,255,255,0.52);
                    max-width: 440px;
                    margin-bottom: 40px;
                }

                /* ── pillars ── */
                .pillars { display: flex; flex-direction: column; gap: 2px; margin-bottom: 44px; }
                .pillar-card {
                    display: flex; align-items: flex-start; gap: 20px;
                    padding: 20px 22px;
                    border-radius: 14px;
                    border: 1px solid transparent;
                    cursor: default;
                    transition: background 0.25s, border-color 0.25s, transform 0.25s;
                }
                .pillar-card:hover {
                    background: rgba(255,255,255,0.04);
                    border-color: rgba(201,168,76,0.2);
                    transform: translateX(6px);
                }
                .pillar-num {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 11px; font-weight: 600;
                    letter-spacing: 0.15em;
                    color: var(--gold);
                    margin-top: 3px;
                    flex-shrink: 0;
                    min-width: 26px;
                }
                .pillar-body { flex: 1; }
                .pillar-title {
                    display: block;
                    font-size: 14px; font-weight: 600;
                    color: rgba(255,255,255,0.9);
                    margin-bottom: 4px;
                    letter-spacing: 0.01em;
                }
                .pillar-text {
                    font-size: 13px; font-weight: 300;
                    color: rgba(255,255,255,0.42);
                    line-height: 1.65;
                    margin: 0;
                }
                .pillar-arrow {
                    font-size: 16px; color: rgba(255,255,255,0.12);
                    margin-top: 2px;
                    transition: color 0.2s, transform 0.2s;
                    flex-shrink: 0;
                }
                .pillar-card:hover .pillar-arrow {
                    color: var(--gold); transform: translateX(4px);
                }

                /* ── CTA buttons ── */
                .cta-row { display: flex; gap: 12px; flex-wrap: wrap; }
                .btn-primary {
                    padding: 13px 30px;
                    background: linear-gradient(135deg, var(--gold) 0%, #a8722a 100%);
                    border: none; border-radius: 10px;
                    font-family: 'Outfit', sans-serif;
                    font-size: 13px; font-weight: 600;
                    color: #1a1000;
                    cursor: pointer;
                    letter-spacing: 0.03em;
                    transition: transform 0.2s, box-shadow 0.2s;
                    box-shadow: 0 8px 28px rgba(201,168,76,0.28);
                }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(201,168,76,0.38); }
                .btn-ghost {
                    padding: 13px 30px;
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.18);
                    border-radius: 10px;
                    font-family: 'Outfit', sans-serif;
                    font-size: 13px; font-weight: 500;
                    color: rgba(255,255,255,0.7);
                    cursor: pointer;
                    transition: border-color 0.2s, color 0.2s, transform 0.2s;
                }
                .btn-ghost:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-2px); }

                /* ── right col ── */
                .right-col {
                    display: flex; flex-direction: column; gap: 28px;
                }

                /* image frame */
                .img-frame-outer {
                    position: relative;
                }
                .img-frame {
                    position: relative;
                    border-radius: 20px;
                    overflow: hidden;
                    aspect-ratio: 4/3;
                    border: 1px solid rgba(255,255,255,0.08);
                    box-shadow:
                        0 40px 80px rgba(0,0,0,0.55),
                        inset 0 0 0 1px rgba(255,255,255,0.04);
                }
                .img-frame img {
                    width: 100%; height: 100%;
                    object-fit: cover; object-position: center;
                    display: block;
                }
                .img-frame::after {
                    content: '';
                    position: absolute; inset: 0;
                    background: linear-gradient(to top, rgba(11,11,16,0.6) 0%, transparent 55%);
                    border-radius: inherit;
                    pointer-events: none;
                }

                /* decorative corner rule */
                .img-corner {
                    position: absolute;
                    width: 52px; height: 52px;
                    border-color: var(--gold);
                    border-style: solid;
                    border-width: 0;
                    opacity: 0.6;
                }
                .img-corner.tl { top: -10px; left: -10px; border-top-width: 1px; border-left-width: 1px; border-top-left-radius: 6px; }
                .img-corner.br { bottom: -10px; right: -10px; border-bottom-width: 1px; border-right-width: 1px; border-bottom-right-radius: 6px; }

                /* badge */
                .img-badge {
                    position: absolute;
                    bottom: 20px; left: 20px; z-index: 3;
                    background: rgba(11,11,16,0.82);
                    backdrop-filter: blur(18px);
                    border: 1px solid rgba(201,168,76,0.25);
                    border-radius: 14px;
                    padding: 14px 18px;
                    display: flex; align-items: center; gap: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                }
                .badge-dot {
                    width: 8px; height: 8px; border-radius: 50%;
                    background: #4ade80;
                    flex-shrink: 0;
                    box-shadow: 0 0 10px #4ade80;
                    animation: pulse-green 2.2s ease-out infinite;
                }
                @keyframes pulse-green {
                    0%,100% { box-shadow: 0 0 6px #4ade80; }
                    50% { box-shadow: 0 0 14px #4ade80, 0 0 24px rgba(74,222,128,0.3); }
                }
                .badge-text-top {
                    font-size: 11px; font-weight: 300;
                    color: rgba(255,255,255,0.45);
                    margin-bottom: 1px;
                }
                .badge-text-bot {
                    font-size: 14px; font-weight: 600;
                    color: #fff;
                    font-family: 'Outfit', sans-serif;
                }

                /* ── divider ── */
                .gold-rule {
                    width: 100%; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.35), transparent);
                }

                /* ── stats grid ── */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1px;
                    background: rgba(255,255,255,0.07);
                    border-radius: 18px;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.07);
                }
                .stat-chip {
                    display: flex; flex-direction: column; align-items: flex-start;
                    gap: 4px;
                    padding: 26px 24px 22px;
                    background: rgba(11,11,16,0.85);
                    transition: background 0.25s;
                    cursor: default;
                }
                .stat-chip:hover {
                    background: rgba(201,168,76,0.06);
                }
                .stat-icon {
                    font-size: 12px; color: var(--gold); margin-bottom: 6px;
                    letter-spacing: 0;
                }
                .stat-val {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(30px, 3.5vw, 42px);
                    font-weight: 700;
                    color: #fff;
                    line-height: 1;
                    letter-spacing: -0.02em;
                }
                .stat-label {
                    font-size: 10px; font-weight: 500;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.38);
                    margin-top: 2px;
                }

                /* ── bottom strip ── */
                .about-strip {
                    position: relative; z-index: 2;
                    border-top: 1px solid rgba(255,255,255,0.06);
                    padding: 28px 48px;
                    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
                    max-width: 1360px; margin: 0 auto;
                }
                .strip-text {
                    font-size: 12px; font-weight: 400;
                    color: rgba(255,255,255,0.28);
                    letter-spacing: 0.06em;
                }
                .strip-badges { display: flex; gap: 10px; flex-wrap: wrap; }
                .strip-badge {
                    padding: 6px 14px;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 999px;
                    font-size: 11px; font-weight: 500;
                    color: rgba(255,255,255,0.38);
                    letter-spacing: 0.06em;
                    transition: border-color 0.2s, color 0.2s;
                    cursor: default;
                }
                .strip-badge:hover { border-color: var(--gold); color: var(--gold); }
            `}),s.jsx("div",{className:"about-video-wrap",children:s.jsx("video",{src:"/video/about.mp4",autoPlay:!0,loop:!0,muted:!0,playsInline:!0})}),s.jsx("div",{className:"about-grain"}),s.jsxs("div",{className:"about-inner",children:[s.jsxs("div",{children:[s.jsxs(u.div,{className:"eyebrow",initial:{opacity:0,x:-16},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.7},transition:{duration:.6,ease:[.22,1,.36,1]},children:[s.jsx("span",{className:"eyebrow-line"}),"About EmpireOne BPO Solutions Inc."]}),s.jsxs(u.h2,{className:"about-h2",initial:{opacity:0,y:22},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.5},transition:{duration:.75,delay:.1,ease:[.22,1,.36,1]},children:["Your Trusted",s.jsx("br",{}),"Partner in",s.jsx("br",{}),s.jsx("em",{children:"Business Excellence"})]}),s.jsx(u.p,{className:"about-sub",initial:{opacity:0,y:16},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.5},transition:{duration:.7,delay:.22,ease:[.22,1,.36,1]},children:"At EmpireOne, we deliver world-class BPO solutions that help businesses optimize operations, reduce costs, and scale efficiently — from customer support to back-office operations, across the globe."}),s.jsx("div",{className:"pillars",children:Ve.map((r,i)=>s.jsx(Re,{...r,index:i},r.num))}),s.jsxs(u.div,{className:"cta-row",initial:{opacity:0,y:14},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.6},transition:{duration:.6,delay:.5,ease:[.22,1,.36,1]},children:[s.jsx(u.button,{className:"btn-primary",whileHover:{y:-2},whileTap:{scale:.97},children:"Explore More"}),s.jsx(u.a,{href:"#contact",className:"btn-ghost",style:{textDecoration:"none",display:"inline-flex",alignItems:"center"},whileHover:{y:-2},whileTap:{scale:.97},children:"Contact Us →"})]})]}),s.jsxs("div",{className:"right-col",children:[s.jsxs(u.div,{className:"img-frame-outer",initial:{opacity:0,x:32},whileInView:{opacity:1,x:0},viewport:{once:!0,amount:.3},transition:{duration:.85,delay:.18,ease:[.22,1,.36,1]},children:[s.jsx("div",{className:"img-corner tl"}),s.jsx("div",{className:"img-corner br"}),s.jsxs("div",{className:"img-frame",children:[s.jsx(u.img,{src:"/images/image-200.png",alt:"Team collaborating",style:{y:n}}),s.jsxs("div",{className:"img-badge",children:[s.jsx("span",{className:"badge-dot"}),s.jsxs("div",{children:[s.jsx("div",{className:"badge-text-top",children:"Currently hiring"}),s.jsx("div",{className:"badge-text-bot",children:"Join our global team"})]})]})]})]}),s.jsx(u.div,{className:"gold-rule",initial:{scaleX:0},whileInView:{scaleX:1},viewport:{once:!0,amount:.5},transition:{duration:.9,delay:.3,ease:[.22,1,.36,1]},style:{transformOrigin:"left"}}),s.jsx(u.div,{className:"stats-grid",initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.3},transition:{duration:.7,delay:.32,ease:[.22,1,.36,1]},children:We.map((r,i)=>s.jsx(Me,{...r,delay:i*120},r.label))})]})]}),s.jsxs(u.div,{className:"about-strip ",initial:{opacity:0},whileInView:{opacity:1},viewport:{once:!0,amount:.5},transition:{duration:.8,delay:.2},children:[s.jsx("span",{className:"strip-text",children:"EmpireOne BPO · Trusted Worldwide"}),s.jsx("div",{className:"strip-badges",children:[{label:"ISO Certified",img:"/images/ISO-Logo.png"},{label:"GDPR Compliant",img:"/images/GDPR-Logo.png"},{label:"SOC 2 Type II",img:"/images/SOC2-Logo.png"},{label:"HIPAA Ready",img:"/images/HIPAA-Logo.png"},{label:"PCI DSS Certified",img:"/images/PCI-Logo.png"},{label:"BBB Accredited",img:"/images/BBB-Logo.png"}].map(r=>s.jsxs("span",{className:"strip-badge flex items-center gap-2",children:[s.jsx("img",{src:r.img,alt:r.label,style:{height:60,width:"auto"}}),s.jsx("span",{children:r.label})]},r.label))})]})]})}export{Ge as default};
