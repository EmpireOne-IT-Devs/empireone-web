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
import moment from "moment";
import { useSelector } from "react-redux";
import PDFLoader from "@/app/_components/pdf-loader";

// 1. Define Styles
const styles = StyleSheet.create({
    viewer: {
        width: "100%",
        height: "100vh",
        border: "none",
    },
    page: {
        padding: 30,
        fontSize: 9,
        fontFamily: "Helvetica",
        color: "#333",
    },
    logoContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "200"
    },
    // Header
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: "#004a99",
        paddingBottom: 10,
    },
    logoText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#004a99",
    },
    formTitleContainer: {
        alignItems: "flex-end",
    },
    formTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#1a2b3c",
    },
    subTitle: {
        fontSize: 8,
        color: "#666",
        marginTop: 2,
    },
    // Info Section
    infoSection: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        backgroundColor: "#fafafa",
    },
    infoLabel: {
        width: 130,
        padding: 8,
        fontWeight: "bold",
        borderRightWidth: 1,
        borderRightColor: "#e2e8f0",
    },
    infoValue: {
        flex: 1,
        padding: 8,
        backgroundColor: "#fffbe6",
    },
    // Rating Banner
    ratingBanner: {
        backgroundColor: "#eff6ff",
        padding: 10,
        borderRadius: 4,
        marginBottom: 15,
    },
    ratingBannerTitle: {
        color: "#3b82f6",
        marginBottom: 4,
        fontSize: 8,
        fontWeight: "bold",
    },
    ratingScale: {
        flexDirection: "row",
        color: "#3b82f6",
        fontSize: 8,
        justifyContent: "space-between",
    },
    // Sections
    sectionHeader: {
        backgroundColor: "#1e293b",
        color: "white",
        padding: 8,
        fontSize: 10,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 5,
    },
    // Tables
    tableHeader: {
        flexDirection: "row",
        marginBottom: 5,
        paddingHorizontal: 5,
    },
    col1: { flex: 1, paddingRight: 5 },
    col2: { flex: 1, paddingRight: 5 },
    col3: { flex: 1 },
    // Section 1 Specifics
    objectiveBox: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        marginBottom: 10,
    },
    objectiveInputs: {
        flexDirection: "row",
    },
    inputArea: {
        flex: 1,
        minHeight: 40,
        backgroundColor: "#fffbe6",
        borderRightWidth: 1,
        borderRightColor: "#e2e8f0",
        padding: 5,
    },
    managerRatingArea: {
        padding: 10,
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#e2e8f0",
    },
    circlesContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 30,
        marginTop: 5,
    },
    circleOption: {
        alignItems: "center",
    },
    // Radio Button Logic
    circle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#cbd5e1",
        marginTop: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    circleFilled: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#2563eb",
    },
    // Section 2 Table
    reqTable: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    reqHeaderRow: {
        flexDirection: "row",
        backgroundColor: "#f8fafc",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        padding: 8,
    },
    reqRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        padding: 8,
        alignItems: "center",
    },
    reqColMain: {
        flex: 1,
        borderRightWidth: 1,
        borderRightColor: "#e2e8f0",
        paddingRight: 10,
    },
    reqTitle: { fontWeight: "bold", marginBottom: 2 },
    reqDesc: { fontSize: 7, color: "#64748b", fontStyle: "italic" },
    reqColRating: {
        width: 150,
        flexDirection: "row",
        justifyContent: "space-around",
        paddingLeft: 10,
    },
    // Over-all Rating Box
    overallBox: {
        alignSelf: "flex-end",
        width: 250,
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    overallRow: {
        flexDirection: "row",
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        backgroundColor: "#f8fafc",
    },
    overallTotalRow: {
        flexDirection: "row",
        padding: 8,
        backgroundColor: "#1e293b",
        color: "white",
    },
    overallLabel: { flex: 1, fontWeight: "bold" },
    overallValue: { width: 50, textAlign: "center", fontWeight: "bold" },
    // Remarks
    remarksSection: {
        borderWidth: 1,
        borderColor: "#e2e8f0",
        padding: 10,
        marginTop: 15,
    },
    remarksBox: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        minHeight: 60,
        marginTop: 10,
        padding: 5,
        backgroundColor: "#fffbe6",
    },
    // Recommendations
    recommendationSection: {
        marginTop: 15,
        flexDirection: "row",
        gap: 20,
    },
    recOption: {
        flexDirection: "row",
        alignItems: "center",
    },
    // Signature
    signatureSection: {
        marginTop: 40,
        alignItems: "center",
        width: 200,
        alignSelf: "flex-end", // Aligning to the right
    },
    signatureImage: {
        width: 120,
        height: 60,
        objectFit: "contain",
        marginBottom: -10, // Pull it down over the text slightly
    },
    signatureLine: {
        borderTopWidth: 1,
        borderTopColor: "#000",
        width: "100%",
        textAlign: "center",
        paddingTop: 5,
        marginTop: 5,
        fontSize: 8,
    },
});

