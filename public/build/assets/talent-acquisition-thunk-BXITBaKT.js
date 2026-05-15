<<<<<<<< HEAD:public/build/assets/talent-acquisition-thunk-CTuxzY3D.js
import{b as i}from"./job-requisition-service-Dt_a3ehB.js";import{w as a}from"./app-Dkh-cg7x.js";async function s(){return(await axios.get("/api/job/job_applicant_schedules")).data}function r(){return async function(t,n){const e=await s();t(a.actions.setSchedules(e.data))}}function u(){return async function(t,n){const e=await i();t(a.actions.setInterviews(e.data))}}export{r as a,u as g};
========
import{b as i}from"./job-requisition-service-DpA4egEc.js";import{v as a}from"./app-DjYmpiqR.js";async function s(){return(await axios.get("/api/job/job_applicant_schedules")).data}function r(){return async function(t,n){const e=await s();t(a.actions.setSchedules(e.data))}}function u(){return async function(t,n){const e=await i();t(a.actions.setInterviews(e.data))}}export{r as a,u as g};
>>>>>>>> 0644bd035c967f8210f589c34f8fc352ef0ae8d1:public/build/assets/talent-acquisition-thunk-BXITBaKT.js
