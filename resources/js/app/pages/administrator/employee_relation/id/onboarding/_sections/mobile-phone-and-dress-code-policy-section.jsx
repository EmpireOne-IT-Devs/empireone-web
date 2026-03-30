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
    header: { alignItems: "center", marginBottom: 14 },
    logoContainer: { flexDirection: "column", alignItems: "center" },
    logo: { width: 450, height: 130, objectFit: "contain" },
    title: {
        textAlign: "center",
        fontSize: 11,
        fontFamily: "Times-Bold",
        marginBottom: 14,
    },
    sectionHeader: {
        fontFamily: "Times-Bold",
        textDecoration: "underline",
        fontSize: 10,
        marginBottom: 6,
        marginTop: 10,
    },
    subHeader: {
        fontFamily: "Times-Bold",
        fontSize: 10,
        marginBottom: 5,
        marginTop: 8,
    },
    paragraph: {
        fontFamily: "Times-Roman",
        fontSize: 10,
        marginBottom: 6,
        textAlign: "justify",
        lineHeight: 1.5,
    },
    bold: { fontFamily: "Times-Bold" },
    /* Numbered list with indent */
    listItem: {
        flexDirection: "row",
        marginBottom: 5,
        textAlign: "justify",
    },
    listNum: {
        width: 16,
        fontFamily: "Times-Roman",
        fontSize: 10,
    },
    listText: {
        flex: 1,
        fontFamily: "Times-Roman",
        fontSize: 10,
        lineHeight: 1.5,
        textAlign: "justify",
    },
    /* Sub-letter (A. B.) */
    letterLabel: {
        fontFamily: "Times-Bold",
        fontSize: 10,
        marginBottom: 4,
        marginTop: 8,
    },
    /* Table styles */
    tableTitle: {
        backgroundColor: "#4472C4",
        color: "white",
        fontFamily: "Times-Bold",
        fontSize: 10,
        textAlign: "center",
        padding: 5,
    },
    tableHeaderRow: {
        flexDirection: "row",
        backgroundColor: "#D9E1F2",
        borderWidth: 1,
        borderColor: "#4472C4",
    },
    tableRow: {
        flexDirection: "row",
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#4472C4",
    },
    tableCell: {
        flex: 1,
        padding: 4,
        fontSize: 9,
        fontFamily: "Times-Roman",
        lineHeight: 1.4,
        borderRightWidth: 1,
        borderColor: "#4472C4",
    },
    tableCellLast: {
        flex: 1,
        padding: 4,
        fontSize: 9,
        fontFamily: "Times-Roman",
        lineHeight: 1.4,
    },
    tableHeaderCell: {
        flex: 1,
        padding: 4,
        fontSize: 9,
        fontFamily: "Times-Bold",
        borderRightWidth: 1,
        borderColor: "#4472C4",
    },
    tableHeaderCellLast: {
        flex: 1,
        padding: 4,
        fontSize: 9,
        fontFamily: "Times-Bold",
    },
    tableWrapper: { marginBottom: 14 },
    signatureRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 10,
        marginTop: 10,
    },
    signatureLabel: { fontFamily: "Times-Roman", fontSize: 10, marginRight: 5 },
    signatureLine: {
        width: 200,
        borderBottomWidth: 1,
        borderBottomColor: "black",
        height: 12,
    },
    disclaimerBlock: { marginTop: "auto", paddingTop: 10 },
    disclaimerTitle: { fontSize: 8, fontFamily: "Times-Bold", marginBottom: 2 },
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

const LogoHeader = () => (
    <View style={styles.header}>
        <View style={styles.logoContainer}>
            <Image style={styles.logo} src="/images/Blogo (1).png" />
        </View>
    </View>
);

const Li = ({ n, children }) => (
    <View style={styles.listItem}>
        <Text style={styles.listNum}>{n}.</Text>
        <Text style={styles.listText}>{children}</Text>
    </View>
);

const TableRow = ({ left, right, isHeader }) => (
    <View style={styles.tableRow}>
        <Text style={isHeader ? styles.tableHeaderCell : styles.tableCell}>
            {left}
        </Text>
        <Text
            style={isHeader ? styles.tableHeaderCellLast : styles.tableCellLast}
        >
            {right}
        </Text>
    </View>
);

const DressTable = ({ title, headerLeft, headerRight, rows }) => (
    <View style={styles.tableWrapper}>
        <Text style={styles.tableTitle}>{title}</Text>
        <View style={styles.tableHeaderRow}>
            <Text style={styles.tableHeaderCell}>{headerLeft}</Text>
            <Text style={styles.tableHeaderCellLast}>{headerRight}</Text>
        </View>
        {rows.map((r, i) => (
            <TableRow key={i} left={r[0]} right={r[1]} />
        ))}
    </View>
);

