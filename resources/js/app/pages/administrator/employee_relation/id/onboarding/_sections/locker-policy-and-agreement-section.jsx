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
        marginBottom: 10,
    },
    logoContainer: {
        flexDirection: "column",
        alignItems: "center",
    },
    logo: {
        width: 450,
        height: 130,
        objectFit: "contain",
    },
    title: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: "Times-Bold",
        textDecoration: "underline",
        marginBottom: 24,
    },
    paragraph: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        marginBottom: 10,
        textAlign: "justify",
        lineHeight: 1.5,
    },
    numberedItem: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        marginBottom: 7,
        textAlign: "justify",
        lineHeight: 1.5,
    },
    spacer: { height: 10 },
    /* Signature row at bottom */
    sigSection: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    sigBlock: {
        alignItems: "flex-start",
    },
    sigLine: {
        borderBottomWidth: 1,
        borderBottomColor: "black",
        marginBottom: 4,
        height: 1,
    },
    sigLabel: {
        fontFamily: "Times-Roman",
        fontSize: 9,
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

const LockerPolicyDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} src="/images/Blogo (1).png" />
                </View>
            </View>

            <Text style={styles.title}>Locker Policy and Agreement</Text>

            {/* Intro paragraphs */}
            <Text style={styles.paragraph}>
                Use of the EmpireOne lockers is a privilege. It is the policy of
                EmpireOne BPO Solutions Inc. to provide lockers only to
                employees that do not have an office or cubicle in the site.
            </Text>
            <Text style={styles.paragraph}>
                EmpireOne BPO Solutions Inc. cannot be held responsible for
                lost, stolen or damaged personal property. By signing the Locker
                Use Agreement (below), employees agree to abide by the terms and
                conditions set forth by the HR Department outlined below:
            </Text>

            <View style={styles.spacer} />

            {/* Numbered rules */}
            <Text style={styles.numberedItem}>
                1. All lockers are the property of EmpireOne BPO Solutions Inc.
            </Text>
            <Text style={styles.numberedItem}>
                2. Use of a locker by a person other than to whom it is assigned
                is prohibited. Misuse of a locker may lead to termination of
                locker privileges.
            </Text>
            <Text style={styles.numberedItem}>
                3. The HR Office reserves the right to open a locker without the
                consent of the employee to whom the locker is registered in
                instances where locker procedures are being abused or in the
                case of an emergency situation.
            </Text>
            <Text style={styles.numberedItem}>
                4. Flammable materials, dangerous chemicals, explosives or
                weapons of any kind are strictly prohibited inside the lockers.
            </Text>
            <Text style={styles.numberedItem}>
                5. Perishable items, illegal or controlled substances such as
                drugs or alcohol are also strictly prohibited inside the
                lockers.
            </Text>
            <Text style={styles.numberedItem}>
                6. Employees are not permitted to affix anything to the interior
                or exterior of their lockers.
            </Text>
            <Text style={styles.numberedItem}>
                7. Upon assignment and during use, employees are responsible for
                reporting any damage or needed repairs to the HR Office.
                Employees will assume the cost of any unreported damages.
            </Text>
            <Text style={styles.numberedItem}>
                8. All personal items must be stored completely within the
                locker. All items left outside of a locker, whether secured or
                not, will be removed and disposed accordingly.
            </Text>
            <Text style={styles.numberedItem}>
                9. Lockers are not transferable. Employees who wish to change
                the location of their lockers must apply with good reason in
                person to the HR Department.
            </Text>
            <Text style={styles.numberedItem}>
                10. Any violation of the locker regulations by the users may
                result in termination of the use of lockers and be reported to
                the Discipline Committee.
            </Text>

            {/* Signature section — 4 columns */}
            <View style={styles.sigSection}>
                <View style={styles.sigBlock}>
                    <View style={{ ...styles.sigLine, width: 160 }} />
                    <Text style={styles.sigLabel}>
                        Printed Name and Signature
                    </Text>
                </View>
                <View style={styles.sigBlock}>
                    <View style={{ ...styles.sigLine, width: 80 }} />
                    <Text style={styles.sigLabel}>Employee ID No.</Text>
                </View>
                <View style={styles.sigBlock}>
                    <View style={{ ...styles.sigLine, width: 70 }} />
                    <Text style={styles.sigLabel}>Locker No.</Text>
                </View>
                <View style={styles.sigBlock}>
                    <View style={{ ...styles.sigLine, width: 80 }} />
                    <Text style={styles.sigLabel}>Date Received</Text>
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

const LockerPolicyAndAgreementSection = () => (
    <div style={{ width: "100vw", height: "88vh", margin: 0, padding: 0 }}>
        <PDFLoader pdf={<LockerPolicyDocument />} />
    </div>
);

export default LockerPolicyAndAgreementSection;
