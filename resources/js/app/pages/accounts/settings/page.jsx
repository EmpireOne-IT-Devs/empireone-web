import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import Layout from "../layout";
import EmployeeTest from "./sections/employee-test";

import useCurrentEmployee from "@/app/_hooks/use-current-employee";
export default function Page({ mustVerifyEmail, status }) {
    const { isReady, isContentManager } = useCurrentEmployee();
    return (
        <Layout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profile Settings" />
            <div>
                <div className="space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div> */}
                </div>
            </div>
            {!isReady ? (
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
                    <div className="h-40 animate-pulse rounded-lg bg-gray-200" />
                </div>
            ) : (
                isContentManager && (
                    <div>
                        <EmployeeTest />
                    </div>
                )
            )}
        </Layout>
    );
}
