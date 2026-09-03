import React, { useEffect } from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
    Image,
} from "@react-pdf/renderer";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import PDFLoader from "@/app/_components/pdf-loader";
import { setDocument } from "@/app/redux/app-slice";
import { peso_format } from "@/app/lib/peso-format";

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 10,
        lineHeight: 1.5,
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
    bold: {
        fontFamily: "Helvetica-Bold",
    },
    header: {
        marginBottom: 20,
    },
    paragraph: {
        marginBottom: 10,
        textAlign: "justify",
    },
    sectionTitle: {
        fontFamily: "Helvetica-Bold",
        marginTop: 15,
        marginBottom: 5,
        textDecoration: "underline",
    },
    row: {
        flexDirection: "row",
        marginBottom: 5,
    },
    label: {
        width: 150,
        fontFamily: "Helvetica-Bold",
    },
    fieldRow: {
        flexDirection: "row",
        alignItems: "flex-end", // Aligns the text to the bottom of the line
        marginBottom: 10,
    },
    labelContrainer: {
        marginRight: 10,
        fontSize: 10,
    },
    underlineContainer: {
        borderBottomWidth: 1, // Creates the physical line
        borderBottomColor: "#000",
        width: "30%",
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
    inputText: {
        fontSize: 10,
        paddingBottom: 2,
        textAlign: "center",
    },
    value: {
        flex: 1,
    },
    bulletRow: {
        flexDirection: "row",
        marginBottom: 3,
    },
    bullet: {
        width: 20,
        textAlign: "center",
    },
    bulletText: {
        flex: 1,
        textAlign: "justify",
    },
    signatureContainer: {
        marginTop: 30,
    },
    signature_over_printed_name_line: {
        marginTop: 30,
        borderTopWidth: 1,
        borderTopColor: "#000",
        width: 250,
        paddingTop: 5,
        textAlign: "center",
    },
    centerTitle: {
        fontFamily: "Helvetica-Bold",
        textAlign: "center",
        fontSize: 12,
        marginBottom: 20,
    },
});

