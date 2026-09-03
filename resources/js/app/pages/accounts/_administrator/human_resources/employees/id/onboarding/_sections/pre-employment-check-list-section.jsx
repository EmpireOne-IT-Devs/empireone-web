import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import PDFLoader from "@/app/_components/pdf-loader";

// Register custom standard fonts or use default sans-serif/Helvetica for clean rendering
const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 50,
        paddingRight: 50,
        fontFamily: "Helvetica",
        fontSize: 9,
    },
    headerContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: 160,
        height: 50,
        objectFit: "contain",
        marginBottom: 25,
    },
    title: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        textAlign: "center",
        letterSpacing: 0.5,
        marginBottom: 25,
    },
    // Table Styles
    table: {
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#000000",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000000",
        minHeight: 18,
        alignItems: "center",
    },
    tableRowNoBorder: {
        flexDirection: "row",
        borderBottomWidth: 0,
        minHeight: 18,
        alignItems: "center",
    },
    colLeft: {
        width: "78%",
        borderRightWidth: 1,
        borderRightColor: "#000000",
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 3,
        paddingBottom: 3,
        justifyContent: "center",
    },
    colRight: {
        width: "22%",
        paddingLeft: 4,
        paddingRight: 4,
        paddingTop: 3,
        paddingBottom: 3,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTextLeft: {
        fontFamily: "Helvetica-Bold",
        fontSize: 10,
        textAlign: "center",
    },
    headerTextRightTop: {
        fontFamily: "Helvetica-Bold",
        fontSize: 9,
        textAlign: "center",
    },
    headerTextRightSub: {
        fontFamily: "Helvetica",
        fontSize: 8,
        textAlign: "center",
    },
    cellText: {
        fontFamily: "Helvetica",
        fontSize: 9,
    },
    cellTextIndent: {
        fontFamily: "Helvetica",
        fontSize: 9,
        paddingLeft: 30,
    },
    noteContainer: {
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 12,
        paddingRight: 12,
    },
    noteText: {
        fontFamily: "Helvetica-Oblique",
        fontSize: 6.5,
        textAlign: "center",
        lineHeight: 1.2,
    },
    bold: {
        fontFamily: "Helvetica-Bold",
    },
    // Footer Disclaimer
    disclaimerBlock: {
        marginTop: "auto",
        paddingTop: 20,
    },
    disclaimerTitle: {
        fontSize: 7.5,
        fontFamily: "Times-Bold",
        marginBottom: 2,
    },
    disclaimerText: {
        fontSize: 7,
        fontFamily: "Times-Italic",
        lineHeight: 1.2,
    },
});

// The updated PDF Document Layout
const ChecklistDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Logo Header */}
            <View style={styles.headerContainer}>
                <Image style={styles.logo} src="/images/E1CXlogo.png" />
                <Text style={styles.title}>PRE-EMPLOYMENT REQUIREMENTS CHECKLIST</Text>
            </View>

            {/* Table */}
            <View style={styles.table}>
                {/* Header Row */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.headerTextLeft}>LIST OF REQUIREMENTS</Text>
                    </View>
                    <View style={styles.colRight}>
                        <Text style={styles.headerTextRightTop}>STATUS</Text>
                        <Text style={styles.headerTextRightSub}>Done / Pending</Text>
                    </View>
                </View>

                {/* Row 1: Basic 5 */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellText}>
                            Basic 5 Pre-Employment Medical Examination - LOE will be provided by EmpireOne
                        </Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                {/* Sub items */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellTextIndent}>Physical Examination</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellTextIndent}>Complete Blood Count (CBC)</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellTextIndent}>Urinalysis</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellTextIndent}>Fecalysis</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellTextIndent}>Chest X-ray</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellTextIndent}>Drug Test</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                {/* Proof of Education */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellText}>Proof of Education (TOR/Diploma)</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                {/* NBI/Police Clearance */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellText}>NBI/Police Clearance (Original)</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                {/* Note Row */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <View style={styles.noteContainer}>
                            <Text style={styles.noteText}>
                                If you already have a valid <Text style={styles.bold}>NBI Clearance</Text>, there is <Text style={styles.bold}>no need to secure a Police Clearance</Text>.
                            </Text>
                            <Text style={styles.noteText}>
                                However, if you only have a <Text style={styles.bold}>Police Clearance</Text>, you are still required to obtain and submit an <Text style={styles.bold}>NBI Clearance</Text>, as this is a mandatory requirement.
                            </Text>
                        </View>
                    </View>
                    <View style={styles.colRight} />
                </View>

                {/* Barangay Clearance */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellText}>Barangay Clearance (Original)</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                {/* Valid ID */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellText}>Copy of Valid ID</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                {/* 2x2 ID Picture */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellText}>2x2 ID Picture (white background)</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                {/* PSA Birth Certificate */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellText}>PSA Birth Certificate (Photocopy)</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                {/* SSS Number */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellText}>SSS Number (E-1/E-4/1902/1905/2316)</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                {/* PhilHealth ID */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellText}>PhilHealthID/ MDR</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                {/* Pag-IBIG MDF */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellText}>Pag-IBIG MDF/ ID (HDMF Number)</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                {/* TIN ID */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellText}>TIN ID / BIR Form 1902</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                {/* COE */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellText}>Certificate of Employment (from latest employer)</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                {/* Marriage Certificate */}
                <View style={styles.tableRow}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellText}>Photocopy of Marriage Certificate (if married)</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>

                {/* Loan Voucher (Last row without bottom border) */}
                <View style={styles.tableRowNoBorder}>
                    <View style={styles.colLeft}>
                        <Text style={styles.cellText}>SSS &amp; PAG-IBIG Loan Voucher (if applicable)</Text>
                    </View>
                    <View style={styles.colRight} />
                </View>
            </View>

            {/* Footer Disclaimer */}
            <View style={styles.disclaimerBlock}>
                <Text style={styles.disclaimerTitle}>Disclaimer:</Text>
                <Text style={styles.disclaimerText}>
                    This document and its contents are the property of <Text style={{ fontFamily: "Times-BoldItalic" }}>EmpireOne BPO Solutions, Inc.</Text> and are intended for internal use only. Unauthorized reproduction, disclosure, or distribution of this material, in whole or in part, without prior written permission from the company is strictly prohibited.
                </Text>
            </View>
        </Page>
    </Document>
);

// Wrapper Component
const PreEmploymentChecklistSection = () => {
    return <PDFLoader pdf={<ChecklistDocument />} />;
};

export default PreEmploymentChecklistSection;