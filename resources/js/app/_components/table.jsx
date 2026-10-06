import React from 'react';

const Table = ({ columns, data, isloading = false, skeletonRows = 12 }) => {
    // Generate placeholder array for skeleton rows
    const skeletonArray = Array.from({ length: skeletonRows });

    const getValue = (col, row) =>
        col.render ? col.render(row) : row[col.accessor || col.key];

    const isEmpty = !isloading && (!data || data.length === 0);

    return (
        <>
            {/* Mobile View: Card Layout */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:hidden">
                {isloading ? (
                    skeletonArray.map((_, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 shadow-sm rounded-lg p-3 sm:p-4 space-y-3 animate-pulse"
                        >
                            {columns?.map((col, colIndex) => (
                                <div key={colIndex} className="flex justify-between items-center text-sm gap-3 sm:gap-4">
                                    <span className="font-medium text-gray-500 flex items-center gap-1 shrink-0">
                                        {col.header}
                                    </span>
                                    <div className="h-4 bg-gray-200 rounded w-24 max-w-[50%]"></div>
                                </div>
                            ))}
                        </div>
                    ))
                ) : isEmpty ? (
                    <div className="rounded-lg border border-dashed border-gray-200 bg-white py-10 px-4 text-center text-sm text-gray-400">
                        No records found.
                    </div>
                ) : (
                    data?.map((row, rowIndex) => (
                        <div
                            key={row.id || rowIndex}
                            className="bg-white border border-gray-200 shadow-sm rounded-lg p-3 sm:p-4 space-y-3"
                        >
                            {columns?.map((col, colIndex) => (
                                <div key={colIndex} className="flex justify-between items-start text-sm gap-3 sm:gap-4">
                                    <span className="font-medium text-gray-500 flex items-center gap-1 shrink-0 pt-px">
                                        {col.header}
                                    </span>
                                    <span className="text-gray-800 text-right flex flex-wrap items-center justify-end min-w-0 break-words">
                                        {getValue(col, row)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>

            {/* Desktop View: Standard Table Layout */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-500 text-xs font-medium border-b border-gray-200">
                            {columns?.map((col, index) => (
                                <th
                                    key={index}
                                    className={`py-3 px-4 whitespace-nowrap ${col.width || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {isloading ? (
                            skeletonArray.map((_, rowIndex) => (
                                <tr key={rowIndex} className="border-b border-gray-100 animate-pulse">
                                    {columns?.map((_, colIndex) => (
                                        <td key={colIndex} className="py-4 px-4">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : isEmpty ? (
                            <tr>
                                <td
                                    colSpan={columns?.length || 1}
                                    className="py-12 px-4 text-center text-sm text-gray-400"
                                >
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            data?.map((row, rowIndex) => (
                                <tr
                                    key={row.id || rowIndex}
                                    className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors group"
                                >
                                    {columns?.map((col, colIndex) => (
                                        <td key={colIndex} className="py-4 px-4">
                                            {getValue(col, row)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Table;