const ListItem = ({ children }) => (
    <View style={styles.bulletRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>{children}</Text>
    </View>
);

const OfferLetterPDF = (data) => (
    <Document>
        {/* MAIN LETTER PAGE */}
        <Page size="A4" style={styles.page}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} src="/images/E1CXlogo.png" />
            </View>
            <View style={styles.header}>
                <Text style={styles.bold}>DATE: {data?.date}</Text>
                <Text style={styles.bold}>NAME: {data?.applicant_name}</Text>
                <Text style={styles.bold}>
                    HOME ADDRESS: {data?.applicant_address}
                </Text>
            </View>

            <Text style={styles.paragraph}>
                Dear Mr/Mrs. {data?.applicant_name},
            </Text>

            <Text style={styles.paragraph}>
                We are pleased to make you an offer of employment with us and
                this letter sets forth the terms of appointment:
            </Text>

            <View style={styles.row}>
                <Text style={styles.label}>Designation:</Text>
                <Text style={styles.value}>{data?.designation}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Company:</Text>
                <Text style={styles.value}>EmpireOne BPO Solutions, Inc.</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Place of Posting:</Text>
                <Text style={styles.value}>{data?.place_of_posting}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Date of Joining:</Text>
                <Text style={styles.value}>{data?.date_of_joining}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Compensation and Benefits:</Text>
                <View style={styles.value}>
                    <Text>Annual Fixed Pay: PHP{data?.annual_fixed_pay}</Text>
                    <Text>Night Shift Differential: 10%</Text>
                    <Text style={styles.bold}>
                        Total Compensation (TC): PHP{data?.total_compensation}
                    </Text>
                    <Text>
                        (Basic Pay PHP{data?.annual_fixed_pay} + 13th month pay)
                    </Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>
                Background Checks/ Pre-employment Medical Check-up/ Critical/
                Requirements
            </Text>
            <Text style={styles.paragraph}>
                Your appointment is subject to the background check clearance in
                all aspects, any discrepancies in the background/ pre-employment
                medical check-up will lead to withdrawal of the offer.
                Non-completion of background check within 60 days from the date
                of hire may lead to revocation of employment offer. TA will let
                you know of the final status of your check once it is completed.
            </Text>
            <Text style={styles.paragraph}>
                Your Start Date will be dependent once you have completed and
                submitted the following pre-employment requirements:
            </Text>
            <ListItem>SSS Number (E-4/1902/1905/2316)</ListItem>
            <ListItem>Tax Identification Number (TIN)</ListItem>
            <ListItem>Philhealth Identification Number (PIN)</ListItem>
            <ListItem>Pag Ibig Number (HDMF Number)</ListItem>
            <ListItem>NBI/police Clearance</ListItem>
            <ListItem>Medical Exam results</ListItem>

            <Text style={styles.sectionTitle}>Confidentiality</Text>
            <Text style={styles.paragraph}>
                You are requested to maintain confidentiality on all aspects of
                the letter at all times. You shall not divulge, communicate or
                pass on any information regarding the company, its business,
                customers, work practices and security practices to any outsider
                or any external vendor or contractor employed by the Company.
            </Text>

            <Text style={styles.sectionTitle}>Notice Period</Text>
            <Text style={styles.paragraph}>
                The Employee may terminate his/her employment only after serving
                the Employer a written notice duly received by the Employer not
                less than 30 days prior to the actual date of resignation.,
                otherwise, the Employee shall be liable for whatever legal
                damages the Employer may sustain on account of non-observance of
                the period stated herein, and shall mean that the Employees
                agrees to forfeit any salary due to him/her for such period and
                thereby authorize the deductions in favor of the Company.
            </Text>
            <Text style={styles.paragraph}>
                The Employer also reserves the right to undertake such action or
                institute a case necessary for the recovery of the liquidated
                damages and any amount which the employer may be entitled to
                under the law. Similarly, EmpireOne may, at any time, terminate
                your employment on the account of just cause and authorized
                cause.
            </Text>

            <Text style={styles.sectionTitle}>Probation Period</Text>
            <Text style={styles.paragraph}>
                Employees will join the team on a probationary employment status
                for a period of six (6) months. His/her skills, performance, and
                competence will be evaluated based on the standards of the
                Company, which will determine your qualification for
                regularization or otherwise. The management of the Company shall
                have full right to rescind this employment contract at any time
                with due cause in accordance with the labor code and in
                accordance with due process. If an employee fails the required
                pre-employment processes, employment will be discontinued and
                the Company shall pay worked days only.
            </Text>

            <Text style={styles.sectionTitle}>Cause for Termination</Text>
            <Text style={styles.paragraph}>
                A willful failure by the employee to substantially perform
                his/her duties and responsibilities, breach of company policies
                and Code of Ethics and Business Conduct and the commission by
                the employee of theft, fraud, breach of trust or any material
                act of dishonesty involving the Company and its affiliates.
            </Text>
            <ListItem>
                Sharing of this information will result in withdrawal of your
                Offer Letter
            </ListItem>
            <ListItem>
                A detail Employment Contract/ Appointment Letter will be issued
                as you have joined the Organization
            </ListItem>
            <ListItem>
                The Annexure I needs to be accepted and signed along with this
                Offer Letter
            </ListItem>

            <Text style={[styles.paragraph, { marginTop: 15 }]}>
                Please report to any HR personnel for your orientation and
                on-boarding procedures, submission of requirements and for the
                formalization of Employment Contract once you qualify for the
                position. For any concerns, please contact the HR through the
                Talent Acquisition Team at careers@empireonegroup.com.
            </Text>
            <Text style={styles.paragraph}>
                Note that this is NOT the actual employment contract and should
                never be considered as such. Nor should it be used as a
                replacement for your actual employment contract with EmpireOne.
                Your actual employment contract will be served to you upon the
                commencement of your employment with the Company.
            </Text>
            <Text style={styles.paragraph}>
                We look forward to having you on board with Team EmpireOne!
            </Text>

            <View style={styles.signatureContainer}>
                <Text>Very truly yours,</Text>
                <Text style={[styles.bold, { marginTop: 10 }]}>
                    Anabelle Marie Ubaldo
                </Text>
                <Text>Talent Acquisition Manager</Text>
            </View>

            <View style={{ marginTop: 10 }}>
                <Text style={styles.paragraph}>
                    I hereby accept the above offer on the terms and conditions
                    outlined.
                </Text>
                <View style={styles.signature_over_printed_name_line}>
                    {data?.applicant_signature && (
                        <Image
                            style={styles.signature_over_printed_name}
                            src={data?.talent_acquisition_manager_signature}
                        />
                    )}
                    <Text style={{ marginTop: -20 }}>
                        {data?.talent_acquisition_manager} {data?.date}
                    </Text>
                    <Text>Signature over Printed Name / Date</Text>
                </View>
            </View>
        </Page>

        {/* ANNEXURE I PAGE */}
        <Page size="A4" style={styles.page}>
            <Text style={styles.centerTitle}>ANNEXURE I</Text>
            <Text style={styles.centerTitle}>SCHEDULE OF BENEFITS</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Service Incentive Leave</Text>
                <Text style={styles.value}>
                    upon regularization at 0.42 (5.04 days annually){"\n"}
                    Conversion every February of the following year
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Government Mandated Benefits</Text>
                <Text style={styles.value}>as applicable</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Medical Benefits</Text>
                <Text style={styles.value}>
                    effective period of coverage is upon regularization
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Hospitalization</Text>
                <Text style={styles.value}>
                    Room and Board: Regular Private{"\n"}Maximum Benefit Limit:
                    PHP50,000.00
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Dental</Text>
                <Text style={styles.value}>Included in the HMO Plan</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Dependent</Text>
                <Text style={styles.value}>NA</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Allowances</Text>
                <View style={{ flexDirection: "column", gap: 1 }}>
                    {data?.allowances?.map((res, index) => {
                        return (
                            <Text key={res.id || index}>
                                {`${res.allowance_type} - ${res.allowance}`}
                            </Text>
                        );
                    })}
                </View>
            </View>

            <Text style={[styles.bold, { marginTop: 20, marginBottom: 5 }]}>
                Note:
            </Text>
            <ListItem>
                All benefits are subject to annual review and may be amended,
                abrogated, modified, rescinded/reinstated by the Company from
                time to time
            </ListItem>
            <ListItem>
                All Philippines government mandated benefits will be provided as
                applicable
            </ListItem>

            <View style={{ marginTop: 40 }}>
                <Text style={styles.paragraph}>
                    I hereby accept the above schedule of benefits on the terms
                    and conditions outlined.
                </Text>
                <View style={{ marginTop: 10 }}>
                    {/* Name Field */}
                    <View style={styles.fieldRow}>
                        <Text style={styles.labelContrainer}>Name:</Text>
                        <View style={styles.underlineContainer}>
                            <Text style={styles.inputText}>
                                {data?.applicant_name || " "}
                            </Text>
                        </View>
                    </View>

                    {/* Signature Field */}
                    <View style={[styles.fieldRow]}>
                        <Text style={styles.labelContrainer}>Signature:</Text>
                        <View style={styles.underlineContainer}>
                            {data?.applicant_signature && (
                                <Image
                                    style={styles.signature}
                                    src={data?.applicant_signature}
                                />
                            )}
                        </View>
                    </View>

                    {/* Date Field */}
                    <View style={styles.fieldRow}>
                        <Text style={styles.labelContrainer}>Date:</Text>
                        <View style={styles.underlineContainer}>
                            <Text style={styles.inputText}>
                                {data?.date || " "}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Page>

        {/* ANNEXURE II PAGE */}
        <Page size="A4" style={styles.page}>
            <Text style={styles.centerTitle}>Annexure II</Text>
            <Text style={styles.centerTitle}>
                PERSONAL INFORMATION AS REQUIRED UNDER DATA PRIVACY ACT 2012
                (RA10173)
            </Text>

            <Text style={styles.paragraph}>
                I confirm that I am voluntarily sharing my personal information
                with EmpireOne’s duly authorized representative for the
                following purposes:
            </Text>

            <ListItem>
                Validating my Curriculum Vitae and retaining records on the same
                for any future reference / verification
            </ListItem>
            <ListItem>
                Processing my job application including background verification
                check and medical checks
            </ListItem>
            <ListItem>
                Employment-related actions including record keeping, processing
                compensation and benefits and any action required in the context
                of my employment with EmpireOne
            </ListItem>

            <Text style={[styles.paragraph, { marginTop: 15 }]}>
                In this context, I also agree to the retention of such Personal
                Information by EmpireOne for any future reference/ verification
                and authorize EmpireOne to transfer the same to a third party.
            </Text>
            <Text style={styles.paragraph}>
                I understand the Personal Information means any information
                relating to me that is available with EmpireOne and is capable
                of identifying me.
            </Text>

            <View style={{ marginTop: 10 }}>
                {/* Name Field */}
                <View style={styles.fieldRow}>
                    <Text style={styles.labelContrainer}>Name:</Text>
                    <View style={styles.underlineContainer}>
                        <Text style={styles.inputText}>
                            {data?.applicant_name || " "}
                        </Text>
                    </View>
                </View>

                {/* Signature Field */}
                <View style={[styles.fieldRow]}>
                    <Text style={styles.labelContrainer}>Signature:</Text>
                    <View style={styles.underlineContainer}>
                        {data?.applicant_signature && (
                            <Image
                                style={styles.signature}
                                src={data?.applicant_signature}
                            />
                        )}
                    </View>
                </View>

                {/* Date Field */}
                <View style={styles.fieldRow}>
                    <Text style={styles.labelContrainer}>Date:</Text>
                    <View style={styles.underlineContainer}>
                        <Text style={styles.inputText}>
                            {data?.date || " "}
                        </Text>
                    </View>
                </View>
            </View>
        </Page>
    </Document>
);

