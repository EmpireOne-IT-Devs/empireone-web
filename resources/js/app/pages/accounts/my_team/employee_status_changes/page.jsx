import React, { useEffect } from "react";
import EmployeeRelationLayout from "../../layout";
import EmployeeMovementsLayout from "../layout";
import EmployeeChangeFormSection from "./_sections/employee-change-form-section";

export default function Page() {
    return (
        <EmployeeRelationLayout>
            <div className="py-3">
                <EmployeeMovementsLayout>
                   <EmployeeChangeFormSection />
                </EmployeeMovementsLayout>
            </div>
        </EmployeeRelationLayout>
    );
}
