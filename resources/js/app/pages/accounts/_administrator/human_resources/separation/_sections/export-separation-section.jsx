import React, { useState } from 'react';
import Button from '@/app/_components/button';
import { FiDownload, FiCalendar, FiFilter } from 'react-icons/fi';
import axios from 'axios';

export default function ExportSeparationSection({
    apiUrl = '/api/er/export_separation', // Adjust to your route path
    defaultFilename = 'separation_report.csv',
}) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);

        try {
            const payload = {
                start_date: startDate || null,
                end_date: endDate || null,
                status: status || null,
            };

            const response = await axios.post(apiUrl, payload, {
                responseType: 'blob',
            });

            let downloadFilename = defaultFilename;
            const disposition = response.headers['content-disposition'];
            if (disposition && disposition.indexOf('filename=') !== -1) {
                const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
                if (matches != null && matches[1]) {
                    downloadFilename = matches[1].replace(/['"]/g, '');
                }
            }

            const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', downloadFilename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export separation records. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Status Dropdown */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <FiFilter className="text-gray-400" /> Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Cleared">Cleared</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                {/* Date Range Filters (Separation Date) */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <FiCalendar className="text-gray-400" /> From
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                        <FiCalendar className="text-gray-400" /> To
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                {(startDate || endDate || status) && (
                    <button
                        type="button"
                        onClick={() => {
                            setStartDate('');
                            setEndDate('');
                            setStatus('');
                        }}
                        className="text-xs text-red-500 hover:text-red-700 underline self-end mb-2 transition-colors"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Export Button */}
            <div>
                <Button
                    onClick={handleExport}
                    loading={isExporting}
                    className="flex items-center gap-2"
                >
                    <FiDownload />
                    Export CSV
                </Button>
            </div>
        </div>
    );
}