// Example wrapper for preViewing
const AgentOfferLetterPreview = ({ name, type, applicant_signature }) => {
    const { job_offer } = useSelector((store) => store.applicants);
    const { document } = useSelector((store) => store.app);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            setDocument({
                ...document,
                name: name,
                type: type,
            }),
        );
    }, []);

    // Clean data object. NO HTML TAGS here.
    const rawData = {
        date: moment().format("LL"),
        date_of_joining: moment(job_offer?.start_date).format("LL"),
        designation:
            job_offer?.job_application?.job_posting?.job_requisition?.title ||
            "Manager",
        applicant_name:
            `${job_offer?.user?.personal_information?.first_name || ""} ${job_offer?.user?.personal_information?.last_name || ""}`.trim(),
        applicant_address:
            `${job_offer?.user?.personal_information?.street || ""} ${job_offer?.user?.personal_information?.city || ""} ${job_offer?.user?.personal_information?.province || ""} ${job_offer?.user?.personal_information?.zip_code || ""}`.trim(),
        applicant_signature: applicant_signature,
        place_of_posting: `${job_offer?.job_application?.job_posting?.job_requisition?.location?.name} City`,
        annual_fixed_pay: peso_format(`${Number(job_offer?.salary) * 12}`),
        total_compensation: peso_format(
            `${Number(job_offer?.salary) * 12 + Number(job_offer?.salary)}`,
        ),
        allowances: job_offer?.allowances,
        talent_acquisition_manager: `${job_offer?.manager?.personal_information?.first_name || ""} ${job_offer?.manager?.personal_information?.last_name || ""}`.trim(),
        talent_acquisition_manager_signature: job_offer?.manager?.account_employee?.signature,
    };
    console.log("job_offer", job_offer);

    return <PDFLoader pdf={<OfferLetterPDF {...rawData} />} width="w-full" />;
};

export default AgentOfferLetterPreview;
