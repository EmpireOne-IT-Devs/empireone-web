import{r as i,j as t}from"./app-Bu_08r8m.js";import{x as u}from"./index-Q9XVrGNw.js";import c from"./open-job-posting-aTZ-aNfc.js";import"./iconBase-CmXisG3a.js";function m({props_data:b}){const[e,r]=i.useState(!1),a=i.useRef(null),l=n=>{n.stopPropagation(),r(o=>!o)};return i.useEffect(()=>{const n=s=>{a.current&&!a.current.contains(s.target)&&r(!1)},o=s=>{s.key==="Escape"&&r(!1)};return e&&(document.addEventListener("mousedown",n),document.addEventListener("keydown",o)),()=>{document.removeEventListener("mousedown",n),document.removeEventListener("keydown",o)}},[e]),t.jsxs("div",{className:"relative inline-block text-left",ref:a,children:[t.jsx("button",{type:"button",onClick:l,"aria-expanded":e,"aria-haspopup":"true",className:`
                    relative p-2 rounded-full transition-all duration-150 outline-none
                    hover:bg-black/5 active:bg-black/10
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600
                    ${e?"bg-black/10":""}
                `,children:t.jsx(u,{size:20})}),t.jsxs("div",{className:`
                    absolute right-0 top-full mt-1 min-w-[200px] py-1.5 bg-white rounded-md z-[9999]
                    shadow-[0px_5px_5px_-3px_rgba(0,0,0,0.2),0px_8px_10px_1px_rgba(0,0,0,0.14),0px_3px_14px_2px_rgba(0,0,0,0.12)]
                    transform transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top-right
                    ${e?"opacity-100 scale-100 translate-y-0 pointer-events-auto":"opacity-0 scale-95 -translate-y-2 pointer-events-none"}
                `,children:[t.jsx("div",{className:`\r
                        w-full hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors duration-150\r
                        [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-gray-800\r
                    `,children:t.jsx("div",{className:"group flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors",children:t.jsx(c,{})})}),t.jsx("div",{className:`\r
                        w-full hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors duration-150\r
                        [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-gray-800\r
                    `}),t.jsx("div",{className:`\r
                        w-full hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors duration-150\r
                        [&>button]:w-full [&>button]:px-4 [&>button]:py-2.5 [&>button]:flex [&>button]:items-center [&>button]:gap-3 [&>button]:text-left [&>button]:text-sm [&>button]:font-normal [&>button]:text-gray-800\r
                    `})]})]})}export{m as default};
