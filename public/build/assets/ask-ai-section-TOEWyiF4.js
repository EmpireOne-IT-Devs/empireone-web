import{r,j as e}from"./app-DRwQZIML.js";import{g,s as j,k as N}from"./index-CU53xbaT.js";import{I as _}from"./index-mtkICSgp.js";import{g as $}from"./human-resources-service-CEHyoSeg.js";import"./iconBase-DdVJFqph.js";function R(){const[o,b]=r.useState(!1),[l,m]=r.useState(""),[i,x]=r.useState(!1),[f,c]=r.useState([{role:"ai",text:"Hi there! How can I help you today?"}]),d=r.useRef(null),u=r.useRef(null),h=()=>b(!o);r.useEffect(()=>{o&&d.current&&setTimeout(()=>d.current.focus(),100)},[o]),r.useEffect(()=>{u.current&&u.current.scrollIntoView({behavior:"smooth"})},[f,i]);const y=s=>{if(s?.offenses&&s.offenses.length>0){const a=s.offenses.map((t,n)=>{const p=t.sanctions_ladder?`
  - 1st: ${t.sanctions_ladder["1st"]||"N/A"}
  - 2nd: ${t.sanctions_ladder["2nd"]||"N/A"}
  - 3rd: ${t.sanctions_ladder["3rd"]||"N/A"}
  - 4th: ${t.sanctions_ladder["4th"]||"N/A"}`:"";return`📌 [Offense ${n+1}] Section ${t.section_number}
Group: ${t.classification_group}
Clearing Period: ${t.clearing_period||"N/A"}
Violation: ${t.code_of_discipline_section}
Recommended Penalty: ${t.recommended_penalty}
Sanctions Ladder:${p}
Explanation: ${t.specific_violation_explanation}`}).join(`

-------------------------

`);return`⚠️ Found ${s.total_offenses_detected} Offense(s) Detected:

${a}

⚖️ Highest Penalty Rule:
${s.highest_penalty_rule}

📋 Due Process Protocol:
${s.due_process_protocol}`}return s?.reply||s?.message||"No infractions detected for the submitted description."},w=async s=>{s.preventDefault();const a=l.trim();if(a){c(t=>[...t,{role:"user",text:a}]),m(""),x(!0);try{const t=await $({description_of_infraction:a});console.log("messages",t);const n=t?.data!==void 0?t.data:t,p=y(n);c(v=>[...v,{role:"ai",text:p}])}catch(t){console.error("AI Error:",t),c(n=>[...n,{role:"ai",text:"Sorry, I encountered an error processing your request. Please try again."}])}finally{x(!1)}}};return e.jsxs("div",{className:"fixed bottom-6 right-6 z-50 w-12 flex flex-col items-end",children:[e.jsxs("div",{className:`
                    mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden 
                    origin-bottom-right transition-all duration-300 ease-out flex flex-col
                    ${o?"opacity-100 scale-100 translate-y-0 pointer-events-auto h-[500px]":"opacity-0 scale-90 translate-y-8 pointer-events-none h-0"}
                `,children:[e.jsxs("div",{className:"bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white shrink-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(_,{size:20,className:"text-purple-200"}),e.jsx("h3",{className:"font-semibold text-sm",children:"Ask AI For Code of Conduct"})]}),e.jsx("button",{onClick:h,className:"hover:bg-white/20 p-1.5 rounded-full transition-colors","aria-label":"Close",children:e.jsx(g,{size:18})})]}),e.jsxs("div",{className:"p-4 flex-1 overflow-y-auto bg-slate-50 flex flex-col gap-3",children:[f.map((s,a)=>e.jsx("div",{className:`p-3 rounded-lg shadow-sm border max-w-[85%] ${s.role==="user"?"bg-purple-600 text-white self-end rounded-tr-none border-purple-700":"bg-white text-slate-700 border-slate-100 self-start rounded-tl-none"}`,children:e.jsx("p",{className:"text-sm whitespace-pre-wrap leading-relaxed break-words font-sans",children:s.text})},a)),i&&e.jsxs("div",{className:"bg-white p-4 rounded-lg shadow-sm border border-slate-100 self-start rounded-tl-none flex gap-1.5 items-center",children:[e.jsx("div",{className:"w-2 h-2 bg-slate-400 rounded-full animate-bounce"}),e.jsx("div",{className:"w-2 h-2 bg-slate-400 rounded-full animate-bounce",style:{animationDelay:"0.15s"}}),e.jsx("div",{className:"w-2 h-2 bg-slate-400 rounded-full animate-bounce",style:{animationDelay:"0.3s"}})]}),e.jsx("div",{ref:u})]}),e.jsxs("form",{onSubmit:w,className:"p-3 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0",children:[e.jsx("input",{ref:d,type:"text",value:l,onChange:s=>m(s.target.value),placeholder:"Describe an infraction or scenario...",disabled:i,className:"flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-full px-4 py-2 text-sm outline-none transition-all placeholder:text-slate-400 text-slate-700 disabled:opacity-50"}),e.jsx("button",{type:"submit",disabled:!l.trim()||i,className:"bg-purple-600 text-white p-2.5 rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 transition-colors shadow-sm",children:e.jsx(j,{size:16})})]})]}),e.jsxs("button",{onClick:h,className:`
                    flex items-center justify-center p-4 rounded-full shadow-lg hover:shadow-xl 
                    transition-all duration-300 transform hover:-translate-y-1 relative
                    ${o?"bg-slate-800 text-white hover:bg-slate-700":"bg-gradient-to-r from-indigo-600 to-purple-600 text-white"}
                `,"aria-label":"Toggle AI Chat",children:[e.jsx("div",{className:`transition-all duration-300 absolute ${o?"scale-100 rotate-0 opacity-100":"scale-50 -rotate-90 opacity-0"}`,children:e.jsx(g,{size:26})}),e.jsx("div",{className:`transition-all duration-300 ${o?"scale-50 rotate-90 opacity-0":"scale-100 rotate-0 opacity-100"}`,children:e.jsx(N,{size:26})})]})]})}export{R as default};
