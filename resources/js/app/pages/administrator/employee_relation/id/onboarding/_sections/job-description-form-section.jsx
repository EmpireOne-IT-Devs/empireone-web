import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    PDFViewer,
} from "@react-pdf/renderer";
import PDFLoader from "@/app/_components/pdf-loader";

const styles = StyleSheet.create({
    page: {
        paddingTop: 50,
        paddingBottom: 50,
        paddingLeft: 60,
        paddingRight: 60,
        fontFamily: "Times-Roman",
        fontSize: 10,
    },
    title: {
        textAlign: "center",
        fontFamily: "Times-Bold",
        fontSize: 11,
        marginBottom: 18,
    },
    /* Info grid rows */
    infoRow: {
        flexDirection: "row",
        marginBottom: 8,
        alignItems: "flex-end",
    },
    infoLabel: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        width: 90,
    },
    infoValue: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        borderBottomWidth: 1,
        borderBottomColor: "black",
        flex: 1,
        marginRight: 12,
    },
    infoLabelRight: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        width: 70,
    },
    infoValueRight: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        borderBottomWidth: 1,
        borderBottomColor: "black",
        flex: 1,
    },
    /* Section headers */
    sectionLabel: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        marginTop: 14,
        marginBottom: 6,
    },
    subLabel: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        marginBottom: 8,
        marginLeft: 20,
    },
    /* Main table */
    table: {
        borderWidth: 1,
        borderColor: "black",
        marginBottom: 14,
    },
    tableHeaderRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "black",
    },
    tableHeaderCell: {
        flex: 1,
        padding: 5,
        fontFamily: "Times-Bold",
        fontSize: 10,
        textAlign: "center",
        borderRightWidth: 1,
        borderColor: "black",
    },
    tableHeaderCellLast: {
        flex: 2,
        padding: 5,
        fontFamily: "Times-Bold",
        fontSize: 10,
        textAlign: "center",
    },
    tableSubHeaderRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "black",
    },
    tableSubCell: {
        flex: 1,
        padding: 5,
        fontFamily: "Times-Italic",
        fontSize: 9,
        textAlign: "center",
        borderRightWidth: 1,
        borderColor: "black",
    },
    tableSubCellLast: {
        flex: 2,
        padding: 5,
        fontFamily: "Times-Italic",
        fontSize: 9,
        textAlign: "center",
    },
    /* Data rows */
    dataRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "black",
    },
    numCell: {
        width: 22,
        padding: 5,
        fontFamily: "Times-Roman",
        fontSize: 10,
        textAlign: "center",
        borderRightWidth: 1,
        borderColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    descCell: {
        flex: 1,
        padding: 5,
        fontFamily: "Times-Roman",
        fontSize: 9,
        textAlign: "center",
        borderRightWidth: 1,
        borderColor: "black",
        justifyContent: "center",
    },
    dutiesCell: {
        flex: 2,
        padding: 5,
        fontFamily: "Times-Roman",
        fontSize: 9,
        justifyContent: "center",
    },
    bulletItem: {
        flexDirection: "row",
        marginBottom: 3,
        alignItems: "flex-start",
    },
    bullet: {
        width: 12,
        fontSize: 9,
        textAlign: "center",
    },
    bulletText: {
        flex: 1,
        fontSize: 9,
        fontFamily: "Times-Roman",
        lineHeight: 1.4,
    },
    /* Acknowledgment */
    ackLabel: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        marginBottom: 8,
        marginTop: 4,
    },
    ackText: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        lineHeight: 1.5,
        textAlign: "justify",
        marginBottom: 40,
    },
    sigRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    sigBlock: {
        width: "45%",
    },
    sigLine: {
        borderBottomWidth: 1,
        borderBottomColor: "black",
        marginBottom: 4,
    },
    sigLabel: {
        fontFamily: "Times-Roman",
        fontSize: 9,
        textAlign: "center",
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
});

const Disclaimer = () => (
    <View style={styles.disclaimerBlock}>
        <Text style={styles.disclaimerTitle}>Disclaimer:</Text>
        <Text style={styles.disclaimerText}>
            This document and its contents are the property of EmpireOne BPO
            Solutions, Inc. and are intended for internal use only. Unauthorized
            reproduction, disclosure, or distribution of this material, in whole
            or in part, without prior written permission from the company is
            strictly prohibited.
        </Text>
    </View>
);

const Bullet = ({ text }) => (
    <View style={styles.bulletItem}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>{text}</Text>
    </View>
);

const DataRow = ({ num, desc, duties }) => (
    <View style={styles.dataRow}>
        <View style={styles.numCell}>
            <Text>{num}</Text>
        </View>
        <View style={styles.descCell}>
            <Text>{desc}</Text>
        </View>
        <View style={styles.dutiesCell}>
            {duties.map((d, i) => (
                <Bullet key={i} text={d} />
            ))}
        </View>
    </View>
);

