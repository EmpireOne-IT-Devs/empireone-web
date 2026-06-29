<<<<<<<< HEAD:public/build/assets/talent-acquisition-thunk-fQJ-NBss.js
import{c as i}from"./job-requisition-service-D7kLi3cG.js";import{N as a}from"./app-C6UbSLC1.js";async function s(){return(await axios.get("/api/job/job_applicant_schedules")).data}function r(){return async function(t,n){const e=await s();t(a.actions.setSchedules(e.data))}}function u(){return async function(t,n){const e=await i();t(a.actions.setInterviews(e.data))}}export{r as a,u as g};
========
import{c as i}from"./job-requisition-service-C7HIFq-Y.js";import{N as a}from"./app-CoIlDueg.js";async function s(){return(await axios.get("/api/job/job_applicant_schedules")).data}function r(){return async function(t,n){const e=await s();t(a.actions.setSchedules(e.data))}}function u(){return async function(t,n){const e=await i();t(a.actions.setInterviews(e.data))}}export{r as a,u as g};
>>>>>>>> 3f2ae3cbe389b7d9f06326390434b5ca890a344b:public/build/assets/talent-acquisition-thunk-rwk75m-v.js
