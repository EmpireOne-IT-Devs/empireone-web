import React from 'react';
import { Download } from 'lucide-react';

export default function ExportApplicantSection() {
    return (
        <div className="w-full py-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-5 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">

                {/* Text Description */}
                <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-bold text-gray-800">Export Applicant Data</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Download a complete CSV report of all applicants, including their contact info and pipeline statuses.
                    </p>
                </div>

                {/* Export Action Button */}
                {/* Using a standard <a> tag instead of <Link> so the browser handles the file download natively */}
                <a
                    href={`/api/job/export_applicant_csv${window.location.search}`}
                    className="
                        inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white 
                        px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 
                        shadow-sm hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap
                    "
                >
                    <Download size={18} strokeWidth={2.5} />
                    Export CSV
                </a>

            </div>
        </div>
    );
}