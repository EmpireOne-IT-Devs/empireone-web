import React from "react";
import Layout from "../layout";
import UserManagementSection from "./sections/user-management-section";
import DepartmentTableSection from "./sections/department-table-section";

export default function Page() {
    return (
        <Layout>
            <UserManagementSection />
        </Layout>
    );
}
