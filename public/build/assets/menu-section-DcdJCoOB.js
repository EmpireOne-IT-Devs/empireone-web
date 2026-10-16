import{r as l,j as t}from"./app-hN14m8fg.js";import{x as m,K as d}from"./index-OM6rp7RU.js";import x from"./create-reach-section-27MKUrct.js";import"./iconBase-Do_tipdq.js";import"./index.esm-CVz0_6tt.js";import"./button-DxL-T9rA.js";import"./index-D3nUgLO5.js";import"./index-J-PIukrI.js";import"./input-DvU_rGTG.js";import"./modal-CE9Igodu.js";import"./index-BhvDUeq4.js";import"./use-transform-C18BoHhU.js";import"./proxy-CsLF-24Q.js";import"./select-DIc8v30O.js";import"./textarea-B87yfFG4.js";function f({items:s=[]}){const[n,r]=l.useState(!1),a=l.useRef(null),p=e=>{e.stopPropagation(),r(o=>!o)},u=e=>{typeof e=="function"&&e(),r(!1)};return l.useEffect(()=>{const e=i=>{a.current&&!a.current.contains(i.target)&&r(!1)},o=i=>{i.key==="Escape"&&r(!1)};return n&&(document.addEventListener("mousedown",e),document.addEventListener("keydown",o)),()=>{document.removeEventListener("mousedown",e),document.removeEventListener("keydown",o)}},[n]),t.jsxs("div",{className:"relative inline-block text-left",ref:a,children:[t.jsx("button",{type:"button",onClick:p,"aria-expanded":n,"aria-haspopup":"true","aria-label":"Toggle actions menu",className:`
                    relative p-2 rounded-full transition-all duration-150 outline-none
                    hover:bg-black/5 active:bg-black/10
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600
                    ${n?"bg-black/10":""}
                `,children:t.jsx(m,{size:20})}),t.jsx("div",{className:`
                    absolute right-0 top-full mt-1 min-w-[200px] py-1 bg-white rounded-md z-[9999]
                    shadow-[0px_5px_5px_-3px_rgba(0,0,0,0.2),0px_8px_10px_1px_rgba(0,0,0,0.14),0px_3px_14px_2px_rgba(0,0,0,0.12)]
                    transform transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top-right
                    ${n?"opacity-100 scale-100 translate-y-0 pointer-events-auto":"opacity-0 scale-95 -translate-y-2 pointer-events-none"}
                `,children:t.jsx("div",{className:"flex flex-col py-1",children:s.map((e,o)=>{const i=e.icon,c=e.id||o;return e.component?t.jsx("div",{onClick:()=>r(!1),className:"w-full cursor-pointer",children:e.component},c):t.jsxs("button",{type:"button",onClick:()=>u(e.onClick),className:`\r
                                    group flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm font-medium \r
                                    text-gray-700 hover:bg-black/[0.04] active:bg-black/[0.08] hover:text-gray-900 \r
                                    transition-colors duration-150\r
                                `,children:[i&&t.jsx(i,{size:20,className:"shrink-0 transition-transform duration-200 ease-out group-hover:scale-110"}),t.jsx("span",{children:e.label})]},c)})})})]})}function R({props_data:s}){const n=[{component:t.jsx(x,{props_data:s})},{label:"View Projects",icon:d,onClick:()=>alert("Clicked projects")}];return t.jsx(f,{items:n})}export{R as default};
