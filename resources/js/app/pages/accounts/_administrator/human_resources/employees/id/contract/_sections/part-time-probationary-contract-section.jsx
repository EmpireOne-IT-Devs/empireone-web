import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import { useDispatch } from "react-redux";
import moment from "moment";
import PDFLoader from "@/app/_components/pdf-loader";
import numberToWords from "number-to-words";

const styles = StyleSheet.create({
    page: {
        padding: 50,
        paddingTop: 30,
        paddingBottom: 40,
        fontFamily: "Times-Roman",
        fontSize: 9.5,
        position: "relative",
    },
    logoContainer: {
        marginBottom: 10,
    },
    logo: {
        width: 140,
        height: 45,
        objectFit: "contain",
    },
    text: {
        fontSize: 9.5,
        marginBottom: 8,
        lineHeight: 1.35,
        textAlign: "justify",
    },
    bold: {
        fontFamily: "Times-Bold",
    },
    sectionTitle: {
        fontFamily: "Times-Bold",
        fontSize: 9.5,
        marginTop: 6,
        marginBottom: 4,
    },
    listIndent: {
        marginLeft: 15,
        marginBottom: 4,
    },
    subListIndent: {
        marginLeft: 30,
        marginBottom: 4,
    },
    signatureRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 40,
    },
    signatureBlock: {
        width: "45%",
    },
    signatureLine: {
        borderBottomWidth: 1,
        borderBottomColor: "#000000",
        marginTop: 35,
        marginBottom: 4,
        width: "100%",
    },
    pageNumber: {
        position: "absolute",
        bottom: 20,
        right: 50,
        fontSize: 8,
        color: "#444444",
    },
});

const PageFooter = ({ pageNumber }) => (
    <Text style={styles.pageNumber}>Page {pageNumber} of 7</Text>
);

