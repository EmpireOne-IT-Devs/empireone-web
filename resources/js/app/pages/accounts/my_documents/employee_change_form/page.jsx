import React, { useEffect } from 'react'
import EmployeeChangeFormSection from './_sections/change-form-section'
import store from '@/app/store/store'
import { get_employee_change_form_by_id_thunk } from '@/app/redux/employee-relation-thunk'
import AcceptChangeForm from './_sections/accept-change-form'
import { useSelector } from 'react-redux'

export default function Page() {

    const { ecf } = useSelector((store) => store.human_resources);
    useEffect(() => {
        store.dispatch(get_employee_change_form_by_id_thunk(window.location.pathname.split('/')[3]))
    }, [])
    return (
        <div>
            <EmployeeChangeFormSection />
            {
                ecf?.status == 'Pending' && <AcceptChangeForm />
            }
        </div>
    )
}
