import React, { useEffect } from 'react';
import Layout from "./layout";
import store from '@/app/store/store';
import { get_location_thunk } from '@/app/redux/app-thunk';
import { useSelector } from 'react-redux';
import { router } from '@inertiajs/react';
import { MapPin, ChevronRight, ChevronLeft, LifeBuoy } from 'lucide-react';

export default function LocationPage() {
    const { locations = [] } = useSelector((store) => store.app);

    useEffect(() => {
        store.dispatch(get_location_thunk());
    }, []);

    return (
        <Layout>
            <div className="min-h-[85vh] bg-gray-50 flex flex-col">
                <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 flex flex-col">

                    {/* Breadcrumb */}
                    <button
                        type="button"
                        onClick={() => router.visit('/talent/application')}
                        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to application
                    </button>

                    {/* Header row */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-6 mb-6 border-b border-gray-200">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 uppercase tracking-wide mb-2">
                                <span>Step 1 of 3</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                                Choose your location
                            </h1>
                            <p className="mt-1.5 text-sm sm:text-base text-gray-500 max-w-xl">
                                Select the office nearest to you. Your application will be routed to the local hiring team.
                            </p>
                        </div>

                        <div className="flex-shrink-0 text-sm text-gray-500 sm:text-right">
                            <span className="font-semibold text-gray-900">{locations.length}</span>
                            {' '}location{locations.length !== 1 ? 's' : ''} available
                        </div>
                    </div>

                    {/* Empty state */}
                    {locations.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white border border-gray-200 rounded-xl">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                <MapPin className="w-5 h-5 text-gray-400" />
                            </div>
                            <p className="text-gray-700 font-medium text-sm">No locations available</p>
                            <p className="text-gray-500 text-sm mt-1">Please check back shortly, or contact support below.</p>
                        </div>
                    )}

                    {/* Location grid */}
                    {locations.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {locations.map((loc) => (
                                <button
                                    key={loc.id}
                                    type="button"
                                    onClick={() => router.visit(`/talent/application/${loc.id}`)}
                                    className="
                                        group relative flex items-start gap-4
                                        bg-white rounded-xl border border-gray-200
                                        p-5 text-left
                                        shadow-sm
                                        transition-all duration-150 ease-out
                                        hover:border-indigo-300 hover:shadow-md
                                        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                                    "
                                >
                                    {/* Left accent bar */}
                                    <span className="
                                        absolute left-0 top-0 h-full w-1 rounded-l-xl bg-transparent
                                        group-hover:bg-indigo-600 transition-colors duration-150
                                    " />

                                    <div className="
                                        flex-shrink-0 w-10 h-10 rounded-lg
                                        bg-indigo-50 text-indigo-600 flex items-center justify-center
                                        group-hover:bg-indigo-600 group-hover:text-white
                                        transition-colors duration-150
                                    ">
                                        <MapPin className="w-5 h-5" strokeWidth={2} />
                                    </div>

                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <h2 className="text-sm font-semibold text-gray-900 truncate">
                                            {loc.name}
                                        </h2>
                                        {loc.address && (
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {loc.address}
                                            </p>
                                        )}
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Select location
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Footer help — pushed to bottom via mt-auto */}
                      {/* Footer help — pushed to bottom via mt-auto */}
                    <div className="mt-auto pt-6 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-500">
                        <LifeBuoy className="w-4 h-4" />
                        <span>
                            Powered by: <span className="font-medium text-gray-700">EmpireOneCx</span>
                        </span>
                    </div>
                </div>
            </div>
        </Layout>
    );
}