<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notice to Explain</title>
    <style>
        body {
            margin: 0;
            padding: 24px 12px;
            background-color: #f0f4f8;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            -webkit-font-smoothing: antialiased;
        }

        .email-wrapper {
            max-width: 620px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        /* Top Hero Banner */
        .header-banner {
            background: linear-gradient(135deg, #4361ee 0%, #3a86ff 100%);
            padding: 36px 20px;
            text-align: center;
            color: #ffffff;
        }

        .header-banner h1 {
            margin: 0 0 8px 0;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }

        .header-banner p {
            margin: 0;
            font-size: 14px;
            opacity: 0.92;
            font-weight: 500;
        }

        /* Body Content Container */
        .content-body {
            padding: 28px 24px 32px 24px;
        }

        .greeting {
            font-size: 15px;
            margin: 0 0 12px 0;
            color: #1e293b;
        }

        .intro-text {
            font-size: 14px;
            color: #475569;
            margin: 0 0 20px 0;
            line-height: 1.6;
        }

        /* Incident Card Box */
        .card-box {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 18px 20px;
            margin-bottom: 20px;
        }

        .field-group {
            margin-bottom: 16px;
        }

        .field-group:last-child {
            margin-bottom: 0;
        }

        .field-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: #64748b;
            margin-bottom: 6px;
        }

        .field-value {
            font-size: 14px;
            font-weight: 600;
            color: #0f172a;
            line-height: 1.5;
        }

        /* Disciplinary Badge Card */
        .cocd-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px 14px;
            margin-top: 8px;
        }

        .cocd-badge {
            display: inline-block;
            background-color: #dbeafe;
            color: #1e40af;
            font-size: 11px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 4px;
            margin-right: 6px;
            letter-spacing: 0.3px;
        }

        .cocd-category {
            display: inline-block;
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 600;
        }

        .cocd-title {
            font-size: 13px;
            font-weight: 700;
            color: #0f172a;
            margin: 6px 0 2px 0;
            line-height: 1.4;
        }

        .cocd-explanation {
            font-size: 12px;
            color: #475569;
            font-style: italic;
            background-color: #ffffff;
            border-left: 3px solid #3b82f6;
            padding: 6px 10px;
            margin-top: 6px;
            border-radius: 0 4px 4px 0;
            line-height: 1.4;
        }

        .cocd-meta {
            font-size: 11px;
            color: #64748b;
            margin-top: 6px;
        }

        .rule-callout {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 10px 12px;
            margin-top: 10px;
            font-size: 12px;
            color: #991b1b;
            line-height: 1.4;
        }

        /* Highlighted Action Callout Box */
        .action-item-box {
            background-color: #eef2ff;
            border-left: 4px solid #4f46e5;
            border-radius: 0 10px 10px 0;
            padding: 16px 18px;
            margin: 22px 0;
        }

        .action-item-title {
            font-size: 14px;
            font-weight: 800;
            color: #1e1b4b;
            margin: 0 0 6px 0;
        }

        .action-item-desc {
            font-size: 13px;
            color: #3730a3;
            margin: 0;
            line-height: 1.5;
        }

        /* Button Container */
        .btn-container {
            text-align: center;
            margin: 28px 0 12px 0;
        }

        .btn-action {
            display: inline-block;
            background: #4361ee;
            color: #ffffff !important;
            padding: 12px 28px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 13px;
            text-decoration: none;
            letter-spacing: 0.3px;
        }

        /* Footer */
        .footer-text {
            border-top: 1px solid #e2e8f0;
            padding-top: 18px;
            margin-top: 24px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            line-height: 1.6;
        }

        .footer-supervisor {
            font-weight: 600;
            color: #334155;
            margin-bottom: 6px;
        }
    </style>
</head>

