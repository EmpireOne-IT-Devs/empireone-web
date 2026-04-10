<<<<<<< HEAD:public/build/assets/job-requisition-thunk-BdxPvGz_.js
import{f as t,v as s}from"./app-ykE7iJsp.js";async function r(i){return await t.post("/api/job/requisitions",i)}async function u(i){return await t.post("/api/job/approve_job_requisition",i)}async function a(){return(await t.get(`/api/job/requisitions${window.location.search}`)).data}function c(){return async function(i,e){const o=await a();i(s.actions.setJobRequisitions(o.data)),i(s.actions.setStats(o.stats))}}export{u as a,r as c,c as g};
=======
<<<<<<<< HEAD:public/build/assets/job-requisition-thunk-R7Q6lXxV.js
import{f as t,v as s}from"./app-DXvfVoFy.js";async function r(i){return await t.post("/api/job/requisitions",i)}async function u(i){return await t.post("/api/job/approve_job_requisition",i)}async function a(){return(await t.get(`/api/job/requisitions${window.location.search}`)).data}function c(){return async function(i,e){const o=await a();i(s.actions.setJobRequisitions(o.data)),i(s.actions.setStats(o.stats))}}export{u as a,r as c,c as g};
========
import{f as t,v as s}from"./app-D2Xb7bAV.js";async function r(i){return await t.post("/api/job/requisitions",i)}async function u(i){return await t.post("/api/job/approve_job_requisition",i)}async function a(){return(await t.get(`/api/job/requisitions${window.location.search}`)).data}function c(){return async function(i,e){const o=await a();i(s.actions.setJobRequisitions(o.data)),i(s.actions.setStats(o.stats))}}export{u as a,r as c,c as g};
>>>>>>>> b8a9feccc75346b65c38fc7d3764430d8a71d0c3:public/build/assets/job-requisition-thunk-C_IlyY82.js
>>>>>>> 31d483b4a85a4fee4fe861f019205d87bda5b889:public/build/assets/job-requisition-thunk-C_IlyY82.js
