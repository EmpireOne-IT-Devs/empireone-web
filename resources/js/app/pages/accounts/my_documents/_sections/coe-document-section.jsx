import React from "react";
import {
    Circle,
    Defs,
    Document,
    Image,
    LinearGradient,
    Page,
    Path,
    Rect,
    Stop,
    StyleSheet,
    Svg,
    Text,
    View,
} from "@react-pdf/renderer";

const DEFAULT_PURPOSE = "whatever legal purpose it may serve";
const WEBSITE = "www.empireonecx.com";
const HR_EMAIL = "empireone.hrd@empireonegroup.com";
const VERIFICATION_EMAIL = "EmpireOne.HRD@empireonegroup.com";
const SIGNATORY_NAME = "Anthony Aragon";
const SIGNATORY_TITLE = "HR Director";
const ICON_COLOR = "#5B3DF5";
const CONTENT_WIDTH = 475;

const styles = StyleSheet.create({
    page: {
        paddingTop: 36,
        paddingBottom: 50,
        paddingLeft: 60,
        paddingRight: 60,
        fontFamily: "Helvetica",
        fontSize: 10.5,
        lineHeight: 1.6,
        color: "#1f2937",
    },
    watermark: {
        position: "absolute",
        top: 190,
        left: 58,
        width: 480,
        height: 480,
        opacity: 0.07,
    },
    logo: {
        width: 130,
        height: 77,
        alignSelf: "center",
    },
    title: {
        fontFamily: "Helvetica-Bold",
        fontSize: 15,
        textAlign: "center",
        color: "#000000",
        marginTop: 26,
        marginBottom: 26,
    },
    paragraph: {
        textAlign: "justify",
        marginBottom: 14,
    },
    bold: {
        fontFamily: "Helvetica-Bold",
        color: "#000000",
    },
    issuedBy: {
        marginTop: 36,
    },
    signatory: {
        marginTop: 22,
        fontSize: 10,
        lineHeight: 1.3,
    },
    signatoryTitle: {
        fontSize: 9,
        color: "#000000",
    },
    footer: {
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 34,
    },
    verification: {
        fontFamily: "Helvetica-Oblique",
        fontSize: 8,
        lineHeight: 1.5,
        marginBottom: 34,
    },
    verificationEmail: {
        fontFamily: "Helvetica-BoldOblique",
        color: "#1d4ed8",
        textDecoration: "underline",
    },
    contactRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    contactItem: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 28,
    },
    contactText: {
        fontSize: 8.5,
        marginLeft: 8,
    },
    addressRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
});

export const format_coe_date = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const ordinal = (day) => {
    const mod100 = day % 100;
    if (mod100 >= 11 && mod100 <= 13) return `${day}th`;
    switch (day % 10) {
        case 1:
            return `${day}st`;
        case 2:
            return `${day}nd`;
        case 3:
            return `${day}rd`;
        default:
            return `${day}th`;
    }
};

const get_title_and_pronoun = (gender) => {
    const value = String(gender ?? "").toLowerCase();
    if (value === "male") return { salutation: "Mr.", pronoun: "He" };
    if (value === "female") return { salutation: "Ms.", pronoun: "She" };
    return { salutation: "", pronoun: "The employee" };
};

const iconStroke = { stroke: "#ffffff", strokeWidth: 0.7, fill: "none" };

function IconBadge({ children }) {
    return (
        <Svg width={20} height={20} viewBox="0 0 12 12">
            <Circle cx={6} cy={6} r={6} fill={ICON_COLOR} />
            {children}
        </Svg>
    );
}

function GlobeIcon() {
    return (
        <IconBadge>
            <Circle cx={6} cy={6} r={3.6} {...iconStroke} />
            <Path d="M2.4 6h7.2" {...iconStroke} />
            <Path d="M6 2.4c-1.9 2-1.9 5.2 0 7.2" {...iconStroke} />
            <Path d="M6 2.4c1.9 2 1.9 5.2 0 7.2" {...iconStroke} />
        </IconBadge>
    );
}

function MailIcon() {
    return (
        <IconBadge>
            <Path d="M2.8 3.8h6.4v4.4H2.8z" {...iconStroke} />
            <Path d="M2.8 3.8L6 6.5l3.2-2.7" {...iconStroke} />
        </IconBadge>
    );
}

