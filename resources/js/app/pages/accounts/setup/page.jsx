import React, { useEffect } from 'react'
import HeaderSection from './_sections/header-section'
import FormSection from './_sections/form-section'
import store from '@/app/store/store';
import { get_app_data_thunk } from '@/app/redux/app-thunk';

export default function Page() {

    useEffect(() => {
        store.dispatch(get_app_data_thunk());
    }, []);
    return (
        <>
            <div className="min-h-screen flex items-start justify-center sm:p-8 font-sans">
                <div className="flex flex-col w-full bg-white overflow-hidden rounded-none shadow-none sm:max-w-xl sm:h-full sm:rounded-[2rem] sm:shadow-2xl">
                    <HeaderSection title="SETUP INFORMATION" />
                    <div className="w-full p-8 sm:p-10 flex flex-col justify-center bg-white z-10">
                        <FormSection />
                    </div>
                </div>
            </div>
        </>
    )
}
