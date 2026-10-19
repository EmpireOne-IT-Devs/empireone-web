import React, { useEffect } from 'react'
import PerformanceManagementLayout from './../layout'
import store from '@/app/store/store'
import { get_reach_specific_leader_thunk } from '@/app/redux/employee-relation-thunk'
import TableSection from './_sections/table-section'
export default function Page() {

    useEffect(()=>{
        store.dispatch(get_reach_specific_leader_thunk())
    },[])
  return (
    <PerformanceManagementLayout>
        <TableSection />
    </PerformanceManagementLayout>
  )
}
