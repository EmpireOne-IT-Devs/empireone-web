import React, { useEffect } from 'react';
import Layout from "./layout";
import store from '@/app/store/store';
import { get_location_thunk } from '@/app/redux/app-thunk';
import { useSelector } from 'react-redux';
import { router } from '@inertiajs/react';

export default function LocationPage() {
    const { locations = [] } = useSelector((store) => store.app);

    useEffect(() => {
        store.dispatch(get_location_thunk());
    }, []);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-8 font-sans min-h-[85vh]">
                <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
                    Choose Your Location
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {locations.map((loc) => {
                        return (
                            <div
                                key={loc.id}
                                onClick={() => router.visit(`/talent/application/${loc.id}`)}
                                // Added 'group' to control child elements on hover
                                className="
                                    group cursor-pointer p-6 rounded-2xl border-2 border-gray-200 bg-white 
                                    transition-all duration-300 ease-in-out flex flex-col items-center justify-center text-center 
                                    min-h-[160px] max-h-[200px] hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg hover:-translate-y-1 hover:scale-105
                                "
                            >
                                <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                                    📍
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-700">
                                    {loc.name}
                                </h2>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}