const PartTimeProbationaryContract = ({ data }) => {
    const salaryInWords = data?.salary
        ? numberToWords.toWords(Number(data.salary)).toUpperCase()
        : "<Monthly Salary in Words>";
    const salaryInFigures = Number(data?.salary || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <Document>
            {/* PAGE 1 */}
            <Page size="A4" style={styles.page}>
                <PageFooter pageNumber={1} />
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} src="/images/E1CXlogo.png" />
                </View>

                <Text style={[styles.text, styles.bold, { marginBottom: 12 }]}>
                    {data?.contract_signed_at
                        ? moment(data.contract_signed_at).format("LL")
                        : ""}
                </Text>

                <Text style={[styles.text, styles.bold, { marginBottom: 12 }]}>
                    {data?.employee_name}
                </Text>

                <Text style={[styles.text, { marginBottom: 10 }]}>
                    Dear {data?.first_name},
                </Text>

                <Text style={styles.text}>
                    EmpireOne BPO Solutions Inc. (the Company) is pleased to offer you{" "}
                    <Text style={styles.bold}>part-time probationary employment</Text> as a{" "}
                    <Text style={styles.bold}>{data?.position}</Text> under the terms and conditions of this employment contract (the Contract), as follows:
                </Text>

                <Text style={styles.sectionTitle}>1. Date of Hire</Text>
                <Text style={styles.text}>
                    Your date of hire will be effective{" "}
                    <Text style={styles.bold}>
                        {data?.started_at ? moment(data.started_at).format("LL") : ""}
                    </Text>
                    . Any change to this commencement date must be mutually agreed upon in writing. The employment relationship, including the accrual of salary and benefits, shall officially begin only upon your actual reporting for work on the finalized effective date.
                </Text>

                <Text style={styles.sectionTitle}>2. Work Schedule/Place of Assignment</Text>
                <Text style={styles.text}>
                    You are generally expected to render at least 20 hours in a 5-day work-week but not necessarily with two (2) consecutive days off.
                </Text>
                <Text style={styles.text}>
                    As the Company operates 24 hours per day and 7 days a week, it may, at its sole discretion and prerogative, reasonably change work schedules as may be necessary and/or as dictated by exigencies and business requirements of the Company.
                </Text>
                <Text style={styles.text}>
                    Due to the nature of the business, you may be required to report for work during Philippine regular holidays special (non-working) holidays, special working holidays, weekends, and other days as may be necessary to meet operational requirements.
                </Text>
                <Text style={styles.text}>
                    You understand that work schedules, shifts, rest days, and holiday assignments shall be determined solely by the Company based on legitimate business needs, client requirements, workforce planning, and operational exigencies. The Company reserves the right to assign, modify, or reassign your work schedule, including requiring attendance on holidays, subject to applicable laws, reasonable notice whenever practicable, and the Company's policies.
                </Text>
                <Text style={styles.text}>
                    You agree to comply with lawful work schedules and holiday work assignments issued by the Company. Failure or refusal to report for a duly scheduled shift on a holiday without a valid and authorized reason may be treated as an attendance or disciplinary matter in accordance with the Company's Code of Conduct and Discipline and applicable labor laws.
                </Text>
                <Text style={styles.text}>
                    Any work performed on Philippine regular holidays, special (non-working) holidays, or other holidays recognized by law shall be compensated in accordance with the applicable provisions of the Labor Code of the Philippines, its Implementing Rules and Regulations, Department of Labor and Employment (DOLE) issuances, and other applicable laws, including payment of the appropriate holiday premium, overtime pay, night shift differential, and other statutory benefits, when applicable.
                </Text>
                <Text style={styles.text}>
                    You agree to be assigned to any location that may be determined by the Company as the need arises, without expectation of any additional compensation. You further agree that this employment agreement may be assigned by the Company to any of its affiliates or subsidiaries without your consent. In addition, this agreement shall be assignable by the Company without your consent in the event that the Company is acquired by or merged into another corporation or business entity. The benefits and obligations of this agreement shall be binding upon and inure to the parties hereto, to the Company's successors and assigns.
                </Text>

                <Text style={styles.sectionTitle}>3. Terms of Employment</Text>
                <Text style={[styles.text, styles.listIndent]}>
                    a) The Employee is engaged on a part-time probationary employment for a period of <Text style={styles.bold}>180 days</Text> commencing on {data?.started_at ? moment(data.started_at).format("LL") : "[start date]"}, and shall continue in full force and effect unless terminated by either party in accordance with the provisions of this Contract, the Company's policies, and/or the applicable provisions of the Labor Code of the Philippines, as amended.
                </Text>
                <Text style={[styles.text, styles.listIndent]}>
                    b) Notwithstanding the part-time probationary nature of this engagement, the Employee shall be entitled to such rights, benefits, and protections as are proportionate to actual hours or days worked, and as may be required under existing labor laws, rules, and regulations, and Company policy.
                </Text>
            </Page>

            {/* PAGE 2 */}
            <Page size="A4" style={styles.page}>
                <PageFooter pageNumber={2} />
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} src="/images/E1CXlogo.png" />
                </View>

                <Text style={styles.sectionTitle}>4. Employment Status</Text>
                <Text style={[styles.text, styles.listIndent]}>
                    a) Considering that you are employed on a part-time basis and are scheduled to render twenty (20) hours of work per week, you acknowledge that your work schedule and the total number of hours actually rendered may differ from those of full-time employees. Nevertheless, your part-time employment shall commence on <Text style={styles.bold}>{data?.started_at ? moment(data.started_at).format("LL") : "«HIRE_DATE»"}</Text> and may not exceed the probationary period from such date, in accordance with Article 296 [281] of the Labor Code of the Philippines, as amended.
                </Text>
                <Text style={[styles.text, styles.listIndent]}>
                    During the probationary period, your employment shall be subject to continuous evaluation based on the reasonable standards communicated to you at the commencement of your employment. Such standards shall include, but are not limited to, your work quality, productivity, attendance, punctuality, adherence to client requirements, compliance with Company policies, Code of Conduct and Discipline, information security and data privacy requirements, and such other performance metrics applicable to your position.
                </Text>
                <Text style={[styles.text, styles.listIndent]}>
                    The Company reserves the right to terminate your part-time employment within the probationary period at any time if upon evaluation, the Company has determined that you failed to meet the standards such as but not limited to the following:
                </Text>

                <Text style={[styles.text, styles.subListIndent]}>i. Successful and satisfactory passing of training;</Text>
                <Text style={[styles.text, styles.subListIndent]}>ii. Productivity;</Text>
                <Text style={[styles.text, styles.subListIndent]}>iii. Attendance and punctuality;</Text>
                <Text style={[styles.text, styles.subListIndent]}>iv. Dependability, efficiency, initiative, educability, articulateness;</Text>
                <Text style={[styles.text, styles.subListIndent]}>v. Professionalism and good attitude towards work, your co-employees and the Company; and</Text>
                <Text style={[styles.text, styles.subListIndent]}>vi. Any other performance metrics that may be required by your program/department.</Text>

                <Text style={[styles.text, { marginTop: 4 }]}>
                    You understand and agree that the foregoing standards may vary in different accounts which in turn may be covered by a separate agreement.
                </Text>
                <Text style={styles.text}>
                    In evaluating your suitability for regular employment, the Company shall take into consideration the nature of your part-time work arrangement, including your actual scheduled workdays and hours rendered, so that your performance is assessed fairly based on the work opportunities made available to you.
                </Text>
                <Text style={styles.text}>
                    Upon satisfactory completion of the probationary period and upon meeting the prescribed standards for regular employment, you shall be considered a regular employee with respect to the activities for which you are employed, without prejudice to the continuation of your part-time work arrangement, unless otherwise agreed in writing by the parties.
                </Text>

                <Text style={[styles.text, styles.listIndent]}>
                    b) During your probationary period, you are not entitled to vacation and/or sick leaves. Neither shall you be entitled to any other benefits that are or may hereafter be granted to regular employees, except those provided by law and those which the Company, as a matter of policy and upon its discretion, extends to all employees regardless of employment status.
                </Text>
                <Text style={[styles.text, styles.listIndent]}>
                    c) It is understood and agreed that the Company retains its legal and exclusive prerogative to terminate your services, at anytime during the probationary period for just and authorized causes provided under the Labor Code, as well as applicable laws, rules and regulations.
                </Text>
                <Text style={[styles.text, styles.listIndent]}>
                    d) The Company reserves the right to temporarily suspend work or place the Employee on temporary off-detail or work suspension, upon reasonable notice, due to legitimate business reasons including but not limited to lack of client requirements, declining business volume, temporary cessation of operations, force majeure, or other analogous circumstances, subject to applicable laws and regulations.
                </Text>
                <Text style={[styles.text, styles.listIndent]}>
                    e) You are aware that you are being employed under the express condition that you are not suffering from any disqualification or prohibition either by reason of law, regulations or policies, or by contract to serve as <Text style={styles.bold}>{data?.position || "«DESIGNATION»"}</Text> for the Company. You represent and warrant that your performance of all the terms of this Contract and your employment by the Company does not and will not breach any agreement(s) to which you are a party. You further represent that you have not entered into, and will not enter into, any agreement, either written or oral, in conflict with your obligations under this Contract.
                </Text>
            </Page>

            {/* PAGE 3 */}
            <Page size="A4" style={styles.page}>
                <PageFooter pageNumber={3} />
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} src="/images/E1CXlogo.png" />
                </View>

                <Text style={styles.sectionTitle}>5. Remuneration</Text>
                <Text style={styles.text}>
                    You will be paid a gross hourly basic salary of <Text style={styles.bold}>{salaryInWords}</Text> (PHP <Text style={styles.bold}>{salaryInFigures}</Text>) payable fortnightly (every two weeks), subject to deductions that the Company is authorized or required by law to make, such as, but not limited to, withholding tax, SSS premium, Philhealth and Pag-ibig contributions.
                </Text>

                <Text style={styles.sectionTitle}>6. Benefits</Text>
                <Text style={styles.text}>
                    If applicable, you may be entitled to account specific allowances and/or bonuses that may be covered by a separate agreement.
                </Text>
                <Text style={styles.text}>
                    It is expressly agreed that any bonuses or allowances beyond those mandated by law are granted at the Company's sole discretion. The grant of such benefits in one instance does not create a vested right or a precedent for future entitlement, the Company reserves the right to discontinue or revise at any time, at its sole discretion. Furthermore, incidents when the Company grants any bonus, benefit or other payment in excess of those enumerated in this Contract shall not be considered as an established practice or precedent, and shall not form part of those due and demandable herein.
                </Text>

                <Text style={styles.sectionTitle}>7. Company Policies and Procedures</Text>
                <Text style={styles.text}>
                    EmpireOne BPO Solutions Inc. employees set the standard for ethical business conduct. As an employee of the Company, you are required to review the Employee Handbook and the Code of Conduct and agree to faithfully comply with it. You are also required to observe and abide by the Company's business ethics and philosophy, as well as the policies and procedures governing the same.
                </Text>
                <Text style={styles.text}>
                    As the Company maintains a drug-free environment, the Company reserves the right to implement a random drug testing, pre-employment drug testing, and drug testing "for cause" as stated in the Company's policies and procedures without prejudice to the provisions of all applicable laws. Any employee testing positive for illicit drug use will be subject to appropriate action which may include termination of employment.
                </Text>
                <Text style={styles.text}>
                    The Company may from time to time, and, after such issuance, discontinue, amend or change, certain personnel policies, procedures and/or practices as may be determined as necessary by the Company. You agree that such policies, procedures, and/or practices shall, when promulgated and issued, form an integral part of the terms and conditions of this Contract, and as such, you agree to comply with the same.
                </Text>

                <Text style={styles.sectionTitle}>8. Floating Status Due to Client Exit</Text>
                <Text style={styles.text}>
                    In the event that the Employer's engagement with the client, account, program, project, or undertaking to which the Employee is assigned ends, is suspended, reduced, or otherwise results in the unavailability of work for the Employee, and no immediate suitable reassignment is available, the Employee may, when legally permissible and subject to the Employer's compliance with applicable labor laws and regulations, be placed on temporary off-duty or "floating" status for a period not exceeding six (6) months.
                </Text>
                <Text style={styles.text}>
                    During a valid period of floating status, the Employee shall not be entitled to regular salary or other compensation for periods during which no work is rendered, consistent with the applicable no work, no pay principle. The Employer shall exert reasonable and good-faith efforts to identify and offer available work or reassignment opportunities to the Employee, subject to business requirements, available positions, qualifications, client requirements, and applicable company policies.
                </Text>
                <Text style={styles.text}>
                    The Employee shall be required to participate in the Employer's applicable assessment, screening, interview, training, or qualification process for available reassignment opportunities. A regular employee may be endorsed to Recruitment for interview and/or transfer to another account up to three (3) times, subject to the availability of suitable vacancies and the Employer's applicable reassignment procedures. Failure to pass Training Standards shall be dealt with in accordance with the appropriate provision of the Code of Conduct and shall warrant a Corrective Action up to and including Termination with due process. Redeployed probationary employees will be endorsed for non – regularization if s/he fails training standards due to performance or attendance.
                </Text>
                <Text style={styles.text}>
                    The Employee is expected to reasonably cooperate with and attend scheduled assessment, interview, screening, or other activities related to potential reassignment. Failure or refusal to attend, participate in, or comply with a legitimate and properly communicated reassignment or assessment activity, without a valid and reasonable justification, may be addressed under the applicable provisions of the Company's Code of Conduct and may
                </Text>
            </Page>

            {/* PAGE 4 */}
            <Page size="A4" style={styles.page}>
                <PageFooter pageNumber={4} />
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} src="/images/E1CXlogo.png" />
                </View>

                <Text style={styles.text}>
                    result in corrective or disciplinary action, up to and including termination of employment, subject to due process and applicable law.
                </Text>

                <Text style={styles.sectionTitle}>9. Termination / Resignation</Text>
                <Text style={styles.text}>
                    In case your employment is terminated as provided for under Section 4 hereof, except in case of termination due to an authorized cause, or if your employment is terminated for just cause, the Company shall have no obligation to you other than to pay you that portion of your salary due to you for your services rendered to the Company up to and including the effective date of such termination.
                </Text>
                <Text style={styles.text}>
                    In the event that you wish to resign for any reason, you are required to give the Company a thirty (30) day written notice prior to the effective date of your resignation. During this period, you shall continue to report for work and ensure a proper turn-over of all your duties and responsibilities to the other employees, including Company records, documents, properties, equipment and other materials in your possession and custody. Otherwise, you acknowledge the Company's right to terminate your employment instead and to hold you liable for damages.
                </Text>
                <Text style={styles.text}>
                    Should you have unpaid or pending obligations or liabilities to the Company, monetary or otherwise, upon the termination of your employment, or upon your resignation from the Company, you expressly agree and authorize the Company to deduct from the salary, bonuses and any other amounts or benefits that may be due you, any and all amounts necessary to offset or effect settlement/payment of your said obligations, without prejudice to its right to hold you liable for any remaining balance, including filing of the appropriate legal action to collect such amount without need of further demand.
                </Text>

                <Text style={styles.sectionTitle}>10. Conflict of Interest.</Text>
                <Text style={styles.text}>
                    You shall refrain from engaging in any activity which will be prejudicial to the interests of the Company or which will interfere with the performance of your job, whether within or outside the office hours. Furthermore, you will not accept any other employment, position, appointment, or engagement during the period of your employment with the Company, without the prior written approval of the Company. Neither will you engage in any activity during office hours, whether personal or official , that will constitute potential conflict of interest between you and the Company.
                </Text>

                <Text style={styles.sectionTitle}>11. Accountability</Text>
                <Text style={styles.text}>
                    You agree that all records, documents and properties of the Company or its clients in your custody shall be immediately surrendered, if requested during employment period, and the termination thereof, whether or not requested.
                </Text>
                <Text style={styles.text}>
                    You also agree that you shall be held solely responsible, accountable for all funds and properties that are entrusted to you or otherwise come into your possession by reason of your position and in the performance of your duties. Accordingly, you are obligated to return to the Company any excess, and restore to it any shortage or deficiency to the Company, immediately upon your discovery thereof or when demanded by the Company.
                </Text>

                <Text style={styles.sectionTitle}>12. Email/Personal Computer/Telephone Calls</Text>
                <Text style={styles.text}>
                    EmpireOne BPO Solutions Inc and/or his duly authorized representative/s, shall be allowed access to your Company-assigned personal computer and/or E-mail Account for whatever purpose during the duration of your employment with the Company, this being expressly understood that such equipment/account is owned by the Company.
                </Text>
                <Text style={styles.text}>
                    You acknowledge that the Company may intercept, monitor, and/or record any and all incoming and outgoing telephone calls and emails for purposes of quality control checks, to ensure your compliance with the Company's policies and procedures, and for training, educational and corrective action purposes. You freely and voluntarily give your consent to the Company to intercept, monitor and/or record all outgoing and incoming calls and emails.
                </Text>

                <Text style={styles.sectionTitle}>13. Training Bond</Text>
                <Text style={styles.text}>
                    You also agree that in the event that the Company sponsors you to a local and/or international external training, conventions, conferences or seminars, the Company has the option to enforce equitable reimbursement of the cost of such training in the event of your resignation within a specified period of time which shall be set forth in a
                </Text>
            </Page>

            {/* PAGE 5 */}
            <Page size="A4" style={styles.page}>
                <PageFooter pageNumber={5} />
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} src="/images/E1CXlogo.png" />
                </View>

                <Text style={styles.text}>
                    separate training agreement or training bond to be executed prior to attending the sponsored training, seminar, convention, or conference. You hereby agree and authorize the Company to deduct from the salary, bonuses and any other amounts or benefits that may be due you, any and all amounts necessary to offset or effect settlement/payment of your said obligations, without prejudice to its right to hold you liable for any remaining balance.
                </Text>

                <Text style={styles.sectionTitle}>14. Confidential Information</Text>
                <Text style={styles.text}>
                    You agree not to use other than for the benefit of the Company and to keep confidential, during the term of this Contract, and for at least one (1) year thereafter, all information about EmpireOne BPO Solutions Inc. which the Company or any of its business affiliates treats as confidential, including, but not limited to, information about customers/campaigns, recruitment/ramp plans, marketing techniques, technical information, and possible new products or line of business, except that you will not be required to keep particular items of information confidential after those items of information become generally available to the public without a breach obligations under this Section.
                </Text>
                <Text style={styles.text}>
                    You agree that except in the performance of your duties hereunder, you will not, at any time, directly or indirectly, without the prior written consent of the Company, use or disclose to any person any confidential or proprietary information obtained or developed by you while employed by the Company relating to the business of EmpireOne BPO Solutions Inc., except information which at the time:
                </Text>

                <Text style={[styles.text, styles.listIndent]}>
                    a) is available to others in the business or generally known to the public other than as a result of disclosure by you not permitted hereunder;
                </Text>
                <Text style={[styles.text, styles.listIndent]}>
                    b) is lawfully acquired from a third party who is not obligated to EmpireOne BPO Solutions Inc. to maintain such information in confidence, or;
                </Text>
                <Text style={[styles.text, styles.listIndent]}>
                    c) is used in any dispute or proceedings between the parties and/or you yourself is legally compelled to disclose such information; <Text style={styles.bold}>provided, however</Text>, that prior to any such compelled disclosure, you will:
                </Text>

                <Text style={[styles.text, styles.subListIndent]}>
                    i. assert the privileged and confidential nature of the Confidential Information against the third party seeking disclosure and;
                </Text>
                <Text style={[styles.text, styles.subListIndent]}>
                    ii. cooperate fully with the Company in protecting against any such disclosure and/or obtaining a protective order narrowing the scope of such disclosure and/or use of the Confidential Information.
                </Text>

                <Text style={[styles.text, { marginTop: 4 }]}>
                    In the event that such protection against disclosure is not obtained, you will be entitled to disclose the Confidential Information, but only as and to the extent necessary to legally comply with such compelled disclosure.
                </Text>
                <Text style={styles.text}>
                    You shall not keep, copy from Company files and records and/or download from the Company's computer systems any of the foregoing confidential information upon your separation from the Company for whatever cause.
                </Text>

                <Text style={styles.sectionTitle}>15. Non-Solicitation/Competition</Text>
                <Text style={styles.text}>
                    You agree that during the term of your employment with the Company and for a period of six (6) months from the cessation of your employment for any reason or cause, you will refrain from:
                </Text>

                <Text style={[styles.text, styles.listIndent]}>
                    a) directly or indirectly (as a director, officer, employee, manager, consultant, independent contractor, advisor or otherwise) engaging in an activity in competition with, or owning any interest in, performing any services for, participating in or being connected with any business or organisation which engages in competition with the Company;
                </Text>
                <Text style={[styles.text, styles.listIndent]}>
                    b) soliciting directly or indirectly the patronage of any person with whom you have had personal contact or dealings on behalf of EmpireOne BPO Solutions Inc. during the 6-month period immediately preceding your separation from the Company, or;
                </Text>
                <Text style={[styles.text, styles.listIndent]}>
                    c) directly or indirectly employing, soliciting for employment, or advising or recommending to any other persons that they employ or solicit for employment, any employee of EmpireOne BPO Solutions Inc.
                </Text>
            </Page>

            {/* PAGE 6 */}
            <Page size="A4" style={styles.page}>
                <PageFooter pageNumber={6} />
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} src="/images/E1CXlogo.png" />
                </View>

                <Text style={styles.text}>
                    In connection with the foregoing provisions, you represent that your experience, capabilities and circumstances are such that the provisions of this Section will not prevent you from earning a livelihood and that the limitations set forth herein are reasonable and properly required for the adequate protection of the Company.
                </Text>

                <Text style={styles.sectionTitle}>16. Intellectual Property Rights</Text>
                <Text style={styles.text}>
                    You hereby acknowledge that any and all patents, trademark and copyrights on any work products that you will create or deliver on account of your employment with the Company shall be owned exclusively by the Company. You further acknowledge that the Company has exclusive ownership rights over the said work products, including the rights of reproduction, publication and amendment. You shall execute all documents necessary to direct the issuance of trademarks, copyrights or patents to the Company.
                </Text>
                <Text style={styles.text}>
                    You agree to warrant that the work product/s that you will deliver on account of your employment with the Company will not infringe any patent, trademark, copyright or any other proprietary right issued or honored in any country. You agree to hold the Company, its Directors, Officers and employees free and harmless against any suit for damages or any action on account of patent, trademark or copyright infringement and other causes inherent to the work product/s that you will deliver.
                </Text>

                <Text style={styles.sectionTitle}>17. Injunctive Remedy</Text>
                <Text style={styles.text}>
                    You recognize that violation of provisions hereof could cause the Company irreparable harm and agree that the company shall have the right o apply to any court of competent jurisdiction for an order restraining any breach or threatened breach of the provisions herein. Accordingly, you agree that the Company shall be entitled to injunctive relief for any actual or threatened violation hereof in addition to any other remedies it may have.
                </Text>

                <Text style={styles.sectionTitle}>18. Severability</Text>
                <Text style={styles.text}>
                    Any provision of this Contract that is invalid, illegal or unenforceable in any jurisdiction shall be automatically reformed and construed so as to be valid, operative and enforceable to the maximum extent permitted by law, or if no reformation is permissible, shall be ineffective to the extent of such invalidity, illegality or unenforceability without invalidating or rendering unenforceable the remaining provisions of this Contract, and any such invalidity, illegality or unenforceability shall not, of itself, affect the validity, legality or enforceability of such provision in any other jurisdiction.
                </Text>

                <Text style={styles.sectionTitle}>19. Jurisdiction</Text>
                <Text style={styles.text}>
                    This Contract shall be interpreted and construed in accordance with the laws of the Philippines, without giving effect to the conflict of laws provisions thereof. Any suit, action or proceeding seeking to enforce any provision of, or based on any matter arising out of or in connection with, this Contract or the transactions contemplated herein shall be brought against any of the parties in the appropriate courts or tribunals ofthe Philippines, and each of the parties hereby consents to the jurisdiction of such courts and waives any objection to venue laid therein.
                </Text>

                <Text style={styles.sectionTitle}>20. Acknowledgement</Text>
                <Text style={styles.text}>You acknowledge and agree that:</Text>
                <Text style={[styles.text, styles.listIndent]}>
                    a) except as otherwise provided for herein, the terms contained herein are the entire terms of your employment with the Company and that there are no other arrangements, agreements, or understanding, oral or written, between you and the Company regarding your present or future employment with the Company, and that any arrangements, agreements, or understanding between you and the Company regarding your present or future employment with the Company shall not be valid unless evidenced by a writing signed by the duly authorized representative EmpireOne BPO Solutions Inc. and;
                </Text>
                <Text style={[styles.text, styles.listIndent]}>
                    b) except as otherwise provided for herein, any of the terms and conditions of this Contract may only be modified or amended in writing signed by both you and the duly authorized representative of EmpireOne BPO Solutions Inc.
                </Text>

                <Text style={styles.sectionTitle}>21. Headings</Text>
                <Text style={styles.text}>
                    Any subject headings of clauses and/or Sub-Clauses of this Contract are included for purposes of convenience only and shall not affect the construction of interpretation of any of the provisions of this letter.
                </Text>
            </Page>

            {/* PAGE 7 */}
            <Page size="A4" style={styles.page}>
                <PageFooter pageNumber={7} />
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} src="/images/E1CXlogo.png" />
                </View>

                <Text style={styles.text}>
                    You have been provided with two (2) originals of this letter, both of which are in the English language. If you agree with the terms and conditions set forth herein and wish to be employed by the Company under said terms and conditions, please sign and date each original and return one (1) original to EmpireOne BPO Solutions Inc. The other original is yours to keep. Upon your signature of each original, each shall be deemed an original and shall constitute one and the same instrument.
                </Text>

                <Text style={[styles.text, { marginTop: 15, marginBottom: 25 }]}>
                    EmpireOne BPO Solutions Inc. welcomes you into its organization, and looks forward to your success.
                </Text>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={styles.signatureBlock}>
                        <Text style={styles.text}>Sincerely,</Text>
                        <Text style={[styles.text, styles.bold, { marginTop: 40 }]}>
                            {data?.employer_name}
                        </Text>
                        <Text style={styles.text}>
                            {data?.employer_position}
                        </Text>
                    </View>

                    <View style={styles.signatureBlock}>
                        <Text style={styles.text}>Conforme:</Text>
                        {data?.signature && (
                            <Image
                                style={{
                                    position: "absolute",
                                    bottom: 20,
                                    left: 10,
                                    height: 50,
                                    width: 140,
                                    zIndex: 1,
                                }}
                                src={data?.signature}
                            />
                        )}
                        <View style={styles.signatureLine} />
                        <Text style={[styles.text, { fontSize: 8.5 }]}>
                            Signature over Printed Name of Employee/Date
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default function PartTimeProbationaryContractSection({ data }) {
    const dispatch = useDispatch();

    return (
        <PDFLoader
            pdf={<PartTimeProbationaryContract data={data} />}
            width="w-full"
        />
    );
}