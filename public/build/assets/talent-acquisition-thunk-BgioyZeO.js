<<<<<<<< HEAD:public/build/assets/talent-acquisition-thunk-QDsyvw7V.js
import{c as i}from"./job-requisition-service-CBAvMlUB.js";import{D as a}from"./app-ByRRWV1Q.js";async function s(){return(await axios.get("/api/job/job_applicant_schedules")).data}function r(){return async function(t,n){const e=await s();t(a.actions.setSchedules(e.data))}}function u(){return async function(t,n){const e=await i();t(a.actions.setInterviews(e.data))}}export{r as a,u as g};
========
import{c as i}from"./job-requisition-service-rUxVbh_k.js";import{N as a}from"./app-RDg_UBxH.js";async function s(){return(await axios.get("/api/job/job_applicant_schedules")).data}function r(){return async function(t,n){const e=await s();t(a.actions.setSchedules(e.data))}}function u(){return async function(t,n){const e=await i();t(a.actions.setInterviews(e.data))}}export{r as a,u as g};
>>>>>>>> 9517ab5676fd8d983f1f1b62c5118a88efd0f7a0:public/build/assets/talent-acquisition-thunk-BgioyZeO.js
