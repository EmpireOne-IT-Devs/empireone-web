import{r as n,j as e}from"./app-B3_eDmBC.js";const m=n.forwardRef(({label:o,name:s,type:r="text",disabled:p=!1,required:d=!1,iconLeft:a,iconRight:l,error:t,readOnly:x=!1,className:u="",...i},c)=>e.jsxs("div",{className:"w-full",children:[e.jsxs("div",{className:"relative",children:[a&&e.jsx("div",{className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-500",children:a}),e.jsx("input",{autoComplete:"off",ref:c,id:s,name:s,type:r,disabled:p,required:d,readOnly:x,step:r==="number"?"any":void 0,placeholder:" ",...i,className:`
              peer w-full rounded-md border bg-white py-2.5 px-4 text-sm text-black
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${a?"pl-10":""} ${l?"pr-10":""}
              ${t?"border-red-500 focus:ring-red-500":"border-gray-300"}
              ${u}
            `}),e.jsx("label",{htmlFor:s,className:`
              absolute left-3 top-2.5 bg-white px-1 text-gray-500 text-sm
              transition-all duration-200 ease-out
              peer-placeholder-shown:top-2.5
              peer-placeholder-shown:text-sm
              peer-placeholder-shown:text-gray-500
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
              peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-700
            `,children:o}),l&&e.jsx("div",{className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-500",children:l})]}),t&&e.jsx("p",{className:"mt-1 text-sm text-red-500",children:t.message??t})]}));m.displayName="Input";export{m as I};
