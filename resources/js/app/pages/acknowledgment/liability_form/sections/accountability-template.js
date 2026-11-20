const v1 = {
    title: "ASSET ACCOUNTABILITY FORM",
    policyTitle: "Physical Security Policy for Issued Assets",
    headers: ["Asset Type", "Brand/Model", "Serial Number", "Condition at Issuance", "Value at the Time of Purchase", "Remarks"],
    fields: ["Complete Employee Name:", "Account/Program:", "Employee #:", "Date of Issue:", "Hire date:", "Location:"],
    categories: ["Laptop", "Mobile Device", "Headset", "Other Equipment", "ID & Lanyard", "Access Badge/RFID"],
    sections: [
        ["1. Ownership and Use", [
            "All assets remain the exclusive property of the company.",
            "Assets are issued for business use only, unless otherwise authorized.",
            "Employees must not transfer, sell, or lend assets to unauthorized persons.",
        ]],
        ["2. Care and Safekeeping", [
            "Employees must exercise reasonable care to prevent damage, loss, or unauthorized access.",
            "Assets must be stored securely when not in use (e.g., locked drawers, secure bags).",
            "Food, liquids, and hazardous materials must be kept away from devices.",
        ]],
        ["3. Loss, Theft, or Damage", [
            "Any incident of loss, theft, or damage must be reported immediately to HR/IT.",
            "In cases of negligence, the employee may be held financially liable for repair or replacement costs, subject to labor law.",
            "Normal wear and tear are exempt from liability.",
        ]],
        ["4. Access Control", [
            "Employees must use company-approved authentication methods (passwords, biometrics, badges).",
            "Sharing of login credentials or bypassing security controls is strictly prohibited.",
            "Devices must be locked when unattended.",
            "Unauthorized software installation or data transfer is prohibited.",
        ]],
        ["5. Reporting to IT", [
            ["Employees must promptly report to IT any:", [
                "Hardware or software malfunction",
                "Security incident (e.g., phishing attempt, malware detection)",
                "Loss, theft, or damage of assets",
            ]],
            "IT will document and investigate reported issues, and employees must cooperate fully.",
        ]],
        ["6. Confidentiality", [
            "Employees must maintain strict confidentiality of company data stored, accessed, or transmitted through issued assets.",
            "Sensitive information must not be copied, transferred, or disclosed without proper authorization.",
            "Any suspected data breach or unauthorized access must be reported immediately to IT.",
        ]],
        ["7. Return and Separation", [
            ["All assets must be returned in good condition upon:", [
                "Resignation or termination",
                "Role change requiring different equipment",
                "Company request",
                "Preventive suspension status, wherein which assets are to be temporarily surrendered during the investigation process",
            ]],
            "A Return & Clearance Form will be completed during offboarding to confirm asset recovery.",
        ]],
        ["8. Inspection and Audit", [
            "The company reserves the right to inspect and audit assets at any time to ensure compliance with security and usage policies.",
            "Employees must cooperate fully during inspections.",
        ]],
    ],
    acknowledgmentTitle: "Acknowledgment",
    acknowledgment: "I, the undersigned, acknowledge receipt of the above-listed company assets and agree to comply with the terms stated in this document, including the physical security policy. I understand that failure to comply may result in accountability measures under company policy and applicable labor regulations.",
    signatureLabel: "SIGNATURE OVER PRINTED NAME",
    dateLabel: "DATE",
    disclaimer: "This document and its contents are the property of EmpireOne BPO Solutions, Inc. and are intended for internal use only. Unauthorized reproduction, disclosure, or distribution of this material, in whole or in part, without prior written permission from the company is strictly prohibited.",
};

const templates = { "asset-accountability-v1": v1 };
export const ACCOUNTABILITY_ASSET_TYPES = v1.categories;
const currency = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", currencyDisplay: "code" });

export function getAccountabilityDocument(form) {
    const template = Object.hasOwn(templates, form.templateVersion) ? templates[form.templateVersion] : null;
    if (!template) return null;

    const { accountProgram, hireDate, location, items } = form.document;
    const values = [form.employeeName, accountProgram, form.employeeNumber, form.issueDate, hireDate, location];
    const formatItem = (item) => [
        item.assetType, item.brandModel, item.serialNumber, item.conditionAtIssuance,
        item.purchaseValue == null ? null : currency.format(item.purchaseValue), item.remarks,
    ];
    const rows = template.categories.flatMap((category) => {
        const matches = items.filter((item) => item.assetType === category);
        return matches.length ? matches.map(formatItem) : [[category, null, null, null, null, null]];
    });

    return { ...template, values, rows };
}
