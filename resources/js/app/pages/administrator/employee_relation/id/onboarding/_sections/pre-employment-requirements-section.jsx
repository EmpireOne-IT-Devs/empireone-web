import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    PDFViewer,
    BlobProvider,
} from "@react-pdf/renderer";
import PDFLoader from "@/app/_components/pdf-loader";

// Define styles
const styles = StyleSheet.create({
    page: {
        paddingTop: 50,
        paddingBottom: 50,
        paddingLeft: 60,
        paddingRight: 60,
        fontFamily: "Times-Roman",
        fontSize: 10,
        height: "50vh",
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    logoPlaceholder: {
        border: "1px solid #00529B",
        padding: 10,
        borderRadius: 5,
        color: "#00529B",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    title: {
        textAlign: "center",
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 20,
        fontFamily: "Times-Bold",
    },
    inputGroup: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "flex-end",
    },
    label: {
        fontFamily: "Times-Roman",
        marginRight: 5,
    },
    line: {
        flexGrow: 1,
        borderBottomWidth: 1,
        borderBottomColor: "black",
    },
    instruction: {
        marginTop: 15,
        marginBottom: 25,
    },
    section: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    listColumn: {
        width: "65%",
    },
    remarksColumn: {
        width: "30%",
    },
    sectionHeader: {
        fontFamily: "Times-Bold",
        textDecoration: "underline",
        marginBottom: 10,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 4,
    },
    bullet: {
        width: 15,
        textAlign: "center",
    },
    listItemText: {
        flex: 1,
    },
    indentedText: {
        marginLeft: 15,
        marginBottom: 4,
    },
    remarksLine: {
        borderBottomWidth: 1,
        borderBottomColor: "black",
        height: 14,
        marginBottom: 4,
    },
    bold: {
        fontFamily: "Times-Bold",
    },
    originalHeader: {
        fontFamily: "Times-Bold",
        textDecoration: "underline",
        marginTop: 15,
        marginBottom: 10,
    },
    footerList: {
        marginTop: 15,
        marginBottom: 30,
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
});

// The actual PDF Document Layout
const ChecklistDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} src="/images/Blogo (1).png" />
                </View>
                <Text style={styles.title}>PRE-EMPLOYMENT CHECKLIST</Text>
            </View>

            {/* Applicant Info */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Applicant:</Text>
                <View style={styles.line} />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Department:</Text>
                <View style={styles.line} />
                <Text style={{ ...styles.label, marginLeft: 15 }}>
                    Position:
                </Text>
                <View style={{ ...styles.line, width: 100, flexGrow: 0 }} />
            </View>

            <Text style={styles.instruction}>
                Please enclose the following in a{" "}
                <Text style={styles.bold}>long, brown envelope</Text>
            </Text>

            {/* Main Two-Column Layout */}
            <View style={styles.section}>
                {/* Left Column - The Checklist */}
                <View style={styles.listColumn}>
                    <Text style={styles.sectionHeader}>PHOTOCOPY</Text>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listItemText}>
                            Birth certificate (2 copies)
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listItemText}>
                            SSS Form E1/SSS ID
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listItemText}>
                            TIN ID/Number (1901 form)
                        </Text>
                    </View>
                    <View style={{ height: 15 }} />
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listItemText}>
                            Certificate of Employment from the previous employer
                            (optional)
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listItemText}>
                            Phil Health MDR/ID
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listItemText}>
                            PAG-IBIG Number/ID
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listItemText}>
                            Photocopy of Driver's License (if applicable)
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listItemText}>
                            SSS &amp; PAG-IBIG Loan Voucher (if applicable)
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listItemText}>
                            Marriage Contract (if married)
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listItemText}>
                            Birth Certificates of Dependents (1 copy each)
                        </Text>
                    </View>
                    <Text style={styles.indentedText}>
                        if Married- spouse &amp; children; if Single- parents
                    </Text>
                    <Text style={styles.originalHeader}>
                        ORIGINAL COPY (must be prioritized)
                    </Text>
                    <Text style={{ marginBottom: 4 }}>Barangay Clearance</Text>
                    <Text style={{ marginBottom: 4 }}>Police Clearance</Text>
                    <Text style={{ marginBottom: 4 }}>NBI Clearance</Text>
                    <Text
                        style={{
                            ...styles.bold,
                            marginTop: 10,
                            marginBottom: 4,
                        }}
                    >
                        Health Certificate with the ff tests:
                    </Text>
                    <Text style={{ marginBottom: 4 }}>Chest X-ray</Text>
                    <Text style={{ marginBottom: 4 }}>Drug Test</Text>
                    <Text
                        style={{
                            ...styles.bold,
                            marginTop: 10,
                            marginBottom: 4,
                        }}
                    >
                        Colored pictures
                    </Text>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listItemText}>2x2 – 2 pcs</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.listItemText}>1x1 – 1 pc</Text>
                    </View>
                    <View style={styles.footerList}>
                        <Text style={{ marginBottom: 4 }}>WHATSAPP</Text>
                        <Text>KOMO APP</Text>
                    </View>
                </View>

                {/* Right Column - Remarks Lines */}
                <View style={styles.remarksColumn}>
                    <Text
                        style={{ ...styles.sectionHeader, textAlign: "center" }}
                    >
                        REMARKS
                    </Text>
                    {/* Group 1 */}
                    <View style={styles.remarksLine} />
                    <View style={styles.remarksLine} />
                    <View style={styles.remarksLine} />
                    <View style={{ height: 15 }} />
                    {/* Group 2 */}
                    <View style={styles.remarksLine} />
                    <View style={styles.remarksLine} />
                    <View style={styles.remarksLine} />
                    <View style={styles.remarksLine} />
                    <View style={styles.remarksLine} />
                    <View style={styles.remarksLine} />
                    <View style={{ ...styles.remarksLine, marginTop: 14 }} />
                    <View style={{ height: 40 }} />
                    {/* Group 3 */}
                    <View style={styles.remarksLine} />
                    <View style={styles.remarksLine} />
                    <View style={{ height: 25 }} />
                    {/* Group 4 */}
                    <View style={styles.remarksLine} />
                    <View style={styles.remarksLine} />
                    <View style={{ height: 15 }} />
                    {/* Group 5 */}
                    <View style={styles.remarksLine} />
                    <View style={styles.remarksLine} />
                </View>
            </View>

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

// Web Wrapper Component
const PreEmploymentChecklist = () => {
    return (
        <div style={{ width: "100vw", height: "88vh", margin: 0, padding: 0 }}>
            <PDFLoader pdf={<ChecklistDocument />} />
        </div>
    );
};

export default PreEmploymentChecklist;
