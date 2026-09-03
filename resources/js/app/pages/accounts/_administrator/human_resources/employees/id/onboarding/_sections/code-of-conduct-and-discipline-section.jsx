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

const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingBottom: 60,
        paddingLeft: 60,
        paddingRight: 60,
        fontFamily: "Times-Roman",
        fontSize: 10,
    },
    // ── Header ───────────────────────────────────────────────────────────────
    header: {
        alignItems: "center",
        marginBottom: 10,
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 450,
        height: 120,
        objectFit: "contain",
    },
    pageTitle: {
        textAlign: "center",
        fontSize: 14,
        fontFamily: "Times-Bold",
        marginTop: 4,
        marginBottom: 6,
    },
    // ── Meta row (Document Approvers etc.) ───────────────────────────────────
    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        fontSize: 9,
    },
    // ── Section headings ──────────────────────────────────────────────────────
    sectionHeading: {
        fontFamily: "Times-Bold",
        fontSize: 10,
        marginTop: 10,
        marginBottom: 4,
    },
    // ── Body text ─────────────────────────────────────────────────────────────
    paragraph: {
        fontSize: 10,
        lineHeight: 1.5,
        marginBottom: 5,
        textAlign: "justify",
    },
    bold: { fontFamily: "Times-Bold" },
    italic: { fontFamily: "Times-Italic" },
    // ── Numbered / lettered list items ────────────────────────────────────────
    listRow: {
        flexDirection: "row",
        marginBottom: 4,
        alignItems: "flex-start",
    },
    listIndex: {
        width: 20,
        fontSize: 10,
        fontFamily: "Times-Roman",
    },
    listText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 1.4,
        textAlign: "justify",
    },
    // indented sub-list
    subListRow: {
        flexDirection: "row",
        marginBottom: 3,
        paddingLeft: 20,
        alignItems: "flex-start",
    },
    subListIndex: { width: 18, fontSize: 10 },
    subListText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 1.4,
        textAlign: "justify",
    },
    // ── Simple penalty tables (Level 1/2/3) ───────────────────────────────────
    penaltyTable: {
        marginTop: 4,
        marginBottom: 8,
        borderTopWidth: 1,
        borderTopColor: "#000",
        borderLeftWidth: 1,
        borderLeftColor: "#000",
    },
    penaltyRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
    },
    penaltyCol1: {
        width: "50%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 4,
        fontSize: 10,
    },
    penaltyCol2: {
        width: "50%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 4,
        fontSize: 10,
    },
    penaltyHeaderText: { fontFamily: "Times-Bold", fontSize: 10 },
    penaltyCellText: { fontSize: 10, lineHeight: 1.3 },
    // ── Clearing period table ─────────────────────────────────────────────────
    clearTable: {
        marginTop: 4,
        marginBottom: 8,
        borderTopWidth: 1,
        borderTopColor: "#000",
        borderLeftWidth: 1,
        borderLeftColor: "#000",
    },
    clearRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
    },
    clearCol1: {
        width: "60%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 4,
        fontSize: 10,
    },
    clearCol2: {
        width: "40%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 4,
        fontSize: 10,
    },
    // ── Big violation table ───────────────────────────────────────────────────
    violTable: {
        marginTop: 6,
        marginBottom: 10,
        borderTopWidth: 1,
        borderTopColor: "#000",
        borderLeftWidth: 1,
        borderLeftColor: "#000",
    },
    violRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        minHeight: 20,
    },
    // column widths for the big table
    vColNo: {
        width: "5%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 3,
        fontSize: 9,
    },
    vColDesc: {
        width: "30%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 3,
        fontSize: 9,
    },
    vColLvl: {
        width: "8%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 3,
        fontSize: 9,
    },
    vCol1: {
        width: "12%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 3,
        fontSize: 9,
    },
    vCol2: {
        width: "12%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 3,
        fontSize: 9,
    },
    vCol3: {
        width: "12%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 3,
        fontSize: 9,
    },
    vCol4: {
        width: "12%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 3,
        fontSize: 9,
    },
    vCol5: {
        width: "9%",
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 3,
        fontSize: 9,
    },
    vHeaderText: { fontFamily: "Times-Bold", fontSize: 9 },
    vCellText: { fontSize: 9, lineHeight: 1.3 },
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
        bottom: 14,
        left: 60,
        right: 60,
    },
    disclaimerTitle: { fontSize: 7, fontFamily: "Times-Bold", marginBottom: 1 },
    disclaimerText: {
        fontSize: 7,
        fontFamily: "Times-Italic",
        lineHeight: 1.3,
        textAlign: "justify",
    },
    // ── Approvers / Acknowledgement ───────────────────────────────────────────
    approverRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
        marginBottom: 6,
    },
    approverCol: { width: "30%", alignItems: "center" },
    approverLine: {
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        width: "100%",
        height: 14,
        marginBottom: 3,
    },
    approverLabel: { fontSize: 9, textAlign: "center" },
    sigBlock: { marginTop: 14 },
    sigLine: {
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        width: 200,
        height: 14,
        marginBottom: 3,
    },
    sigLabel: { fontSize: 10, marginBottom: 6 },
    confidential: {
        textAlign: "center",
        fontSize: 10,
        fontFamily: "Times-Bold",
        marginTop: 20,
    },
});

