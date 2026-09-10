import{r,j as t}from"./app-DWLVRJhO.js";import{G as c}from"./iconBase-CyqKmde5.js";import d from"./add-attrition-section-NfTGE5gp.js";import"./index.esm-DjlyIibZ.js";import"./index-NZO1aV3G.js";import"./button-Q_DJUYMF.js";import"./index-DSYvhO_b.js";import"./input-CyAk21Nh.js";import"./modal-umLnJ6Ww.js";import"./index-D1hrQ3sc.js";import"./radio-ChkQg0o-.js";import"./select-BArhlE73.js";import"./employee-relation-thunk-B8RmSfQ4.js";import"./applicants-service-DvUELxxc.js";import"./employee-change-form-service-BSPPOnxc.js";import"./er-leaders-service-fGXZcj5n.js";import"./human-resources-service-BSiflnYw.js";import"./performance-evaluation-service-v064tDlw.js";function m(e){return c({attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{d:"M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"},child:[]}]})(e)}function S({props_data:e}){const[o,i]=r.useState(!1),n=r.useRef(null),a=()=>i(!o);return r.useEffect(()=>{const s=l=>{n.current&&!n.current.contains(l.target)&&i(!1)};return document.addEventListener("mousedown",s),()=>{document.removeEventListener("mousedown",s)}},[]),t.jsxs("div",{className:"relative inline-block text-left",ref:n,children:[t.jsx("button",{onClick:a,"aria-expanded":o,className:"p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none",children:t.jsx(m,{size:20})}),t.jsx("div",{className:`
                  absolute left-0 top-full mt-1.5 min-w-52 bg-white rounded-md shadow-lg flex flex-col z-50 ring-1 ring-black ring-opacity-5
                  transition-all duration-200 ease-in-out
                  ${o?"opacity-100 visible translate-y-0 pointer-events-auto":"opacity-0 invisible -translate-y-2 pointer-events-none"}
                `,children:t.jsx("div",{className:`
                        group flex items-center justify-center gap-2 
                        px-6 py-2.5 
                        bg-gray-300 font-semibold hover:text-white text-sm tracking-wide
                        rounded-lg shadow-sm 
                        transition-all duration-200 ease-in-out
                        hover:bg-gray-400 hover:shadow-md hover:-translate-y-0.5
                        active:scale-95 active:translate-y-0 active:bg-gray-400
                        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                    `,children:t.jsx(d,{props_data:e})})})]})}export{S as default};