const maleCasualRows = [
    [
        "Polo shirts (with collar)",
        "Shirts with vulgar prints pertaining to drugs, sex, or alcohol",
    ],
    [
        "Golf shirts (with collar)",
        "Shirts with discriminatory, disrespectful or derogatory slogans or designs",
    ],
    ["Long-sleeved shirts (with collar)", "Sandos/sleeveless shirts"],
    [
        "Short-sleeved shirts (with collar)",
        "Tanktop or crops (collarless shirts)",
    ],
    ["Barong", "Any revealing or provocative clothing"],
    ["Slacks", "Jogging pants/sweatpants"],
    ["Tailored Pants", "Short pants"],
    ["Slacks", "Basketball jerseys/uniforms"],
    ["Khakis", "All forms of slippers and sandals"],
    [
        "Denim pants (but not tattered or with slits)",
        "Worn, tattered, cut-off or ripped clothing",
    ],
    [
        "(Appropriate socks should be worn all the time)",
        "Wearing dark or tinted eyeglasses. This will only be allowed provided there is a medical prescription from an ophthalmologist",
    ],
    [
        "(Supervisors and management personnel are encouraged to dress more professionally by wearing long-sleeved shirts with ties, barong or suits)",
        "Any form of headgear, unless pertaining to religion-mandated clothing attire",
    ],
];

const maleDressDownRows = [
    [
        "Round collar shirts",
        "Shirts with vulgar prints pertaining to drugs, sex, or alcohol",
    ],
    [
        "V-neck shirts",
        "Shirts with discriminatory, disrespectful or derogatory slogans or designs",
    ],
    ["Jeans/Denims (non-tattered)", "Sandos/sleeveless shirts"],
    ["Cargo/carpenter pants", "Tanktops or crops (collarless shirts)"],
    [
        "Rubber shoes/sneakers/tennis shoes",
        "Any revealing or provocative clothing",
    ],
    [
        "",
        "Wearing of dark or tinted eye glasses. This will only be allowed provided there is a medical prescription from an ophthalmologist",
    ],
    [
        "",
        "Any form of headgear, unless pertaining to religion mandated clothing attire",
    ],
];

const femaleCasualRows = [
    [
        "Blouses",
        "Shirts with vulgar prints pertaining to drugs, sex, or alcohol",
    ],
    [
        "Collared Shirts",
        "Shirts with discriminatory, disrespectful or derogatory slogans or designs",
    ],
    ["Tailored Pants", "Sandos/Sleeveless shirts/blouses"],
    ["Slacks", "Tanktops or crops, spaghetti strap shirts/blouses"],
    ["Khakis", "Any revealing or provocative clothing"],
    [
        "Denim pants (but not tattered or with slits)",
        "Jogging pants/sweatpants",
    ],
    ["Closed shoes", "Dresses, Short pants, and skirts above the knee"],
    [
        "Open toe/open back with at least 1-inch heel shoes",
        "Basketball jerseys/uniforms",
    ],
    [
        "",
        "Flip-flops. All forms of slippers and sandals (open toe/open back/flat)",
    ],
    [
        "",
        "Wearing of dark or tinted eyeglasses. This will only be allowed provided there is a medical prescription from an ophthalmologist",
    ],
    [
        "(Supervisors and management personnel are encouraged to dress in a more professional or formal attire)",
        "Any form of headgear, unless pertaining to religion-mandated clothing attire",
    ],
];

const femaleDressDownRows = [
    [
        "Round collar shirts and blouses",
        "Shirts with vulgar prints pertaining to drugs, sex, or alcohol",
    ],
    [
        "Jeans/Denim (non-tattered)",
        "Shirts with discriminatory, disrespectful or derogatory slogans or designs",
    ],
    [
        "Cargo/carpenter pants",
        "Sweatshirts/pants, exercise clothing, jogging pants, and suits",
    ],
    [
        "Rubber shoes/sneakers/tennis shoes",
        "Tanktops or crops (collarless shirts)",
    ],
    ["", "Any revealing or provocative clothing"],
    ["", "Sandos/sleeveless shirts"],
    ["", "Basketball jerseys/uniforms"],
    ["", "Short pants/ Capri pants and leggings"],
    ["", "All forms of slippers and sandals"],
    ["", "Worn, tattered, cut-off, or ripped clothing"],
    [
        "",
        "Wearing dark or tinted eyeglasses. This will only be allowed provided there is a medical prescription from an ophthalmologist",
    ],
    [
        "",
        "Any form of headgear, unless pertaining to religion mandated clothing attire",
    ],
];

