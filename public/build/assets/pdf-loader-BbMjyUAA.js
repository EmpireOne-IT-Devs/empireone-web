import{a as o,j as e,g as l}from"./app-CEXBUoC3.js";import{B as c}from"./react-pdf.browser-DhFeT4In.js";function m({pdf:t,width:i="sm:w-[80vw]"}){const r=o();return e.jsx("div",{className:`w-screen ${i} h-screen m-0 p-0`,children:e.jsx(c,{document:t,children:({url:n,loading:s,error:a})=>(r(l(s)),s?e.jsxs("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",height:"100%",gap:"16px",fontFamily:"system-ui, -apple-system, sans-serif"},children:[e.jsxs("svg",{width:"40",height:"40",viewBox:"0 0 50 50",style:{animation:"spin 1s linear infinite"},children:[e.jsx("circle",{cx:"25",cy:"25",r:"20",fill:"none",strokeWidth:"5",stroke:"#e5e7eb"}),e.jsx("circle",{cx:"25",cy:"25",r:"20",fill:"none",strokeWidth:"5",stroke:"#00529B",strokeDasharray:"31.4 100",strokeLinecap:"round"})]}),e.jsx("p",{style:{animation:"pulse 1.5s ease-in-out infinite",color:"#4b5563",margin:0,fontWeight:500},children:"Generating PDF, please wait..."}),e.jsx("style",{children:`
            @keyframes spin {
                100% { transform: rotate(360deg); }
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `})]}):a?e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%"},children:e.jsx("p",{children:"Error generating PDF. Please try again."})}):e.jsx("iframe",{src:n,style:{width:"100%",height:"100%",border:"none"},title:"Pre-Employment Checklist PDF"}))})})}export{m as P};