// Helper component for Radio Buttons
const RadioRating = ({ selectedValue }) => (
    <View style={styles.circlesContainer}>
        {[1, 2, 3, 4, 5].map((num) => (
            <View key={num} style={styles.circleOption}>
                <Text style={{ fontSize: 7, color: "#64748b" }}>{num}</Text>
                <View style={styles.circle}>
                    {Number(selectedValue) === num && (
                        <View style={styles.circleFilled} />
                    )}
                </View>
            </View>
        ))}
    </View>
);

// 2. Define the PDF Document Component
export const EvaluationDocument = ({ data }) => {
    // Safety check to ensure arrays exist
    const objectives = data?.objectives || [];
    const performances = data?.performances || [];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <View style={styles.logoContainer}>
                        <Image src="/images/E1CXlogo2.png" />
                    </View>
                    <View style={styles.formTitleContainer}>
                        <Text style={styles.formTitle}>
                            PERFORMANCE EVALUATION FORM
                        </Text>
                        <Text style={styles.subTitle}>
                            {/* (Probationary Employee) */}
                        </Text>
                    </View>
                </View>

                {/* Employee Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Employee Name: *</Text>
                        <Text style={styles.infoValue}>
                            {data?.employee_name || "-"}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Supervisor Name: *</Text>
                        <Text style={styles.infoValue}>
                            {data?.supervisor_name || "-"}
                        </Text>
                    </View>
                    <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.infoLabel}>
                            Date of Assessment: *
                        </Text>
                        <Text style={styles.infoValue}>
                            {data?.date_of_assessment
                                ? moment(data.date_of_assessment).format("MM/DD/YYYY")
                                : "-"}
                        </Text>
                    </View>
                </View>

                {/* Rating Scale Legend */}
                <View style={styles.ratingBanner}>
                    <Text style={styles.ratingBannerTitle}>Rating Scale:</Text>
                    <View style={styles.ratingScale}>
                        <Text>5 - Excellent</Text>
                        <Text>4 - Outstanding</Text>
                        <Text>3 - Satisfactory</Text>
                        <Text>2 - Needs Improvement</Text>
                        <Text>1 - Unacceptable</Text>
                    </View>
                </View>

                {/* SECTION 1 */}
                <Text style={styles.sectionHeader}>
                    SECTION 1: OBJECTIVES (50%)
                </Text>

                <View style={styles.tableHeader}>
                    <Text style={[styles.col1, { fontSize: 7, color: "#64748b" }]}>
                        OBJECTIVE *
                    </Text>
                    <Text style={[styles.col2, { fontSize: 7, color: "#64748b" }]}>
                        ACTION ITEMS *
                    </Text>
                    <Text style={[styles.col3, { fontSize: 7, color: "#64748b" }]}>
                        OUTCOMES *
                    </Text>
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
                            <Text style={{ fontSize: 7, color: "#64748b" }}>
                                Manager Rating *
                            </Text>
                            <RadioRating selectedValue={obj.mgr_rating} />
                        </View>
                    </View>
                ))}

                {/* SECTION 2 */}
                <Text style={styles.sectionHeader}>
                    SECTION 2: GENERAL PERFORMANCE REQUIREMENTS (50%)
                </Text>

                <View style={styles.reqTable}>
                    <View style={styles.reqHeaderRow}>
                        <Text style={[styles.reqColMain, { fontWeight: "bold", fontSize: 8 }]}>
                            REQUIREMENT
                        </Text>
                        <Text style={[styles.reqColRating, { fontWeight: "bold", fontSize: 8, justifyContent: "center" }]}>
                            MGR. RATING *
                        </Text>
                    </View>

                    {performances.map((item, index) => (
                        <View style={styles.reqRow} key={index}>
                            <View style={styles.reqColMain}>
                                <Text style={styles.reqTitle}>{item.title}</Text>
                                <Text style={styles.reqDesc}>
                                    {item.action_items}
                                </Text>
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

                {/* OVERALL RATING */}
                <Text style={styles.sectionHeader}>OVER-ALL RATING</Text>
                <View style={styles.overallBox}>
                    <View style={styles.overallRow}>
                        <Text style={styles.overallLabel}>
                            Section 1 (50%) Average:
                        </Text>
                        <Text style={styles.overallValue}>
                            {data?.section1Score || "-"}
                        </Text>
                    </View>
                    <View style={styles.overallRow}>
                        <Text style={styles.overallLabel}>
                            Section 2 (50%) Average:
                        </Text>
                        <Text style={styles.overallValue}>
                            {data?.section2Score || "-"}
                        </Text>
                    </View>
                    <View style={styles.overallTotalRow}>
                        <Text style={styles.overallLabel}>
                            TOTAL AVERAGE SCORE:
                        </Text>
                        <Text style={styles.overallValue}>
                            {data?.totalScore || "-"}
                        </Text>
                    </View>
                </View>

                {/* REMARKS */}
                <View style={styles.remarksSection}>
                    <Text style={{ fontSize: 8, fontWeight: "bold" }}>
                        REMARKS / COMMENTS: *
                    </Text>
                    <View style={styles.remarksBox}>
                        <Text>{data?.remarks || ""}</Text>
                    </View>
                </View>

                {/* RECOMMENDATION (Mapped from your form code) */}
                <View style={styles.recommendationSection}>
                    <Text style={{ fontSize: 8, fontWeight: "bold" }}>
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
                                <Text style={{ fontSize: 8, marginLeft: 4 }}>
                                    {recOption}
                                </Text>
                            </View>
                        )
                    )}
                </View>

                {/* SIGNATURE */}
                <View style={styles.signatureSection}>
                    {data?.signature && (
                        <Image
                            src={data.signature}
                            style={styles.signatureImage}
                        />
                    )}
                    <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                        {data?.supervisor_name || ""}
                    </Text>
                    <Text style={styles.signatureLine}>
                        IMMEDIATE SUPERIOR NAME & SIGNATURE
                    </Text>
                </View>
            </Page>
        </Document>
    );
};


export default function ResultFormSection() {
    // 1. Pull directly from Redux
    const { evaluation } = useSelector((store) => store.human_resources);

    // Safety fallback while Redux is loading
    if (!evaluation) return null;

    // 2. Recreate the calculation logic based on raw database arrays
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

    // 3. Map the database fields to the PDF's expected keys
    const pdfPayload = {
        employee_name: evaluation?.user?.personal_information
            ? `${evaluation.user.personal_information.first_name} ${evaluation.user.personal_information.last_name}`
            : "",
        supervisor_name: evaluation?.supervisor?.personal_information
            ? `${evaluation.supervisor.personal_information.first_name} ${evaluation.supervisor.personal_information.last_name}`
            : "",
        date_of_assessment: evaluation?.date_of_assessment,

        // Map section1s to 'objectives' format
        objectives: evaluation?.section1s?.map((res) => ({
            title: res.objective,
            action_items: res.action,
            outcomes: res.outcome,
            mgr_rating: String(res.rating || ""),
        })) || [],

        // Map section2s to 'performances' format
        performances: evaluation?.section2s?.map((res) => ({
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
console.log('evaluation',evaluation)
    return <PDFLoader pdf={<EvaluationDocument data={pdfPayload} />} width="w-full" />;
}