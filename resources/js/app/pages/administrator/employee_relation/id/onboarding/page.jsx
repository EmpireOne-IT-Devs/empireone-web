import React from "react";
import PreEmploymentChecklist from "./_sections/pre-employment-requirements-section";
import StepperSection from "./_sections/stepper-section";
import ConfidentialityAndNonCompetitionAgreementSection from "./_sections/confidentiality-and-non-competition-agreement-section";

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
        { id: 3, title: "Profile", content: <PreEmploymentChecklist /> },
        { id: 4, title: "Billing", content: "Setup your payment method" },
        { id: 5, title: "Review", content: "Confirm your details" },
    ];
    return (
        <div>
            <StepperSection steps={steps} />
        </div>
    );
}
