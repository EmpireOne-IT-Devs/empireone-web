import React from "react";
import { Mail, Phone, Edit2, ChevronDown } from "lucide-react";
import EmployeeLayout from "../layout";
import Layout from "../../../../layout";

const Page = () => {
    return (
        <Layout>
            <EmployeeLayout>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information Card */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                        <button className="absolute top-6 right-6 text-gray-400 hover:text-blue-600">
                            <Edit2 size={18} />
                        </button>
                        <h3 className="text-lg font-bold mb-6">
                            Basic information
                        </h3>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex flex-col items-center md:items-start gap-4">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                                    className="w-32 h-32 rounded-full bg-slate-100 object-cover"
                                    alt="Profile"
                                />
                                <div className="space-y-1">
                                    <h4 className="text-xl font-bold">
                                        John Williams
                                    </h4>
                                    <p className="text-gray-400 text-sm">
                                        1210372726433743682
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                        <span>♂ Male</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail size={14} />{" "}
                                        johnwilliams@bicaradata.com
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone size={14} /> 081323323311
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 flex-1 gap-y-4 text-sm self-center">
                                <div>
                                    <p className="text-gray-500">
                                        Place of birth
                                    </p>
                                    <p className="font-medium">Bandung</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Birth date</p>
                                    <p className="font-medium">30 Oct 1994</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Blood type</p>
                                    <p className="font-medium">AB</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">
                                        Marital Status
                                    </p>
                                    <p className="font-medium">Married</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Religion</p>
                                    <p className="font-medium">Christian</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Card */}
                    <Card title="Address">
                        <div className="space-y-4 text-sm">
                            <div className="flex">
                                <p className="w-1/3 text-gray-500">
                                    Citizen ID address
                                </p>
                                <p className="w-2/3">
                                    Jl. Wayang No.2, Burangrang, Kec. Lengkong,
                                    Kota Bandung, Jawa Barat 40262
                                </p>
                            </div>
                            <div className="flex">
                                <p className="w-1/3 text-gray-500">
                                    Residential address
                                </p>
                                <p className="w-2/3">
                                    Jl. Wayang No.2, Burangrang, Kec. Lengkong,
                                    Kota Bandung, Jawa Barat 40262
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Emergency Contact Card */}
                    <Card title="Emergency contact">
                        <div className="space-y-4 text-sm">
                            <div className="flex">
                                <p className="w-1/3 text-gray-500">Name</p>
                                <p className="w-2/3 font-medium">
                                    Olivia Bennett
                                </p>
                            </div>
                            <div className="flex">
                                <p className="w-1/3 text-gray-500">
                                    Relationship
                                </p>
                                <p className="w-2/3 font-medium">Wife</p>
                            </div>
                            <div className="flex">
                                <p className="w-1/3 text-gray-500">
                                    Phone number
                                </p>
                                <p className="w-2/3 font-medium">
                                    081324815250
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Education Card */}
                    <Card title="Education">
                        <div className="space-y-6">
                            <EducationItem
                                degree="Master Degree - Bina Nusantara"
                                major="Business"
                                gpa="3.5"
                                year="2016 - 2018"
                            />
                            <EducationItem
                                degree="Bachelor Degree - Bina Nusantara"
                                major="Business"
                                gpa="3.9"
                                year="2012 - 2016"
                                isLast
                            />
                        </div>
                    </Card>

                    {/* Family Card */}
                    <Card title="Family">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-3 font-semibold text-gray-600">
                                        Family type
                                    </th>
                                    <th className="text-left p-3 font-semibold text-gray-600">
                                        Person name
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="p-3 text-gray-500">
                                        Father
                                    </td>
                                    <td className="p-3">Benjamin Williams</td>
                                </tr>
                                <tr>
                                    <td className="p-3 text-gray-500">
                                        Mother
                                    </td>
                                    <td className="p-3">Evelyn Potts</td>
                                </tr>
                                <tr>
                                    <td className="p-3 text-gray-500">
                                        Siblings
                                    </td>
                                    <td className="p-3">
                                        James Williams
                                        <br />
                                        Emily Williams
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Card>
                </div>
            </EmployeeLayout>
        </Layout>
    );
};

// Reusable Components
const Card = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
        <button className="absolute top-6 right-6 text-gray-400 hover:text-blue-600">
            <Edit2 size={16} />
        </button>
        <h3 className="text-lg font-bold mb-6">{title}</h3>
        {children}
    </div>
);

const EducationItem = ({ degree, major, gpa, year, isLast }) => (
    <div className="relative pl-6">
        {!isLast && (
            <div className="absolute left-[3px] top-2 w-[2px] h-full bg-gray-200"></div>
        )}
        <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-blue-500"></div>
        <p className="font-bold text-sm">{degree}</p>
        <p className="text-gray-600 text-xs">{major}</p>
        <p className="text-gray-400 text-xs">GPA ({gpa})</p>
        <p className="text-gray-400 text-xs mt-1">{year}</p>
    </div>
);

export default Page;
