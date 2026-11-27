import Button from "@/app/_components/button";
import Modal from "@/app/_components/modal";
import React, { useMemo, useState } from "react";

const EVALUATION_MILESTONES = [
    "3rd Month (Mid-Probationary)",
    "5th Month (Regularization)",
];

const SCORE_OPTIONS = [
    { value: 4, label: "4 - Exceed Expectation" },
    { value: 3, label: "3 - Meets Expectation" },
    { value: 2, label: "2 - Needs Improvement" },
    { value: 1, label: "1 - Unsatisfactory" },
];

const EVALUATION_SECTIONS = [
    {
        key: "attendance",
        title: "ATTENDANCE",
        criteria: [
            {
                key: "on_time_meetings_and_activities",
                label: "Always on time (or even early) for meetings, conferences, and company activities.",
            },
            {
                key: "within_leave_and_time_off_limits",
                label: "Maintains attendance within allowed limits for leaves and time offs.",
            },
            {
                key: "adheres_to_schedules_breaks_and_overtime",
                label: "Adheres to schedules, including breaks and mandatory overtime.",
            },
            {
                key: "notifies_ahead_if_absent_or_late",
                label: "Notifies ahead if absent or late.",
            },
            {
                key: "perfect_attendance_three_months",
                label: "Achieves perfect attendance for at least 3 months, excluding approved leaves.",
            },
        ],
    },
    {
        key: "attitude",
        title: "ATTITUDE",
        criteria: [
            {
                key: "cheerful_attitude_benefits_teammates",
                label: "Has a cheerful attitude that benefits teammates.",
            },
            {
                key: "respects_colleagues_consistently",
                label: "Respects colleagues consistently.",
            },
            {
                key: "looks_for_positive_in_every_situation",
                label: "Looks for the positive in every situation.",
            },
            {
                key: "protects_company_reputation_and_culture",
                label: "Does not engage in actions that could affect the reputation or culture of the company.",
            },
            {
                key: "lightens_mood_during_stressful_times",
                label: "Offers a smile or joke to lighten the mood during stressful times.",
            },
            {
                key: "ready_to_share_and_help_others",
                label: "Ready to share and help others.",
            },
            {
                key: "stays_motivated_and_influences_positively",
                label: "Stays motivated and influences the team positively.",
            },
            {
                key: "open_to_feedback_and_constructive_criticism",
                label: "Open to feedback and constructive criticism.",
            },
            {
                key: "reports_to_work_with_positive_attitude",
                label: "Always reports to work with a positive attitude.",
            },
            {
                key: "frequently_has_a_smile_for_others",
                label: "Frequently has a smile for others.",
            },
        ],
    },
    {
        key: "dependability",
        title: "DEPENDABILITY",
        criteria: [
            {
                key: "willing_to_work_beyond_scheduled_hours",
                label: "Willing to work beyond scheduled hours when needed.",
            },
            {
                key: "manages_time_and_meets_deadlines",
                label: "Manages time effectively and consistently meets deadlines.",
            },
            {
                key: "delivers_good_to_great_results",
                label: "Delivers good to great results consistently.",
            },
            {
                key: "cares_about_quality_and_helps_others",
                label: "Cares about the quality of work and always willing to help others.",
            },
        ],
    },
    {
        key: "flexibility",
        title: "FLEXIBILITY",
        criteria: [
            {
                key: "adapts_to_unknown_processes_and_shows_initiative",
                label: "Adapts well to tasks with unknown processes and shows initiative.",
            },
            {
                key: "new_solutions_to_common_problems",
                label: "Can come up with new solutions to common problems.",
            },
            {
                key: "handles_varied_assignments_efficiently",
                label: "Handles a variety of assignments efficiently.",
            },
            {
                key: "identifies_and_implements_efficient_methods",
                label: "Identifies and implements more efficient methods.",
            },
            {
                key: "remains_calm_under_pressure_and_adapts",
                label: "Remains calm under pressure and adapts quickly to changing situations.",
            },
            {
                key: "willing_to_admit_mistakes_and_learn",
                label: "Willing to admit lapses or mistakes and learn from them.",
            },
            {
                key: "takes_ownership_and_accountability",
                label: "Takes ownership and accountability for responsibilities.",
            },
        ],
    },
    {
        key: "interpersonal_skills",
        title: "INTERPERSONAL SKILLS",
        criteria: [
            {
                key: "builds_strong_positive_relationships",
                label: "Builds strong, positive relationships with coworkers.",
            },
            {
                key: "easy_to_get_along_with_and_approachable",
                label: "Is easy to get along with and approachable.",
            },
            {
                key: "shows_genuine_interest_and_values_others",
                label: "Shows genuine interest in others and makes them feel valued.",
            },
            {
                key: "no_superior_attitude_towards_others",
                label: "Does not display a superior attitude towards others.",
            },
            {
                key: "sensitive_and_considerate_of_feelings",
                label: "Is sensitive and considerate of coworkers’ feelings.",
            },
        ],
    },
    {
        key: "teamwork",
        title: "TEAMWORK",
        criteria: [
            {
                key: "actively_listens_and_values_input",
                label: "Actively listens to team members and values their input.",
            },
            {
                key: "encourages_teamwork_and_collaboration",
                label: "Encourages teamwork and collaboration to achieve common goals.",
            },
            {
                key: "offers_assistance_and_advice",
                label: "Offers assistance and advice to teammates when needed.",
            },
            {
                key: "promotes_team_centered_workplace_and_unity",
                label: "Promotes a team-centered workplace and fosters unity.",
            },
            {
                key: "shares_ideas_and_techniques",
                label: "Shares ideas and techniques to help the team improve.",
            },
            {
                key: "cooperates_and_resolves_conflicts_professionally",
                label: "Willing to cooperate with coworkers and resolve conflicts professionally.",
            },
        ],
    },
];

