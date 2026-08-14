import{r,j as t}from"./app-DyidzfRE.js";import{G as c}from"./iconBase-CDfVyAHm.js";import d from"./add-attrition-section-DSURRfUr.js";import"./button-BF3qgeEG.js";import"./index-xER7Zgbw.js";import"./input-C4R_UlNp.js";import"./modal-DM2fISX6.js";import"./index-DfSF7qre.js";import"./radio-Cw-fPHKe.js";import"./select-CbnSNhEr.js";import"./employee-relation-service-CEWiBLPt.js";import"./index.esm-DYwRVySL.js";import"./index-DuIBcGJ6.js";function u(e){return c({attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{d:"M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"},child:[]}]})(e)}function N({props_data:e}){const[n,i]=r.useState(!1),o=r.useRef(null),a=()=>i(!n);return r.useEffect(()=>{const s=l=>{o.current&&!o.current.contains(l.target)&&i(!1)};return document.addEventListener("mousedown",s),()=>{document.removeEventListener("mousedown",s)}},[]),t.jsxs("div",{className:"relative inline-block text-left",ref:o,children:[t.jsx("button",{onClick:a,"aria-expanded":n,className:"p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none",children:t.jsx(u,{size:20})}),t.jsx("div",{className:`
                  absolute left-0 top-full mt-1.5 min-w-52 bg-white rounded-md shadow-lg flex flex-col z-50 ring-1 ring-black ring-opacity-5
                  transition-all duration-200 ease-in-out
                  ${n?"opacity-100 visible translate-y-0 pointer-events-auto":"opacity-0 invisible -translate-y-2 pointer-events-none"}
                `,children:t.jsx("div",{className:`
                        group flex items-center justify-center gap-2 
                        px-6 py-2.5 
                        bg-gray-300 font-semibold hover:text-white text-sm tracking-wide
                        rounded-lg shadow-sm 
                        transition-all duration-200 ease-in-out
                        hover:bg-gray-400 hover:shadow-md hover:-translate-y-0.5
                        active:scale-95 active:translate-y-0 active:bg-gray-400
                        focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                    `,children:t.jsx(d,{props_data:e})})})]})}export{N as default};
