import{r,j as n}from"./app-C8ckx5gs.js";import{y as d}from"./index-CyltJ-TU.js";function m({items:c=[]}){const[a,s]=r.useState(!1),i=r.useRef(null),p=e=>{e.stopPropagation(),s(t=>!t)},u=e=>{typeof e=="function"&&e(),s(!1)};return r.useEffect(()=>{const e=o=>{i.current&&!i.current.contains(o.target)&&s(!1)},t=o=>{o.key==="Escape"&&s(!1)};return a&&(document.addEventListener("mousedown",e),document.addEventListener("keydown",t)),()=>{document.removeEventListener("mousedown",e),document.removeEventListener("keydown",t)}},[a]),n.jsxs("div",{className:"relative inline-block text-left",ref:i,children:[n.jsx("button",{type:"button",onClick:p,"aria-expanded":a,"aria-haspopup":"true","aria-label":"Toggle actions menu",className:`
                    relative p-2 rounded-full transition-all duration-150 outline-none
                    hover:bg-black/5 active:bg-black/10
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600
                    ${a?"bg-black/10":""}
                `,children:n.jsx(d,{size:20})}),n.jsx("div",{className:`
                    absolute right-0 top-full mt-1 min-w-[200px] py-1 bg-white rounded-md z-[9999]
                    shadow-[0px_5px_5px_-3px_rgba(0,0,0,0.2),0px_8px_10px_1px_rgba(0,0,0,0.14),0px_3px_14px_2px_rgba(0,0,0,0.12)]
                    transform transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top-right
                    ${a?"opacity-100 scale-100 translate-y-0 pointer-events-auto":"opacity-0 scale-95 -translate-y-2 pointer-events-none"}
                `,children:n.jsx("div",{className:"flex flex-col py-1",children:c.map((e,t)=>{const o=e.icon,l=e.id||t;return e.component?n.jsx("div",{onClick:()=>s(!1),className:"w-full cursor-pointer",children:e.component},l):n.jsxs("button",{type:"button",onClick:()=>u(e.onClick),className:`\r
                                    group flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm font-medium \r
                                    text-gray-700 hover:bg-black/[0.04] active:bg-black/[0.08] hover:text-gray-900 \r
                                    transition-colors duration-150\r
                                `,children:[o&&n.jsx(o,{size:20,className:"shrink-0 transition-transform duration-200 ease-out group-hover:scale-110"}),n.jsx("span",{children:e.label})]},l)})})})]})}export{m as M};