function buildInitialScores() {
    return EVALUATION_SECTIONS.reduce((acc, section) => {
        acc[section.key] = section.criteria.reduce((sectionAcc, item) => {
            sectionAcc[item.key] = null;
            return sectionAcc;
        }, {});
        return acc;
    }, {});
}

export default function PerformanceEvaluationForm({
    employeeId = 1,
    employeeName = "Bautista, Benedicto",
    position = "Customer Service",
    onSubmitEvaluation,
}) {
    const [evaluationType, setEvaluationType] = useState("");
    const [scores, setScores] = useState(buildInitialScores);
    const [submitting, setSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [open, setOpen] = useState(false);
    const averageScore = useMemo(() => {
        const numericScores = Object.values(scores)
            .flatMap((categoryScores) => Object.values(categoryScores))
            .filter((val) => typeof val === "number" && !Number.isNaN(val));

        if (numericScores.length === 0) return "0.00";
        const sum = numericScores.reduce(
            (total, current) => total + current,
            0,
        );
        return (sum / numericScores.length).toFixed(2);
    }, [scores]);

    const handleScoreChange = (categoryKey, criterionKey, value) => {
        setScores((prev) => ({
            ...prev,
            [categoryKey]: {
                ...prev[categoryKey],
                [criterionKey]: Number(value),
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage("");

        const payload = {
            employee_id: employeeId,
            position,
            evaluation_type: evaluationType,
            scores,
            average_score: Number(averageScore),
        };

        if (onSubmitEvaluation) {
            setSubmitting(true);
            try {
                await onSubmitEvaluation(payload);
                setStatusMessage("Evaluation submitted and emailed to HR.");
            } catch (err) {
                setStatusMessage(
                    "Failed to submit evaluation. Please try again.",
                );
            } finally {
                setSubmitting(false);
            }
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch("/api/performance-evaluations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Request failed");
            }
            setStatusMessage("Evaluation submitted and emailed to HR.");
        } catch (error) {
            setStatusMessage("Could not reach /api/performance-evaluations.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
       <>
       <Button>
        CLICK ME
       </Button>
       <Modal>
 <div className="min-h-screen bg-slate-100 py-8 px-4">
            <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-5xl space-y-6"
            >
                {/* Top Banner & Header Card */}
                <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-slate-200">
                    <div className="bg-blue-600 px-6 py-4">
                        <h1 className="text-lg font-semibold text-white">
                            Performance Evaluation
                        </h1>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Employee Name
                                </label>
                                <input
                                    type="text"
                                    value={employeeName}
                                    readOnly
                                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-3.5 py-2 text-sm text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Position
                                </label>
                                <input
                                    type="text"
                                    value={position}
                                    readOnly
                                    className="w-full rounded-md border border-slate-300 bg-slate-50 px-3.5 py-2 text-sm text-slate-800"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div className="w-full sm:max-w-md">
                                <label
                                    htmlFor="evaluation_type"
                                    className="block text-sm font-medium text-slate-700 mb-1.5"
                                >
                                    Select Evaluation Type
                                </label>
                                <select
                                    id="evaluation_type"
                                    value={evaluationType}
                                    onChange={(e) =>
                                        setEvaluationType(e.target.value)
                                    }
                                    required
                                    className="w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                                >
                                    <option value="">
                                        -- Choose Milestone --
                                    </option>
                                    {EVALUATION_MILESTONES.map((milestone) => (
                                        <option
                                            key={milestone}
                                            value={milestone}
                                        >
                                            {milestone}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="rounded-lg bg-slate-100 px-6 py-3 text-center border border-slate-200 min-w-[150px]">
                                <div className="text-xs font-medium text-blue-700">
                                    Average Score
                                </div>
                                <div className="text-2xl font-bold text-slate-900">
                                    {averageScore}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Evaluation Categories */}
                {EVALUATION_SECTIONS.map((section) => (
                    <div
                        key={section.key}
                        className="rounded-lg bg-white p-6 shadow-sm border border-slate-200"
                    >
                        <h2 className="border-b border-slate-200 pb-3 text-sm font-bold tracking-wide text-slate-800 uppercase">
                            {section.title}
                        </h2>

                        <div className="divide-y divide-slate-100">
                            {section.criteria.map((criterion) => {
                                const currentScore =
                                    scores[section.key]?.[criterion.key];
                                const groupName = `${section.key}__${criterion.key}`;

                                return (
                                    <div
                                        key={criterion.key}
                                        className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6"
                                    >
                                        <p className="text-sm text-slate-700 lg:max-w-xl">
                                            {criterion.label}
                                        </p>

                                        <div
                                            role="radiogroup"
                                            aria-label={criterion.label}
                                            className="flex flex-wrap gap-2 shrink-0"
                                        >
                                            {SCORE_OPTIONS.map(
                                                (option, idx) => {
                                                    const inputId = `${groupName}_${option.value}`;
                                                    const isSelected =
                                                        currentScore ===
                                                        option.value;

                                                    return (
                                                        <label
                                                            key={option.value}
                                                            htmlFor={inputId}
                                                            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium cursor-pointer transition ${
                                                                isSelected
                                                                    ? "border-blue-600 bg-blue-50 text-blue-800"
                                                                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                                            }`}
                                                        >
                                                            <input
                                                                id={inputId}
                                                                type="radio"
                                                                name={groupName}
                                                                value={
                                                                    option.value
                                                                }
                                                                checked={
                                                                    isSelected
                                                                }
                                                                required={
                                                                    idx === 0
                                                                }
                                                                onChange={(e) =>
                                                                    handleScoreChange(
                                                                        section.key,
                                                                        criterion.key,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="h-3.5 w-3.5 accent-blue-600"
                                                            />
                                                            <span>
                                                                {option.label}
                                                            </span>
                                                        </label>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Submit Button */}
                <div className="space-y-3">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-md bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 transition cursor-pointer"
                    >
                        {submitting
                            ? "Submitting..."
                            : "Submit & Email Evaluation to HR"}
                    </button>

                    {statusMessage && (
                        <p className="text-center text-sm font-medium text-slate-700">
                            {statusMessage}
                        </p>
                    )}
                </div>
            </form>
        </div>


       </Modal>
       </>
    );
}
