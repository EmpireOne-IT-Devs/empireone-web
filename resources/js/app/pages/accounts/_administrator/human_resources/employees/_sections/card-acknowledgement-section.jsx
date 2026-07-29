import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  Eye, 
  FileText, 
  User, 
  Mail, 
  Building, 
  Briefcase, 
  MapPin 
} from 'lucide-react';

export default function CardAcknowledgementSection() {
  const { employees } = useSelector((store) => store.human_resources);
  
  // Track open/collapsed state for policy sub-items per employee card
  const [openItems, setOpenItems] = useState({});

  const toggleAccordion = (employeeId, ackId) => {
    const key = `${employeeId}-${ackId}`;
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex bg-gray-100 p-6 gap-6 flex-wrap w-full justify-start">
      {employees?.data?.map((res) => {
        const empId = res.id || res.employee_id;
        
        return (
          <div
            key={empId}
            className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.15rem)] max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-5 text-sm"
          >
            {/* Top Employee Info Section */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                  Employee Details
                </span>
                <span className="font-mono text-xs font-bold text-gray-500">
                  #{res?.employee_id || 'N/A'}
                </span>
              </div>

              {/* Fullname */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-purple-600" /> Fullname
                </span>
                <span className="font-semibold text-gray-900">
                  {res?.user?.name || res?.personal_information?.first_name || 'N/A'}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-purple-600" /> Email
                </span>
                <span className="text-gray-900 font-medium truncate max-w-[180px]" title={res?.user?.email || res?.eogs_email}>
                  {res?.user?.email || res?.eogs_email || 'N/A'}
                </span>
              </div>

              {/* Department */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-purple-600" /> Department
                </span>
                <span className="text-gray-900 font-medium">
                  {res?.department?.name || 'N/A'}
                </span>
              </div>

              {/* Account */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-purple-600" /> Account
                </span>
                <span className="text-gray-900 font-medium">
                  {res?.account?.name || res?.account || 'N/A'}
                </span>
              </div>

              {/* Site */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-purple-600" /> Site
                </span>
                <span className="text-gray-900 font-medium">
                  {res?.site?.name || 'San Carlos City'}
                </span>
              </div>
            </div>

            {/* Acknowledgements Section */}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Document Acknowledgements
              </span>

              {res?.acknowledgements?.length > 0 ? (
                res?.acknowledgements?.map((ress) => {
                  const hasSubItems = ress?.items && ress?.items?.length > 0;
                  const accordionKey = `${empId}-${ress.id}`;
                  const isOpen = !!openItems[accordionKey];

                  return (
                    <div 
                      key={ress.id} 
                      className="flex flex-col bg-slate-50 border border-slate-200/80 rounded-xl p-3 transition-all"
                    >
                      {/* Main Acknowledgement Title Header */}
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-700" />
                          <span className="font-semibold text-gray-800 text-sm">
                            {ress.title}
                          </span>
                        </div>

                        {/* Status Badge OR Accordion Toggle Button */}
                        {hasSubItems ? (
                          <button
                            onClick={() => toggleAccordion(empId, ress.id)}
                            className="flex items-center gap-1 text-xs font-medium text-purple-700 hover:text-purple-900 bg-purple-100/70 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <span>{ress.items.length} Sub-policies</span>
                            {/* Rotating Arrow Icon Animation */}
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </motion.div>
                          </button>
                        ) : (
                          <StatusBadge isDone={ress?.is_already_acknowledged} />
                        )}
                      </div>

                      {/* Animated Sub-items Dropdown Accordion */}
                      <AnimatePresence initial={false}>
                        {hasSubItems && isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-col gap-2 pl-2">
                              {ress.items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-xs py-1">
                                  <span className="text-gray-600 font-medium flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                                    {item?.title}
                                  </span>
                                  <StatusBadge isDone={item?.is_already_acknowledged} size="sm" />
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-3 text-xs text-gray-400 bg-slate-50 rounded-lg border border-dashed border-gray-200">
                  No documents assigned
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
              <button 
                onClick={() => alert(`Viewing details for ${res?.user?.name || 'Employee'}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
              >
                <Eye className="w-3.5 h-3.5" /> View Profile
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}

// Helper Badge Component
function StatusBadge({ isDone, size = 'md' }) {
  if (isDone) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md ${size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}`}>
        <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} /> Done
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-md ${size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}`}>
      <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} /> Incomplete
    </span>
  );
}