import{r as n,j as t}from"./app-UanO2MTZ.js";import{G as c}from"./iconBase-DUCJASuZ.js";import d from"./add-attrition-section-DNB2_xqY.js";import"./index.esm-BGG7tfIk.js";import"./index-DfTTDM2S.js";import"./button-CEydC4h2.js";import"./index-CYjLz6oH.js";import"./input-8d7X3OPO.js";import"./modal-DHP4Ectu.js";import"./index-D7tpzciq.js";import"./radio-DnyIPycT.js";import"./select-eu9I44IU.js";import"./employee-relation-thunk-BOTRtx7A.js";import"./applicants-service-P8BmWRGL.js";import"./employee-change-form-service-B-5ZMzZe.js";import"./er-leaders-service-D9k2LExR.js";import"./human-resources-service-DThXa2sD.js";import"./performance-evaluation-service-DDkg5UcW.js";function m(e){return c({attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{d:"M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"},child:[]}]})(e)}function S({props_data:e}){const[r,i]=n.useState(!1),o=n.useRef(null),a=()=>i(!r);return n.useEffect(()=>{const s=l=>{o.current&&!o.current.contains(l.target)&&i(!1)};return document.addEventListener("mousedown",s),()=>{document.removeEventListener("mousedown",s)}},[]),t.jsxs("div",{className:"relative inline-block text-left",ref:o,children:[t.jsx("button",{onClick:a,"aria-expanded":r,className:"p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none",children:t.jsx(m,{size:20})}),t.jsx("div",{className:`
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
