import{r as o,j as t}from"./app-KbtrhYe8.js";import{G as c}from"./iconBase-LvaCGnwz.js";import d from"./add-attrition-section-DmO3h6S0.js";import"./button-DS63-iSU.js";import"./index-Cn_aavoV.js";import"./input-C7d9xK_Z.js";import"./modal-DpikOCfe.js";import"./index-DKhd4DAH.js";import"./radio-_UnoI3CQ.js";import"./select-CY9_yjnm.js";import"./employee-relation-service-8cuQ-G6g.js";import"./index.esm-U8zAXd7T.js";import"./index-DbJSMgAb.js";function u(e){return c({attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{d:"M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"},child:[]}]})(e)}function N({props_data:e}){const[n,i]=o.useState(!1),r=o.useRef(null),a=()=>i(!n);return o.useEffect(()=>{const s=l=>{r.current&&!r.current.contains(l.target)&&i(!1)};return document.addEventListener("mousedown",s),()=>{document.removeEventListener("mousedown",s)}},[]),t.jsxs("div",{className:"relative inline-block text-left",ref:r,children:[t.jsx("button",{onClick:a,"aria-expanded":n,className:"p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none",children:t.jsx(u,{size:20})}),t.jsx("div",{className:`
                  absolute left-0 top-full mt-1.5 min-w-52 bg-white rounded-md shadow-lg flex flex-col z-50 ring-1 ring-black ring-opacity-5
                  transition-all duration-200 ease-in-out
                  ${n?"opacity-100 visible translate-y-0 pointer-events-auto":"opacity-0 invisible -translate-y-2 pointer-events-none"}
                `,children:t.jsx("div",{className:`\r
                        group flex items-center justify-center gap-2 \r
                        px-6 py-2.5 \r
                        bg-gray-300 font-semibold hover:text-white text-sm tracking-wide\r
                        rounded-lg shadow-sm \r
                        transition-all duration-200 ease-in-out\r
                        hover:bg-gray-400 hover:shadow-md hover:-translate-y-0.5\r
                        active:scale-95 active:translate-y-0 active:bg-gray-400\r
                        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2\r
                    `,children:t.jsx(d,{props_data:e})})})]})}export{N as default};
