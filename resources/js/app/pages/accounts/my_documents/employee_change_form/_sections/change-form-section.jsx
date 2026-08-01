import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import moment from "moment";
import PDFLoader from "@/app/_components/pdf-loader";
import { useSelector } from "react-redux";

const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingBottom: 60,
        paddingLeft: 40,
        paddingRight: 40,
        fontFamily: "Times-Roman",
        fontSize: 10,
    },
    // ── Header ──────────────────────────────────────────────────────────────
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        borderBottomWidth: 2,
        borderBottomColor: "#000",
        paddingBottom: 10,
        marginBottom: 15,
    },
    logo: {
        width: 150,
        objectFit: "contain",
    },
    pageTitle: {
        fontSize: 16,
        fontFamily: "Times-Bold",
        textTransform: "uppercase",
    },
    // ── Typography ───────────────────────────────────────────────────────────
    sectionLabel: {
        fontFamily: "Times-Bold",
        fontSize: 11,
        marginBottom: 4,
        marginTop: 2,
        textTransform: "uppercase",
    },
    paragraph: {
        fontSize: 10,
        lineHeight: 1.5,
        marginBottom: 6,
    },
    bold: {
        fontFamily: "Times-Bold",
    },
    italic: {
        fontFamily: "Times-Italic",
    },
    divider: {
        borderTopWidth: 2,
        borderTopColor: "#000",
        marginBottom: 5,
    },
    // ── Tables ───────────────────────────────────────────────────────────────
    table: {
        flexDirection: "column",
        width: "100%",
        borderWidth: 1,
        borderColor: "#000",
        marginBottom: 15,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
    },
    tableRowLast: {
        flexDirection: "row",
    },
    tableHeader: {
        backgroundColor: "#f3f4f6",
        padding: 4,
        fontFamily: "Times-Bold",
        textAlign: "center",
        textTransform: "uppercase",
    },
    colLabel: {
        width: "25%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 4,
        fontFamily: "Times-Bold",
        textTransform: "uppercase",
    },
    colValue: {
        width: "25%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 4,
        textAlign: "center",
    },
    colValueLast: {
        width: "25%",
        padding: 4,
        textAlign: "center",
    },
    colNameValue: {
        width: "75%",
        padding: 4,
        fontFamily: "Times-Bold",
        textTransform: "uppercase",
    },
    // ── Reason For Change Box ────────────────────────────────────────────────
    reasonBox: {
        borderWidth: 1,
        borderColor: "#000",
        padding: 6,
        minHeight: 50,
        width: "100%",
        marginTop: 4,
        marginBottom: 8,
    },
    italicLabel: {
        fontFamily: "Times-Italic",
        fontSize: 9,
        color: "#4b5563",
    },
    // ── Checkboxes ───────────────────────────────────────────────────────────
    checkboxContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 15,
        marginBottom: 10,
    },
    checkboxItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 10,
        height: 10,
        borderWidth: 1,
        borderColor: "#000",
        marginRight: 4,
    },
    checkboxChecked: {
        backgroundColor: "#000",
    },
    // ── Signature block ──────────────────────────────────────────────────────
    signatureArea: {
        marginTop: 15,
    },
    signatureBlock: {
        marginBottom: 20,
    },
    sigLine: {
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        width: 200,
        marginTop: 15,
        marginBottom: 4,
    },
    // ── Footer ───────────────────────────────────────────────────────────────
    footerBlock: {
        position: "absolute",
        bottom: 20,
        left: 40,
        right: 40,
        alignItems: "center",
    },
    disclaimerTitle: {
        fontSize: 10,
        fontFamily: "Times-BoldItalic", // <-- Use the dedicated bold-italic font
        marginBottom: 2,
    },
    disclaimerText: {
        fontSize: 8,
        fontFamily: "Times-Italic",
        lineHeight: 1.2,
        color: "#6b7280",
        textAlign: "center",
    },
    signature: {
        position: "absolute",
        bottom: -50,
        left: -10,
        height: 120,
        width: 150,
        zIndex: 1,
    },
    signature_over_printed_name: {
        position: "absolute",
        bottom: -20,
        left: 50,
        height: 120,
        width: 150,
        zIndex: 1,
    },
    signature_over_printed_name_line: {
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: "#000",
        width: 250,
        paddingTop: 5,
        textAlign: "center",
    },
});

// ── Shared components ────────────────────────────────────────────────────────

const PageHeader = () => (
    <View style={styles.header}>
        <Image style={styles.logo} src="/images/E1CXlogo2.png" />
        <Text style={styles.pageTitle}>Employee Change Form</Text>
    </View>
);

const PageFooter = () => (
    <View style={styles.footerBlock}>
        <Text style={styles.disclaimerTitle}>Confidential and Proprietary</Text>
        <Text style={styles.disclaimerText}>Disclaimer:</Text>
        <Text style={styles.disclaimerText}>
            This document and its contents are the property of EmpireOne BPO
            Solutions, Inc. and are intended for internal use only. Unauthorized
            reproduction, disclosure, or distribution of this material, in whole
            or in part, without prior written permission from the company is
            strictly prohibited.
        </Text>
    </View>
);

