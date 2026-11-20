import React from "react";
import { getAccountabilityDocument } from "./accountability-template";

export function AssetAccountabilityDocument({ form }) {
    const document = getAccountabilityDocument(form);
    if (!document) return <p role="alert" className="text-sm text-red-700">This form uses an unsupported template version.</p>;

    return (
        <article className="space-y-6 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-800 sm:p-6 lg:p-8">
            <header className="space-y-3 text-center">
                <img src="/images/eo-full-logo.png" alt="EmpireOneCX" className="mx-auto h-12 w-auto object-contain" />
                <h2 className="text-lg font-bold text-gray-900">{document.title}</h2>
                <p className="text-gray-500">{form.id}</p>
                {form.source === "paper" && (
                    <p className="text-gray-600">Paper Record · Originally signed {form.paperSignedDate}. No digital signature was applied.</p>
                )}
            </header>
            <dl className="grid gap-3 rounded-lg border border-gray-200 p-4 sm:grid-cols-2">
                {document.fields.map((field, index) => (
                    <div className="min-w-0 break-words" key={field}>
                        <dt className="font-medium">{field}</dt>
                        <dd>{document.values[index] ?? (index === 3 && form.canAcknowledge ? "Recorded on acknowledgment" : "—")}</dd>
                    </div>
                ))}
            </dl>
            <div className="overflow-x-auto rounded-lg border border-gray-200" tabIndex={0} role="region" aria-label="Asset details">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                    <thead className="bg-gray-50">
                        <tr>{document.headers.map((header) => <th className="border-b border-gray-200 p-2" key={header} scope="col">{header}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {document.rows.map((row, index) => (
                            <tr key={`${row[0]}-${index}`}>
                                <th scope="row" className="p-2 font-medium">{row[0]}</th>
                                {row.slice(1).map((cell, cellIndex) => <td className="p-2" key={cellIndex}>{cell ?? "—"}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <section className="space-y-3">
                <h3 className="font-bold">{document.policyTitle}</h3>
                {document.sections.map(([title, points]) => (
                    <div key={title}>
                        <h4 className="font-medium">{title}</h4>
                        <ul className="ml-5 list-disc space-y-0.5">
                            {points.map((point) => Array.isArray(point) ? (
                                <li key={point[0]}>
                                    {point[0]}
                                    <ul className="ml-5 list-[circle]">
                                        {point[1].map((detail) => <li key={detail}>{detail}</li>)}
                                    </ul>
                                </li>
                            ) : <li key={point}>{point}</li>)}
                        </ul>
                    </div>
                ))}
            </section>
            <section className="space-y-2 border-t border-gray-200 pt-4">
                <h3 className="font-bold">{document.acknowledgmentTitle}</h3>
                <p>{document.acknowledgment}</p>
                {form.signature && (
                    <div className="grid gap-4 pt-3 sm:grid-cols-2 sm:gap-y-0">
                        <div className="min-w-0 sm:row-span-2 sm:grid sm:grid-rows-subgrid">
                            <p className="self-end">{form.issueDate}</p>
                            <p className="border-t border-gray-300 pt-1 text-xs">{document.dateLabel}</p>
                        </div>
                        <div className="min-w-0 sm:row-span-2 sm:grid sm:grid-rows-subgrid">
                            <div className="self-end">
                                <img src={form.signature} alt="Recorded employee signature" className="h-14 w-full object-contain object-left" />
                                <p className="break-words">{form.printedName}</p>
                            </div>
                            <p className="border-t border-gray-300 pt-1 text-xs">{document.signatureLabel}</p>
                        </div>
                    </div>
                )}
            </section>
            <footer className="border-t border-gray-200 pt-4 text-xs text-gray-600">
                <p className="font-medium">Disclaimer:</p>
                <p>{document.disclaimer}</p>
            </footer>
        </article>
    );
}
