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

const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingBottom: 60,
        paddingLeft: 60,
        paddingRight: 60,
        fontFamily: "Times-Roman",
        fontSize: 10,
    },
    // ── Header ──────────────────────────────────────────────────────────────
    header: {
        alignItems: "center",
        marginBottom: 18,
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 300,
        height: 100,
        objectFit: "contain",
    },
    pageTitle: {
        textAlign: "center",
        fontSize: 10,
        marginTop: 12,
        fontFamily: "Times-Bold",
    },
    // ── Typography ───────────────────────────────────────────────────────────
    sectionLabel: {
        fontFamily: "Times-Bold",
        fontSize: 10,
        marginBottom: 3,
        marginTop: 10,
    },
    paragraph: {
        fontSize: 10,
        lineHeight: 1.5,
        marginBottom: 6,
        textAlign: "justify",
    },
    bold: {
        fontFamily: "Times-Bold",
    },
    italic: {
        fontFamily: "Times-Italic",
    },
    // ── Level 1: "- Unauthorized Absence" ────────────────────────────────────
    l1Row: {
        flexDirection: "row",
        marginBottom: 3,
        paddingLeft: 15,
    },
    l1Dash: { width: 12, fontSize: 10 },
    l1Text: { flex: 1, fontSize: 10, lineHeight: 1.4, textAlign: "justify" },
    // ── Level 2: "o  sub item" ───────────────────────────────────────────────
    l2Row: {
        flexDirection: "row",
        marginBottom: 3,
        paddingLeft: 30,
    },
    l2Bullet: { width: 14, fontSize: 10 },
    l2Text: { flex: 1, fontSize: 10, lineHeight: 1.4, textAlign: "justify" },
    // ── Level 3: "  -  sub-sub item" ────────────────────────────────────────
    l3Row: {
        flexDirection: "row",
        marginBottom: 3,
        paddingLeft: 50,
    },
    l3Dash: { width: 12, fontSize: 10 },
    l3Text: { flex: 1, fontSize: 10, lineHeight: 1.4 },
    // ── Note (italic, under l2) ───────────────────────────────────────────────
    noteRow: { paddingLeft: 44, marginBottom: 6 },
    noteText: { fontSize: 10, fontFamily: "Times-Italic", lineHeight: 1.4 },
    // ── Filled bullet (page 4) ───────────────────────────────────────────────
    bulletRow: { flexDirection: "row", marginBottom: 3, paddingLeft: 15 },
    bulletDot: { width: 14, fontSize: 10 },
    bulletText: { flex: 1, fontSize: 10, lineHeight: 1.4, textAlign: "justify" },
    // ── Numbered list ────────────────────────────────────────────────────────
    numberedRow: { flexDirection: "row", marginBottom: 3, paddingLeft: 15 },
    numberedIndex: { width: 18, fontSize: 10 },
    numberedText: { flex: 1, fontSize: 10, lineHeight: 1.4 },
    // ── Table ────────────────────────────────────────────────────────────────
    tableWrapper: { marginTop: 8, marginBottom: 10 },
    tableRow: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#000",
        borderLeftWidth: 1,
        borderLeftColor: "#000",
    },
    tableLastRow: { borderBottomWidth: 1, borderBottomColor: "#000" },
    colIncident: {
        width: "45%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 5,
        fontSize: 10,
    },
    colSanction: {
        width: "55%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 5,
        fontSize: 10,
    },
    tableHeaderText: { fontFamily: "Times-Bold", fontSize: 10 },
    tableCellText: { fontSize: 10, lineHeight: 1.3 },
    // ── Signature block ──────────────────────────────────────────────────────
    signatureArea: { marginTop: 20 },
    sigLine: {
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        width: 220,
        height: 16,
        marginBottom: 3,
    },
    sigLabel: { fontSize: 10, marginBottom: 8 },
    // ── Footer ───────────────────────────────────────────────────────────────
    pageNumberBlock: {
        position: "absolute",
        bottom: 38,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    pageNumberText: { fontSize: 10, fontFamily: "Times-Roman" },
    disclaimerBlock: {
        position: "absolute",
        bottom: 16,
        left: 60,
        right: 60,
    },
    disclaimerTitle: {
        fontSize: 7,
        fontFamily: "Times-Bold",
        marginBottom: 1,
    },
    disclaimerText: {
        fontSize: 7,
        fontFamily: "Times-Italic",
        lineHeight: 1.3,
        textAlign: "justify",
    },
});