const FormCheckbox = ({ label, checked }) => (
    <View style={styles.checkboxItem}>
        <View style={[styles.checkbox, checked ? styles.checkboxChecked : {}]} />
        <Text>{label}</Text>
    </View>
);

const DetailRow = ({ label, from, to, isLast }) => (
    <View style={isLast ? styles.tableRowLast : styles.tableRow}>
        <View style={[styles.colLabel, { width: "25%", textAlign: "center" }]}>
            <Text>{label}</Text>
        </View>
        <View style={[styles.colValue, { width: "37.5%" }]}>
            <Text>{from}</Text>
        </View>
        <View style={[styles.colValueLast, { width: "37.5%" }]}>
            <Text>{to}</Text>
        </View>
    </View>
);

// ── Document ─────────────────────────────────────────────────────────────────

const EmployeeChangeFormDocument = ({ data }) => {
    const safeData = data || {};
    console.log('safeData', safeData)
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <PageHeader />

                {/* ══ GENERAL EMPLOYEE INFORMATION ══════════════════════════════ */}
                <View>
                    <Text style={styles.sectionLabel}>General Employee Information:</Text>
                    <View style={styles.divider} />
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={styles.colLabel}>
                                <Text>Name:</Text>
                            </View>
                            <View style={styles.colNameValue}>
                                <Text>{safeData.name || "N/A"}</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.colLabel}><Text>Employee ID:</Text></View>
                            <View style={styles.colValue}><Text>{safeData.employee_id}</Text></View>
                            <View style={styles.colLabel}><Text>Hire Date:</Text></View>
                            <View style={styles.colValueLast}><Text>{safeData.hire_date}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.colLabel}><Text>Position Level:</Text></View>
                            <View style={styles.colValue}><Text>{safeData.position_level}</Text></View>
                            <View style={styles.colLabel}><Text>Position Title:</Text></View>
                            <View style={styles.colValueLast}><Text>{safeData.position}</Text></View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={styles.colLabel}><Text>Department:</Text></View>
                            <View style={styles.colValue}><Text>{safeData.department}</Text></View>
                            <View style={styles.colLabel}><Text>Account:</Text></View>
                            <View style={styles.colValueLast}><Text>{safeData.account}</Text></View>
                        </View>
                        <View style={styles.tableRowLast}>
                            <View style={styles.colLabel}><Text>Reporting To:</Text></View>
                            <View style={styles.colValue}><Text>{safeData.reporting_to}</Text></View>
                            <View style={styles.colLabel}><Text>Employment Status:</Text></View>
                            <View style={styles.colValueLast}><Text></Text></View>
                        </View>
                    </View>
                </View>

                {/* ══ REASON FOR CHANGE ═════════════════════════════════════════ */}
                <View style={{ marginBottom: 15 }}>
                    <Text style={styles.italicLabel}>
                        (Kindly make sure to attach the necessary documentation):
                    </Text>
                    <Text style={[styles.bold, { marginTop: 6 }]}>Reason for Change:</Text>

                    <View style={styles.reasonBox}>
                        <Text>{safeData.reason_for_change}</Text>
                    </View>

                    <View style={styles.checkboxContainer}>
                        {safeData.status === "Probationary" && (
                            <FormCheckbox label="Regular" checked={safeData.regular} />
                        )}
                        <FormCheckbox label="Account Transfer" checked={safeData.is_account_transfer} />
                        <FormCheckbox label="Department Transfer" checked={safeData.is_department_transfer} />
                        <FormCheckbox label="Position & Title" checked={safeData.is_position_and_title} />
                        <FormCheckbox label="Tiering" checked={safeData.is_tiering} />
                    </View>
                </View>
                <View>
                    {
                        safeData?.tiering && <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <View style={[styles.tableHeader, { width: "100%" }]}>
                                    <Text>Tiering Information</Text>
                                </View>
                            </View>
                            <View style={styles.tableRow}>
                                <View style={[styles.colLabel, { width: "20%" }]}><Text>New Tier Name</Text></View>
                                <View style={[styles.colLabel, { width: "20%" }]}><Text>Original Tier</Text></View>
                                <View style={[styles.colLabel, { width: "20%" }]}><Text>Role</Text></View>
                                <View style={[styles.colLabel, { width: "20%" }]}><Text>Responsibilities</Text></View>
                                <View style={[styles.colLabel, { width: "20%" }]}><Text>Payout Details</Text></View>
                            </View>

                            <View style={styles.tableRow}>
                                <View style={[styles.colLabel, { width: "20%" }]}><Text>{safeData?.tiering?.name}</Text></View>
                                <View style={[styles.colLabel, { width: "20%" }]}><Text>{safeData?.tiering?.original}</Text></View>
                                <View style={[styles.colLabel, { width: "20%" }]}><Text>{safeData?.tiering?.role}</Text></View>
                                <View style={[styles.colLabel, { width: "20%" }]}><Text>{safeData?.tiering?.responsibility}</Text></View>
                                <View style={[styles.colLabel, { width: "20%" }]}><Text>{safeData?.tiering?.payout_details}</Text></View>
                            </View>


                        </View>
                    }

                </View>
                {/* ══ NEW INFORMATION DETAILS ═══════════════════════════════════ */}
                <View>
                    <Text style={styles.sectionLabel}>New Information Details:</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRowLast}>
                            <View style={[styles.colLabel, { width: "20%" }]}>
                                <Text>Effective Date:</Text>
                            </View>
                            <View style={[styles.colValueLast, styles.bold, { width: "80%", textAlign: "left" }]}>
                                <Text>{safeData.effective_date}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <View style={[styles.tableHeader, { width: "100%" }]}>
                                <Text>Information Details</Text>
                            </View>
                        </View>
                        <View style={styles.tableRow}>
                            <View style={[styles.colLabel, { width: "25%" }]}><Text>Field</Text></View>
                            <View style={[styles.colLabel, { width: "37.5%" }]}><Text>From</Text></View>
                            <View style={[styles.colLabel, { width: "37.5%", borderRightWidth: 0 }]}><Text>To</Text></View>
                        </View>

                        <DetailRow
                            label="Position Level:"
                            from={safeData.info_position_level_from}
                            to={safeData.info_position_level_to || "No Change"}
                        />
                        <DetailRow
                            label="Department:"
                            from={safeData.info_department_from}
                            to={safeData.info_department_id_to || "No Change"}
                        />
                        <DetailRow
                            label="Account:"
                            from={safeData.info_account_from}
                            to={safeData.info_account_id_to || "No Change"}
                        />
                        <DetailRow
                            label="Status:"
                            from={safeData.info_status_from}
                            to={safeData.info_status_to || "No Change"}
                        />
                        <DetailRow
                            label="Position Title:"
                            from={safeData.info_position_from}
                            to={safeData.info_position_to || "No Change"}
                        />
                        <DetailRow
                            label="Reporting To:"
                            from={safeData.info_reporting_from}
                            to={safeData.info_reporting_to || "No Change"}
                        />
                        <DetailRow
                            label="Basic Pay:"
                            from={safeData.info_basic_pay_from}
                            to={safeData.info_basic_pay_to || "No Change"}
                        />
                        <DetailRow
                            label="Allowances:"
                            from={safeData.info_allowances_from}
                            to={safeData.info_allowances_to || "No Change"}
                            isLast={true}
                        />
                    </View>
                </View>

                {/* ══ SIGNATURES ════════════════════════════════════════════════ */}
                <View style={styles.signatureArea}>


                    <View style={[styles.signatureBlock, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <View style={styles.signature_over_printed_name_line}>
                            {safeData?.prepaired_by_signature && (
                                <Image
                                    style={styles.signature_over_printed_name}
                                    src={safeData?.prepaired_by_signature}
                                />
                            )}
                            <Text style={{ marginTop: -20 }}>
                                HR Director:{safeData.prepaired_by_id}
                            </Text>
                            <Text style={[styles.bold, { marginTop: 8 }]}>Prepared & Approved by:</Text>
                            {/* <Text>Signature over Printed Name / Date</Text> */}
                        </View>
                        <View style={styles.signature_over_printed_name_line}>
                            {safeData?.employee_signature && (
                                <Image
                                    style={styles.signature_over_printed_name}
                                    src={safeData?.employee_signature}
                                />
                            )}
                            <Text style={{ marginTop: -20 }}>
                               {safeData.name}
                            </Text>
                            <Text style={[styles.bold, { marginTop: 8 }]}>Employee:</Text>
                            {/* <Text>Signature over Printed Name / Date</Text> */}
                        </View>
                        {/* <Text style={[styles.bold]}>Date: {moment().format("LL")}</Text> */}
                    </View>
                </View>

                <PageFooter />
            </Page>
        </Document>
    );
};

// ── Web wrapper ──────────────────────────────────────────────────────────────

const EmployeeChangeFormSection = () => {

    const { ecf } = useSelector((store) => store.human_resources);
    console.log('ecfecfss', ecf.prepaired_by)
    return (
        <PDFLoader pdf={<EmployeeChangeFormDocument data={{
            ...ecf,
            name: `${ecf?.employee?.personal_information?.first_name} ${ecf?.employee?.personal_information?.last_name}`,
            info_account_id_to: `${ecf?.account_to?.name}`,
            info_department_id_to: `${ecf?.department_to?.name}`,
            prepaired_by_id: `${ecf?.prepaired_by?.personal_information?.first_name} ${ecf?.prepaired_by?.personal_information?.last_name}`,
            prepaired_by_signature: ecf?.prepaired_by?.signature,
            employee_signature: ecf.employee?.signature
        }} />} width="w-full" />
    );
};

export default EmployeeChangeFormSection;