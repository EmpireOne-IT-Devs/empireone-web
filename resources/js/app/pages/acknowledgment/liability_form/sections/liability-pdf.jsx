import React from "react";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { getAccountabilityDocument } from "./accountability-template";

const styles = StyleSheet.create({
    page: { padding: 38, paddingBottom: 68, fontSize: 9, lineHeight: 1.25, color: "#222" },
    logo: { width: 96, height: 38, objectFit: "contain", alignSelf: "center", marginBottom: 6 },
    title: { textAlign: "center", fontSize: 14, fontFamily: "Helvetica-Bold" },
    reference: { textAlign: "center", marginBottom: 14, fontSize: 8 },
    fields: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10, borderTopWidth: 0.5, borderLeftWidth: 0.5 },
    field: { width: "50%", padding: 4, borderBottomWidth: 0.5, borderRightWidth: 0.5 },
    row: { flexDirection: "row", borderBottomWidth: 0.5, borderLeftWidth: 0.5 },
    headers: { borderTopWidth: 0.5, backgroundColor: "#f3f4f6" },
    cell: { flex: 1, padding: 4, borderRightWidth: 0.5 },
    heading: { fontFamily: "Helvetica-Bold", marginTop: 9, marginBottom: 3 },
    bullet: { marginLeft: 12, marginBottom: 2 },
    nested: { marginLeft: 24, marginBottom: 2 },
    signRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 26 },
    signBlock: { width: "44%", justifyContent: "flex-end", textAlign: "center" },
    signature: { width: 120, height: 44, objectFit: "contain", alignSelf: "center" },
    signLabel: { borderTopWidth: 0.5, marginTop: 4, paddingTop: 3, fontSize: 8 },
    footer: { position: "absolute", bottom: 30, left: 38, right: 38, fontSize: 7, color: "#555" },
});

function PolicySections({ sections }) {
    return sections.map(([title, points]) => (
        <View key={title} wrap={false}>
            <Text style={styles.heading}>{title}</Text>
            {points.map((point) => Array.isArray(point) ? (
                <View key={point[0]}>
                    <Text style={styles.bullet}>• {point[0]}</Text>
                    {point[1].map((detail) => <Text style={styles.nested} key={detail}>- {detail}</Text>)}
                </View>
            ) : <Text style={styles.bullet} key={point}>• {point}</Text>)}
        </View>
    ));
}

export function LiabilityPdf({ form, logo }) {
    const document = getAccountabilityDocument(form);
    if (!document) throw new Error("Unsupported liability form template.");

    return (
        <Document title={`${document.title} ${form.id}`} author="EmpireOneCX">
            <Page size="A4" style={styles.page}>
                <Image src={logo} style={styles.logo} />
                <Text style={styles.title}>{document.title}</Text>
                <Text style={styles.reference}>{form.id} | {form.status}</Text>
                {form.source === "paper" && <Text style={styles.reference}>Paper Record - Transcription, not the signed original</Text>}
                <View style={styles.fields}>
                    {document.fields.map((field, index) => (
                        <Text key={field} style={styles.field}>{field} {document.values[index] ?? "—"}</Text>
                    ))}
                </View>
                <View style={[styles.row, styles.headers]}>
                    {document.headers.map((header) => <Text style={styles.cell} key={header}>{header}</Text>)}
                </View>
                {document.rows.map((row, index) => (
                    <View key={index} style={styles.row} wrap={false}>
                        {row.map((cell, cellIndex) => <Text style={styles.cell} key={cellIndex}>{cell ?? "—"}</Text>)}
                    </View>
                ))}
                <Text style={styles.heading} minPresenceAhead={35}>{document.policyTitle}</Text>
                <PolicySections sections={document.sections.slice(0, 5)} />
                <View break>
                    <Image src={logo} style={styles.logo} />
                    <PolicySections sections={document.sections.slice(5)} />
                    <View wrap={false}>
                        <Text style={styles.heading}>{document.acknowledgmentTitle}</Text>
                        <Text>{document.acknowledgment}</Text>
                        <View style={styles.signRow}>
                            <View style={styles.signBlock}>
                                <Text>{form.paperSignedDate ?? form.issueDate ?? " "}</Text>
                                <Text style={styles.signLabel}>{document.dateLabel}</Text>
                            </View>
                            <View style={styles.signBlock}>
                                {form.signature && <Image src={form.signature} style={styles.signature} />}
                                <Text>{form.source === "paper" ? "See signed original" : (form.printedName ?? " ")}</Text>
                                <Text style={styles.signLabel}>{document.signatureLabel}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <Text fixed style={styles.footer}>Disclaimer: {document.disclaimer}</Text>
            </Page>
        </Document>
    );
}
