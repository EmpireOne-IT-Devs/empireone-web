import React, { useEffect } from 'react'
import PerformanceManagementLayout from './../layout'
import store from '@/app/store/store'
import { get_my_team_thunk } from '@/app/redux/department-thunk'
import TableSection from './_sections/table-section'
export default function Page() {

    useEffect(()=>{
        store.dispatch(get_my_team_thunk())
    },[])
    return (
        <PerformanceManagementLayout>
            <TableSection />
        </PerformanceManagementLayout>
    )
}
