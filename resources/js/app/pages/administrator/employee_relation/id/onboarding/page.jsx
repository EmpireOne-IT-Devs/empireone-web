import React from "react";
import PreEmploymentChecklist from "./_sections/pre-employment-requirements-section";
import StepperSection from "./_sections/stepper-section";
import ConfidentialityAndNonCompetitionAgreementSection from "./_sections/confidentiality-and-non-competition-agreement-section";
import AttendancePolicySection from "./_sections/attendance-policy-section";
import CertificationOfUseAndServiceOfElectronicDataAndElectronicDataSignatureSection from "./_sections/certification-of-use-and-service-of-electronic-data-and-electronic-data-signature-section";
import CodeOfConductAndDisciplineSection from "./_sections/code-of-conduct-and-discipline-section";

export default function Page() {
    const steps = [
        {
            id: 1,
            title: "Pre Employment Checklist",
            content: <PreEmploymentChecklist />,
        },
        {
            id: 2,
            title: "Confidentiality and Non-Competition Agreement",
            content: <ConfidentialityAndNonCompetitionAgreementSection />,
        },

        {
            id: 3,
            title: "Attendance Policy",
            content: <AttendancePolicySection />,
        },
         {
            id: 4,
            title: "Certification of Use and Service of Electronic Data and Electronic Data Signature",
            content: <CertificationOfUseAndServiceOfElectronicDataAndElectronicDataSignatureSection />,
        },
       {
            id: 5,
            title: "Code of Conduct and Discipline",
            content: <CodeOfConductAndDisciplineSection />,
        },
        { id: 6, title: "Review", content: "Confirm your details" },
    ];
    return (
        <div>
            <StepperSection steps={steps} />
        </div>
    );
}