// ── Reusable pieces ──────────────────────────────────────────────────────────

const PageHeader = ({ showTitle }) => (
    <View style={styles.header}>
        <View style={styles.logoContainer}>
            <Image style={styles.logo} src="/images/E1CXlogo.png" />
        </View>
        {showTitle && (
            <Text style={styles.pageTitle}>Code of Conduct and Discipline</Text>
        )}
    </View>
);

const PageFooter = ({ pageNum, total }) => (
    <>
        <View style={styles.pageNumberBlock}>
            <Text style={styles.pageNumberText}>
                Page {pageNum} of {total}
            </Text>
        </View>
        <View style={styles.disclaimerBlock}>
            <Text style={styles.disclaimerTitle}>Disclaimer:</Text>
            <Text style={styles.disclaimerText}>
                This document and its contents are the property of EmpireOne BPO
                Solutions, Inc. and are intended for internal use only.
                Unauthorized reproduction, disclosure, or distribution of this
                material, in whole or in part, without prior written permission
                from the company is strictly prohibited.
            </Text>
        </View>
    </>
);

const LI = ({ idx, text, bold }) => (
    <View style={styles.listRow}>
        <Text style={styles.listIndex}>{idx}</Text>
        <Text style={[styles.listText, bold ? styles.bold : {}]}>{text}</Text>
    </View>
);

const SubLI = ({ idx, text }) => (
    <View style={styles.subListRow}>
        <Text style={styles.subListIndex}>{idx}</Text>
        <Text style={styles.subListText}>{text}</Text>
    </View>
);

// Simple 2-col penalty table
const PenaltyTable = ({ rows }) => (
    <View style={styles.penaltyTable}>
        <View style={styles.penaltyRow}>
            <View style={styles.penaltyCol1}>
                <Text style={styles.penaltyHeaderText}>Violation</Text>
            </View>
            <View style={styles.penaltyCol2}>
                <Text style={styles.penaltyHeaderText}>Penalty</Text>
            </View>
        </View>
        {rows.map((r, i) => (
            <View style={styles.penaltyRow} key={i}>
                <View style={styles.penaltyCol1}>
                    <Text style={styles.penaltyCellText}>{r[0]}</Text>
                </View>
                <View style={styles.penaltyCol2}>
                    <Text style={styles.penaltyCellText}>{r[1]}</Text>
                </View>
            </View>
        ))}
    </View>
);

// Big violation table row
const VRow = ({ no, desc, lvl, c1, c2, c3, c4, c5, header }) => (
    <View style={styles.violRow}>
        <View style={styles.vColNo}>
            <Text style={header ? styles.vHeaderText : styles.vCellText}>
                {no}
            </Text>
        </View>
        <View style={styles.vColDesc}>
            <Text style={header ? styles.vHeaderText : styles.vCellText}>
                {desc}
            </Text>
        </View>
        <View style={styles.vColLvl}>
            <Text style={header ? styles.vHeaderText : styles.vCellText}>
                {lvl}
            </Text>
        </View>
        <View style={styles.vCol1}>
            <Text style={header ? styles.vHeaderText : styles.vCellText}>
                {c1}
            </Text>
        </View>
        <View style={styles.vCol2}>
            <Text style={header ? styles.vHeaderText : styles.vCellText}>
                {c2}
            </Text>
        </View>
        <View style={styles.vCol3}>
            <Text style={header ? styles.vHeaderText : styles.vCellText}>
                {c3}
            </Text>
        </View>
        <View style={styles.vCol4}>
            <Text style={header ? styles.vHeaderText : styles.vCellText}>
                {c4}
            </Text>
        </View>
        <View style={styles.vCol5}>
            <Text style={header ? styles.vHeaderText : styles.vCellText}>
                {c5}
            </Text>
        </View>
    </View>
);

