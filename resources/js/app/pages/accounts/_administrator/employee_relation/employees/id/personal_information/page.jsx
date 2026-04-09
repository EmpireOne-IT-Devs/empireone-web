import React, { useEffect } from "react";
import { Mail, Phone } from "lucide-react";
import EmployeeLayout from "../layout";
import Layout from "../../../../../layout";
import { useSelector } from "react-redux";
import moment from "moment";
import { QRCodeSVG } from "qrcode.react";

const Page = () => {
    const { user } = useSelector((store) => store.app);
    console.log("User Data:", user);

    return (
        <Layout>
            <EmployeeLayout>
                {/* Fixed Grid: Changed to 3 columns to properly support a col-span-2 main card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Basic Information Card */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
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
                                <div className="space-y-1 text-center md:text-left">
                                    <h4 className="text-xl font-bold flex gap-1 justify-center md:justify-start">
                                        <span>
                                            {
                                                user?.personal_information
                                                    ?.first_name
                                            }
                                        </span>
                                        <span>
                                            {
                                                user?.personal_information
                                                    ?.middle_name
                                            }
                                        </span>
                                        <span>
                                            {
                                                user?.personal_information
                                                    ?.last_name
                                            }
                                        </span>
                                    </h4>
                                    <p className="text-gray-400 text-sm">
                                        {user?.account_employee?.employee_id}
                                    </p>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600 mt-2">
                                        <span>
                                            ♂{" "}
                                            {user?.personal_information?.gender}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600">
                                        <Mail size={14} />
                                        {user?.account_employee?.eogs_email}
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600">
                                        <Mail size={14} /> {user?.email}
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600">
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
                                        {user?.personal_information
                                            ?.date_of_birth
                                            ? moment().diff(
                                                  user?.personal_information
                                                      ?.date_of_birth,
                                                  "years",
                                              )
                                            : ""}
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

                    {/* Right Column / Sidebar Cards */}
                    <div className="space-y-6">
                        {/* Address Card */}
                        <Card title="Address">
                            <div className="space-y-4 text-sm">
                                <div className="flex flex-col gap-2 w-full">
                                    <p className="flex-none text-gray-500">
                                        Residential address:
                                    </p>
                                    <div className="flex flex-1 w-full gap-1 flex-wrap font-medium">
                                        <span>
                                            {user?.personal_information?.street}
                                            ,
                                        </span>
                                        <span>
                                            {
                                                user?.personal_information
                                                    ?.barangay
                                            }
                                            ,
                                        </span>
                                        <span>
                                            {user?.personal_information?.city},
                                        </span>
                                        <span>
                                            {
                                                user?.personal_information
                                                    ?.province
                                            }
                                        </span>
                                        <span>
                                            {
                                                user?.personal_information
                                                    ?.zip_code
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Emergency Contact Card */}
                        <Card title="Emergency contact">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <p className="text-gray-500">Name</p>
                                    <p className="font-medium">
                                        {
                                            user?.personal_information
                                                ?.contact_name
                                        }
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-500">
                                        Relationship
                                    </p>
                                    <p className="font-medium">
                                        {
                                            user?.personal_information
                                                ?.contact_relationship
                                        }
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-500">Phone</p>
                                    <p className="font-medium">
                                        {
                                            user?.personal_information
                                                ?.contact_number
                                        }
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Bottom Row Cards */}
                    <Card title="Education">
                        <div className="space-y-4">
                            <TimelineItem
                                title={user?.personal_information?.school_name}
                                subtitle={user?.personal_information?.course}
                                metaText={
                                    user?.personal_information
                                        ?.highest_level_of_education
                                        ? `Level: ${user?.personal_information?.highest_level_of_education}`
                                        : null
                                }
                                dateText={
                                    user?.personal_information?.year_graduated
                                }
                                isLast={true}
                            />
                        </div>
                    </Card>

                    <Card title="Skills">
                        <div className="space-y-4">
                            {user?.skills?.map((res, index) => (
                                <TimelineItem
                                    key={index} // Added Key to fix React warning
                                    title={res.skill}
                                    subtitle={`Proficiency: ${res.percentage}%`}
                                    isLast={index === user.skills.length - 1}
                                />
                            ))}
                        </div>
                    </Card>

                    <Card title="Working Experiences">
                        <div className="space-y-4">
                            {user?.working_experience?.map((res, index) => (
                                <TimelineItem
                                    key={index} // Added Key to fix React warning
                                    title={res.company_name}
                                    subtitle={res.position}
                                    metaText={res.job_description}
                                    dateText={`${res.start_date} to ${res.end_date}`}
                                    isLast={
                                        index ===
                                        user.working_experience.length - 1
                                    }
                                />
                            ))}
                        </div>
                    </Card>
                    <Card title="Government Information">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <p className="text-gray-500">
                                    Government ID Type
                                </p>
                                <p className="font-medium">
                                    {
                                        user?.personal_information
                                            ?.government_type
                                    }
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-500">ID Number</p>
                                <p className="font-medium">
                                    {user?.personal_information?.id_number}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-500">SSS</p>
                                <p className="font-medium">
                                    {user?.personal_information?.sss}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-500">PhilHealth</p>
                                <p className="font-medium">
                                    {user?.personal_information?.philhealth}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-500">Pag-Ibig</p>
                                <p className="font-medium">
                                    {user?.personal_information?.pagibig}
                                </p>
                            </div>
                            <div className="flex justify-between">
                                <p className="text-gray-500">TIN #</p>
                                <p className="font-medium">
                                    {user?.personal_information?.tin}
                                </p>
                            </div>
                        </div>
                    </Card>
                    <Card title="QR Code">
                        <QRCodeSVG
                            className="w-full"
                            value={user?.account_employee?.employee_id}
                            size={256} // Width and height in pixels
                            bgColor={"#ffffff"} // Background color
                            fgColor={"#000000"} // Foreground (QR code) color
                            level={"H"} // Error correction level (L, M, Q, H)
                        />
                    </Card>
                    <Card title="E-Signature">
                        <img src={user?.account_employee?.signature} />
                    </Card>
                </div>
            </EmployeeLayout>
        </Layout>
    );
};

// Reusable Components
const Card = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative ">
        <h3 className="text-lg font-bold mb-6">{title}</h3>
        {children}
    </div>
);

// Renamed from EducationItem to TimelineItem for generic reusability
const TimelineItem = ({ title, subtitle, metaText, dateText, isLast }) => (
    <div className="relative pl-6 pb-2">
        {!isLast && (
            <div className="absolute left-[3px] top-2 w-[2px] h-full bg-gray-200"></div>
        )}
        <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-blue-500"></div>

        <p className="font-bold text-sm text-gray-800">{title}</p>
        {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
        {metaText && <p className="text-gray-500 text-xs mt-1">{metaText}</p>}
        {dateText && (
            <p className="text-blue-500 font-medium text-xs mt-1">{dateText}</p>
        )}
    </div>
);

export default Page;
