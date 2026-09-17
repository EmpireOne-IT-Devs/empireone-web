import{r as s,j as t}from"./app-O_Ki6cYV.js";import{v as m}from"./index-l8sZnQSj.js";import u from"./add-attrition-section-hV-qiyJo.js";import d from"./update-employee-BIpWim8T.js";import"./iconBase-C1CJwxn6.js";import"./index.esm-BniF5k_z.js";import"./index-DRp23vra.js";import"./button-n84k6AkZ.js";import"./index-CyHXYPgJ.js";import"./input-DPDaU10W.js";import"./modal-B9O7UQGo.js";import"./index-BiY4ho7V.js";import"./radio-C8ozlVl2.js";import"./select-4XugKj9M.js";import"./employee-relation-thunk-CaE9wpU_.js";import"./applicants-service-Dh1s_mxQ.js";import"./employee-change-form-service-CKD3ch4I.js";import"./er-leaders-service-piWzER_z.js";import"./human-resources-service-DfwbCTRE.js";import"./performance-evaluation-service-COUdxSmq.js";import"./moment-BMQglvow.js";import"./account-service-DAgqXvgE.js";import"./hash-bJWz8uvI.js";import"./createLucideIcon-DZ7LvaTA.js";import"./building-2-BdyEmaE0.js";import"./briefcase-DWff89Bd.js";import"./mail-Bcct86Jh.js";function q({props_data:l}){const[e,o]=s.useState(!1),r=s.useRef(null),c=()=>o(n=>!n);s.useEffect(()=>{const n=i=>{r.current&&!r.current.contains(i.target)&&o(!1)},p=i=>{i.key==="Escape"&&o(!1)};return e&&(document.addEventListener("mousedown",n),document.addEventListener("keydown",p)),()=>{document.removeEventListener("mousedown",n),document.removeEventListener("keydown",p)}},[e]);const a=()=>{o(!1)};return t.jsxs("div",{className:"relative inline-block text-left",ref:r,children:[t.jsx("button",{type:"button",onClick:c,"aria-expanded":e,"aria-haspopup":"true",className:`
                    relative p-2 rounded-full transition-all duration-150 outline-none
                    hover:bg-black/5 active:bg-black/10
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600
                    ${e?"bg-black/10":""}
                `,children:t.jsx(m,{size:20})}),t.jsxs("div",{className:`
                    absolute left-0 top-full mt-1 min-w-[200px] py-2 bg-white rounded-md z-[100]
                    shadow-[0px_5px_5px_-3px_rgba(0,0,0,0.2),0px_8px_10px_1px_rgba(0,0,0,0.14),0px_3px_14px_2px_rgba(0,0,0,0.12)]
                    transform transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top-left
                    ${e?"opacity-100 scale-100 translate-y-0 pointer-events-auto":"opacity-0 scale-95 -translate-y-2 pointer-events-none"}
                `,children:[t.jsx("div",{onClick:a,className:`\r
                        group relative flex items-center w-full px-4 py-2.5 text-sm font-normal text-gray-800\r
                        cursor-pointer select-none transition-colors duration-150\r
                        hover:bg-black/[0.04] active:bg-black/[0.08]\r
                        [&>button]:w-full [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left\r
                    `,children:t.jsx(u,{props_data:l})}),t.jsx("div",{onClick:a,className:`\r
                        group relative flex items-center w-full px-4 py-2.5 text-sm font-normal text-gray-800\r
                        cursor-pointer select-none transition-colors duration-150\r
                        hover:bg-black/[0.04] active:bg-black/[0.08]\r
                        [&>button]:w-full [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left\r
                    `,children:t.jsx(d,{props_data:l})})]})]})}export{q as default};
