import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { useSelector } from 'react-redux';
import { get_corrective_action_by_id_thunk } from '@/app/redux/employee-relation-thunk';
import { sign_corrective_action_service } from '@/app/services/human-resources-service';
import store from '@/app/store/store';
import moment from 'moment';

export default function CorrectiveActionForm() {
    const user = usePage().props.auth.user;
    const { corrective_action } = useSelector((store) => store.human_resources);
    const [explanation, setExplanation] = useState('');
    const [selectedSanction, setSelectedSanction] = useState('');
    const [commitment, setCommitment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingSanction, setIsSavingSanction] = useState(false);


    // Keep state synchronized with backend values
    useEffect(() => {
        if (corrective_action?.employee_explanation) {
            setExplanation(corrective_action.employee_explanation);
        }
        if (corrective_action?.final_sanction) {
            setSelectedSanction(corrective_action.final_sanction);
        }
        if (corrective_action?.employee_commitment) {
            setCommitment(corrective_action.employee_commitment);
        }
    }, [corrective_action]);

    // Save Selected Sanction
    const handleSaveSanction = async () => {
        if (!selectedSanction) {
            alert('Please select a sanction option first.');
            return;
        }

        setIsSavingSanction(true);
        try {
            await sign_corrective_action_service({
                id: corrective_action.id,
                role: 'save_sanction',
                final_sanction: selectedSanction,
            });

            const pathSegments = window.location.pathname.split('/');
            const id = pathSegments[3] || pathSegments.pop();
            await store.dispatch(get_corrective_action_by_id_thunk(id));
            alert('Sanction saved successfully.');
        } catch (error) {
            console.error('Failed to save sanction:', error);
            alert(error?.response?.data?.message || 'Failed to save sanction.');
        } finally {
            setIsSavingSanction(false);
        }
    };

    console.log('corrective_action', corrective_action)
    // Submission handler
    const handleSign = async (roleType) => {
        if (!corrective_action?.id) return;

        // Validation safeguards
        if (roleType === 'employee_explanation' && !explanation.trim()) {
            alert('Please provide your written explanation before signing.');
            return;
        }

        if (roleType.includes('_action') && !selectedSanction && !corrective_action?.final_sanction) {
            alert('Please select a final sanction before signing.');
            return;
        }

        if (roleType === 'employee_final_commitment' && !commitment.trim() && !corrective_action?.employee_commitment) {
            alert('Please write your commitment statement before signing.');
            return;
        }

        if (window.confirm('Are you sure you want to sign this document?')) {
            setIsSubmitting(true);
            try {
                await sign_corrective_action_service({
                    id: corrective_action.id,
                    role: roleType,
                    employee_explanation: explanation,
                    final_sanction: selectedSanction || corrective_action?.final_sanction,
                    employee_commitment: commitment,
                });

                // Refresh data
                const pathSegments = window.location.pathname.split('/');
                const id = pathSegments[3] || pathSegments.pop();
                await store.dispatch(get_corrective_action_by_id_thunk(id));
            } catch (error) {
                console.error("Signature failed:", error);
                alert(error?.response?.data?.message || 'Failed to submit signature. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Name formatters
    const employeeFullName = [corrective_action?.first_name, corrective_action?.last_name]
        .filter(Boolean)
        .join(' ');

    const supervisorFullName = [corrective_action?.supervisor_first_name, corrective_action?.supervisor_last_name]
        .filter(Boolean)
        .join(' ');

    const managerFullName = [corrective_action?.manager_first_name, corrective_action?.manager_last_name]
        .filter(Boolean)
        .join(' ');

    const hrFullName = [corrective_action?.hr_first_name, corrective_action?.hr_last_name]
        .filter(Boolean)
        .join(' ');

    // Section 1: Initial NTE signatures
    const isHrSigned = Number(corrective_action?.is_hr_acknowledge) === 1;
    const isSupervisorSigned = Number(corrective_action?.is_supervisor_acknowledge) === 1;
    const isManagerSigned = Number(corrective_action?.is_manager_acknowledge) === 1;
    const isEmployeeNteSigned = Number(corrective_action?.is_employee_acknowledge) === 1;

    // Section 2: Explanation signature
    const isExplanationSigned = Boolean(corrective_action?.employee_explanation_at);

    // Section 3: Final sanction approvals
    const isHrSanctionSigned = Number(corrective_action?.is_hr_sanction_acknowledge) === 1;
    const isSupervisorSanctionSigned = Number(corrective_action?.is_supervisor_sanction_acknowledge) === 1;
    const isManagerSanctionSigned = Number(corrective_action?.is_manager_sanction_acknowledge) === 1;

    // Section 4: Final employee commitment signature
    const isFinalSanctionReceived = Boolean(corrective_action?.employee_commitment && corrective_action?.status === 'COMPLETED');

    // Authority permission checks based on logged in user ID
    const canHrSign = !isHrSigned && (user?.id === corrective_action?.hr_user_id || user?.role === 'HR');
    const canSupervisorSign = !isSupervisorSigned && user?.id === corrective_action?.supervisor_user_id;
    const canManagerSign = !isManagerSigned && user?.id === corrective_action?.manager_user_id;
    const canEmployeeSignNte = !isEmployeeNteSigned && user?.id === corrective_action?.user_id;

    const canEmployeeSignExplanation = !isExplanationSigned && isEmployeeNteSigned && user?.id === corrective_action?.user_id;

    const canHrSignSanction = !isHrSanctionSigned && (user?.id === corrective_action?.hr_user_id || user?.role === 'HR');
    const canSupervisorSignSanction = !isSupervisorSanctionSigned && user?.id === corrective_action?.supervisor_user_id;
    const canManagerSignSanction = !isManagerSanctionSigned && user?.id === corrective_action?.manager_user_id;

    const canEmployeeSignFinal = !isFinalSanctionReceived && user?.id === corrective_action?.user_id;

    // Permissions to set/save sanction (HR, Supervisor, or Manager)
    const canSetSanction = (
        user?.id === corrective_action?.hr_user_id ||
        user?.id === corrective_action?.supervisor_user_id ||
        user?.id === corrective_action?.manager_user_id ||
        user?.role === 'HR'
    ) && !(isHrSanctionSigned || isSupervisorSanctionSigned || isManagerSanctionSigned);

    // Attached signature images
    const supervisorSignature = corrective_action?.supervisor?.signature;
    const managerSignature = corrective_action?.manager?.signature;
    const hrSignature = corrective_action?.hr?.signature;
    const employeeSignature = corrective_action?.employee?.signature;

    const details = {
        employeeName: employeeFullName || '',
        idNumber: corrective_action?.employee_id ?? '',
        supervisorName: supervisorFullName || '',
        datePrepared: moment(corrective_action?.created_at).format('LLL'),
        department: corrective_action?.employee?.department?.name ?? '',
        dateReceived: corrective_action?.nte_received_at ? moment(corrective_action.nte_received_at).format('LL') : '---',
        managerName: managerFullName || '',
        account: corrective_action?.employee?.account?.name ?? '',
        policyCategory: corrective_action?.category ?? '',
        section: corrective_action?.code_of_discipline_section ?? '',
        incidentDate: corrective_action?.date_of_occurrence ?? '',
        incidentReport:
            corrective_action?.description_of_infraction ??
            ``,
        hrRepresentative: hrFullName || 'Anthony Aragon',
        nteReceivedAt: corrective_action?.nte_received_at ? moment(corrective_action.nte_received_at).format('LL') : '---',
        dateSubmitted: corrective_action?.employee_explanation_at ? moment(corrective_action.employee_explanation_at).format('LL') : '---',
        dateFinalReceived: corrective_action?.updated_at && isFinalSanctionReceived ? moment(corrective_action.updated_at).format('LL') : '---',
    };

    const isAuthorizedLeader =
        Number(user?.id) === Number(corrective_action?.supervisor_user_id) ||
        Number(user?.id) === Number(corrective_action?.manager_user_id)

    const isSanctionFullyLocked =
        Number(corrective_action?.is_hr_sanction_acknowledge) === 1 &&
        Number(corrective_action?.is_supervisor_sanction_acknowledge) === 1 &&
        Number(corrective_action?.is_manager_sanction_acknowledge) === 1;

    // Reusable Signature Block
    const SignatureSlot = ({ isSigned, canSign, printedName, signatureImg, roleKey, label }) => (
        <div className="flex flex-col items-center justify-end min-h-[70px]">
            <div className="relative w-full border-b border-black pb-1 min-h-[38px] flex items-end justify-center">
                {isSigned ? (
                    <div className="flex flex-col items-center justify-end w-full">
                        {signatureImg && (
                            <img
                                src={signatureImg}
                                alt="Signature"
                                className="h-10 max-w-[120px] object-contain -mb-2 pointer-events-none"
                            />
                        )}
                        <span className="font-bold text-slate-900 leading-tight">{printedName}</span>
                    </div>
                ) : canSign ? (
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSign(roleKey)}
                        className="print:hidden px-3 py-1 text-[10px] font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded transition-colors shadow-sm disabled:opacity-50 mb-0.5"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit & Sign Document'}
                    </button>
                ) : (
                    <span className="text-[10px] text-amber-700 italic font-medium mb-0.5 print:hidden">
                        Pending Signature
                    </span>
                )}
            </div>
            <span className="text-[10px] block mt-1 font-semibold text-slate-700">{label}</span>
        </div>
    );

    return (
        <div className="flex items-center justify-center w-full">
            <div className="min-h-screen max-w-4xl py-10 px-4 flex justify-center text-slate-900 font-sans antialiased print:bg-white print:p-0">
                {/* 8.5" x 11" Paper Canvas */}
                <div className="w-full max-w-[850px] bg-white border border-slate-300 shadow-xl p-8 space-y-6 print:border-none print:shadow-none print:p-6 text-[11px] leading-tight">

                    {/* ================= HEADER ================= */}
                    <div className="text-center">
                        <h1 className="text-base font-extrabold uppercase tracking-wide border-b-2 border-black inline-block pb-0.5">
                            NOTICE TO EXPLAIN
                        </h1>
                    </div>

                    {/* ================= 1. PERSONNEL & CASE GRID ================= */}
                    <div className="border border-black">
                        {/* Row 1 */}
                        <div className="grid grid-cols-4 border-b border-black text-left">
                            <div className="p-1.5 border-r border-black">
                                <span className="block text-[9px] uppercase font-bold text-slate-600">TO (Name of Employee):</span>
                                <span className="font-bold text-slate-900">{details.employeeName}</span>
                            </div>
                            <div className="p-1.5 border-r border-black">
                                <span className="block text-[9px] uppercase font-bold text-slate-600">ID NUMBER:</span>
                                <span className="font-semibold">{details.idNumber}</span>
                            </div>
                            <div className="p-1.5 border-r border-black">
                                <span className="block text-[9px] uppercase font-bold text-slate-600">NAME OF IMMEDIATE SUP.:</span>
                                <span className="font-semibold">{details.supervisorName}</span>
                            </div>
                            <div className="p-1.5">
                                <span className="block text-[9px] uppercase font-bold text-slate-600">DATE & TIME PREPARED:</span>
                                <span className="font-semibold">{details.datePrepared}</span>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className="grid grid-cols-4 text-left">
                            <div className="p-1.5 border-r border-black">
                                <span className="block text-[9px] uppercase font-bold text-slate-600">DEPARTMENT/SECTION:</span>
                                <span className="font-semibold">{details.department}</span>
                            </div>
                            <div className="p-1.5 border-r border-black">
                                <span className="block text-[9px] uppercase font-bold text-slate-600">DATE RECEIVED:</span>
                                <span className="font-semibold">{details.dateReceived}</span>
                            </div>
                            <div className="p-1.5 border-r border-black">
                                <span className="block text-[9px] uppercase font-bold text-slate-600">NAME OF NEXT LEVEL MANAGER:</span>
                                <span className="font-semibold">{details.managerName}</span>
                            </div>
                            <div className="p-1.5">
                                <span className="block text-[9px] uppercase font-bold text-slate-600">ACCOUNT/PROGRAM:</span>
                                <span className="font-semibold">{details.account}</span>
                            </div>
                        </div>
                    </div>

                    <p className="italic text-slate-700">
                        Please be advised that you are being issued this <span className="font-bold not-italic">NOTICE TO EXPLAIN</span> for an alleged violation of the following policy/s:
                    </p>

                    {/* ================= 2. POLICY / CATEGORY BOX ================= */}
                    <div className="border border-black p-2 bg-slate-50/50">
                        <p><span className="font-bold">Policy/Category:</span> {details.policyCategory}</p>
                        <div className="my-3 rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Code of Discipline
                                    </span>
                                    {details.section?.section_number && (
                                        <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800 border border-blue-200">
                                            Sec. {details.section.section_number}
                                        </span>
                                    )}
                                </div>

                                {details.section?.recommended_penalty && (
                                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                                        Penalty: {details.section.recommended_penalty}
                                    </span>
                                )}
                            </div>

                            <p className="text-sm font-semibold text-slate-900 leading-snug">
                                {details.section?.code_of_discipline_section || 'Pending HR Review'}
                            </p>

                            {details.section?.classification_group && (
                                <p className="mt-1 text-xs text-slate-500">
                                    {details.section.classification_group}
                                </p>
                            )}
                        </div>
                    </div>

                    <p className="italic text-slate-700">
                        State in detail the offense committed and all possible causes analogous to the foregoing. You may attach the actual Incident Report if necessary.
                    </p>

                    {/* ================= 3. INCIDENT REPORT DETAILS BOX ================= */}
                    <div className="border border-black p-3 space-y-3 bg-white leading-relaxed">
                        <p className="font-bold">Incident Date: <span className="font-normal">{details.incidentDate}</span></p>
                        <div className="whitespace-pre-line text-justify text-slate-800">
                            {details.incidentReport}
                        </div>
                    </div>

                    {/* Advisory Paragraphs */}
                    <div className="space-y-2 text-justify text-slate-800">
                        <p>
                            In view of the above, you are hereby given an opportunity to be heard by submitting a written response within five (5) calendar days from receipt of this notice.
                        </p>
                        <p>
                            Please be informed that the above-mentioned infraction, if and when such has been found committed, whether with or without malicious intent, carries a penalty which may lead up to and including <span className="font-bold tracking-wider">TERMINATION</span>.
                        </p>
                    </div>

                    {/* ================= SIGNATURE BLOCK 1 (ISSUANCE) ================= */}
                    <div className="pt-4 grid grid-cols-3 gap-6 text-center">
                        <SignatureSlot
                            isSigned={isHrSigned}
                            canSign={canHrSign}
                            printedName={details.hrRepresentative}
                            signatureImg={hrSignature}
                            roleKey="hr"
                            label="HR Representative"
                        />
                        <SignatureSlot
                            isSigned={isSupervisorSigned}
                            canSign={canSupervisorSign}
                            printedName={details.supervisorName}
                            signatureImg={supervisorSignature}
                            roleKey="supervisor"
                            label="Immediate Supervisor"
                        />
                        <SignatureSlot
                            isSigned={isManagerSigned}
                            canSign={canManagerSign}
                            printedName={details.managerName}
                            signatureImg={managerSignature}
                            roleKey="manager"
                            label="Next Level Manager"
                        />
                    </div>

                    {/* Employee Acknowledgement Line */}
                    <div className="pt-2 grid grid-cols-3 gap-6 text-center">
                        <SignatureSlot
                            isSigned={isEmployeeNteSigned}
                            canSign={canEmployeeSignNte}
                            printedName={details.employeeName}
                            signatureImg={employeeSignature}
                            roleKey="employee_nte"
                            label="Received by (Employee Signature)"
                        />
                        <div className="flex flex-col items-center justify-end">
                            <div className="w-full border-b border-black pb-1 font-bold">{details.idNumber}</div>
                            <span className="text-[10px] block mt-1 text-slate-600">Employee ID</span>
                        </div>
                        <div className="flex flex-col items-center justify-end">
                            <div className="w-full border-b border-black pb-1 font-bold">
                                {details.nteReceivedAt}
                            </div>
                            <span className="text-[10px] block mt-1 text-slate-600">Date NTE Received</span>
                        </div>
                    </div>

                    {/* ================= 4. WRITTEN EXPLANATION SECTION ================= */}
                    {(isEmployeeNteSigned || corrective_action?.employee_explanation) && (
                        <>
                            <div className="border-t-2 border-dashed border-black my-6"></div>

                            <div className="space-y-2">
                                <h2 className="font-extrabold uppercase tracking-wide text-xs">
                                    WRITTEN EXPLANATION:
                                </h2>
                                {isExplanationSigned || corrective_action?.employee_explanation ? (
                                    <div className="border border-black p-3.5 whitespace-pre-line text-justify bg-white leading-relaxed text-slate-800">
                                        {corrective_action?.employee_explanation || explanation}
                                    </div>
                                ) : (
                                    <textarea
                                        rows={6}
                                        value={explanation}
                                        placeholder="Type your explanation here..."
                                        className="w-full border border-black p-2.5 text-xs focus:ring-0 focus:outline-none"
                                        onChange={(e) => setExplanation(e.target.value)}
                                    />
                                )}
                            </div>

                            {/* Explanation Signature Line */}
                            <div className="pt-2 grid grid-cols-2 gap-12 text-center">
                                <SignatureSlot
                                    isSigned={isExplanationSigned}
                                    canSign={canEmployeeSignExplanation}
                                    printedName={details.employeeName}
                                    signatureImg={employeeSignature}
                                    roleKey="employee_explanation"
                                    label="Name & Sign of Employee"
                                />
                                <div className="flex flex-col items-center justify-end">
                                    <div className="w-full border-b border-black pb-1 font-bold">
                                        {details.dateSubmitted}
                                    </div>
                                    <span className="text-[10px] block mt-1 text-slate-600">Date Submitted</span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* ================= 5. CORRECTIVE ACTION TAKEN ================= */}
                    {(isExplanationSigned || corrective_action?.final_sanction) && (
                        <>
                            <div className="border-t-2 border-dashed border-black my-6"></div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-extrabold uppercase tracking-wide text-xs">
                                        CORRECTIVE ACTION TAKEN
                                    </h2>
                                    {/* Always show the Save button as long as all parties haven't locked/signed the sanction */}
                                    {(!corrective_action?.final_sanction && isAuthorizedLeader && !isSanctionFullyLocked) && (
                                        <button
                                            type="button"
                                            disabled={isSavingSanction || !selectedSanction}
                                            onClick={handleSaveSanction}
                                            className="print:hidden px-3 py-1 text-[10px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors shadow-sm cursor-pointer"
                                        >
                                            {isSavingSanction ? 'Saving...' : 'Save Sanction'}
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold">
                                    {[
                                        { key: 'Verbal Warning/Coaching', label: 'Verbal Warning/Coaching' },
                                        { key: 'Written Warning', label: 'Written Warning' },
                                        { key: '2nd Written Warning', label: '2nd Written Warning' },
                                        { key: 'Final Written Warning', label: 'Final Written Warning' },
                                        { key: 'termination', label: 'Termination' },
                                    ].map((item) => (
                                        <label key={item.key} className="flex items-center gap-1.5 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="final_sanction"
                                                value={item.key}
                                                disabled={(isHrSanctionSigned && isSupervisorSanctionSigned && isManagerSanctionSigned) || corrective_action?.final_sanction}
                                                checked={selectedSanction === item.key || corrective_action?.final_sanction === item.key}
                                                onChange={(e) => setSelectedSanction(e.target.value)}
                                                className="rounded-full border-black text-black focus:ring-0 disabled:opacity-75 cursor-pointer"
                                            />
                                            <span>{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Corrective Action Approvals */}
                            <div className="pt-4 grid grid-cols-3 gap-6 text-center">
                                <SignatureSlot
                                    isSigned={isHrSanctionSigned}
                                    canSign={canHrSignSanction}
                                    printedName={details.hrRepresentative}
                                    signatureImg={hrSignature}
                                    roleKey="is_hr_sanction_acknowledge"
                                    label="HR Representative"
                                />
                                <SignatureSlot
                                    isSigned={isSupervisorSanctionSigned}
                                    canSign={canSupervisorSignSanction}
                                    printedName={details.supervisorName}
                                    signatureImg={supervisorSignature}
                                    roleKey="is_supervisor_sanction_acknowledge"
                                    label="Immediate Supervisor"
                                />
                                <SignatureSlot
                                    isSigned={isManagerSanctionSigned}
                                    canSign={canManagerSignSanction}
                                    printedName={details.managerName}
                                    signatureImg={managerSignature}
                                    roleKey="is_manager_sanction_acknowledge"
                                    label="Next Level Manager"
                                />
                            </div>
                        </>
                    )}

                    {/* ================= 6. EMPLOYEE COMMENT / COMMITMENT ================= */}
                    {(isHrSanctionSigned && isSupervisorSanctionSigned && isManagerSanctionSigned) && (
                        <>
                            <div className="border-t-2 border-dashed border-black my-6"></div>

                            <div className="space-y-2">
                                <span className="block text-[10px] font-bold text-slate-700 uppercase">
                                    Employee Comment / Commitment:
                                </span>
                                {isFinalSanctionReceived || corrective_action?.employee_commitment ? (
                                    <div className="border border-black p-3 bg-white text-justify leading-relaxed text-slate-800">
                                        {corrective_action?.employee_commitment || commitment}
                                    </div>
                                ) : (
                                    <textarea
                                        rows={4}
                                        value={commitment}
                                        disabled={Number(user?.id) != Number(corrective_action?.user_id)}
                                        placeholder="Write your commitment statement here..."
                                        className="w-full border border-black p-2 text-xs focus:ring-0 focus:outline-none"
                                        onChange={(e) => setCommitment(e.target.value)}
                                    />
                                )}
                            </div>

                            {/* Final Receipt Signature Row */}
                            <div className="pt-4 grid grid-cols-3 gap-6 text-center">
                                <SignatureSlot
                                    isSigned={isFinalSanctionReceived}
                                    canSign={canEmployeeSignFinal}
                                    printedName={details.employeeName}
                                    signatureImg={employeeSignature}
                                    roleKey="employee_final_commitment"
                                    label="Received by (Employee Signature)"
                                />
                                <div className="flex flex-col items-center justify-end">
                                    <div className="w-full border-b border-black pb-1 font-bold">{details.idNumber}</div>
                                    <span className="text-[10px] block mt-1 text-slate-600">Employee ID</span>
                                </div>
                                <div className="flex flex-col items-center justify-end">
                                    <div className="w-full border-b border-black pb-1 font-bold">
                                        {details.dateFinalReceived}
                                    </div>
                                    <span className="text-[10px] block mt-1 text-slate-600">Date Sanction Received</span>
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}