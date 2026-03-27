import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
    Image,
} from "@react-pdf/renderer";

// Define styles matching the actual document with optimized spacing
const styles = StyleSheet.create({
    page: {
        padding: 70,
        paddingTop: 35,
        paddingBottom: 50,
        fontFamily: "Helvetica",
        fontSize: 9,
        position: "relative",
    },
    title: {
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
        textAlign: "center",
        marginBottom: 15,
        color: "#1e3a8a",
    },
    sectionTitle: {
        fontFamily: "Helvetica-Bold",
        fontSize: 10,
        marginTop: 8,
        marginBottom: 4,
    },
    text: {
        fontSize: 10.5,
        marginBottom: 5,
        lineHeight: 1.3,
        textAlign: "justify",
    },
    bold: {
        fontFamily: "Helvetica-Bold",
    },
    center: {
        textAlign: "center",
    },
    signatureRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 25,
        marginBottom: 15,
    },
    signatureBlock: {
        width: "45%",
    },
    signatureLine: {
        borderBottomWidth: 1,
        borderBottomColor: "#000000",
        marginTop: 20,
        marginBottom: 5,
        width: "100%",
    },
    witnessRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        marginBottom: 15,
    },
    witnessBlock: {
        width: "45%",
    },
    witnessLine: {
        borderBottomWidth: 1,
        borderBottomColor: "#000000",
        marginTop: 8,
        marginBottom: 5,
        width: "100%",
    },
    // Table styles for Acknowledgement
    acknowledgementTable: {
        marginTop: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#000000",
    },
    tableHeaderRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000000",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000000",
        minHeight: 28,
    },
    tableHeaderCell: {
        padding: 4,
        fontFamily: "Helvetica-Bold",
        fontSize: 8,
        textAlign: "center",
        borderRightWidth: 1,
        borderRightColor: "#000000",
    },
    tableCell: {
        padding: 4,
        fontSize: 8,
        textAlign: "center",
        borderRightWidth: 1,
        borderRightColor: "#000000",
    },
    col1: {
        width: "30%",
    },
    col2: {
        width: "30%",
    },
    col3: {
        width: "40%",
    },
    noBorder: {
        borderRightWidth: 0,
    },
    indentText: {
        marginLeft: 20,
        marginBottom: 5,
        fontSize: 9,
    },
    disclaimer: {
        position: "absolute",
        bottom: 15,
        left: 40,
        right: 40,
        fontSize: 7,
        textAlign: "center",
        color: "#666666",
        borderTopWidth: 0.5,
        borderTopColor: "#cccccc",
        paddingTop: 5,
    },
    pageNumber: {
        position: "absolute",
        bottom: 15,
        right: 40,
        fontSize: 7,
        color: "#666666",
    },
    headerDisclaimer: {
        fontSize: 7,
        textAlign: "center",
        color: "#666666",
        marginBottom: 8,
        lineHeight: 1.2,
    },
    whereClause: {
        marginTop: 5,
        marginBottom: 5,
    },
    logo: {
        width: "70%", // width in points
        height: 80, // height in points
        marginBottom: 20,
    },
    logoContainer: {
        display: "flex",
        flexDirection: "column", // stack items vertically
        alignItems: "center", // horizontal center
        justifyContent: "center", // vertical center
        marginBottom: 20,
    },
});

// Disclaimer component for each page
const PageFooter = ({ pageNumber, totalPages }) => (
    <>
        <Text style={styles.disclaimer}>
            Disclaimer: This document and its contents are the property of
            EmpireOne BPO Solutions, Inc. and are intended for internal use
            only. Unauthorized reproduction, disclosure, or distribution of this
            material, in whole or in part, without prior written permission from
            the company is strictly prohibited.
        </Text>
        <Text style={styles.pageNumber}>
            Page {pageNumber} of {totalPages}
        </Text>
    </>
);

