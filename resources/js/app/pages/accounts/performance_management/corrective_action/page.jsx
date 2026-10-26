import React, { useEffect } from 'react'
import PerformanceManagementLayout from './../layout'
import CreateCorrectiveActionSection from './_sections/create-corrective-action-section'
import store from '@/app/store/store'
import TableSection from './_sections/table-section'
export default function Page() {

    return (
        <PerformanceManagementLayout>
            <div className='w-full flex items-center justify-end'>
                <CreateCorrectiveActionSection />
            </div>
            <TableSection />
        </PerformanceManagementLayout>
    )
}
