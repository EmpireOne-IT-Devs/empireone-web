import React from 'react';
import { Trash2, Eye } from 'lucide-react';

export default function CardAcknowledgementSection({ acknowledgements = [], employees = [] }) {
  
  // Helper to find employee's status for a specific acknowledgement ID
  const getEmployeeAcknowledgement = (employee, acknowledgementId) => {
    return employee?.acknowledgement_employees?.find(
      (item) => item.e_r_acknowledgement_id === acknowledgementId
    );
  };

  // Helper function to render status badges based on DB record presence
  const renderStatus = (acknowledgementRecord) => {
    if (acknowledgementRecord) {
      return (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap">
          Acknowledged
        </span>
      );
    }
    return (
      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap">
        Missing
      </span>
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-t-lg bg-[#fcfcfc] border border-gray-200 shadow-sm">
      <table className="w-full text-left text-sm min-w-max">
        <thead>
          <tr className="text-gray-800 font-medium border-b border-gray-200 bg-white">
            {/* Standard Employee Detail Headers */}
            <th className="px-4 py-4 align-middle border-r border-gray-100">
              Employee<br />#
            </th>
            <th className="px-4 py-4 align-middle border-r border-gray-100">
              Fullname
            </th>
            <th className="px-4 py-4 align-middle border-r border-gray-100 min-w-[200px]">
              Email
            </th>
            <th className="px-4 py-4 align-middle border-r border-gray-100">
              Department
            </th>
            <th className="px-4 py-4 align-middle border-r border-gray-100">
              Account
            </th>
            <th className="px-4 py-4 align-middle border-r border-gray-100">
              Site
            </th>

            {/* Dynamic Acknowledgement Headers */}
            {acknowledgements.map((ack) => (
              <th
                key={ack.id}
                className="px-4 py-4 align-middle border-r border-gray-100 leading-tight"
              >
                {ack.title}
              </th>
            ))}

            <th className="px-4 py-4 align-middle">
              Action
            </th>
          </tr>
        </thead>
        
        <tbody className="bg-white">
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              {/* Employee Info Columns */}
              <td className="px-4 py-3 border-r border-gray-100 font-medium text-gray-900">
                {employee.employee_number || employee.id}
              </td>
              <td className="px-4 py-3 border-r border-gray-100 whitespace-nowrap">
                {`${employee.first_name || ''} ${employee.last_name || ''}`.trim() || employee.fullname}
              </td>
              <td className="px-4 py-3 border-r border-gray-100 text-gray-500">
                {employee.email}
              </td>
              <td className="px-4 py-3 border-r border-gray-100 whitespace-nowrap">
                {employee.department?.name || employee.department}
              </td>
              <td className="px-4 py-3 border-r border-gray-100 whitespace-nowrap">
                {employee.account?.name || employee.account}
              </td>
              <td className="px-4 py-3 border-r border-gray-100 whitespace-nowrap">
                {employee.site?.name || employee.site}
              </td>

              {/* Dynamic Document Status Columns */}
              {acknowledgements.map((ack) => {
                const record = getEmployeeAcknowledgement(employee, ack.id);
                return (
                  <td key={ack.id} className="px-4 py-3 border-r border-gray-100">
                    {renderStatus(record)}
                  </td>
                );
              })}

              {/* Action Column */}
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button className="flex items-center justify-center border border-blue-600 text-blue-600 px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-blue-50 transition-colors uppercase">
                    <Eye className="w-3.5 h-3.5 mr-1" /> Show
                  </button>
                  <button className="flex items-center justify-center border border-red-500 text-red-500 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}