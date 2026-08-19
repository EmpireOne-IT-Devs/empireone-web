import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import moment from "moment";
import { useSelector } from "react-redux";
import PDFLoader from "@/app/_components/pdf-loader";

// Refactored Stylesheet with layout, spacing, and contrast fixes
const styles = StyleSheet.create({
    page: {
        padding: 24,
        fontSize: 8,
        fontFamily: "Helvetica",
        color: "#1e293b",
        lineHeight: 1.2,
    },
    // Header
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        borderBottomWidth: 1.5,
        borderBottomColor: "#0f172a",
        paddingBottom: 8,
    },
    logoImage: {
        width: 130,
        height: "auto",
    },
    formTitleContainer: {
        alignItems: "flex-end",
    },
    formTitle: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: "#0f172a",
        textTransform: "uppercase",
    },

    // Info Table
    infoSection: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        marginBottom: 10,
        borderRadius: 2,
    },
    infoRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    infoLabel: {
        width: 120,
        padding: 5,
        fontFamily: "Helvetica-Bold",
        backgroundColor: "#f1f5f9",
        borderRightWidth: 1,
        borderRightColor: "#cbd5e1",
        color: "#334155",
    },
    infoValue: {
        flex: 1,
        padding: 5,
        backgroundColor: "#ffffff",
        color: "#0f172a",
    },

    // Rating Banner
    ratingBanner: {
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        padding: 6,
        borderRadius: 2,
        marginBottom: 10,
    },
    ratingBannerTitle: {
        color: "#0f172a",
        marginBottom: 3,
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
    },
    ratingScale: {
        flexDirection: "row",
        color: "#475569",
        fontSize: 7,
        justifyContent: "space-between",
    },

    // Section Headers
    sectionHeader: {
        backgroundColor: "#0f172a",
        color: "#ffffff",
        padding: 5,
        fontSize: 8.5,
        fontFamily: "Helvetica-Bold",
        marginTop: 8,
        marginBottom: 4,
        borderRadius: 1,
    },

    // Section 1
    colHeaderRow: {
        flexDirection: "row",
        backgroundColor: "#f1f5f9",
        borderWidth: 1,
        borderColor: "#cbd5e1",
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    colHeader: {
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        color: "#475569",
    },
    objectiveBox: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderTopWidth: 0,
        marginBottom: 8,
    },
    objectiveInputs: {
        flexDirection: "row",
    },
    inputArea: {
        flex: 1,
        padding: 5,
        minHeight: 32,
        backgroundColor: "#ffffff",
        borderRightWidth: 1,
        borderRightColor: "#e2e8f0",
    },
    managerRatingArea: {
        padding: 4,
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
        backgroundColor: "#f8fafc",
    },

    // Custom Radio Alignment
    circlesContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
        marginTop: 2,
    },
    circleOption: {
        alignItems: "center",
    },
    circle: {
        width: 9,
        height: 9,
        borderRadius: 4.5,
        borderWidth: 1,
        borderColor: "#64748b",
        marginTop: 2,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    circleFilled: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: "#0f172a",
    },

    // Section 2
    reqTable: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        marginBottom: 8,
    },
    reqHeaderRow: {
        flexDirection: "row",
        backgroundColor: "#f1f5f9",
        borderBottomWidth: 1,
        borderBottomColor: "#cbd5e1",
        padding: 5,
    },
    reqRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        padding: 5,
        alignItems: "center",
    },
    reqColMain: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: "#e2e8f0",
        paddingRight: 6,
    },
    reqTitle: {
        fontFamily: "Helvetica-Bold",
        fontSize: 7.5,
        color: "#0f172a",
    },
    reqDesc: {
        fontSize: 6.5,
        color: "#64748b",
        marginTop: 1,
    },
    reqColRating: {
        width: 140,
        flexDirection: "row",
        justifyContent: "space-around",
        paddingLeft: 6,
    },

    // Overall Table
    overallBox: {
        alignSelf: "flex-end",
        width: 220,
        marginTop: 4,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#cbd5e1",
    },
    overallRow: {
        flexDirection: "row",
        padding: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        backgroundColor: "#ffffff",
    },
    overallTotalRow: {
        flexDirection: "row",
        padding: 5,
        backgroundColor: "#0f172a",
        color: "#ffffff",
    },
    overallLabel: {
        flex: 1,
        fontFamily: "Helvetica-Bold",
        fontSize: 7.5,
    },
    overallValue: {
        width: 45,
        textAlign: "right",
        fontFamily: "Helvetica-Bold",
        fontSize: 7.5,
    },

    // Remarks
    remarksSection: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        padding: 6,
        marginBottom: 8,
    },
    remarksBox: {
        minHeight: 35,
        marginTop: 4,
        padding: 4,
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },

    // Recommendations
    recommendationSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    recOption: {
        flexDirection: "row",
        alignItems: "center",
    },

    // Signatures
    signatureSection: {
        marginTop: 10,
        alignItems: "center",
        width: 180,
        alignSelf: "flex-end",
    },
    signatureImage: {
        width: 100,
        height: 35,
        objectFit: "contain",
        marginBottom: -5,
    },
    signatureLine: {
        borderTopWidth: 1,
        borderTopColor: "#0f172a",
        width: "100%",
        textAlign: "center",
        paddingTop: 3,
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        color: "#334155",
    },
});

