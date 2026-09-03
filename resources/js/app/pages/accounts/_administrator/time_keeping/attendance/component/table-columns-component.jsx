import React from "react";

export default function TableColumnsComponent({ column_name }) {
    return (
        <>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {column_name}
            </th>
        </>
    );
}