const MobilePhoneDocument = () => (
    <Document>
        {/* PAGE 1 */}
        <Page size="A4" style={styles.page}>
            <LogoHeader />
            <Text style={styles.title}>MOBILE PHONE AND DRESS CODE POLICY</Text>

            <Text style={styles.sectionHeader}>
                STATEMENT OF THE POLICY AND PURPOSE:
            </Text>

            <Text style={styles.paragraph}>
                The excellent and outstanding health of the company is based
                upon each worker giving each of their tasks his or her maximum
                attention, effort, and impressive professional image and
                exemplary representation for the company towards our
                customers/clients and partners.
            </Text>
            <Text style={styles.paragraph}>
                The use of a mobile phone to create and receive SMS messages,
                and read them at a workstation; making a call to non-related
                personnel or unauthorized personnel and taking pictures or
                images of the production floor is not related to an employee's
                job duties and does not enhance a worker's focus on his or her
                intended work. Mobile phone signals could potentially disrupt
                telephone/headset signals causing noise and interference to both
                co-employees and callers/customers.
            </Text>
            <Text style={styles.paragraph}>
                This policy prohibits the use of Mobile/Cell phones within the
                Operations area, including but not limited to the Production
                floor, training area, huddle room, conference room, and IT room
                of the site.
            </Text>
            <Text style={styles.paragraph}>
                Its purposes are to a.) create an environment that would refrain
                from fraudulent activities; b.) each employee will be able to
                deliver maximum productivity through focus and attention; c.)
                understand accountability when client and customer information
                can be transmitted and relayed to external and non- authorized
                individuals and organizations; d.) minimize work disruptions and
                e.) protect the company's intellectual property as well as
                confidential information/records.
            </Text>
            <Text style={styles.paragraph}>
                On the other hand, one's physical appearance is the first thing
                people use to form an initial impression. It is an aspect of
                human nature to draw conclusions about individuals based on what
                we see in front of us. Customers, clients, and management
                probably have higher standards for physical appearance than what
                most would consider acceptable on a given occasion. Physical
                appearances, in the way we dress, would project a professional
                image and atmosphere which would be suitable for the work
                environment.
            </Text>

            <Text style={styles.subHeader}>Provisions:</Text>
            <Text style={styles.letterLabel}>A. Mobile Phone</Text>

            <Li n="1">
                Use of Mobile/Cell phones to make calls, or to send/receive
                Short Message Service (SMS) messages within the Operations area
                is prohibited.
            </Li>
            <Li n="2">
                Unauthorized use of mobile/cell phones to take images and
                pictures of the Operations area is prohibited.
            </Li>
            <Li n="3">
                For security purposes and security issues related to the
                transmission of confidential information and records,
                Mobile/Cell phones must be switched off within the production
                floor and related areas.
            </Li>

            <Disclaimer />
        </Page>

        {/* PAGE 2 */}
        <Page size="A4" style={styles.page}>
            <Li n="4">
                Unless otherwise allowed and authorized by management, the use
                of Mobile/Cell phones is required for legitimate,
                business-related purposes or customer/client-requested purposes.
                All such requests should be submitted to the Director of
                Operations or HR department for approval.
            </Li>
            <Li n="5">
                Designated areas for mobile/cell phone usage and permissible
                must be strictly followed. The following areas are considered in
                this section: break room (canteen), courtyard, company lobby,
                and entertainment room, HR area, reception areas, locker and
                storage area, smoking area, toilets/restrooms outside the
                production floor, Penthouse area, hallways outside of the
                production floor, elevator, staircase, and parking areas.
            </Li>
            <Li n="6">
                All violations must be reported to HR for appropriate
                disciplinary actions based on the Company Code of Conduct and
                Discipline.
            </Li>

            <Text style={styles.letterLabel}>B. Dress Code</Text>

            <Li n="1">
                The recommended dress code for all employees of EmpireOne BPO
                Solutions Inc. is Business Casual every Monday shift through
                Thursday shift. Business casual attire is described as a
                professional and clean, yet casual image and does not include
                sloppy, tattered, messy, or weekend-style clothing attire. When
                these are client visits and corporate meetings professional
                business attire should be worn.
            </Li>
            <Li n="2">
                Every Friday shift, weekend shift, and Holiday shift will allow
                week-end style clothing or "dress down". Weekend style clothing
                or "dress down" is described as a decent and presentable look
                that would not attract undue attention from visitors,
                co-employees, and clients of the Company.
            </Li>
            <Li n="3">
                Any employee who reports to work dressed improperly will be
                advised and sent home to change his/her clothing based on the
                recommended dress code for that shift day and must return to
                work appropriately and timely. An employee's failure to return
                to work dressed properly may result in appropriate disciplinary
                actions based on the Company Code of Conduct and Discipline. In
                addition, if the employee fails to report to work when sent home
                to change will be considered an unauthorized absence. Further,
                non-compliance of the provisions set forth by this policy may
                result in appropriate disciplinary actions, up to and including
                termination based on the Company Code of Conduct and Discipline.
            </Li>
            <Li n="4">
                Immediate superiors, management, and compliance team will take
                ownership to enforce the policy. The HR department will partner
                with Operations in settling disputes regarding the
                interpretation of the policy. Any exemption or exception of the
                rule on dress code will need the written approval of the
                Director of Operations, or HR department (in the absence of the
                former), and must be cascaded properly. The cascade will be in
                the form of a "Memorandum", and should include the reason for
                dress down and duration.
            </Li>
            <Li n="5">
                Employees who are on their day off and visiting the site should
                follow the recommended dress code of that day shift unless they
                are staying for less than 30 minutes for business-related
                purposes.
            </Li>
            <Li n="6">
                All provisions indicated (especially in #1 and #2) are not
                all-encompassing and therefore good judgment on your part as to
                the appropriateness of the attire you intend to wear to work is
                necessary. Please also refer to Annex "A" for suggested
                references. When in doubt, check with your management and HR
                department.
            </Li>

            <Disclaimer />
        </Page>

        {/* PAGE 3 - Tables Male */}
        <Page size="A4" style={styles.page}>
            <Text style={{ ...styles.paragraph, marginBottom: 4 }}>
                Implementation and Compliance:
            </Text>
            <Text style={{ ...styles.paragraph, marginBottom: 14 }}>
                The implementation of the provisions of this policy and its
                compliance is subject to all related agreements, policies and
                guidelines governing employment and Company Code of Conduct and
                Discipline.
            </Text>
            <Text
                style={{
                    textAlign: "center",
                    fontFamily: "Times-Roman",
                    fontSize: 10,
                    marginBottom: 10,
                }}
            >
                Annex "A"
            </Text>

            <DressTable
                title="DRESS CODE FOR MALE EMPLOYEES"
                headerLeft="Business Casual"
                headerRight="Prohibited"
                rows={maleCasualRows}
            />

            <DressTable
                title="DRESS CODE FOR MALE EMPLOYEES"
                headerLeft="Weekend-style Clothing/Dress Down"
                headerRight="Prohibited"
                rows={maleDressDownRows}
            />

            <Disclaimer />
        </Page>

        {/* PAGE 4 - Tables Female */}
        <Page size="A4" style={styles.page}>
            <DressTable
                title="DRESS CODE FOR FEMALE EMPLOYEES"
                headerLeft="Business Casual"
                headerRight="Prohibited"
                rows={femaleCasualRows}
            />

            <DressTable
                title="DRESS CODE FOR MALE EMPLOYEES"
                headerLeft="Weekend-style Clothing/Dress Down"
                headerRight="Prohibited"
                rows={femaleDressDownRows}
            />

            <Disclaimer />
        </Page>

        {/* PAGE 5 - Acknowledgment */}
        <Page size="A4" style={styles.page}>
            <Text style={styles.sectionHeader}>ACKNOWLEDGMENT:</Text>
            <Text style={{ ...styles.paragraph, marginBottom: 20 }}>
                I have read and understood the provision indicated in this
                policy and have affixed my name and signature, freely and
                without inducement as indicated below. And should I violate any
                of its provisions will be subject to the company's Code of
                Conduct and Discipline.
            </Text>
            <View
                style={{
                    width: 220,
                    borderBottomWidth: 1,
                    borderBottomColor: "black",
                    height: 1,
                }}
            />
            <View style={styles.signatureRow}>
                <Text style={styles.signatureLabel}>Name and Signature </Text>
            </View>
            <Text style={styles.paragraph}>Date:</Text>

            <Disclaimer />
        </Page>
    </Document>
);

const MobilePhoneAndDressCodePolicySection = () => (
    <div style={{ width: "100vw", height: "88vh", margin: 0, padding: 0 }}>
        <PDFLoader pdf={<MobilePhoneDocument />} />
    </div>
);

export default MobilePhoneAndDressCodePolicySection;
