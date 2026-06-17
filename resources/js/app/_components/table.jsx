import React from 'react';

const Table = ({ columns, data }) => {
    return (
        <div className="w-full">
            {/* Mobile View: Card Layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
                {data?.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className="bg-white border border-gray-300 shadow-sm rounded-lg p-4 space-y-3"
                    >
                        {columns?.map((col, colIndex) => (
                            <div key={colIndex} className="flex justify-between items-start text-sm">
                                <span className="font-semibold text-purple-700 mr-4">
                                    {col.header}
                                </span>
                                <span className="text-gray-800 text-right">
                                    {row[col.accessor]}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Desktop View: Standard Table Layout */}
            <div className="hidden md:block overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-300 shadow-sm">
                    <thead className="bg-purple-100">
                        <tr>
                            {columns?.map((col, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-sm font-medium text-purple-700 uppercase tracking-wider"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data?.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="px-6 py-3 text-sm text-gray-800">
                                        {row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;