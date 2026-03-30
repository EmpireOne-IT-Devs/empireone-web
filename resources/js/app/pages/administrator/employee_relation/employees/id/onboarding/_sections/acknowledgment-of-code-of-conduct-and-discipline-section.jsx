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

// Styles mirrored from PreEmploymentChecklist
const styles = StyleSheet.create({
    page: {
        paddingTop: 50,
        paddingBottom: 50,
        paddingLeft: 60,
        paddingRight: 60,
        fontFamily: "Times-Roman",
        fontSize: 10,
    },
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
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 20,
        fontFamily: "Times-Bold",
    },
    body: {
        fontSize: 10,
        fontFamily: "Times-Roman",
        lineHeight: 1.6,
        textAlign: "justify",
    },
    paragraph: {
        marginBottom: 14,
        textAlign: "justify",
    },
    bold: {
        fontFamily: "Times-Bold",
    },
    underline: {
        textDecoration: "underline",
        fontFamily: "Times-Bold",
    },
    signatureSection: {
        marginTop: 30,
    },
    signatureRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 10,
    },
    signatureLabel: {
        fontFamily: "Times-Bold",
        fontSize: 10,
        marginRight: 5,
    },
    signatureLine: {
        flexGrow: 1,
        borderBottomWidth: 1,
        borderBottomColor: "black",
    },
    witnessSection: {
        marginTop: 30,
    },
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
    blankLine: {
        height: 14,
    },
});

const AcknowledgmentDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header - identical to PreEmploymentChecklist */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} src="/images/Blogo (1).png" />
                </View>
                <Text style={styles.title}>
                    ACKNOWLEDGMENT OF CODE OF CONDUCT AND DISCIPLINE (COCD)
                </Text>
            </View>

            {/* Body */}
            <View style={styles.body}>
                {/* Opening line with blank name field */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                        marginBottom: 14,
                    }}
                >
                    <Text>I, </Text>
                    <View
                        style={{
                            width: 180,
                            borderBottomWidth: 1,
                            borderBottomColor: "black",
                            height: 12,
                        }}
                    />
                    <Text>
                        , hereby acknowledge that I have attended the HR
                    </Text>
                </View>
                <View style={{ ...styles.paragraph, marginTop: -10 }}>
                    <Text>
                        Orientation conducted on{" "}
                        <Text style={styles.bold}>February 27, 2026</Text>, at{" "}
                        <Text style={styles.bold}>
                            EmpireOne Building, S. Carmona St., San Carlos City,
                            Negros Occidental
                        </Text>
                        .
                    </Text>
                </View>

                {/* Paragraph 2 */}
                <View style={styles.paragraph}>
                    <Text>
                        During the orientation, the{" "}
                        <Text style={styles.bold}>
                            Code of Conduct and Discipline (COCD)
                        </Text>{" "}
                        of{" "}
                        <Text style={styles.bold}>
                            EmpireOne BPO Solutions Inc.
                        </Text>{" "}
                        was thoroughly discussed and explained to me. I confirm
                        that I have received, read, and fully understood the
                        provisions, policies, and guidelines contained in the
                        COCD.
                    </Text>
                </View>

                {/* Paragraph 3 */}
                <View style={styles.paragraph}>
                    <Text>
                        I understand that the COCD outlines the professional
                        behavior, ethical standards, and disciplinary procedures
                        expected of me as an employee of EmpireOne. I
                        acknowledge my responsibility to comply with all the
                        policies stated therein and understand the consequences
                        of any violations.
                    </Text>
                </View>

                {/* Paragraph 4 */}
                <View style={styles.paragraph}>
                    <Text>
                        By signing this acknowledgement, I agree to adhere to
                        the COCD at all times and recognize that it forms an
                        integral part of the company's rules and regulations,
                        which I am expected to follow throughout the duration of
                        my employment.
                    </Text>
                </View>

                {/* Employee Signature Block */}
                <View style={styles.signatureSection}>
                    <View style={styles.signatureRow}>
                        <Text style={styles.signatureLabel}>
                            Employee Full Name (Printed):
                        </Text>
                        <View style={styles.signatureLine} />
                    </View>
                    <View style={styles.signatureRow}>
                        <Text style={styles.signatureLabel}>Signature:</Text>
                        <View
                            style={{ ...styles.signatureLine, maxWidth: 220 }}
                        />
                    </View>
                    <View style={styles.signatureRow}>
                        <Text style={styles.signatureLabel}>Date Signed:</Text>
                        <View
                            style={{ ...styles.signatureLine, maxWidth: 220 }}
                        />
                    </View>
                </View>

                {/* Witness Block */}
                <View style={styles.witnessSection}>
                    <View style={styles.signatureRow}>
                        <Text style={styles.signatureLabel}>
                            Witnessed by (HR Representative):
                        </Text>
                        <View style={styles.signatureLine} />
                    </View>
                    <View style={styles.signatureRow}>
                        <Text style={styles.signatureLabel}>Signature:</Text>
                        <View
                            style={{ ...styles.signatureLine, maxWidth: 220 }}
                        />
                    </View>
                    <View style={styles.signatureRow}>
                        <Text style={styles.signatureLabel}>Date:</Text>
                        <View
                            style={{ ...styles.signatureLine, maxWidth: 220 }}
                        />
                    </View>
                </View>
            </View>

            {/* Footer Disclaimer - identical to PreEmploymentChecklist */}
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

// Web Wrapper Component
const AcknowledgmentOfCodeOfConductAndDisciplineSection = () => {
    return (
           <PDFLoader pdf={<AcknowledgmentDocument />} />
    );
};

export default AcknowledgmentOfCodeOfConductAndDisciplineSection;
