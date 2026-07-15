import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    PDFViewer,
} from "@react-pdf/renderer";
import PDFLoader from "@/app/_components/pdf-loader";

// ── Styles exactly matching PreEmploymentChecklist ───────────────────────────
const styles = StyleSheet.create({
    page: {
        paddingTop: 50,
        paddingBottom: 50,
        paddingLeft: 60,
        paddingRight: 60,
        fontFamily: "Times-Roman",
        fontSize: 10,
    },

    // Header
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    logoContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 450,
        height: 130,
        objectFit: "contain",
    },
    title: {
        textAlign: "center",
        fontSize: 13,
        fontFamily: "Times-Bold",
        marginBottom: 20,
        marginTop: 10,
    },

    // Input fields (Name, Date of Orientation, Position)
    inputGroup: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "flex-end",
    },
    label: {
        fontFamily: "Times-Bold",
        marginRight: 5,
        fontSize: 10,
    },
    line: {
        flexGrow: 1,
        borderBottomWidth: 1,
        borderBottomColor: "black",
    },

    // Checklist items
    checklistItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    checkbox: {
        width: 12,
        height: 12,
        border: "1px solid black",
        marginRight: 10,
        flexShrink: 0,
    },
    checklistText: {
        fontFamily: "Times-Roman",
        fontSize: 10,
    },

    // Items with a line after the label
    checklistItemWithLine: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 10,
    },
    checklistLineLabel: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        marginRight: 5,
    },
    checklistLine: {
        width: 120,
        borderBottomWidth: 1,
        borderBottomColor: "black",
    },

    // Disclaimer
    disclaimerBlock: {
        marginTop: "auto",
        paddingTop: 10,
    },
    disclaimerTitle: {
        fontSize: 8,
        fontFamily: "Times-Bold",
        marginBottom: 2,
    },
    disclaimerText: {
        fontSize: 8,
        fontFamily: "Times-Italic",
        lineHeight: 1.2,
    },
});

// ── Reusable checkbox row ────────────────────────────────────────────────────
const CheckItem = ({ label, hasLine = false, lineWidth = 120 }) => {
    if (hasLine) {
        return (
            <View style={styles.checklistItemWithLine}>
                <View style={styles.checkbox} />
                <Text style={styles.checklistLineLabel}>{label}</Text>
                <View style={{ ...styles.checklistLine, width: lineWidth }} />
            </View>
        );
    }
    return (
        <View style={styles.checklistItem}>
            <View style={styles.checkbox} />
            <Text style={styles.checklistText}>{label}</Text>
        </View>
    );
};

// ── PDF Document ─────────────────────────────────────────────────────────────
const OnboardingDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} src="/images/Blogo (1).png" />
                </View>
            </View>

            {/* Name / Date / Position fields */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Name:</Text>
                <View style={styles.line} />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Orientation:</Text>
                <View style={styles.line} />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Position:</Text>
                <View style={styles.line} />
            </View>

            {/* Title */}
            <Text style={styles.title}>ONBOARDING CHECKLIST</Text>

            {/* Checklist Items */}
            <CheckItem label="EOGS Email" hasLine lineWidth={120} />
            <CheckItem label="Employee ID" hasLine lineWidth={120} />
            <CheckItem label="WhatsApp Account" hasLine lineWidth={100} />
            <CheckItem label="BDO Account" hasLine lineWidth={110} />
            <CheckItem label="Employment Contract" />
            <CheckItem label="Job Offer" />
            <CheckItem label="Job Description" />
            <CheckItem label="Training Agreement" />
            <CheckItem label="General House Rules" />
            <CheckItem label="Attendance Policy" />
            <CheckItem label="Mobile Phone and Dress Code Policy" />
            <CheckItem label="Locker Policy" />
            <CheckItem label="Fraud Policy" />
            <CheckItem label="Confidentiality and Non-Competition Agreement" />
            <CheckItem label="Certification of Use and Service of Electronic Data and Electronic Signature" />
            <CheckItem label="COCD Acknowledgement" />

            {/* Footer Disclaimer */}
            <View style={styles.disclaimerBlock}>
                <Text style={styles.disclaimerTitle}>Disclaimer:</Text>
                <Text style={styles.disclaimerText}>
                    This document and its contents are the property of EmpireOne
                    BPO Solutions, Inc. and are intended for internal use only.
                    Unauthorized reproduction, disclosure, or distribution of
                    this material, in whole or in part, without prior written
                    permission from the company is strictly prohibited.
                </Text>
            </View>
        </Page>
    </Document>
);

// ── Web Wrapper ───────────────────────────────────────────────────────────────
export default function OnboardingChecklistSection() {
    return (
     <PDFLoader pdf={<OnboardingDocument />} />
    );
}
