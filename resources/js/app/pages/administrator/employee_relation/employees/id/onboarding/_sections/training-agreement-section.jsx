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
        textDecoration: "underline",
        fontSize: 16,
        fontFamily: "Times-Bold",
        marginBottom: 16,
    },
    sectionHeader: {
        fontFamily: "Times-Bold",

        fontSize: 10,
        marginBottom: 6,
        marginTop: 10,
    },
    paragraph: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        marginBottom: 6,
        textAlign: "justify",
        lineHeight: 1.5,
    },
    numberedItem: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        marginBottom: 5,
        textAlign: "justify",
        lineHeight: 1.5,
    },
    bold: {
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
        fontFamily: "Times-Roman",
        fontSize: 10,
        marginRight: 5,
    },
    signatureLine: {
        width: 160,
        borderBottomWidth: 1,
        borderBottomColor: "black",
        height: 12,
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

const TrainingAgreementDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} src="/images/Blogo (1).png" />
                </View>
                <Text style={styles.title}>TRAINING AGREEMENT</Text>
            </View>

            {/* Section 1 */}
            <Text style={styles.sectionHeader}>
                RESPONSIBILITIES UNDER THIS AGREEMENT
            </Text>
            <Text style={styles.paragraph}>
                The Trainee in this contract assumes the following
                responsibilities:
            </Text>

            <Text style={styles.numberedItem}>
                1. Perform to the best of your ability those tasks assigned by
                your Work Supervisor/Manager which are related to your job
                responsibilities and your Learning Objectives.
            </Text>
            <Text style={styles.numberedItem}>
                2. Follow all personnel rules, regulations, and other standard
                requirements of your host organization/employer.
            </Text>
            <Text style={styles.numberedItem}>
                3. Fulfill the Learning Contract or Observation period under the
                direction of the Supervisor/Manager as needed for guidance and
                evaluation.
            </Text>
            <Text style={styles.numberedItem}>
                4. Strictly NO Absences and Late during the Training Period.
            </Text>
            <Text style={styles.numberedItem}>
                6. Timekeeping must be up to date.
            </Text>
            <Text style={styles.numberedItem}>
                7. Always use the Biometrics, especially on the first entry of
                your shift. Strictly NO Tailgating.
            </Text>
            <Text style={styles.numberedItem}>
                8. Observe the proper dress code.
            </Text>

            {/* Section 2 */}
            <Text style={styles.sectionHeader}>
                TERMINATION OF THE AGREEMENT:
            </Text>

            <Text style={styles.numberedItem}>
                1. In the event of failure by the trainee to perform any of the
                obligations arising from the agreement, and regardless of the
                consequences provided for under the applicable law, EmpireOne
                BPO Solutions, Inc. is legally entitled to terminate or cancel
                the agreement without any further legal formality.
            </Text>
            <Text style={styles.numberedItem}>
                2. If the trainee terminates the agreement before its agreement
                ends or if he/she fails to follow the agreement in accordance
                with the rules, he/she will have to pay a pro-rata share of the
                costs of training not paid by way of service amounting to
                <Text style={styles.bold}> Php 10,000.00</Text>
            </Text>

            <Text style={styles.paragraph}>
                This policy covers/does not cover any injury or property damage
                to a party not employed by the organization. This policy
                covers/does not cover trainee damage to property or injury to
                co-workers of the organization. This policy covers/does not
                cover any injury or property damage to a party not employed by
                the organization.
            </Text>

            <Text style={styles.paragraph}>
                This is not a contract but an agreement.
            </Text>

            {/* Signature Block */}
            <View style={styles.signatureSection}>
                <View style={styles.signatureRow}>
                    <Text style={styles.signatureLabel}>
                        Trainee Name and Signature:
                    </Text>
                    <View style={styles.signatureLine} />
                </View>
                <View style={styles.signatureRow}>
                    <Text style={styles.signatureLabel}>Date :</Text>
                    <View style={{ ...styles.signatureLine, width: 120 }} />
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

const TrainingAgreementSection = () => {
    return <PDFLoader pdf={<TrainingAgreementDocument />} />;
};

export default TrainingAgreementSection;
