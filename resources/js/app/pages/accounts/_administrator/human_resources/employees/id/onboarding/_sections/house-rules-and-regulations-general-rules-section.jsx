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
        marginBottom: 16,
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
    mainTitle: {
        textAlign: "center",
        fontSize: 11,
        fontFamily: "Times-Roman",
        marginBottom: 4,
    },
    subTitle: {
        textAlign: "center",
        fontSize: 11,
        fontFamily: "Times-Roman",
        marginBottom: 14,
    },
    numberedItem: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        marginBottom: 6,
        textAlign: "justify",
        lineHeight: 1.5,
    },
    acknowledgmentLabel: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        marginTop: 20,
        marginBottom: 6,
    },
    acknowledgmentText: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        marginBottom: 30,
        textAlign: "justify",
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
        width: 200,
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

const HouseRulesDocument = () => (
    <Document>
        {/* PAGE 1 */}
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} src="/images/E1CXlogo.png" />
                </View>
                <Text style={styles.mainTitle}>
                    EmpireOne BPO Solutions Inc. House Rules And Regulations
                </Text>
                <Text style={styles.subTitle}>General Rules</Text>
            </View>

            <Text style={styles.numberedItem}>
                1. All EmpireOne BPO Solutions Inc. employees shall not suffer
                or permit the obstruction of any Common Areas, including
                hallways, walkways, and driveways.
            </Text>
            <Text style={styles.numberedItem}>
                2. EmpireOne BPO Solutions Inc. Management reserves the right to
                refuse access to any persons, in good faith judged to be a
                threat to the safety, reputation, or property of the Building
                and/or its occupants.
            </Text>
            <Text style={styles.numberedItem}>
                3. All EmpireOne BPO Solutions Inc. employees are expected to
                report to the office dressed in a presentable and professional-
                looking attire or wear it upon entry. (Refer to dress code
                policy)
            </Text>
            <Text style={styles.numberedItem}>
                4. All EmpireOne BPO Solutions Inc. employees shall not make or
                permit any noise or odors that annoy or interfere with other
                tenants or persons having business within the Building.
            </Text>
            <Text style={styles.numberedItem}>
                5. All EmpireOne BPO Solutions Inc. employees shall not keep
                animals or birds within the Building and or pets, and shall not
                bring bicycles, motorcycles, or other vehicles into portions of
                the Building that are not designated as authorized for same
                (provided, however, that Tenant may bring bicycles into the
                Premises and may use a forklift in the warehouse portion of the
                Premises).
            </Text>
            <Text style={styles.numberedItem}>
                6. All EmpireOne BPO Solutions Inc. employees shall not make,
                suffer or permit litter except in appropriate receptacles for
                that purpose.
            </Text>
            <Text style={styles.numberedItem}>
                7. All unauthorized EmpireOne BPO Solutions Inc. employees shall
                not alter any lock or install new or additional locks or bolts
                unless given written and approved consent by EmpireOne BPO
                Solutions Management consent.
            </Text>
            <Text style={styles.numberedItem}>
                8. All EmpireOne BPO Solutions Inc. employees shall be
                responsible for the inappropriate use of any toilet rooms,
                plumbing, or other utilities. No foreign substances of any kind
                are to be inserted therein.
            </Text>
            <Text style={styles.numberedItem}>
                9. All EmpireOne BPO Solutions Inc. employees shall not deface
                the walls, partitions, or other surfaces of the Premises or the
                Building, or any vandalism is prohibited in all forms.
            </Text>
            <Text style={styles.numberedItem}>
                10. All EmpireOne BPO Solutions Inc. employees shall not suffer
                or permit anything in or around the premises that causes
                excessive vibration or floor loading in any part of the
                Building.
            </Text>
            <Text style={styles.numberedItem}>
                11. Furniture, significant freight, and equipment shall be moved
                into or out of the Building only with the knowledge and consent
                of EmpireOne BPO Solutions Inc. Management, and subject to such
                reasonable limitations, techniques, and timing, as may be
                designated. All EmpireOne BPO Solutions Inc. employees shall be
                responsible for any damage to the Building arising from any such
                activity.
            </Text>
            <Text style={styles.numberedItem}>
                12. All EmpireOne BPO Solutions Inc. employees shall not employ
                any service or contractor for services or work to be performed
                in the Building, except as approved by EmpireOne BPO Solutions
                Inc. Management.
            </Text>
            <Text style={styles.numberedItem}>
                13. All EmpireOne BPO Solutions Inc. employees shall not suffer
                or permit the smoking or carrying of lighted cigars or
                cigarettes in areas reasonably designated by EmpireOne BPO
                Solutions Inc. Management or by applicable governmental agencies
                as nonsmoking areas.
            </Text>
            <Text style={styles.numberedItem}>
                14. All EmpireOne BPO Solutions Inc. employees shall not use any
                method of heating or air conditioning other than as provided by
                the Management or any dedicated system approved by the
                Management.
            </Text>
            <Text style={styles.numberedItem}>
                15. The Premises shall not be used for lodging or manufacturing,
                cooking, or food preparation. Notwithstanding the foregoing,
                Underwriters Laboratory-approved equipment and microwave ovens
                may be used in the Premises for heating food and brewing coffee,
                tea, hot chocolate, and similar beverages, provided that such
                use is in accordance with all applicable laws, codes,
                ordinances, rules, and regulations, and does not cause odors
                which are objectionable to Landlord and other tenants.
            </Text>

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

        {/* PAGE 2 */}
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} src="/images/E1CXlogo.png" />
                </View>
            </View>

            <Text style={styles.numberedItem}>
                16. All EmpireOne BPO Solutions Inc. employees shall comply with
                all safety, fire protection, and evacuation regulations
                established by EmpireOne BPO Solutions Inc. or any applicable
                governmental agency.
            </Text>
            <Text style={styles.numberedItem}>
                17. EmpireOne BPO Solutions Inc. Management reserves the right
                to waive any one of these rules or regulations, and/or as to any
                particular tenant, and any such waiver shall not constitute a
                waiver of any other rule or regulation or any subsequent
                application thereof to such tenant.
            </Text>
            <Text style={styles.numberedItem}>
                18. All EmpireOne BPO Solutions Inc. employees assume all risks
                from theft or vandalism to the Premises and agree to keep the
                Premises locked as may be required.
            </Text>
            <Text style={styles.numberedItem}>
                19. EmpireOne BPO Solutions Inc. Management reserves the right
                to make such other reasonable rules and regulations as it may
                from time to time deem necessary for the appropriate operation
                and safety of the Building and its occupants.
            </Text>
            <Text style={styles.numberedItem}>
                20. Any violations of the foregoing rules and regulations will
                be appropriately subjected to the Company Code of Conduct and
                Discipline provisions and any such related laws and policies.
            </Text>

            <Text style={styles.acknowledgmentLabel}>Acknowledgment:</Text>
            <Text style={styles.acknowledgmentText}>
                I have read, understood and acknowledged the contents of this
                form.
            </Text>

            <View style={{ marginTop: 20 }}>
                <View style={styles.signatureRow}>
                    <Text style={styles.signatureLabel}>
                        Signature over Printed Name:
                    </Text>
                    <View style={styles.signatureLine} />
                </View>
                <View style={styles.signatureRow}>
                    <Text style={styles.signatureLabel}>Date:</Text>
                    <View style={{ ...styles.signatureLine, width: 120 }} />
                </View>
            </View>

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

const HouseRulesAndRegulationsGeneralRulesSection = () => {
    return (
        <PDFLoader pdf={<HouseRulesDocument />} />
    );
};

export default HouseRulesAndRegulationsGeneralRulesSection;
