<<<<<<<< HEAD:public/build/assets/talent-acquisition-thunk-BH9ABXIR.js
import{c as i}from"./job-requisition-service-DegUWtvi.js";import{V as a}from"./app-BcgFT2UZ.js";async function s(){return(await axios.get("/api/job/job_applicant_schedules")).data}function r(){return async function(t,n){const e=await s();t(a.actions.setSchedules(e.data))}}function u(){return async function(t,n){const e=await i();t(a.actions.setInterviews(e.data))}}export{r as a,u as g};
========
import{c as i}from"./job-requisition-service-1AX5cIjs.js";import{_ as a}from"./app-BmrEqltX.js";async function s(){return(await axios.get("/api/job/job_applicant_schedules")).data}function r(){return async function(t,n){const e=await s();t(a.actions.setSchedules(e.data))}}function u(){return async function(t,n){const e=await i();t(a.actions.setInterviews(e.data))}}export{r as a,u as g};
>>>>>>>> origin/HEAD:public/build/assets/talent-acquisition-thunk-CqUTLtT2.js