function PinIcon() {
    return (
        <IconBadge>
            <Path
                d="M6 10C6 10 3.2 7.4 3.2 5.2a2.8 2.8 0 0 1 5.6 0C8.8 7.4 6 10 6 10z"
                {...iconStroke}
            />
            <Circle cx={6} cy={5.2} r={1} fill="#ffffff" />
        </IconBadge>
    );
}

function HeaderRule() {
    return (
        <Svg width={CONTENT_WIDTH} height={2} style={{ marginTop: 6 }}>
            <Defs>
                <LinearGradient id="coe-rule" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#c4b5fd" />
                    <Stop offset="0.5" stopColor="#8b5cf6" />
                    <Stop offset="1" stopColor="#93c5fd" />
                </LinearGradient>
            </Defs>
            <Rect
                x={0}
                y={0}
                width={CONTENT_WIDTH}
                height={1}
                fill="url(#coe-rule)"
            />
        </Svg>
    );
}

export default function CoeDocument({
    name,
    first_name,
    middle_name,    
    last_name,
    employee_id,
    gender,
    position,
    started_at,
    purpose,
    office_address,
}) {
    const today = new Date();
    const { salutation, pronoun } = get_title_and_pronoun(gender);
    const start_date = format_coe_date(started_at);
    const display_name = String(`${first_name} ${middle_name ?? ""} ${last_name}` ?? "").toUpperCase();
    const requester = [salutation, last_name || name].filter(Boolean).join(" ");
    const purpose_text = purpose?.trim() || DEFAULT_PURPOSE;
    const month = today.toLocaleDateString("en-US", { month: "long" });

    return (
        <Document title={`Certificate of Employment - ${name}`}>
            <Page size="A4" style={styles.page}>
                <Image
                    fixed
                    style={styles.watermark}
                    src="/images/E1Icon.png"
                />

                <Image style={styles.logo} src="/images/E1CXlogo2-cropped.png" />
                <HeaderRule />

                <Text style={styles.title}>CERTIFICATE OF EMPLOYMENT</Text>

                <Text style={styles.paragraph}>
                    This is to certify that{salutation ? ` ${salutation} ` : " "}
                    <Text style={styles.bold}>{display_name}</Text>
                    {employee_id ? (
                        <>
                            {" "}
                            with employee number{" "}
                            <Text style={styles.bold}>{employee_id}</Text>
                        </>
                    ) : null}{" "}
                    is an active employee of EmpireOne BPO Solutions, Inc.{" "}
                    {pronoun} is currently occupying the position of{" "}
                    {position || "—"}. {pronoun} has been with the company
                    {start_date ? " since " : ""}
                    {start_date ? (
                        <Text style={styles.bold}>{start_date}</Text>
                    ) : null}
                    .
                </Text>

                <Text style={styles.paragraph}>
                    This certification is being issued upon the request of{" "}
                    {requester} for {purpose_text}. EmpireOne shall not be held
                    liable if this certification is used other than the purpose
                    indicated.
                </Text>

                <Text style={styles.paragraph}>
                    Issued this {ordinal(today.getDate())} day of {month},{" "}
                    {today.getFullYear()}
                    {office_address ? ` at ${office_address}` : ""}
                </Text>

                <Text style={styles.issuedBy}>Issued by:</Text>

                <View style={styles.signatory}>
                    <Text>{SIGNATORY_NAME}</Text>
                    <Text style={styles.signatoryTitle}>{SIGNATORY_TITLE}</Text>
                </View>

                <View style={styles.footer} fixed>
                    <Text style={styles.verification}>
                        For Employee Verification, please send an email to{" "}
                        <Text style={styles.verificationEmail}>
                            {VERIFICATION_EMAIL}
                        </Text>{" "}
                        along with an Authorization Letter duly signed by the
                        employee.
                    </Text>

                    <View style={styles.contactRow}>
                        <View style={styles.contactItem}>
                            <GlobeIcon />
                            <Text style={styles.contactText}>{WEBSITE}</Text>
                        </View>
                        <View style={styles.contactItem}>
                            <MailIcon />
                            <Text style={styles.contactText}>{HR_EMAIL}</Text>
                        </View>
                    </View>

                    {office_address ? (
                        <View style={styles.addressRow}>
                            <PinIcon />
                            <Text style={styles.contactText}>
                                {office_address}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </Page>
        </Document>
    );
}