const EmploymentContract = () => (
    <Document>
        {/* PAGE 1 */}
        <Page size="A4" style={styles.page}>
            <PageFooter pageNumber={1} totalPages={7} />
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    src="/images/eo-full-logo.png" // local or remote URL
                />
            </View>
            <Text style={styles.title}>EMPLOYMENT CONTRACT</Text>

            <Text style={[styles.text, { marginBottom: 20 }]}>
                THIS EMPLOYMENT CONTRACT, is made and entered into on ___ day of
                ___________, 2026, by and between:
            </Text>

            <Text style={[styles.text, { marginBottom: 20 }]}>
                <Text style={styles.bold}>EmpireOne BPO Solutions Inc.</Text> a
                corporation organized and existing under the laws of the
                Republic of the Philippines, with principal office address at
                EmpireOne Bldg., S. Carmona St., Brgy. VI, San Carlos City,
                Negros Occidental, represented herein by its Human Resource
                Lead, Apple Loraine Mag-usara, (hereinafter referred to as the
                "Employer")
            </Text>

            <Text
                style={[
                    styles.text,
                    styles.center,
                    { marginTop: 20, marginBottom: 20 },
                ]}
            >
                -- and –
            </Text>

            <Text style={[styles.text, { marginBottom: 20 }]}>
                ____________________________, of legal age, Filipino, and a
                resident of _______________________________________________ in
                the Province of Negros __________________, (hereinafter referred
                to as the "Employee")
            </Text>

            <Text
                style={[
                    styles.text,
                    styles.bold,
                    { marginTop: 5, marginBottom: 20, textAlign: "center" },
                ]}
            >
                WITNESSETH:
            </Text>

            <Text style={[styles.text, { marginBottom: 20 }]}>
                WHEREAS, EmpireOne BPO Solutions Inc., (the "Company") is
                engaged in the business of Business Process Outsourcing;
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                WHEREAS, the EMPLOYEE has expressed interest in accepting the
                position and is willing to fulfill the duties and
                responsibilities associated with the role;
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                WHEREAS, the parties agree that the EMPLOYEE shall undergo a
                probationary period of six (6) months, during which performance
                and suitability for regular employment will be evaluated;
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                WHEREAS, the EMPLOYEE acknowledges the conditions of employment,
                including the terms and benefits applicable during the
                probationary period as outlined in this Agreement;
            </Text>

            <Text style={[styles.text, { marginBottom: 20 }]}>
                NOW, THEREFORE, for and in consideration of the foregoing
                premises, the Parties hereby agree as follows:
            </Text>
        </Page>

        {/* PAGE 2 */}
        <Page size="A4" style={[styles.page, , { marginBottom: 20 }]}>
            <PageFooter pageNumber={2} totalPages={7} />

            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
                1. Position and Duties
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                The Employee shall be employed as a Customer Service
                Representative, reporting to James Kenneth De Arce. The Employee
                agrees to faithfully and diligently perform the duties described
                in Annex A, and any related tasks assigned by the Employer,
                subject to lawful changes or reassignments based on operational
                needs.
            </Text>

            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
                2. Term of Employment
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                The Employee shall undergo a probationary period of six (6)
                months, beginning on March 02, 2026 and ending on August 28,
                2026 (the "probationary period"). During this period, the
                Employee shall be evaluated based on standards made known at the
                time of engagement, including but not limited to attendance,
                performance, behavior, suitability for regular employment,
                communication skills, productivity, and adherence to company and
                client standards.
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                If the Employee meets the company's performance standards and no
                written notice of termination is issued before the end of the
                probationary period, the Employee shall be deemed regularized
                and shall continue in employment under the same terms, subject
                to company policy and applicable law.
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                The Employee is required to comply with the all existing rules,
                regulations and policies of the Employer as well as those which
                may hereafter be issued, including but not limited to those
                governing order and discipline, honesty, safety and security,
                work assignments and standard operating procedures, use of
                Company properties and access to matters of confidentiality, and
                such other rules deemed necessary in the conduct of business.
            </Text>

            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
                3. Compensation and Benefit
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                The Employee, during the term of his employment, shall be paid a
                gross monthly salary of TWELVE THOUSAND PESOS PHP 12,000.00
                payable in equal semi-monthly installments, subject to
                applicable statutory deductions. Upon regularization, the
                Employee will receive the same monthly salary or any adjustment
                as may be agreed upon. Additionally, the EMPLOYEE will be
                entitled to full company benefits, including but not limited to
                the 13th Month Pay, leave credits, and other benefits as may be
                provided under company policy and applicable laws.
            </Text>

            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
                4. Pre-Employment Requirements
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                The Employee must submit the medical examination results prior
                to the start of employment, as a priority, while all other
                required pre-employment documents shall be submitted within one
                (1) month from the commencement of employment.
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                Failure to comply with this requirement within the stipulated
                period shall constitute grounds for non-regularization.
            </Text>
        </Page>

        {/* PAGE 3 */}
        <Page size="A4" style={styles.page}>
            <PageFooter pageNumber={3} totalPages={7} />

            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
                5. Training Cost Reimbursement
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                In consideration of the Employer's investment in the onboarding,
                training, and development of the Employee, the Employee agrees
                that if they resign without just cause during the probationary
                period, the Employer shall have the right to recover actual and
                reasonable costs in the amount which shall not exceed Ten
                Thousand Pesos (PHP 10,000), supported by documentation.
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                The Employee hereby authorizes the Employer to deduct said
                amount from any final pay, subject to applicable laws. If the
                final pay is insufficient, the Employer reserves the right to
                recover the remaining amount through other lawful means.
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                This clause shall not apply if termination is initiated by the
                Employer or if the Employee's resignation is due to just causes
                provided under the law.
            </Text>

            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
                6. Floating Status Due to Client Exit
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                If the Employer's engagement with the client to which the
                Employee is assigned ends and no immediate reassignment is
                available, the Employee may be placed on temporary off-duty
                ("floating") status for a period not exceeding six (6) months,
                in accordance with Article 301 of the Labor Code. During this
                period, the Employee will not be entitled to salary, but the
                Employer will exert best efforts to reassign the Employee. If no
                assignment is available after 6 months, employment may be deemed
                terminated due to authorized cause, with due notice and
                separation pay.
            </Text>

            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
                7. Termination
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                The Employer reserves the right to terminate the probationary
                employment at any time for just causes, authorized cause, or
                failure to meet the reasonable and lawful performance standards
                communicated to the Employee at the time of hiring. In such
                cases, the Employee shall only be entitled to his/her salary and
                applicable statutory benefits up to the last day of actual
                service. If, at the end of the six-month probationary period,
                the Employee fails to meet the Employer's performance standards,
                the employment shall be deemed terminated due to failure to
                qualify for regular employment. Conversely, if the Employee
                meets the standards, the Employee shall be considered a regular
                employee.
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                The Employee may terminate his employment at any time by
                providing the Employer with at least thirty (30) days advance
                written notice of his intention to resign consistent with
                Philippine Law. During this notice period, the EMPLOYEE is
                expected to complete pending tasks, hand over documentation,
                assist in the training and orientation of replacement, and
                return company property. Failure to comply with this requirement
                may subject the Employee to liquidated damages in favor of the
                Employer worth at least 1 month salary, and shall be deductible
                to the Employee's final pay. By signing this Agreement, the
                Employee gives his/her consent on the deduction of the
                liquidated damages from his/her final pay. This is without
                prejudice to any remedies available to the Employer.
            </Text>
        </Page>

        {/* PAGE 4 */}
        <Page size="A4" style={styles.page}>
            <PageFooter pageNumber={4} totalPages={7} />

            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
                8. Restrictive Covenant and Non-Competition Undertaking
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                During the pendency of this Contract and employment of the
                Employee and even following the termination of the employment of
                the Employee by the Employer, with or without cause, or the
                resignation or voluntary withdrawal by the Employee from the
                Employer, the Employee shall, for a period of one year following
                the said termination or voluntary withdrawal, within the
                provinces of Republic of the Philippines refrain from either
                directly or indirectly soliciting or attempting to solicit the
                business of any client or customer of the Employer for his own
                benefit or that of any third person or organization, and shall
                refrain from either directly or indirectly attempting to obtain
                the withdrawal from the employment by the Employer of any other
                Employee of the Employer having regard to the same geographic
                and temporal restrictions.
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                The Employee shall not directly or indirectly divulge any
                financial information relating to the Employer or any of its
                affiliates or clients to any person whatsoever. Breach of this
                provision shall render the Employee liable to the Employer for
                all damages among others and said violation may be the subject
                of criminal and/or civil action.
            </Text>

            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
                9. Confidentiality
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                The Employee acknowledges that, in the course of performing and
                fulfilling his duties hereunder, he may have access to and be
                entrusted with confidential information concerning the present
                and contemplated financial status and activities of the
                Employer, the disclosure of any of which confidential
                information to competitors of the Employer would be highly
                detrimental to the interests of the Employer. The Employee
                further acknowledges and agrees that the right to maintain the
                confidentiality of such information constitutes a proprietary
                right which the Employer is entitled to protect. Accordingly,
                the Employee covenants and agrees with the Employer that he will
                not, during the continuance of this agreement, disclose any of
                such confidential information to any person, firm or
                corporation, nor shall he use same, except as required in the
                normal course of his engagement hereunder, and thereafter he
                shall not disclose or make use of the same. Breach of this
                provision shall render the Employee liable to the Employer for
                damages among others and said violation may be the subject of a
                civil action.
            </Text>

            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
                10. Dispute Resolution
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                In the event of any dispute arising from this Contract, both
                parties agree to attempt to resolve the matter internally. If no
                resolution is reached, the parties may submit the dispute to
                mediation or arbitration in accordance with Philippine labor
                laws.
            </Text>

            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
                11. Assignment
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                This agreement shall be assigned by the Employer to any
                successor employer and be binding upon the successor employer.
                The Employer shall ensure that the successor employer shall
                continue the provisions of this agreement as if it were the
                original party of the first part. This agreement may not be
                assigned by the Employee.
            </Text>
        </Page>

        {/* PAGE 5 */}
        <Page size="A4" style={styles.page}>
            <PageFooter pageNumber={5} totalPages={7} />

            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
                12. Severability
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                Each paragraph of this agreement shall and remain separate from
                and independent of, and severable from all and any other
                paragraphs herein except where otherwise indicated by the
                context of the agreement. The decision or declaration that one
                or more of the paragraphs are null and void shall have no effect
                on the remaining paragraphs of this agreement.
            </Text>

            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
                13. Notice
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                Any notice required to be given hereunder shall be deemed to
                have been properly given if delivered personally or sent by
                pre-paid registered mail as follows:
            </Text>
            <Text style={styles.indentText}>
                a. to the Employee:
                _________________________________________________
            </Text>
            <Text style={styles.indentText}>
                b. to the Employer: S. Carmona St., Brgy. V, San Carlos City,
                Negros Occidental
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                and if sent by registered mail shall be deemed to have been
                received on the 4th business day of uninterrupted postal service
                following the date of mailing. Either party may change its
                address for notice at any time, by giving notice to the other
                party pursuant to the provisions of this agreement.
            </Text>

            <Text style={[styles.sectionTitle, { marginBottom: 20 }]}>
                14. Interpretation of Agreement
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                The validity, interpretation, construction and performance of
                this agreement shall be governed by the Laws of the Republic of
                the Philippines. This agreement shall be interpreted with all
                necessary changes in gender and in number as the context may
                require and shall insure to the benefit of and be binding upon
                the respective successors and assigns of the parties hereto.
            </Text>

            <Text style={[styles.text, { marginTop: 350 }]}>
                IN WITNESS WHEREOF the parties hereto have caused this agreement
                to be executed as of the ___ day of __________ 2026.
            </Text>

            <View style={styles.signatureRow}>
                <View style={styles.signatureBlock}>
                    <Text style={[styles.text, styles.bold]}>EMPLOYEE</Text>
                    <View style={styles.signatureLine} />
                    <Text style={[styles.text, { marginBottom: 20 }]}>_____________________</Text>
                </View>
                <View style={styles.signatureBlock}>
                    <Text style={[styles.text, styles.bold]}>EMPLOYER</Text>
                    <View style={styles.signatureLine} />
                    <Text style={[styles.text, styles.bold]}>
                        APPLE LORAINE MAG-USARA
                    </Text>
                    <Text style={[styles.text, { marginBottom: 20 }]}>HR LEAD</Text>
                </View>
            </View>

            <Text style={[styles.text, styles.bold, { marginTop: 5 }]}>
                WITNESSES:
            </Text>
            <View style={styles.witnessRow}>
                <View style={styles.witnessBlock}>
                    <View style={styles.witnessLine} />
                    <Text style={[styles.text, { marginBottom: 20 }]}>_____________________</Text>
                </View>
                <View style={styles.witnessBlock}>
                    <View style={styles.witnessLine} />
                    <Text style={[styles.text, { marginBottom: 20 }]}>_____________________</Text>
                </View>
            </View>

            <Text
                style={[
                    [styles.sectionTitle, { marginBottom: 20 }],
                    { marginTop: 8 },
                ]}
            >
                Annexes:
            </Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>
                Annex A: (Please refer to JD of the specific Position under the
                JA and JD folder of HR)
            </Text>
        </Page>

        {/* PAGE 6 - ACKNOWLEDGEMENT */}
        <Page size="A4" style={styles.page}>
            <PageFooter pageNumber={6} totalPages={7} />

            <Text style={styles.title}>ACKNOWLEDGEMENT</Text>

            <Text style={[styles.text, { marginBottom: 20 }]}>REPUBLIC OF THE PHILIPPINES)</Text>
            <Text style={[styles.text, { marginBottom: 20 }]}>San Carlos City) S.S.</Text>

            <Text style={[styles.text, { marginTop: 8, marginBottom: 8 }]}>
                BEFORE ME, a Notary Public for San Carlos City, on this ______
                day of ______ 202 ______
            </Text>

            <Text style={[styles.text, { marginBottom: 5 }]}>
                personally appeared:
            </Text>

            {/* Table exactly matching the image format */}
            <View style={styles.acknowledgementTable}>
                {/* Header Row */}
                <View style={styles.tableHeaderRow}>
                    <View style={[styles.tableHeaderCell, styles.col1]}>
                        <Text>NAME</Text>
                    </View>
                    <View style={[styles.tableHeaderCell, styles.col2]}>
                        <Text>ID NO.</Text>
                    </View>
                    <View
                        style={[
                            styles.tableHeaderCell,
                            styles.col3,
                            styles.noBorder,
                        ]}
                    >
                        <Text>DATE AND PLACE ISSUED/ DATE OF EXPIRY</Text>
                    </View>
                </View>

                {/* Row 1 - Empty */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCell, styles.col1]}>
                        <Text> </Text>
                    </View>
                    <View style={[styles.tableCell, styles.col2]}>
                        <Text> </Text>
                    </View>
                    <View
                        style={[styles.tableCell, styles.col3, styles.noBorder]}
                    >
                        <Text> </Text>
                    </View>
                </View>

                {/* Row 2 - Empty */}
                <View style={styles.tableRow}>
                    <View style={[styles.tableCell, styles.col1]}>
                        <Text> </Text>
                    </View>
                    <View style={[styles.tableCell, styles.col2]}>
                        <Text> </Text>
                    </View>
                    <View
                        style={[styles.tableCell, styles.col3, styles.noBorder]}
                    >
                        <Text> </Text>
                    </View>
                </View>

                {/* Row 3 - Empty */}
                <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                    <View style={[styles.tableCell, styles.col1]}>
                        <Text> </Text>
                    </View>
                    <View style={[styles.tableCell, styles.col2]}>
                        <Text> </Text>
                    </View>
                    <View
                        style={[styles.tableCell, styles.col3, styles.noBorder]}
                    >
                        <Text> </Text>
                    </View>
                </View>
            </View>

            <Text style={[styles.text, { marginTop: 8 }]}>
                known to me to be the persons who executed the foregoing
                document and acknowledged to me that the same is their free and
                voluntary act and deed.
            </Text>

            <Text style={[styles.text, { marginTop: 5 }]}>
                This instrument, which refers to an Employment Contract,
                consisting of seven (7) pages, including the page whereon this
                Acknowledgement is written, is signed by the parties and their
                instrumental witnesses on each and every page thereof.
            </Text>

            <Text style={[styles.text, { marginTop: 8 }]}>
                WITNESS MY HAND AND SEAL this _____________________ at
                ____________________, Philippines.
            </Text>

            <View style={{ marginTop: 12 }}>
                <Text style={[styles.text, { marginBottom: 20 }]}>Doc.No. ____;</Text>
                <Text style={[styles.text, { marginBottom: 20 }]}>Page No. ____;</Text>
                <Text style={[styles.text, { marginBottom: 20 }]}>Book No. ____;</Text>
                <Text style={[styles.text, { marginBottom: 20 }]}>Series of 2026</Text>
            </View>
        </Page>
    </Document>
);

// Main component for rendering
export default function ContractPDFViewer() {
    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            <PDFViewer
                style={{ width: "100%", height: "100%", border: "none" }}
            >
                <EmploymentContract />
            </PDFViewer>
        </div>
    );
}
