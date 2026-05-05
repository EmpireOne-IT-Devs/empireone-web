import React, { useEffect } from "react";
import PreEmploymentChecklistSection from "./_sections/pre-employment-check-list-section";
import StepperSection from "./_sections/stepper-section";
import ConfidentialityAndNonCompetitionAgreementSection from "./_sections/confidentiality-and-non-competition-agreement-section";
import AttendancePolicySection from "./_sections/attendance-policy-section";
import CertificationOfUseAndServiceOfElectronicDataAndElectronicDataSignatureSection from "./_sections/certification-of-use-and-service-of-electronic-data-and-electronic-data-signature-section";
import CodeOfConductAndDisciplineSection from "./_sections/code-of-conduct-and-discipline-section";
import AcknowledgmentOfCodeOfConductAndDisciplineSection from "./_sections/acknowledgment-of-code-of-conduct-and-discipline-section";
import HouseRulesAndRegulationsGeneralRulesSection from "./_sections/house-rules-and-regulations-general-rules-section";
import MobilePhoneAndDressCodePolicySection from "./_sections/mobile-phone-and-dress-code-policy-section";
import JobDescriptionFormSection from "./_sections/job-description-form-section";
import LockerPolicyAndAgreementSection from "./_sections/locker-policy-and-agreement-section";
import OnboardingChecklistSection from "./_sections/onboarding-checklist-section";
import { useSelector } from "react-redux";
import store from "@/app/store/store";
import { get_user_by_id_thunk } from "@/app/redux/app-thunk";
import VerifySection from "../_sections/verify-section";

export default function Page() {
    const { user } = useSelector((store) => store.app);
    const user_id = window.location.pathname.split("/")[3];
    useEffect(() => {
        store.dispatch(get_user_by_id_thunk(user_id));
    }, []);

    const steps = [
        {
            id: 1,
            title: "Pre Employment Checklist",
            content: <PreEmploymentChecklistSection />,
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
        {
            id: 9,
            title: "Job Description Form",
            content: <JobDescriptionFormSection />,
        },
        {
            id: 10,
            title: "Locker Policy and Agreement",
            content: <LockerPolicyAndAgreementSection />,
        },
        {
            id: 11,
            title: "Onboarding Checklist",
            content: <OnboardingChecklistSection />,
        },
    ];
    function verified_section() {
        if (user?.account_employee?.signature == undefined) {
        } else if (user?.account_employee?.signature == null) {
            return (
                user?.account_employee?.signature == null && <VerifySection />
            );
        } else if (user?.account_employee?.signature != null) {
            return <StepperSection steps={steps} />;
        }
    }
    return <>{verified_section()}</>;
}
