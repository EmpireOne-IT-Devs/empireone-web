import{r as s,j as t}from"./app-bPSUPQIF.js";const C=s.forwardRef(({label:g,name:u,options:l=[],error:n,iconLeft:i,iconRight:p,disabled:f=!1,required:$=!1,readOnly:w=!1,className:v="",value:a,onChange:m,...y},j)=>{const[h,r]=s.useState(""),[N,c]=s.useState(!1),x=s.useRef();s.useEffect(()=>{const e=l.find(o=>o.value===a);e?r(e.label):a||r("")},[a,l]);const b=l.filter(e=>e.label.toLowerCase().includes(h.toLowerCase())),S=e=>{r(e.label),m(e.value),c(!1)},E=e=>{r(e.target.value),c(!0),e.target.value===""&&m("")};return s.useEffect(()=>{const e=o=>{if(x.current&&!x.current.contains(o.target)){c(!1);const d=l.find(O=>O.value===a);r(d?d.label:"")}};return document.addEventListener("mousedown",e),()=>document.removeEventListener("mousedown",e)},[a,l]),t.jsxs("div",{className:"w-full",ref:x,children:[t.jsxs("div",{className:"relative",children:[i&&t.jsx("div",{className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10",children:i}),t.jsx("input",{...y,autoComplete:"off",ref:j,id:u,name:u,disabled:f,placeholder:" ",readOnly:w,value:h,onChange:E,onFocus:()=>c(!0),className:`
              peer w-full rounded-md border bg-white py-2.5 px-4 text-sm text-black
              placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500
              ${i?"pl-10":""} ${p?"pr-10":""}
              ${n?"border-red-500 focus:ring-red-500":"border-gray-300"}
              ${v}
            `}),t.jsx("label",{htmlFor:u,className:`
              absolute left-3 top-2.5 bg-white px-1 text-gray-500 text-sm
              transition-all duration-200 ease-out
              peer-placeholder-shown:top-2.5
              peer-placeholder-shown:text-sm
              peer-placeholder-shown:text-gray-500
              peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
              peer-valid:-top-2 peer-valid:text-xs peer-valid:text-gray-700
            `,children:g}),p&&t.jsx("div",{className:"absolute right-3 top-1/2 -translate-y-1/2 text-gray-500",children:p}),N&&!f&&t.jsx("ul",{className:"absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg",children:b.length>0?b.map((e,o)=>t.jsx("li",{className:"cursor-pointer px-4 py-2 hover:bg-blue-100 text-black text-sm",onMouseDown:d=>{d.preventDefault(),S(e)},children:e.label},o)):t.jsx("li",{className:"px-4 py-2 text-sm text-gray-500",children:"No results found"})})]}),n&&t.jsx("p",{className:"mt-1 text-xs text-red-500",children:n.message??n})]})});C.displayName="Select";export{C as S};