const RadioRating = ({ selectedValue }) => (
    <View style={styles.circlesContainer}>
        {[1, 2, 3, 4, 5].map((num) => (
            <View key={num} style={styles.circleOption}>
                <Text style={{ fontSize: 6.5, color: "#475569" }}>{num}</Text>
                <View style={styles.circle}>
                    {Number(selectedValue) === num && <View style={styles.circleFilled} />}
                </View>
            </View>
        ))}
    </View>
);

export const EvaluationDocument = ({ data }) => {
    const objectives = data?.objectives || [];
    const performances = data?.performances || [];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <Image src="/images/E1CXlogo2.png" style={styles.logoImage} />
                    <View style={styles.formTitleContainer}>
                        <Text style={styles.formTitle}>Performance Evaluation Form</Text>
                    </View>
                </View>

                {/* Employee Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Employee Name:</Text>
                        <Text style={styles.infoValue}>{data?.employee_name || "-"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Supervisor Name:</Text>
                        <Text style={styles.infoValue}>{data?.supervisor_name || "-"}</Text>
                    </View>
                    <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.infoLabel}>Date of Assessment:</Text>
                        <Text style={styles.infoValue}>
                            {data?.date_of_assessment
                                ? moment(data.date_of_assessment).format("MM/DD/YYYY")
                                : "-"}
                        </Text>
                    </View>
                </View>

                {/* Rating Scale Legend */}
                <View style={styles.ratingBanner}>
                    <Text style={styles.ratingBannerTitle}>RATING SCALE</Text>
                    <View style={styles.ratingScale}>
                        <Text>5 - Excellent</Text>
                        <Text>4 - Outstanding</Text>
                        <Text>3 - Satisfactory</Text>
                        <Text>2 - Needs Improvement</Text>
                        <Text>1 - Unacceptable</Text>
                    </View>
                </View>

                {/* SECTION 1 */}
                <View wrap={false}>
                    <Text style={styles.sectionHeader}>SECTION 1: OBJECTIVES (50%)</Text>
                    <View style={styles.colHeaderRow}>
                        <Text style={[styles.colHeader, { flex: 1 }]}>OBJECTIVE</Text>
                        <Text style={[styles.colHeader, { flex: 1 }]}>ACTION ITEMS</Text>
                        <Text style={[styles.colHeader, { flex: 1 }]}>OUTCOMES</Text>
                    </View>

                    {objectives.map((obj, index) => (
                        <View key={`obj-${index}`} style={styles.objectiveBox}>
                            <View style={styles.objectiveInputs}>
                                <View style={styles.inputArea}>
                                    <Text>{obj.title || "-"}</Text>
                                </View>
                                <View style={styles.inputArea}>
                                    <Text>{obj.action_items || "-"}</Text>
                                </View>
                                <View style={[styles.inputArea, { borderRightWidth: 0 }]}>
                                    <Text>{obj.outcomes || "-"}</Text>
                                </View>
                            </View>
                            <View style={styles.managerRatingArea}>
                                <Text style={{ fontSize: 6.5, color: "#475569", fontFamily: "Helvetica-Bold" }}>
                                    Manager Rating
                                </Text>
                                <RadioRating selectedValue={obj.mgr_rating} />
                            </View>
                        </View>
                    ))}
                </View>

                {/* SECTION 2 */}
                <View wrap={false}>
                    <Text style={styles.sectionHeader}>
                        SECTION 2: GENERAL PERFORMANCE REQUIREMENTS (50%)
                    </Text>

                    <View style={styles.reqTable}>
                        <View style={styles.reqHeaderRow}>
                            <Text style={[styles.reqColMain, { fontFamily: "Helvetica-Bold", fontSize: 7, color: "#475569" }]}>
                                REQUIREMENT
                            </Text>
                            <Text style={{ width: 140, fontFamily: "Helvetica-Bold", fontSize: 7, color: "#475569", textAlign: "center" }}>
                                MGR. RATING
                            </Text>
                        </View>

                        {performances.map((item, index) => (
                            <View style={styles.reqRow} key={index}>
                                <View style={styles.reqColMain}>
                                    <Text style={styles.reqTitle}>{item.title}</Text>
                                    <Text style={styles.reqDesc}>{item.action_items}</Text>
                                </View>
                                <View style={styles.reqColRating}>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <View key={`req-${index}-${num}`} style={styles.circleOption}>
                                            <Text style={{ fontSize: 6, color: "#64748b" }}>{num}</Text>
                                            <View style={styles.circle}>
                                                {Number(item.mgr_rating) === num && (
                                                    <View style={styles.circleFilled} />
                                                )}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* OVERALL RATING & REMARKS */}
                <View wrap={false}>
                    <Text style={styles.sectionHeader}>OVERALL SUMMARY</Text>
                    <View style={styles.overallBox}>
                        <View style={styles.overallRow}>
                            <Text style={styles.overallLabel}>Section 1 (50%) Avg:</Text>
                            <Text style={styles.overallValue}>{data?.section1Score || "-"}</Text>
                        </View>
                        <View style={styles.overallRow}>
                            <Text style={styles.overallLabel}>Section 2 (50%) Avg:</Text>
                            <Text style={styles.overallValue}>{data?.section2Score || "-"}</Text>
                        </View>
                        <View style={styles.overallTotalRow}>
                            <Text style={styles.overallLabel}>TOTAL AVERAGE:</Text>
                            <Text style={styles.overallValue}>{data?.totalScore || "-"}</Text>
                        </View>
                    </View>

                    <View style={styles.remarksSection}>
                        <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#334155" }}>
                            REMARKS / COMMENTS:
                        </Text>
                        <View style={styles.remarksBox}>
                            <Text>{data?.remarks || "-"}</Text>
                        </View>
                    </View>

                    {/* RECOMMENDATION */}
                    <View style={styles.recommendationSection}>
                        <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#334155" }}>
                            RECOMMENDATION:
                        </Text>
                        {["Mid-Probationary", "Regular", "Extended Probationary", "End of Contract"].map(
                            (recOption) => (
                                <View key={recOption} style={styles.recOption}>
                                    <View style={styles.circle}>
                                        {data?.recommendation === recOption && (
                                            <View style={styles.circleFilled} />
                                        )}
                                    </View>
                                    <Text style={{ fontSize: 7, marginLeft: 3, color: "#334155" }}>
                                        {recOption}
                                    </Text>
                                </View>
                            )
                        )}
                    </View>

                    {/* SIGNATURE */}
                    <View style={styles.signatureSection}>
                        {data?.signature && (
                            <Image src={data.signature} style={styles.signatureImage} />
                        )}
                        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8.5, marginBottom: 2 }}>
                            {data?.supervisor_name || ""}
                        </Text>
                        <Text style={styles.signatureLine}>
                            IMMEDIATE SUPERIOR NAME & SIGNATURE
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default function ResultFormSection() {
    const { evaluation } = useSelector((store) => store.human_resources);

    if (!evaluation) return null;

    const getAverage = (arr) => {
        if (!arr || arr.length === 0) return 0;
        const ratings = arr
            .map((item) => parseFloat(item.rating))
            .filter((val) => !isNaN(val) && val > 0);

        if (ratings.length === 0) return 0;
        return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2);
    };

    const section1Score = getAverage(evaluation?.section1s);
    const section2Score = getAverage(evaluation?.section2s);
    const totalScore =
        section1Score > 0 && section2Score > 0
            ? ((parseFloat(section1Score) + parseFloat(section2Score)) / 2).toFixed(2)
            : 0;

    const pdfPayload = {
        employee_name: evaluation?.user?.personal_information
            ? `${evaluation.user.personal_information.first_name} ${evaluation.user.personal_information.last_name}`
            : "",
        supervisor_name: evaluation?.supervisor?.personal_information
            ? `${evaluation.supervisor.personal_information.first_name} ${evaluation.supervisor.personal_information.last_name}`
            : "",
        date_of_assessment: evaluation?.date_of_assessment,

        objectives:
            evaluation?.section1s?.map((res) => ({
                title: res.objective,
                action_items: res.action,
                outcomes: res.outcome,
                mgr_rating: String(res.rating || ""),
            })) || [],

        performances:
            evaluation?.section2s?.map((res) => ({
                title: res.requirements,
                action_items: res.description,
                mgr_rating: String(res.rating || ""),
            })) || [],

        remarks: evaluation?.remarks || "",
        recommendation: evaluation?.recommendation || "",
        section1Score: section1Score,
        section2Score: section2Score,
        totalScore: totalScore,
        signature: evaluation?.supervisor?.account_employee?.signature,
    };

    return <PDFLoader pdf={<EvaluationDocument data={pdfPayload} />} width="w-full" />;
}