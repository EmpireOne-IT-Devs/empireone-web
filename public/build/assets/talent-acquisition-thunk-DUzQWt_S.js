<<<<<<<< HEAD:public/build/assets/talent-acquisition-thunk-tgT6JYan.js
import{c as i}from"./job-requisition-service-D07y5gix.js";import{a5 as a}from"./app-DZMAbIuk.js";async function s(){return(await axios.get("/api/job/job_applicant_schedules")).data}function r(){return async function(t,n){const e=await s();t(a.actions.setSchedules(e.data))}}function u(){return async function(t,n){const e=await i();t(a.actions.setInterviews(e.data))}}export{r as a,u as g};
========
import{c as i}from"./job-requisition-service-CdXbt1AJ.js";import{a5 as a}from"./app--oPLbARF.js";async function s(){return(await axios.get("/api/job/job_applicant_schedules")).data}function r(){return async function(t,n){const e=await s();t(a.actions.setSchedules(e.data))}}function u(){return async function(t,n){const e=await i();t(a.actions.setInterviews(e.data))}}export{r as a,u as g};
>>>>>>>> origin/main:public/build/assets/talent-acquisition-thunk-DUzQWt_S.js