const JobDescriptionDocument = () => (
    <Document>
        {/* PAGE 1 */}
        <Page size="A4" style={styles.page}>
            <Text style={styles.title}>JOB DESCRIPTION FORM</Text>

            {/* Info rows */}
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Company:</Text>
                <Text style={styles.infoValue}>
                    EMPIREONE BPO SOLUTIONS INC.
                </Text>
                <Text style={styles.infoLabelRight}>Date:</Text>
                <Text style={styles.infoValueRight}>01/11/2026</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Position Title:</Text>
                <Text style={styles.infoValue}>
                    CUSTOMER SERVICE REPRESENTATIVE
                </Text>
                <Text style={styles.infoLabelRight}>Section/Unit:</Text>
                <Text style={styles.infoValueRight}>OPERATIONS</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Department:</Text>
                <Text style={styles.infoValue}>OPERATIONS - CSR</Text>
                <Text style={styles.infoLabelRight}>Division:</Text>
                <Text style={styles.infoValueRight}></Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Responsible to (Position):</Text>
                <Text style={{ ...styles.infoValue, marginRight: 0 }}>
                    OPERATIONS - CSR SUPERVISOR; OPERATIONS MANAGER
                </Text>
            </View>

            <Text style={styles.sectionLabel}>1.0 Job Specifications</Text>
            <Text style={styles.subLabel}>
                1.1 Describe in detail the information required in each column
            </Text>

            {/* Main Table */}
            <View style={styles.table}>
                {/* Header */}
                <View style={styles.tableHeaderRow}>
                    <Text
                        style={{
                            ...styles.tableHeaderCell,
                            width: 22,
                            flex: 0,
                        }}
                    ></Text>
                    <Text style={styles.tableHeaderCell}>Job Description</Text>
                    <Text style={styles.tableHeaderCellLast}>
                        Duties & Responsibilities
                    </Text>
                </View>
                {/* Sub-header */}
                <View style={styles.tableSubHeaderRow}>
                    <Text
                        style={{ ...styles.tableSubCell, width: 22, flex: 0 }}
                    ></Text>
                    <Text style={styles.tableSubCell}>
                        (List Down the Deliverables or Desired Results from the
                        Job)
                    </Text>
                    <Text style={styles.tableSubCellLast}>
                        (Enumerate the activities or processes involved in
                        achieving the desired job results or deliverables)
                    </Text>
                </View>

                {/* Row 1 */}
                <DataRow
                    num="1"
                    desc="To be able to manage incoming customer service calls and customer service leads (emails and chats) and inquiries"
                    duties={[
                        "Identify and assess customers' needs to achieve satisfaction",
                        "Build sustainable relationships and trust with customer accounts through open and interactive communication",
                        "Handle customer complaints, provide appropriate solutions and alternatives within the time limits, follow up to ensure resolution",
                        "Handle records of customer interactions, process customer accounts and file documents in a confidential manner",
                    ]}
                />

                {/* Row 2 */}
                <DataRow
                    num="2"
                    desc="To be able to follow proper schedule adherence"
                    duties={[
                        "Observed proper attendance in the call queue based on scheduling",
                        "To report to the center per schedule indicated in a timely and accurate manner",
                        "To provide proper notification proceeding in terms of failure to follow schedule",
                        "To be able to inform the immediate superior of any attendance issues and inquiries",
                    ]}
                />

                {/* Row 3 */}
                <DataRow
                    num="3"
                    desc="Adheres to policies and procedures set forth by the company"
                    duties={[
                        "Log-ins and out depending on the schedule provided to them",
                    ]}
                />
            </View>

            <Disclaimer />
        </Page>

        {/* PAGE 2 */}
        <Page size="A4" style={styles.page}>
            <View style={styles.table}>
                {/* Continuation of row 3 + row 4 */}
                <View style={styles.dataRow}>
                    <View style={styles.numCell}></View>
                    <View style={styles.descCell}></View>
                    <View style={styles.dutiesCell}>
                        <Bullet text="Understand the Company code of conduct and its provisions therein" />
                    </View>
                </View>

                <DataRow
                    num="4"
                    desc="Training for basic knowledge on the account"
                    duties={[
                        "Attends training conducted to know the responsibilities of the assigned account",
                        "Know the tools and necessary equipment to use to handle the customer's issues and concerns",
                        "Know the proper department to contact for escalations and resolution management.",
                    ]}
                />
            </View>

            <Text style={styles.ackLabel}>2.0 Acknowledgment:</Text>
            <Text style={styles.ackText}>
                I have read and understood the contents set forth by this form
                and accept all the indicated role of the position that was
                assigned to me by the company based on the job offer and work
                employment contract as indicated.
            </Text>

            <View style={styles.sigRow}>
                <View style={styles.sigBlock}>
                    <View style={styles.sigLine} />
                    <Text style={styles.sigLabel}>
                        Complete Name and Signature
                    </Text>
                </View>
                <View style={styles.sigBlock}>
                    <View style={styles.sigLine} />
                    <Text style={styles.sigLabel}>Date</Text>
                </View>
            </View>

            <Disclaimer />
        </Page>
    </Document>
);

const JobDescriptionFormSection = () => (
    <div style={{ width: "100vw", height: "88vh", margin: 0, padding: 0 }}>
        <PDFLoader pdf={<JobDescriptionDocument />} />
    </div>
);

export default JobDescriptionFormSection;
