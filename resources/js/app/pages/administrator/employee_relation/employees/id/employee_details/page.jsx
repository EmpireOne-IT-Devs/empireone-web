import React, { useEffect } from "react";
import { Mail, Phone, Edit2, ChevronDown } from "lucide-react";
import EmployeeLayout from "../layout";
import Layout from "../../../../layout";
import { useSelector } from "react-redux";
import moment from "moment";

const Page = () => {
    const { user } = useSelector((store) => store.app);
    console.log("userssssss", user);
    return (
        <Layout>
            <EmployeeLayout>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information Card */}
                    <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
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
                                    <h4 className="text-xl font-bold flex gap-1">
                                        <div>
                                            {
                                                user?.personal_information
                                                    ?.first_name
                                            }
                                        </div>
                                        <div>
                                            {
                                                user?.personal_information
                                                    ?.middle_name
                                            }
                                        </div>
                                        <div>
                                            {
                                                user?.personal_information
                                                    ?.last_name
                                            }
                                        </div>
                                    </h4>
                                    <p className="text-gray-400 text-sm">
                                        {user?.account_employee?.employee_id}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                        <span>
                                            ♂{" "}
                                            {user?.personal_information?.gender}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail size={14} /> {user?.account_employee?.eogs_email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone size={14} />
                                        {user?.personal_information?.contact}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 flex-1 gap-y-4 text-sm self-center">
                                <div>
                                    <p className="text-gray-500">
                                        Place of birth
                                    </p>
                                    <p className="font-medium">
                                        {
                                            user?.personal_information
                                                ?.birth_place
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Birth date</p>
                                    <p className="font-medium">
                                        {
                                            user?.personal_information
                                                ?.date_of_birth
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Age</p>
                                    <p className="font-medium">
                                        {moment().diff(
                                            user?.personal_information
                                                ?.date_of_birth,
                                            "years",
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">
                                        Marital Status
                                    </p>
                                    <p className="font-medium">
                                        {
                                            user?.personal_information
                                                ?.marital_status
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Card */}
                    <Card title="Address">
                        <div className="space-y-4 text-sm">
                            <div className="flex gap-3 w-full">
                                <p className="flex-none text-gray-500">
                                    Residential address:
                                </p>

                                <div className="flex flex-1 w-full gap-2 flex-wrap">
                                    <span>
                                        {user?.personal_information?.street}
                                    </span>
                                    <span>
                                        {user?.personal_information?.barangay}
                                    </span>
                                    <span>
                                        {user?.personal_information?.city}
                                    </span>
                                    <span>
                                        {user?.personal_information?.province}
                                    </span>
                                    <span>
                                        {user?.personal_information?.zip_code}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Emergency Contact Card */}
                    <Card title="Emergency contact">
                        <div className="space-y-4 text-sm">
                            <div className="flex">
                                <p className="w-1/3 text-gray-500">Name</p>
                                <p className="w-2/3 font-medium">
                                    {user?.personal_information?.contact_name}
                                </p>
                            </div>
                            <div className="flex">
                                <p className="w-1/3 text-gray-500">
                                    Relationship
                                </p>
                                <p className="w-2/3 font-medium">
                                    {
                                        user?.personal_information
                                            ?.contact_relationship
                                    }
                                </p>
                            </div>
                            <div className="flex">
                                <p className="w-1/3 text-gray-500">
                                    Phone number
                                </p>
                                <p className="w-2/3 font-medium">
                                    {user?.personal_information?.contact_number}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card title="Education">
                        <div className="space-y-6 w-96">
                            <EducationItem
                                degree={user?.personal_information?.school_name}
                                major={user?.personal_information?.course}
                                gpa={
                                    user?.personal_information
                                        ?.highest_level_of_education
                                }
                                year={
                                    user?.personal_information?.year_graduated
                                }
                            />
                        </div>
                    </Card>

                    {/* Education Card */}
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