// ── Shared components ────────────────────────────────────────────────────────

const PageHeader = ({ showTitle }) => (
    <View style={styles.header}>
        <View style={styles.logoContainer}>
            <Image style={styles.logo} src="/images/Blogo (1).png" />
        </View>
        {showTitle && (
            <Text style={styles.pageTitle}>Attendance Policy</Text>
        )}
    </View>
);

const PageFooter = ({ pageNum }) => (
    <>
        <View style={styles.pageNumberBlock}>
            <Text style={styles.pageNumberText}>Page {pageNum} of 4</Text>
        </View>
        <View style={styles.disclaimerBlock}>
            <Text style={styles.disclaimerTitle}>Disclaimer:</Text>
            <Text style={styles.disclaimerText}>
                This document and its contents are the property of EmpireOne BPO Solutions, Inc. and are intended for internal use only. Unauthorized reproduction, disclosure, or distribution of this material, in whole or in part, without prior written permission from the company is strictly prohibited.
            </Text>
        </View>
    </>
);

const L1 = ({ text, bold }) => (
    <View style={styles.l1Row}>
        <Text style={styles.l1Dash}>-</Text>
        <Text style={[styles.l1Text, bold ? styles.bold : {}]}>{text}</Text>
    </View>
);

const L2 = ({ text }) => (
    <View style={styles.l2Row}>
        <Text style={styles.l2Bullet}>o</Text>
        <Text style={styles.l2Text}>{text}</Text>
    </View>
);

const L3 = ({ text }) => (
    <View style={styles.l3Row}>
        <Text style={styles.l3Dash}>-</Text>
        <Text style={styles.l3Text}>{text}</Text>
    </View>
);

const Bullet = ({ text }) => (
    <View style={styles.bulletRow}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}>{text}</Text>
    </View>
);

const Numbered = ({ n, text }) => (
    <View style={styles.numberedRow}>
        <Text style={styles.numberedIndex}>{n}.</Text>
        <Text style={styles.numberedText}>{text}</Text>
    </View>
);

// ── Document ─────────────────────────────────────────────────────────────────

