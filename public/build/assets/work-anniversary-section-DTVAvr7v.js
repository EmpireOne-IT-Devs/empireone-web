import{u as R,b as k,r as l,h as A,j as e}from"./app-BBdnVjAn.js";import{i as p,t as E,a as L}from"./index-Df2LuWbD.js";import{c as F}from"./index-DDQn1RNS.js";import{C as S}from"./card-VXNVZ7Zk.js";import{S as _}from"./skeleton-L5CXeMGr.js";import"./iconBase-B_uhG8vU.js";const w=["bg-gradient-to-br from-blue-600 to-indigo-800","bg-gradient-to-br from-emerald-500 to-teal-700","bg-gradient-to-br from-orange-500 to-amber-700","bg-gradient-to-br from-purple-600 to-violet-800","bg-gradient-to-br from-pink-500 to-rose-700"],v="w-[130px] sm:w-[160px] md:w-[185px] lg:w-[205px] xl:w-[220px]",y=l.memo(({employee:t,index:s})=>{const o=t.profile_picture||t.avatar,i=t.anniversary_date?new Date(t.anniversary_date).toLocaleDateString("default",{month:"short",day:"numeric",year:"numeric"}):null;return e.jsx(S,{variant:"default",padding:"p-0",className:`group relative shrink-0 aspect-square ${v}
                overflow-hidden rounded-2xl border border-slate-200/80
                bg-white shadow-sm transition-all duration-300
                hover:border-indigo-200 hover:shadow-md`,children:e.jsxs("div",{className:"flex h-full w-full flex-col items-center justify-center p-3 text-center sm:p-4",children:[e.jsxs("div",{className:"relative mb-2",children:[o?e.jsx("img",{src:o,alt:t.name,loading:"lazy",className:`
                                h-11 w-11 rounded-2xl object-cover
                                shadow-sm ring-2 ring-white
                                sm:h-12 sm:w-12
                                md:h-14 md:w-14
                                lg:h-16 lg:w-16
                            `}):e.jsx("div",{className:`
                                flex h-11 w-11 items-center justify-center
                                rounded-2xl text-white font-bold
                                sm:h-12 sm:w-12
                                md:h-14 md:w-14
                                lg:h-16 lg:w-16
                                ${w[s%w.length]}
                            `,children:t.initials||"?"}),e.jsx("span",{className:"absolute -bottom-1 -right-1 rounded-xl bg-amber-500 p-1 text-white ring-2 ring-white",children:e.jsx(F,{size:11})})]}),t.anniversary_label&&e.jsxs("span",{className:"rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-800",children:["🎉 ",t.anniversary_label]}),e.jsx("h3",{title:t.name,className:`
                        mt-2 w-full truncate
                        text-[10px] font-bold text-slate-800
                        sm:text-xs md:text-sm
                    `,children:t.name}),e.jsxs("div",{className:`
                        mt-1 flex w-full items-center justify-center
                        gap-1 truncate text-[8px] text-slate-500
                        sm:text-[9px]
                    `,children:[e.jsx(E,{size:10,className:"shrink-0"}),e.jsx("span",{className:"truncate",children:t.department||"General"})]}),i&&e.jsxs("div",{className:"mt-2 flex items-center gap-1 text-[8px] text-slate-500 sm:text-[9px]",children:[e.jsx(L,{size:10,className:"shrink-0 text-indigo-500"}),e.jsx("span",{children:i})]})]})})});function D(){const t=R(),{workAnniversaries:s=[],workAnniversaryMonth:o,workAnniversariesLoading:i,workAnniversaryFilters:d}=k(n=>n.engagement),m=l.useRef(null),x=l.useRef(null),f=l.useRef(!1),h=l.useRef(!1);l.useEffect(()=>{t(A(d))},[t,d]);const{firstRow:j,secondRow:N}=l.useMemo(()=>{if(s.length<15)return{firstRow:s,secondRow:[]};const n=Math.ceil(s.length/2);return{firstRow:s.slice(0,n),secondRow:s.slice(n)}},[s]);l.useEffect(()=>{let n;const c=()=>{const r=m.current,a=x.current;r&&!f.current&&(r.scrollLeft+=.7,r.scrollLeft+r.clientWidth>=r.scrollWidth-1&&(r.scrollLeft=0)),a&&!h.current&&(a.scrollLeft-=.7,a.scrollLeft<=0&&(a.scrollLeft=a.scrollWidth-a.clientWidth)),n=requestAnimationFrame(c)};return s.length>0&&(n=requestAnimationFrame(c)),()=>cancelAnimationFrame(n)},[s]);const u=(n,c,r)=>n.length?e.jsx("div",{ref:c,onMouseEnter:()=>{r.current=!0},onMouseLeave:()=>{r.current=!1},onTouchStart:()=>{r.current=!0},onTouchEnd:()=>{setTimeout(()=>{r.current=!1},800)},className:`
                    flex
                    gap-3
                    overflow-x-auto
                    overflow-y-hidden
                    select-none
                    sm:gap-4

                    /* Hide scrollbar - Firefox */
                    [scrollbar-width:none]

                    /* Hide scrollbar - IE/old Edge */
                    [-ms-overflow-style:none]

                    /* Hide scrollbar - Chrome/Edge/Safari */
                    [&::-webkit-scrollbar]:hidden
                `,children:n.map((a,b)=>e.jsx(y,{employee:a,index:b},`${a.user_id}-${b}`))}):null,g=o||new Date().toLocaleString("default",{month:"long"});return e.jsxs("section",{className:"my-4 w-full",children:[e.jsxs("div",{className:"mb-4 flex items-center justify-between px-1",children:[e.jsxs("div",{className:"flex items-center gap-2.5 p-2",children:[e.jsx("div",{className:"rounded-xl bg-indigo-50 p-2 text-indigo-700",children:e.jsx(p,{size:20})}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-sm font-bold text-slate-900 sm:text-base",children:"Work Anniversaries"}),e.jsxs("p",{className:"text-[10px] text-slate-500 sm:text-xs",children:["Celebrating milestones for ",g]})]})]}),!i&&s.length>0&&e.jsxs("span",{className:"rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-700",children:[s.length," ",s.length===1?"Person":"People"]})]}),i?e.jsx("div",{className:`
                        flex
                        gap-3
                        overflow-hidden
                        sm:gap-4
                    `,children:[1,2,3,4,5].map(n=>e.jsx(_,{variant:"card",className:`shrink-0 aspect-square ${v} rounded-2xl`},n))}):s.length>0?e.jsxs("div",{className:"flex flex-col gap-3 sm:gap-4",children:[u(j,m,f),s.length>=15&&u(N,x,h)]}):e.jsxs("div",{className:"rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center",children:[e.jsx(p,{className:"mx-auto mb-3 text-slate-400",size:24}),e.jsx("p",{className:"text-sm font-semibold text-slate-700",children:"No Anniversaries Found"}),e.jsxs("p",{className:"mt-1 text-xs text-slate-500",children:["There are no work anniversaries scheduled for"," ",g,"."]})]})]})}export{D as default};
