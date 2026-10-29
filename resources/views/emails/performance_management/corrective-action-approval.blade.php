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
            margin-bottom: 14px;
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
            margin-bottom: 4px;
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
            margin-top: 4px;
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
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
            margin: 6px 0 2px 0;
        }

        .cocd-meta {
            font-size: 12px;
            color: #475569;
            margin-top: 6px;
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
    $cocd = is_array($correctiveAction->code_of_discipline_section)
    ? $correctiveAction->code_of_discipline_section
    : json_decode($correctiveAction->code_of_discipline_section ?? '', true);
    @endphp

    <div class="email-wrapper">
        <!-- Top Hero Banner -->
        <div class="header-banner">
            <h1>Notice to Explain (NTE)</h1>
            <p>Case Reference: {{ $correctiveAction->ca_id }}</p>
        </div>

        <!-- Body Content -->
        <div class="content-body">
            <p class="greeting">Dear <strong>{{ $correctiveAction->first_name }} {{ $correctiveAction->last_name }}</strong>,</p>

            <p class="intro-text">
                Please be informed that a Corrective Action record has been generated regarding an incident on
                <strong>{{ \Carbon\Carbon::parse($correctiveAction->date_of_occurrence)->format('F d, Y') }}</strong>.
            </p>

            <!-- Incident Details Card -->
            <div class="card-box">
                <div class="field-group">
                    <div class="field-label">Category</div>
                    <div class="field-value">{{ $correctiveAction->category ?? ($cocd['classification_group'] ?? 'N/A') }}</div>
                </div>

                <div class="field-group">
                    <div class="field-label">Code of Discipline Section</div>
                    @if(is_array($cocd) && !empty($cocd['section_number']))
                    <div class="cocd-card">
                        <div>
                            <span class="cocd-badge">Sec. {{ $cocd['section_number'] }}</span>
                            @if(!empty($cocd['classification_group']))
                            <span class="cocd-category">{{ $cocd['classification_group'] }}</span>
                            @endif
                        </div>
                        <div class="cocd-title">
                            {{ $cocd['code_of_discipline_section'] }}
                        </div>
                        @if(!empty($cocd['recommended_penalty']))
                        <div class="cocd-meta">
                            <strong>Sanction:</strong> {{ $cocd['recommended_penalty'] }}
                            @if(!empty($cocd['clearing_period']))
                            &bull; <strong>Clearing Period:</strong> {{ $cocd['clearing_period'] }}
                            @endif
                        </div>
                        @endif
                    </div>
                    @else
                    <div class="field-value">{{ is_string($correctiveAction->code_of_discipline_section) ? $correctiveAction->code_of_discipline_section : 'Pending HR Review' }}</div>
                    @endif
                </div>

                <div class="field-group">
                    <div class="field-label">Description of Infraction</div>
                    <div class="field-value">{{ $correctiveAction->description_of_infraction }}</div>
                </div>
            </div>

            <!-- Response Deadline Callout -->
            <div class="action-item-box">
                <p class="action-item-title">Submission Required</p>
                <p class="action-item-desc">
                    You are requested to submit your written explanation within five (5) calendar days from receipt of this notice.
                </p>
            </div>

            <!-- CTA Button -->
            <div class="btn-container">
                <a href="{{ URL::signedRoute('human-resources.corrective-actions.acknowledge', ['correctiveAction' => $correctiveAction->id]) }}"
                    class="btn-action"
                    target="_blank">
                    ACKNOWLEDGE CORRECTIVE ACTION &rarr;
                </a>
            </div>

            <!-- Footer Details -->
            <div class="footer-text">
                <p class="footer-supervisor">
                    Immediate Supervisor: {{ $correctiveAction->supervisor_first_name }} {{ $correctiveAction->supervisor_last_name }}
                </p>
                <p style="margin: 0;">
                    This is an automated message from the HR Employee Relations System. Please do not reply directly to this email.
                </p>
            </div>
        </div>
    </div>
</body>

</html>