const VHeader = () => (
    <VRow
        header
        no="Section."
        desc="Description of Warning"
        lvl="Level"
        c1="1st Warning"
        c2="2nd Warning"
        c3="3rd Warning"
        c4="4th Warning"
        c5="5th Warning"
    />
);

// ── Document ─────────────────────────────────────────────────────────────────

const CodeOfConductDocument = () => (
    <Document>
        {/* ══ PAGE 1 ══════════════════════════════════════════════════════════ */}
        <Page size="A4" style={styles.page}>
            <PageHeader showTitle />

            {/* Meta */}
            <View style={styles.metaRow}>
                <Text>
                    Document Approvers: CEO/President Version: 4 - 12.10.2019
                    {"\n"}Process Owner: HR / Admin Department
                </Text>
            </View>

            {/* I. Scope */}
            <Text style={styles.sectionHeading}>I. Scope</Text>
            <Text style={styles.paragraph}>
                This policy applies to all EmpireOne employees regardless of the
                employment agreement and rank.
            </Text>

            {/* II. Purpose */}
            <Text style={styles.sectionHeading}>II. Purpose</Text>
            <Text style={styles.paragraph}>
                The Code of Conduct and Discipline is made to promote and create
                a good and healthy working environment. This policy will make
                sure that our EmpireOne employee upholds professionalism among
                each other. The established code will set standards for how our
                organization lives up to its objectives.
            </Text>

            {/* III. Principles */}
            <Text style={styles.sectionHeading}>
                III. Principles to rule the Company Code of Conduct and
                Discipline
            </Text>
            <LI
                idx="1."
                text="The company has the right to discipline and terminate employees in just and proper causes in accordance with our 1987 Philippine Constitution."
            />
            <LI
                idx="2."
                text="Uphold integrity and equality strict compliance in imposing disciplinary action, in accordance with to the existing labor law, rule, and policy should be observed."
            />
            <LI
                idx="3."
                text="The strict monitoring and execution is the management's responsibility, thus the immediate supervisors and department heads should initiate the disciplinary actions of its subordinates whenever the violation is committed."
            />
            <LI
                idx="4."
                text="Administrative investigation and other proceedings shall be conducted."
            />
            <LI
                idx="5."
                text="Proper sanction should be imposed after the violation was made. The immediate supervisor should provide the letter to explain the document or such related documentary file with the proper justification to his subordinate in real time. The Immediate Supervisor should be responsible for the inability to provide the sanction."
            />
            <LI
                idx="6."
                text="All penalties and sanctions should be reasonable, and shall not be canceled or delayed."
            />
            <LI
                idx="7."
                text="The right of the offender shall be granted in accordance with the company regulations and culture, and as provided for by law."
            />
            <LI
                idx="8."
                text="The management may lessen the penalty given with HDD's approval and upon compliance with the necessary documentation and justification of the decision."
            />
            <LI
                idx="9."
                text="All violations of this code, shall apply to the following rules and penalties imposed."
            />

            <Text style={[styles.paragraph, { marginTop: 6 }]}>
                <Text style={styles.bold}>Level 1 type/Warnings:</Text>
            </Text>
            <PenaltyTable
                rows={[
                    ["1st incident/instance", "Verbal Warning"],
                    ["2nd incident/instance", "Written Warning"],
                    ["3rd incident/instance", "Final Written Warning"],
                    ["4th incident/instance", "Termination"],
                ]}
            />

            <Text style={[styles.paragraph, { marginTop: 2 }]}>
                <Text style={styles.bold}>Level 2 type/Warnings:</Text>
            </Text>
            <PenaltyTable
                rows={[
                    ["1st incident/instance", "Written Warning"],
                    ["2nd incident/instance", "Final Written Warning"],
                    ["3rd incident/instance", "Termination"],
                ]}
            />

            <Text style={[styles.paragraph, { marginTop: 2 }]}>
                <Text style={styles.bold}>Level 3 type/Warnings:</Text>
            </Text>
            <PenaltyTable rows={[["1st incident/instance", "Termination"]]} />

            <PageFooter pageNum="1" total="5" />
        </Page>

        {/* ══ PAGE 2 ══════════════════════════════════════════════════════════ */}
        <Page size="A4" style={styles.page}>
            <PageHeader showTitle={false} />

            <LI
                idx="10."
                text="Prescription of Warnings. All Warning levels and types will follow a prescribed period. Warnings marked as Level 1 and 2 will prescribe for 3 months and 6 months respectively. For Warnings that are marked as Level 3, correspondingly underwent due process whereby the decision has mitigated the disciplinary action of termination, the cleansing period will take 1 year. See the below chart:"
            />

            <View style={[styles.clearTable, { marginTop: 8 }]}>
                <View style={styles.clearRow}>
                    <View style={styles.clearCol1}>
                        <Text style={styles.penaltyHeaderText}>
                            Level and Type of Warning
                        </Text>
                    </View>
                    <View style={styles.clearCol2}>
                        <Text style={styles.penaltyHeaderText}>
                            Clearing Period
                        </Text>
                    </View>
                </View>
                <View style={styles.clearRow}>
                    <View style={styles.clearCol1}>
                        <Text style={styles.penaltyCellText}>Level 1</Text>
                    </View>
                    <View style={styles.clearCol2}>
                        <Text style={styles.penaltyCellText}>3 months</Text>
                    </View>
                </View>
                <View style={styles.clearRow}>
                    <View style={styles.clearCol1}>
                        <Text style={styles.penaltyCellText}>Level 2</Text>
                    </View>
                    <View style={styles.clearCol2}>
                        <Text style={styles.penaltyCellText}>6 months</Text>
                    </View>
                </View>
                <View style={styles.clearRow}>
                    <View style={styles.clearCol1}>
                        <Text style={styles.penaltyCellText}>Level 3</Text>
                    </View>
                    <View style={styles.clearCol2}>
                        <Text style={styles.penaltyCellText}>1 year</Text>
                    </View>
                </View>
            </View>

            {/* IV. Company Standards */}
            <Text style={styles.sectionHeading}>IV. Company Standards</Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>
                    a. Proper Conduct and Etiquette{" "}
                </Text>
                All EmpireOne Employees are expected to observe appropriate
                behavior and decorum within and outside as a representative of
                the company. This included an appropriate attitude which means
                proper language. All employees are required to observe proper
                office and work ethics in terms of communicating with
                co-workers, customers, and clients.
            </Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>b. Company's Productivity </Text>
                The company expects that all employees will utilize all the
                training and company facilities to properly perform their tasks
                and responsibilities as expected by our client and the company,
                this also includes taking your scheduled breaks and time.
            </Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>
                    c. Provide a Healthy and Secure Environment.{" "}
                </Text>
                All employees are required to observe proper attitude towards
                cleanliness and proper housekeeping in the office, also good
                health for yourself and others. An EmpireOne employee needs to
                help in the security of the office and follow basic safety
                procedures.
            </Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>
                    d. Proper use of the company's facilities and Property{" "}
                </Text>
                to protect the company and employees' assets, we need to observe
                proper usage of all the company's facilities, handling of
                confidential records, and strict compliance in auditing company
                funds received.
            </Text>

            {/* V. Types of Penalty */}
            <Text style={styles.sectionHeading}>
                V. Types of Penalty of Warnings
            </Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Level 1: </Text>
                Minor Warning deal with transgression that is inconsequential in
                nature but if not corrected it will become a habit. No impact on
                the company's business.
            </Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Level 2: </Text>
                Minor Warning deal with transgression that would cause delay in
                operations, pose any threats or harm to the company's property.
            </Text>
            <Text style={styles.paragraph}>
                <Text style={styles.bold}>Level 3: </Text>
                Serious and major Warning deals with transgression that would
                impact the company's image that might lead to the loss of the
                company's clients or business. This also entails the security of
                our employees, clients, and customer information. This may also
                be ground for termination.
            </Text>

            <PageFooter pageNum="2" total="5" />
        </Page>

        {/* ══ PAGE 3 — Conduct & Etiquette table ══════════════════════════════ */}
        <Page size="A4" style={styles.page}>
            <PageHeader showTitle={false} />

            <Text style={styles.sectionHeading}>
                VI. Table of Penalty or Warnings
            </Text>
            <Text style={[styles.bold, { marginBottom: 4 }]}>
                Conduct and Etiquette
            </Text>

            <View style={styles.violTable}>
                <VHeader />
                <VRow
                    no="1"
                    desc="Creating unnecessary noise inside the office"
                    lvl="1"
                    c1="Verbal Warning"
                    c2="Written Warning"
                    c3="Final Written Warning"
                    c4="Admin Hearing/ Termination"
                    c5=""
                />
                <VRow
                    no="2"
                    desc="Sleeping during working hours"
                    lvl="1"
                    c1="Verbal Warning"
                    c2="Written Warning"
                    c3="Final Written Warning"
                    c4="Admin Hearing/ Termination"
                    c5=""
                />
                <VRow
                    no="3"
                    desc="Failure to complete the pre-employment requirements"
                    lvl="1"
                    c1="Verbal Warning"
                    c2="Written Warning"
                    c3="Final Written Warning"
                    c4="Admin Hearing/ Termination"
                    c5=""
                />
                <VRow
                    no="4"
                    desc={
                        "Inappropriate conduct causes disorder or disrupt of work such as but not limited to:\na. Physical Violence amongst employees inside the working place.\nb. Any forms of threats"
                    }
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="5"
                    desc="Failure to maintain cleanliness and order in the assigned work station"
                    lvl="1"
                    c1="Verbal Warning"
                    c2="Written Warning"
                    c3="Final Written Warning"
                    c4="Admin Hearing/ Termination"
                    c5=""
                />
                <VRow
                    no="6"
                    desc="Being Disrespectful towards superior, using foul language or act discourteous"
                    lvl="2"
                    c1="Written Warning"
                    c2="Final Written Warning"
                    c3="Admin Hearing/ Termination"
                    c4=""
                    c5=""
                />
                <VRow
                    no="7"
                    desc="Abandonment of work"
                    lvl="3"
                    c1="Final Written Warning"
                    c2="Termination"
                    c3="Admin Hearing/ Termination"
                    c4=""
                    c5=""
                />
                <VRow
                    no="8"
                    desc="Refusal to render overtime during business needs/critical days without any valid reason"
                    lvl="2"
                    c1="Written Warning"
                    c2="Final Written Warning"
                    c3="Admin Hearing/ Termination"
                    c4=""
                    c5=""
                />
                <VRow
                    no="9"
                    desc="Malingering"
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="10"
                    desc="Rudeness to clients and customers which includes but is not limited to co-employees."
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="11"
                    desc={
                        "Any forms of stealing, or attempt to steal, such as but not limited to:\na. Theft\nb. Burglary\nc. Filching\nd. Pilferage"
                    }
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="12"
                    desc="Failure to follow appropriate dress code"
                    lvl="1"
                    c1="Verbal Warning"
                    c2="Written Warning"
                    c3="Final Written Warning"
                    c4="Admin Hearing/ Termination"
                    c5=""
                />
                <VRow
                    no="13"
                    desc="Failure to follow the English-Only Policy in the production floor area."
                    lvl="1"
                    c1="Verbal Warning"
                    c2="Written Warning"
                    c3="Final Written Warning"
                    c4="Admin Hearing/ Termination"
                    c5=""
                />
            </View>

            <PageFooter pageNum="3" total="5" />
        </Page>

        {/* ══ PAGE 4 — Productivity / Health / Facilities tables ═══════════════ */}
        <Page size="A4" style={styles.page}>
            <PageHeader showTitle={false} />

            <Text style={[styles.bold, { marginBottom: 4 }]}>
                Company's Productivity
            </Text>
            <View style={styles.violTable}>
                <VHeader />
                <VRow
                    no="1"
                    desc="Simple Negligence of duties that causes an error with minimal business impact"
                    lvl="1"
                    c1="Verbal Warning"
                    c2="Written Warning"
                    c3="Final Written Warning"
                    c4="Admin Hearing/ Termination"
                    c5=""
                />
                <VRow
                    no="2"
                    desc={
                        "Insubordination by an employee to any order by his superior without any valid reason such as but not limited to:\na. Refusal to accept work schedule or shift assignment\nb. Refusal to be assigned to another department or unit."
                    }
                    lvl="2"
                    c1="Written Warning"
                    c2="Final Written Warning"
                    c3="Admin Hearing/ Termination"
                    c4=""
                    c5=""
                />
                <VRow
                    no="3"
                    desc={
                        "Any work or call avoidance types which include but are not limited to:\na. Not answering a critical call/lead or service call/lead.\nb. Intentionally disconnecting a call.\nc. Failure to respond to customer emails"
                    }
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="4"
                    desc={
                        "Gross Negligence of duties that causes an error with significant business impact:\na. Huge company loss\nb. Anything prejudicial to the image or reputation of the company."
                    }
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="5"
                    desc="Performing any act that would result in hindering one's productivity or attempt to violate the company's productivity"
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="6"
                    desc="Failure of the employee to improve and meet the job standard of task and responsibilities after being coached and given a chance to improve; Failing the company's performance improvement plan."
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="7"
                    desc="Enticing and instigating any act that can cause any delay or hinder job output."
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="8"
                    desc="Unauthorized staying in an area to cause disruption of work."
                    lvl="1"
                    c1="Verbal Warning"
                    c2="Written Warning"
                    c3="Final Written Warning"
                    c4="Admin Hearing/ Termination"
                    c5=""
                />
            </View>

            <View style={{ height: 8 }} />
            <Text style={[styles.bold, { marginBottom: 4 }]}>
                Health and Security
            </Text>
            <View style={styles.violTable}>
                <VHeader />
                <VRow
                    no="1"
                    desc={
                        "Non-Observance of proper housekeeping such as but not limited to:\na. Proper disposal of waste materials\nb. Failure to observe ClayGo (Clean as you go)"
                    }
                    lvl="1"
                    c1="Verbal Warning"
                    c2="Written Warning"
                    c3="Final Written Warning"
                    c4="Admin Hearing/ Termination"
                    c5=""
                />
                <VRow
                    no="2"
                    desc={
                        "Creating or doing unsanitary acts inside the production floor such as but not limited to:\na. Eating inside the production floor.\nb. Failure to use the spill-proof mug."
                    }
                    lvl="2"
                    c1="Written Warning"
                    c2="Final Written Warning"
                    c3="Admin Hearing/ Termination"
                    c4=""
                    c5=""
                />
                <VRow
                    no="3"
                    desc="Non-disclosure of contagious diseases which may endanger the lives of other employees"
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="4"
                    desc="Using or manufacturing and selling illegal drugs or drug paraphernalia, while on duty or inside the company's premises"
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="5"
                    desc="Working while under the influence of illegal drugs or intoxicated."
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="6"
                    desc="Bringing in of alcoholic drinks or beverages."
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="7"
                    desc="Unauthorized carrying and possession of any firearms, explosive, and sharp objects inside the company"
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="8"
                    desc="Any form of harassment including but not limited to sexual harassment."
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="9"
                    desc="Gambling inside the company premises"
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="10"
                    desc="Gossiping and Rumor-mongering"
                    lvl="1"
                    c1="Verbal Warning"
                    c2="Written Warning"
                    c3="Final Written Warning"
                    c4="Admin Hearing/ Termination"
                    c5=""
                />
                <VRow
                    no="11"
                    desc="Unauthorized representation to external parties and customers."
                    lvl="2"
                    c1="Written Warning"
                    c2="Final Written Warning"
                    c3="Admin Hearing/ Termination"
                    c4=""
                    c5=""
                />
                <VRow
                    no="12"
                    desc="Failure to follow the provisions of the Left and Lost ID Policy."
                    lvl="1"
                    c1="Verbal Warning"
                    c2="Written Warning"
                    c3="Final Written Warning"
                    c4="Admin Hearing/ Termination"
                    c5=""
                />
            </View>

            <PageFooter pageNum="4" total="5" />
        </Page>

        {/* ══ PAGE 5 — Facilities table + Approvers + Acknowledgement ══════════ */}
        <Page size="A4" style={styles.page}>
            <PageHeader showTitle={false} />

            <Text style={[styles.bold, { marginBottom: 4 }]}>
                Company's Facilities and Properties
            </Text>
            <View style={styles.violTable}>
                <VHeader />
                <VRow
                    no="1"
                    desc="Mishandling of the company's facilities or any unauthorized shifting and replacing of the furniture or any facilities"
                    lvl="1"
                    c1="Verbal Warning"
                    c2="Written Warning"
                    c3="Final Written Warning"
                    c4="Admin Hearing/ Termination"
                    c5=""
                />
                <VRow
                    no="2"
                    desc="Accessing websites or bringing provocative or pornographic materials."
                    lvl="2"
                    c1="Written Warning"
                    c2="Final Written Warning"
                    c3="Admin Hearing/ Termination"
                    c4=""
                    c5=""
                />
                <VRow
                    no="3"
                    desc="Divulging of confidential information of the company and its accounts to competitors and any unauthorized persons."
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="4"
                    desc={
                        "Any fraudulent acts which includes but not limited to:\na. Use or submission of fake or forged documents\nb. Falsification of documents\nc. Intentional deception to secure unfair or unlawful gain"
                    }
                    lvl="3"
                    c1="Admin Hearing/ Termination"
                    c2=""
                    c3=""
                    c4=""
                    c5=""
                />
                <VRow
                    no="5"
                    desc="Bringing and using of mobile phones in non-designated areas."
                    lvl="1"
                    c1="Verbal Warning"
                    c2="Written Warning"
                    c3="Final Written Warning"
                    c4="Admin Hearing/ Termination"
                    c5=""
                />
                <VRow
                    no="6"
                    desc="Failure to follow Building House Rules Policy"
                    lvl="1"
                    c1="Verbal Warning"
                    c2="Written Warning"
                    c3="Final Written Warning"
                    c4="Admin Hearing/ Termination"
                    c5=""
                />
            </View>

            <Text style={[styles.paragraph, { marginTop: 8 }]}>
                The code of conduct will serve as the core basis for all the
                rules and procedures of the company if other policies are deemed
                to be inconsistent; we are to follow the said policies as above
                mentioned.
            </Text>

            {/* Approvers */}
            <Text style={[styles.bold, { marginTop: 10, marginBottom: 6 }]}>
                Approver:
            </Text>
            <View style={styles.approverRow}>
                <View style={styles.approverCol}>
                    <Text style={styles.approverLabel}>SGD: Fawad Nasir</Text>
                    <View style={styles.approverLine} />
                    <Text style={styles.approverLabel}>CEO/President</Text>
                </View>
                <View style={styles.approverCol}>
                    <Text style={styles.approverLabel}>
                        SGD: Bianca S. Alesna
                    </Text>
                    <View style={styles.approverLine} />
                    <Text style={styles.approverLabel}>Human Resource</Text>
                </View>
                <View style={styles.approverCol}>
                    <Text style={styles.approverLabel}>
                        SGD: Cielo V. Cupta
                    </Text>
                    <View style={styles.approverLine} />
                    <Text style={styles.approverLabel}>
                        Gen. Site Operations Manager
                    </Text>
                </View>
            </View>

            {/* Acknowledgement */}
            <Text style={[styles.bold, { marginTop: 10, marginBottom: 4 }]}>
                Acknowledgments and Confirmation:
            </Text>
            <Text style={styles.paragraph}>
                I fully understand the revised Code of Conduct and Discipline
                and hereby affix my signature as confirmation that I have
                acknowledged its contents and is not made in threat or under
                duress.
            </Text>

            <View style={styles.sigBlock}>
                <Text style={styles.sigLabel}>
                    Name of Employee: _______________________________
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                        marginTop: 8,
                    }}
                >
                    <Text style={{ fontSize: 10, marginRight: 8 }}>
                        Signature:
                    </Text>
                    <View style={styles.sigLine} />
                    <Text
                        style={{ fontSize: 10, marginLeft: 20, marginRight: 8 }}
                    >
                        Date Signed:
                    </Text>
                    <View style={[styles.sigLine, { width: 100 }]} />
                </View>
            </View>

            <Text style={styles.confidential}>
                CONFIDENTIAL AND PROPRIETARY
            </Text>

            <PageFooter pageNum="5" total="5" />
        </Page>
    </Document>
);

// ── Web wrapper ──────────────────────────────────────────────────────────────
const CodeOfConductAndDisciplineSection = () => (
    <PDFLoader pdf={<CodeOfConductDocument />} />
);

export default CodeOfConductAndDisciplineSection;