<body>
    @php
    // 1. Resolve raw data from possible field variants
    $rawSection = $correctiveAction->selected_offenses ?? $correctiveAction->code_of_discipline_section;

    if (is_string($rawSection)) {
    $decoded = json_decode($rawSection, true);
    $rawSection = json_last_error() === JSON_ERROR_NONE ? $decoded : $rawSection;
    }

    // 2. Normalize into an itemized array of offenses
    $offenses = [];

    if (is_array($rawSection)) {
    if (!empty($rawSection['offenses']) && is_array($rawSection['offenses'])) {
    $offenses = $rawSection['offenses'];
    } elseif (isset($rawSection[0]) && is_array($rawSection[0])) {
    $offenses = $rawSection;
    } elseif (!empty($rawSection['section_number'])) {
    $offenses = [$rawSection];
    }
    }

    // 3. Penalty weights to calculate highest applicable baseline
    $penaltyRanks = [
    'Verbal Warning (VW)' => 1,
    'Verbal Warning' => 1,
    'Written Warning (WW)' => 2,
    'Written Warning' => 2,
    'Final Written Warning (FWW)' => 3,
    'Final Written Warning' => 3,
    'Termination (T)' => 4,
    'Termination' => 4,
    ];

    $highestPenalty = null;
    $maxRank = 0;

    foreach ($offenses as $item) {
    $penalty = $item['recommended_penalty'] ?? null;
    $rank = $penaltyRanks[$penalty] ?? 0;
    if ($rank > $maxRank) {
    $maxRank = $rank;
    $highestPenalty = $penalty;
    }
    }
    @endphp

    <div class="email-wrapper">
        <!-- Top Hero Banner -->
        <div class="header-banner">
            <h1>Notice to Explain (NTE)</h1>
            <p>Case Reference: {{ $correctiveAction->ca_id ?? ('CA-' . str_pad($correctiveAction->id, 5, '0', STR_PAD_LEFT)) }}</p>
        </div>

        <!-- Body Content -->
        <div class="content-body">
            <p class="greeting">
                @if($isNotApprover)
                Dear <strong>{{ $correctiveAction->first_name }} {{ $correctiveAction->last_name }}</strong>,
                @else
                Dear <strong>Approver</strong>,
                @endif
            </p>

            <p class="intro-text">
                @if($isNotApprover)
                Please be advised that this <strong>Notice to Explain (NTE)</strong> is being served to you, <strong>{{ $correctiveAction->first_name }} {{ $correctiveAction->last_name }}</strong>, regarding an incident reported on
                <strong>{{ \Carbon\Carbon::parse($correctiveAction->date_of_occurrence)->format('F d, Y') }}</strong>.
                @else
                Please be advised that this <strong>Notice to Explain (NTE)</strong> is being served regarding an incident reported for employee <strong>{{ $correctiveAction->first_name }} {{ $correctiveAction->last_name }}</strong> on
                <strong>{{ \Carbon\Carbon::parse($correctiveAction->date_of_occurrence)->format('F d, Y') }}</strong>.
                @endif
            </p>

            <!-- Incident Details Card -->
            <div class="card-box">
                <div class="field-group">
                    <div class="field-label">Policy Category</div>
                    <div class="field-value">{{ $correctiveAction->category ?? ($offenses[0]['classification_group'] ?? 'Code of Discipline') }}</div>
                </div>

                <!-- Alleged Code of Discipline Infractions -->
                <div class="field-group">
                    <div class="field-label">
                        Alleged Code of Discipline Section(s)
                        @if(count($offenses) > 1)
                        ({{ count($offenses) }} Violations Identified)
                        @endif
                    </div>

                    @if(count($offenses) > 0)
                    @foreach($offenses as $offense)
                    <div class="cocd-card">
                        <div>
                            <span class="cocd-badge">Sec. {{ $offense['section_number'] ?? 'N/A' }}</span>
                            @if(!empty($offense['classification_group']))
                            <span class="cocd-category">{{ $offense['classification_group'] }}</span>
                            @endif
                        </div>

                        <div class="cocd-title">
                            {{ $offense['code_of_discipline_section'] ?? ($offense['title'] ?? 'Policy Infraction') }}
                        </div>

                        @if(!empty($offense['specific_violation_explanation']))
                        <div class="cocd-explanation">
                            {{ $offense['specific_violation_explanation'] }}
                        </div>
                        @endif

                        @if(!empty($offense['recommended_penalty']))
                        <div class="cocd-meta">
                            <strong>Standard 1st Offense:</strong> {{ $offense['recommended_penalty'] }}
                            @if(!empty($offense['clearing_period']))
                            &bull; <strong>Clearing Period:</strong> {{ $offense['clearing_period'] }}[cite: 2]
                            @endif
                        </div>
                        @endif
                    </div>
                    @endforeach

                    @if(count($offenses) > 1)
                    <div class="rule-callout">
                        <strong>Rule on Multiple Infractions:</strong> When a single act or incident constitutes two or more infractions, the highest applicable penalty shall govern (Baseline: <strong>{{ $highestPenalty ?? 'Final Written Warning' }}</strong>)[cite: 25].
                    </div>
                    @endif
                    @else
                    <div class="field-value">
                        {{ is_string($correctiveAction->code_of_discipline_section) ? $correctiveAction->code_of_discipline_section : 'Pending HR Classification' }}
                    </div>
                    @endif
                </div>

                <!-- Description of Infraction Narrative -->
                <div class="field-group">
                    <div class="field-label">Description of Infraction</div>
                    <div class="field-value" style="white-space: pre-line; font-weight: normal; color: #334155;">{{ $correctiveAction->description_of_infraction }}</div>
                </div>
            </div>

            <!-- Response Deadline Callout -->
            <div class="action-item-box">
                <p class="action-item-title">Submission Required (Due Process)</p>
                <p class="action-item-desc">
                    In accordance with company disciplinary procedures, you are hereby given an opportunity to be heard. Please submit your written explanation within <strong>five (5) calendar days</strong> from receipt of this notice[cite: 26].
                </p>
            </div>

            <!-- CTA Button -->
            <div class="btn-container">
                <a href="{{ URL::signedRoute('human-resources.corrective-actions.acknowledge', ['correctiveAction' => $correctiveAction->id]) }}"
                    class="btn-action"
                    target="_blank">
                    REVIEW & PROCEED &rarr;
                </a>
            </div>

            <!-- Footer Details -->
            <div class="footer-text">
                <p class="footer-supervisor">
                    Reporting Leader: {{ $correctiveAction->supervisor_first_name }} {{ $correctiveAction->supervisor_last_name }}
                </p>
                <p style="margin: 0;">
                    This is an official communication from the Human Resources Department. Please do not reply directly to this automated email.
                </p>
            </div>
        </div>
    </div>
</body>

</html>