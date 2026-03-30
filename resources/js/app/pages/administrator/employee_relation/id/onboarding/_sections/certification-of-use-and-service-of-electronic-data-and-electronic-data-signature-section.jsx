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
        paddingTop: 50,
        paddingBottom: 60,
        paddingLeft: 60,
        paddingRight: 60,
        fontFamily: "Times-Roman",
        fontSize: 10,
    },
    // ── Header ───────────────────────────────────────────────────────────────
    header: {
        alignItems: "center",
        marginBottom: 16,
    },
    logoContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 450,
        height: 130,
        objectFit: "contain",
    },
    // ── Title block ───────────────────────────────────────────────────────────
    titleLine1: {
        textAlign: "center",
        fontSize: 11,
        fontFamily: "Times-Bold",
        marginBottom: 4,
    },
    titleLine2: {
        textAlign: "center",
        fontSize: 11,
        fontFamily: "Times-Bold",
        marginBottom: 20,
    },
    // ── Inline name underline ─────────────────────────────────────────────────
    signatureLine: {
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        width: 160,
        height: 12,
        marginHorizontal: 4,
    },
    // ── Numbered list ─────────────────────────────────────────────────────────
    numberedRow: {
        flexDirection: "row",
        marginBottom: 5,
        alignItems: "flex-start",
    },
    numberedIndex: {
        width: 18,
        fontSize: 10,
        fontFamily: "Times-Roman",
        lineHeight: 1.5,
    },
    numberedText: {
        flex: 1,
        fontSize: 10,
        fontFamily: "Times-Roman",
        lineHeight: 1.5,
        textAlign: "justify",
    },
    bold: {
        fontFamily: "Times-Bold",
    },
    // ── Bold acknowledgement blocks ───────────────────────────────────────────
    ackBlock: {
        marginTop: 14,
        marginBottom: 10,
    },
    ackText: {
        fontSize: 10,
        fontFamily: "Times-Bold",
        lineHeight: 1.5,
        textAlign: "justify",
    },
    // ── Signature block ───────────────────────────────────────────────────────
    sigBlock: {
        marginTop: 20,
    },
    sigLine: {
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        width: 240,
        height: 16,
        marginBottom: 3,
    },
    sigLabel: {
        fontSize: 10,
        fontFamily: "Times-Roman",
        marginBottom: 10,
    },
    dateLabel: {
        fontSize: 10,
        fontFamily: "Times-Roman",
    },
    // ── Footer disclaimer ─────────────────────────────────────────────────────
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

const CertificationDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header - Logo */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} src="/images/Blogo (1).png" />
                </View>
            </View>

            {/* Title */}
            <Text style={styles.titleLine1}>
                CERTIFICATION of USE and SERVICE OF ELECTRONIC DATA
            </Text>
            <Text style={styles.titleLine2}>
                and ELECTRONIC SIGNATURE
            </Text>

            {/* Intro paragraph with inline blank line */}
            <View style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 12, flexWrap: "wrap" }}>
                <Text style={{ fontSize: 10 }}>I </Text>
                <View style={styles.signatureLine} />
                <Text style={{ fontSize: 10, flex: 1 }}>
                    {" "}(also referred to herein as SIGNEE) am an employee of EmpireOne Group Inc. hereby certify and acknowledge:
                </Text>
            </View>

            {/* Numbered list */}
            <View style={styles.numberedRow}>
                <Text style={styles.numberedIndex}>1.</Text>
                <Text style={styles.numberedText}>
                    That all notifications and incoming messages using electronic data (e.g. SMS – Short Messaging
                    Service, electronic mail, and related media) sent under the name of 'EmpireOne' and its authorized
                    representatives, will be construed as authentic, genuine, and official in its form; content and
                    substance;
                </Text>
            </View>

            <View style={styles.numberedRow}>
                <Text style={styles.numberedIndex}>2.</Text>
                <Text style={styles.numberedText}>
                    That these electronic data will be interpreted and understood in their true and actual purpose
                    indicated;
                </Text>
            </View>

            <View style={styles.numberedRow}>
                <Text style={styles.numberedIndex}>3.</Text>
                <Text style={styles.numberedText}>
                    That service of such electronic data has been completed thereon.
                </Text>
            </View>

            <View style={styles.numberedRow}>
                <Text style={styles.numberedIndex}>4.</Text>
                <Text style={styles.numberedText}>
                    That I have indicated the complete details of my personal electronic credentials as indicated in my
                    company profile; my personal email address; social media site/s; and such related information TO
                    BE TRUE and CORRECT, and that the company has the sole responsibility to use it in whichever
                    purpose deemed necessary;
                </Text>
            </View>

            <View style={styles.numberedRow}>
                <Text style={styles.numberedIndex}>5.</Text>
                <Text style={styles.numberedText}>
                    That I will be made to sign via an electronic method which will be interpreted and construed as
                    GENUINE, AUTHENTIC, and VALID in its face in all records;
                </Text>
            </View>

            <View style={styles.numberedRow}>
                <Text style={styles.numberedIndex}>6.</Text>
                <Text style={styles.numberedText}>
                    That I KNOWINGLY AND FREELY ASSUME ALL SUCH RISKS AND LIABILITY, both
                    known and unknown, EVEN IF ARISING FROM THE NEGLIGENCE OF THE SIGNER or others,
                    and assume full responsibility for any future events and occurrences; and,
                </Text>
            </View>

            <View style={styles.numberedRow}>
                <Text style={styles.numberedIndex}>7.</Text>
                <Text style={styles.numberedText}>
                    I willingly agree to comply with all applicable terms and conditions of my employment in relation to
                    the use of electronic data and its related resources.
                </Text>
            </View>

            {/* Acknowledgement Block 1 */}
            <View style={styles.ackBlock}>
                <Text style={styles.ackText}>
                    I HAVE FULLY READ AND UNDERSTAND THE CONTENTS OF THIS DOCUMENT; ITS
                    APPLICABLE TERMS AND CONDITIONS, AND SIGN IT FREELY AND VOLUNTARILY
                    WITHOUT ANY INDUCEMENT.
                </Text>
            </View>

            {/* Acknowledgement Block 2 */}
            <View style={{ marginBottom: 10 }}>
                <Text style={styles.ackText}>
                    I HAVE ALSO UNDERSTOOD THAT THE COMPANY CAN USE THIS CERTIFICATION
                    FOR WHICHEVER PURPOSES IT SERVES.
                </Text>
            </View>

            {/* Signature block */}
            <View style={styles.sigBlock}>
                <View style={styles.sigLine} />
                <Text style={styles.sigLabel}>Complete Name of Employee &amp; Signature</Text>
                <Text style={styles.dateLabel}>DATE:</Text>
            </View>

            {/* Footer Disclaimer */}
            <View style={styles.disclaimerBlock}>
                <Text style={styles.disclaimerTitle}>Disclaimer:</Text>
                <Text style={styles.disclaimerText}>
                    This document and its contents are the property of EmpireOne BPO Solutions, Inc. and are intended for internal use only. Unauthorized
                    reproduction, disclosure, or distribution of this material, in whole or in part, without prior written permission from the company is strictly
                    prohibited.
                </Text>
            </View>

        </Page>
    </Document>
);

const CertificationOfUseAndServiceOfElectronicDataAndElectronicDataSignatureSection = () => (
    <div style={{ width: "100vw", height: "88vh", margin: 0, padding: 0 }}>
        <PDFViewer width="100%" height="100%">
            <CertificationDocument />
        </PDFViewer>
    </div>
);

export default CertificationOfUseAndServiceOfElectronicDataAndElectronicDataSignatureSection;