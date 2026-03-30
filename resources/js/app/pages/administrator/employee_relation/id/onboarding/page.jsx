import React from "react";
import PreEmploymentChecklist from "./_sections/pre-employment-requirements-section";
import StepperSection from "./_sections/stepper-section";
import ConfidentialityAndNonCompetitionAgreementSection from "./_sections/confidentiality-and-non-competition-agreement-section";
import AttendancePolicySection from "./_sections/attendance-policy-section";
import CertificationOfUseAndServiceOfElectronicDataAndElectronicDataSignatureSection from "./_sections/certification-of-use-and-service-of-electronic-data-and-electronic-data-signature-section";
import CodeOfConductAndDisciplineSection from "./_sections/code-of-conduct-and-discipline-section";
import AcknowledgmentOfCodeOfConductAndDisciplineSection from "./_sections/acknowledgment-of-code-of-conduct-and-discipline-section";
import HouseRulesAndRegulationsGeneralRulesSection from "./_sections/house-rules-and-regulations-general-rules-section";
import MobilePhoneAndDressCodePolicySection from "./_sections/mobile-phone-and-dress-code-policy-section";

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
            content: (
                <CertificationOfUseAndServiceOfElectronicDataAndElectronicDataSignatureSection />
            ),
        },
        {
            id: 5,
            title: "Code of Conduct and Discipline",
            content: <CodeOfConductAndDisciplineSection />,
        },
        {
            id: 6,
            title: "Acknowledgment of Code of Conduct and Discipline",
            content: <AcknowledgmentOfCodeOfConductAndDisciplineSection />,
        },
        {
            id: 7,
            title: "House Rules and Regulations - General Rules",
            content: <HouseRulesAndRegulationsGeneralRulesSection />,
        },
        {
            id: 8,
            title: "Mobile Phone and Dress Code Policy",
            content: <MobilePhoneAndDressCodePolicySection />,
        },
        { id: 9, title: "Review", content: "Confirm your details" },
    ];
    return (
        <div>
            <StepperSection steps={steps} />
        </div>
    );
}
