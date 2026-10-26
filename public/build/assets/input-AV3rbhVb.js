import{r as m,j as e}from"./app-D-Cr_cQr.js";const b=m.forwardRef(({label:n,name:s,type:r="text",disabled:d=!1,required:i=!1,iconLeft:a,iconRight:l,error:t,readOnly:u=!1,className:x="",onWheel:p,...c},h)=>{const f=o=>{r==="number"&&o.target.blur(),p&&p(o)};return e.jsxs("div",{className:"w-full",children:[e.jsxs("div",{className:"relative",children:[a&&e.jsx("div",{className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-500",children:a}),e.jsx("input",{autoComplete:"off",ref:h,id:s,name:s,type:r,disabled:d,required:i,readOnly:u,step:r==="number"?"any":void 0,placeholder:" ",onWheel:f,...c,className:`
                            peer w-full rounded-md border bg-white py-2.5 px-4 text-sm text-black transition-colors
                            focus:outline-none focus:ring-2 focus:ring-purple-500 
                            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                            ${a?"pl-10":""} ${l?"pr-10":""}
                            ${t?"border-red-500 focus:ring-red-500":"border-gray-300"}
                            ${x}
                        `}),e.jsx("label",{htmlFor:s,className:`
                            absolute left-3 top-2.5 bg-white px-1 text-purple-500 text-sm
                            transition-all duration-200 ease-out pointer-events-none
                            peer-placeholder-shown:top-2.5
                            peer-placeholder-shown:text-sm
                            peer-placeholder-shown:text-purple-500
                            peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-600
                            peer-valid:-top-2 peer-valid:text-xs peer-valid:text-purple-700
                            peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs
                        `,children:n}),l&&e.jsx("div",{className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-500",children:l})]}),t&&e.jsx("p",{className:"mt-1 text-sm text-red-500",children:t.message??t})]})});b.displayName="Input";export{b as I};
