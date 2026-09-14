import{r as n,j as t}from"./app-q4BbiSiR.js";import{G as c}from"./iconBase-ss18W1Gn.js";import d from"./add-attrition-section-Ci5WxeYg.js";import"./index.esm-DsIAgNzB.js";import"./index-CVOR7jRM.js";import"./button-CmtHqrz1.js";import"./index-BuJXqa8S.js";import"./input-Bakgnny3.js";import"./modal-B7HO_u06.js";import"./index-DfM07l0X.js";import"./radio-DTriwQmi.js";import"./select-D8mHNbsH.js";import"./employee-relation-thunk-CuisMhNl.js";import"./applicants-service-BfabysN0.js";import"./employee-change-form-service-Cqyyjf2m.js";import"./er-leaders-service-Co_qzCGE.js";import"./human-resources-service-BDcUbHpW.js";import"./performance-evaluation-service-oquO4XnM.js";function m(e){return c({attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{d:"M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"},child:[]}]})(e)}function S({props_data:e}){const[r,i]=n.useState(!1),o=n.useRef(null),a=()=>i(!r);return n.useEffect(()=>{const s=l=>{o.current&&!o.current.contains(l.target)&&i(!1)};return document.addEventListener("mousedown",s),()=>{document.removeEventListener("mousedown",s)}},[]),t.jsxs("div",{className:"relative inline-block text-left",ref:o,children:[t.jsx("button",{onClick:a,"aria-expanded":r,className:"p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none",children:t.jsx(m,{size:20})}),t.jsx("div",{className:`
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
