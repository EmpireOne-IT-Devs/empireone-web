import React from 'react';

const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
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
  );
};

export default Table;