const AttendancePolicyDocument = () => (
    <Document>

        {/* ══ PAGE 1 ══════════════════════════════════════════════════════════ */}
        <Page size="A4" style={styles.page}>
            <PageHeader showTitle />

            <Text style={styles.sectionLabel}>Introduction:</Text>
            <Text style={styles.paragraph}>
                The company EmpireOne Global Solution Inc.'s attendance policy is a set of rules that outlines the
                expectation of the company to our employees on the importance of coming to work and punctuality; it
                also will help us maintain our productivity in the workplace.
            </Text>

            <Text style={styles.sectionLabel}>Scope:</Text>
            <Text style={styles.paragraph}>
                The attendance policy applies to all employees.
            </Text>

            <Text style={styles.sectionLabel}>Policy Fundamentals:</Text>
            <Text style={styles.paragraph}>
                As a Business Process Outsourcing company, the key to the company's growth lies within our employees,
                making sure our employees follow their shift schedule and break schedule will greatly affect the
                productivity of the company or organization as a whole.
            </Text>
            <Text style={styles.paragraph}>
                Being tardy, and absent at work without a valid reason will greatly impact your colleague that will
                shoulder some of the burdens regarding the workload. As a result, you will get a bad attendance record
                and will result in progressive disciplinary action.
            </Text>

            <Text style={styles.sectionLabel}>Definition of Terms:</Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Absent</Text> is defined as not being present in a place, an occasion, or as part of something.
            </Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Absenteeism</Text> is described as an excessive absence of an individual.
            </Text>
            <Text style={[styles.paragraph, { marginBottom: 4 }]}>
                3 categories of absenteeism:
            </Text>

            <L1 text="Unauthorized Absence" bold />
            <L2 text="Notification to immediate superior of absence but was not given permission." />
            <L2 text="Late notification to immediate superior of absence for any reason." />
            <L2 text="The following list, though not complete, is the reason we considered an unauthorized absence." />
            <L3 text="Waking up Late" />
            <L3 text="Running errands on the way to work" />
            <L3 text="Traffic or any Transportation delays" />
            <L3 text="Bad weather" />
            <L3 text="A holiday that is not officially approved" />
            <L3 text="Dysmenorrhea or menstrual cramps" />
            <L3 text="No cash allowance for fare or day expenses" />

            <PageFooter pageNum="1" />
        </Page>

        {/* ══ PAGE 2 ══════════════════════════════════════════════════════════ */}
        <Page size="A4" style={styles.page}>
            <PageHeader showTitle={false} />

            <L1 text="Authorized Absence" bold />
            <L2 text="Proper notification to immediate superior a day before the affected date of absence and approval is given for the absence to take place validly. Following which agent must submit the required documents to support the absence (eg. medical certificate and others)" />
            <L2 text="Proper notification to immediate superior 5-7 days before the absence date with documentation and records related to the absence, and approval is given for the absence to take place validly. This will be tagged as a leave of absence." />
            <L2 text="Proper and late notification to immediate superior due to medical and fortuitous events. (eg. Earthquake, fire, theft, accident)" />
            <View style={styles.noteRow}>
                <Text style={styles.noteText}>
                    Note: Succeeding documents must be submitted within 24 hours of the return.
                </Text>
            </View>

            <View style={{ height: 6 }} />
            <L1 text="No Call No Show" bold />
            <L2 text="Absence without any notification." />

            <View style={{ height: 6 }} />
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Tardiness</Text> refers to coming in late; or logging in not on the designated schedule as indicated. An
                employee is tagged tardy when he/she comes in to work no later than 1 hour before the scheduled
                employee.
            </Text>
            <Text style={styles.paragraph}>
                The employee will be considered an unauthorized absence if he still reported working later than the 1-
                hour period and must go directly to the operations management for further deliberation if he will continue
                to work the rest of his shift.
            </Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Under time</Text> refers to the working time that is less than full time or a required minimum of 4 hours of work rendered.
            </Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Overbreak</Text> taking a longer break than you are entitled to and frequently doing under time without any
                valid reason.
            </Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Presentism</Text> refers to being present beyond your working hours or doing overtime without approval or
                even if it's not required. It will impact your productivity and efficiency towards your work.
            </Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Infraction System:</Text> Employees' attendance shall be based on the table of penalties below:
            </Text>

            <PageFooter pageNum="2" />
        </Page>

        {/* ══ PAGE 3 ══════════════════════════════════════════════════════════ */}
        <Page size="A4" style={styles.page}>
            <PageHeader showTitle={false} />

            <Text style={[styles.paragraph, { marginBottom: 6 }]}>Table of Penalties</Text>
            <View style={styles.tableWrapper}>
                <View style={styles.tableRow}>
                    <View style={styles.colIncident}>
                        <Text style={styles.tableHeaderText}>Incident</Text>
                    </View>
                    <View style={styles.colSanction}>
                        <Text style={styles.tableHeaderText}>Sanction</Text>
                    </View>
                </View>
                <View style={styles.tableRow}>
                    <View style={styles.colIncident}>
                        <Text style={styles.tableCellText}>1st offense/strike</Text>
                    </View>
                    <View style={styles.colSanction}>
                        <Text style={styles.tableCellText}>Verbal Warning to Written warning</Text>
                    </View>
                </View>
                <View style={styles.tableRow}>
                    <View style={styles.colIncident}>
                        <Text style={styles.tableCellText}>2nd offense/strike</Text>
                    </View>
                    <View style={styles.colSanction}>
                        <Text style={styles.tableCellText}>Final Written Warning</Text>
                    </View>
                </View>
                <View style={[styles.tableRow, styles.tableLastRow]}>
                    <View style={styles.colIncident}>
                        <Text style={styles.tableCellText}>3rd offense/strike</Text>
                    </View>
                    <View style={styles.colSanction}>
                        <Text style={styles.tableCellText}>
                            Endorsed to Admin Hearing and Termination{"\n"}procedure
                        </Text>
                    </View>
                </View>
            </View>

            <Text style={styles.paragraph}>
                All incidents that fall on Critical Working Days which include but are{" "}
                <Text style={styles.italic}>not limited to:</Text>
            </Text>
            <Numbered n="1" text="Holidays" />
            <Numbered n="2" text="Before and after payday" />
            <Numbered n="3" text="Company Outing/events" />
            <View style={{ height: 6 }} />
            <Text style={styles.paragraph}>
                Will warrant higher sanctions as a management prerogative which includes an endorsement to
                admin hearing or termination procedure.
            </Text>
            <Text style={styles.paragraph}>
                Three Consecutive absences without proper notification or NCNS will be tagged as{" "}
                <Text style={styles.bold}>AWOL (absence without leave) or abandonment of work</Text>{" "}
                and will terminate his/her employment effective immediately.
            </Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Cleansing Period:</Text> Six months without incurring any penalties.
            </Text>
            <Text style={styles.paragraph}>
                Management has the right to decide based on the circumstances to approve or disapprove any leave or
                sick leave especially if the reason is not validated.
            </Text>

            <View style={{ height: 10 }} />

            <Text style={styles.sectionLabel}>Immediate Supervisors and HR role:</Text>
            <Text style={styles.paragraph}>
                The immediate supervisor/HR has the responsibility to monitor and manage his/her team's attendance. If
                the supervisor notices that one of his/her team members is constantly absent, the supervisor will endorse
                to HR any attendance issues. HR will arrange a meeting with the representative and discuss this.
            </Text>
            <Text style={styles.paragraph}>
                If the supervisor notices that a team member is abusing the use of leave and intentionally being tardy,
                kindly inform HR, and we will proceed with the progressive Disciplinary action.
            </Text>

            <PageFooter pageNum="3" />
        </Page>

        {/* ══ PAGE 4 ══════════════════════════════════════════════════════════ */}
        <Page size="A4" style={styles.page}>
            <PageHeader showTitle={false} />

            <Text style={styles.paragraph}>
                Management has the right to take Disciplinary Action including Termination of employment if the
                following still does not work:
            </Text>
            <Bullet text="Corrective coaching from the supervisor or HR" />
            <Bullet text="We find that you are deliberately tardy" />
            <Bullet text="Your Absences and Tardiness have a great impact on the productivity of the team or company" />

            <View style={{ height: 8 }} />
            <Text style={styles.sectionLabel}>Termination</Text>
            <Text style={styles.paragraph}>
                The employee is not entitled to convert the remaining PTO/leave credits if terminated with cause.
            </Text>
            <Text style={styles.paragraph}>
                The following are entitled to convert their Service Incentive Leave credits to cash: (The calculation
                will be prorated)
            </Text>

            <Text style={styles.sectionLabel}>Resignation</Text>
            <Text style={styles.paragraph}>
                Refers to employees who have properly tendered his/her resignation and have rendered 30 days.
            </Text>

            <Text style={styles.sectionLabel}>Involuntary Separation</Text>
            <Text style={styles.paragraph}>
                Refers to dismissal for any just or authorized causes as indicated in the Labor Code of the Philippines,
                Art.282 and Art 283, or failure to obtain reappointment.
            </Text>

            <View style={{ height: 16 }} />
            <Text style={styles.paragraph}>I fully understand the Attendance Policy.</Text>

            <View style={styles.signatureArea}>
                <View style={styles.sigLine} />
                <Text style={styles.sigLabel}>Name and Signature</Text>
                <Text style={styles.sigLabel}>Date Signed:</Text>
            </View>

            <PageFooter pageNum="4" />
        </Page>

    </Document>
);

// ── Web wrapper ──────────────────────────────────────────────────────────────
const AttendancePolicySection = () => (
    <div style={{ width: "100vw", height: "88vh", margin: 0, padding: 0 }}>
        <PDFViewer width="100%" height="100%">
            <AttendancePolicyDocument />
        </PDFViewer>
    </div>
);

export default AttendancePolicySection;