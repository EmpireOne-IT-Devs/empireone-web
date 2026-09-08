import{r as n,j as t}from"./app-BWW0761G.js";import{G as c}from"./iconBase-BkRSG4Ps.js";import d from"./add-attrition-section-CkZ9WzJX.js";import"./index.esm-CCiSb2f-.js";import"./index-VAy0SAjl.js";import"./button-YFZRObWO.js";import"./index-C_jBGcr0.js";import"./input-BlIN7Iaf.js";import"./modal-CyjpfGm7.js";import"./index-ReYw2f49.js";import"./radio-BFG4P7VA.js";import"./select-C_0pulPC.js";import"./employee-relation-thunk-DoHQ9vlb.js";import"./applicants-service-Bv6zWyv5.js";import"./employee-change-form-service-bdQIeJ4w.js";import"./er-leaders-service-B5SsvOsC.js";import"./human-resources-service-CbY6mF9K.js";import"./performance-evaluation-service-CQnAKAw1.js";function m(e){return c({attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{d:"M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"},child:[]}]})(e)}function S({props_data:e}){const[r,i]=n.useState(!1),o=n.useRef(null),a=()=>i(!r);return n.useEffect(()=>{const s=l=>{o.current&&!o.current.contains(l.target)&&i(!1)};return document.addEventListener("mousedown",s),()=>{document.removeEventListener("mousedown",s)}},[]),t.jsxs("div",{className:"relative inline-block text-left",ref:o,children:[t.jsx("button",{onClick:a,"aria-expanded":r,className:"p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none",children:t.jsx(m,{size:20})}),t.jsx("div",{className:`
                  absolute left-0 top-full mt-1.5 min-w-52 bg-white rounded-md shadow-lg flex flex-col z-50 ring-1 ring-black ring-opacity-5
                  transition-all duration-200 ease-in-out
                  ${r?"opacity-100 visible translate-y-0 pointer-events-auto":"opacity-0 invisible -translate-y-2 pointer-events-none"}
                `,children:t.jsx("div",{className:`\r
                        group flex items-center justify-center gap-2 \r
                        px-6 py-2.5 \r
                        bg-gray-300 font-semibold hover:text-white text-sm tracking-wide\r
                        rounded-lg shadow-sm \r
                        transition-all duration-200 ease-in-out\r
                        hover:bg-gray-400 hover:shadow-md hover:-translate-y-0.5\r
                        active:scale-95 active:translate-y-0 active:bg-gray-400\r
                        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2\r
                    `,children:t.jsx(d,{props_data:e})})})]})}export{S as default};
