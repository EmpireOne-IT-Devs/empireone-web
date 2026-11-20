import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Layout from "@/app/pages/accounts/layout";
import Badge from "@/app/_components/badge";
import Button from "@/app/_components/button";
import Checkbox from "@/app/_components/checkbox";
import { AssetAccountabilityDocument } from "./sections/asset-accountability-document";
import { getAccountabilityDocument } from "./sections/accountability-template";
import { LiabilityDownload } from "./sections/liability-download";
import useLiabilityForm from "./sections/use-liability-form";

function SigningForm({ id }) {
    const { form, loading, error, reload, run, busy, actionError } = useLiabilityForm(id);
    const [accepted, setAccepted] = useState(false);

    const acknowledge = async (event) => {
        event.preventDefault();
        if (accepted && form?.canAcknowledge && getAccountabilityDocument(form)) {
            await run("acknowledge", { accepted, templateVersion: form.templateVersion });
        }
    };

    if (loading) return <p role="status">Loading your accountability form...</p>;
    if (error || !form) return (
        <div className="space-y-3">
            <p role="alert" className="text-sm text-red-700">{error?.message ?? "The form could not be loaded."}</p>
            <Button type="button" variant="secondary" outlined onClick={reload}>Retry</Button>
        </div>
    );

    const fieldError = actionError?.errors?.accepted?.[0];
    const signatureError = actionError?.errors?.signature?.[0];
    const canSign = form.canAcknowledge && getAccountabilityDocument(form);

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
                <Badge label={form.status} variant={form.canAcknowledge ? "warning" : form.signature ? "success" : "secondary"} />
                {form.signature && <LiabilityDownload form={form} />}
            </div>
            <AssetAccountabilityDocument form={form} />
            {canSign && (
                <form onSubmit={acknowledge} className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
                    <p className="text-sm text-gray-600">Confirm only after you receive the listed property. Your signature on file will be applied to this form.</p>
                    <Checkbox
                        name="accept-accountability"
                        label="I acknowledge receipt and agree to the terms shown above."
                        checked={accepted}
                        onChange={(event) => setAccepted(event.target.checked)}
                        disabled={Boolean(busy)}
                        required
                        error={fieldError}
                    />
                    {actionError && !fieldError && (
                        <div role="alert" className="space-y-2 text-sm text-red-700">
                            <p>{signatureError ?? actionError.message}</p>
                            {actionError.status === 409 && <Button type="button" variant="secondary" outlined onClick={() => {
                                setAccepted(false);
                                reload();
                            }}>Reload form</Button>}
                        </div>
                    )}
                    <Button type="submit" variant="primary" loading={Boolean(busy)} disabled={!accepted || Boolean(busy)}>
                        Acknowledge and apply signature
                    </Button>
                </form>
            )}
            {form.status === "Acknowledged" && <p role="status" className="text-sm text-green-700">Your acknowledgment has been saved.</p>}
            {form.status === "Voided" && <p role="status" className="text-sm text-gray-600">This form was voided. Contact your asset custodian if you need help.</p>}
        </div>
    );
}

export default function Page({ id }) {
    return (
        <Layout>
            <Head title="Asset Accountability Form" />
            <section className="mx-auto max-w-4xl space-y-4 text-gray-900">
                <h1 className="text-xl font-bold sm:text-2xl">Asset Accountability Form</h1>
                <SigningForm key={id} id={id} />
            </section>
        </Layout>
    );
}
