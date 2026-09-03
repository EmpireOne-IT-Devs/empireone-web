import React, { useEffect } from 'react'
import Layout from '../layout'
import CreateJobRequisition from '../_administrator/talent_acquisition/job_requisition/_sections/create-requisition-section'
import store from '@/app/store/store';
import { get_job_requisitions_by_user_thunk, get_job_requisitions_thunk } from '@/app/redux/job-requisition-thunk';
import { get_job_interviewer_schedule_thunk } from '@/app/redux/app-thunk';
import HeaderSection from './_sections/header-section';
import JobRequisitionCardSection from '../_administrator/talent_acquisition/job_requisition/_sections/job-requisition-card-section';
import CardSection from '../_administrator/talent_acquisition/job_requisition/_sections/card-section';

export default function Page() {

    useEffect(() => {
        store.dispatch(get_job_requisitions_by_user_thunk());
        store.dispatch(get_job_interviewer_schedule_thunk());
    }, []);

    return (
        <Layout>
            <div className='flex flex-col gap-3'>
                <HeaderSection />
                <CreateJobRequisition />
                <CardSection />
                <JobRequisitionCardSection />
            </div>
        </Layout>
    )
}
