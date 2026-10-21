<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>PM Reach Session Summary</title>

    <style>
        /* Base Reset */
        body,
        table,
        td,
        a {
            text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            background-color: #f4f6f9;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        /* Interactive Animations & Hover Effects */
        .btn-action {
            background-color: #4f46e5;
            color: #ffffff !important;
            display: inline-block;
            font-weight: 600;
            padding: 14px 28px;
            border-radius: 8px;
            text-decoration: none;
            transition: all 0.3s ease-in-out;
            box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
        }

        .btn-action:hover {
            background-color: #4338ca !important;
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
        }

        .card-interactive {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card-interactive:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
        }

        .badge-status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .badge-pending {
            background-color: #fef3c7;
            color: #92400e;
        }

        .badge-acknowledged {
            background-color: #d1fae5;
            color: #065f46;
        }

        /* Responsive Breakpoints */
        @media screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
                padding: 10px !important;
            }

            .col-stack {
                display: block !important;
                width: 100% !important;
                box-sizing: border-box;
            }

            .mobile-padding {
                padding: 20px !important;
            }
        }
    </style>
</head>

<body>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f9; padding: 30px 0;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table class="email-container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">

                    <!-- Header Banner -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 32px; text-align: center; color: #ffffff;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">PM Reach Session Summary</h1>
                            <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">
                                {{ $reach->account->name ?? 'Account Session' }} &bull; {{ \Carbon\Carbon::parse($reach->date_of_session)->format('M d, Y') }}
                            </p>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td class="mobile-padding" style="padding: 32px;">

                            <!-- Status & Employee Info Card -->
                            <table class="card-interactive" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td class="col-stack" width="50%" style="vertical-align: top;">
                                                    <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600;">Employee</span>
                                                    <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 4px;">
                                                        {{ $reach->first_name }} {{ $reach->last_name }}
                                                    </div>
                                                    <div style="font-size: 13px; color: #64748b;">{{ $reach->employee_email }}</div>
                                                </td>
                                                <td class="col-stack" width="50%" style="vertical-align: top; text-align: right;">
                                                    <span class="badge-status {{ $reach->status === 'ACKNOWLEDGED' ? 'badge-acknowledged' : 'badge-pending' }}">
                                                        {{ $reach->status ?? 'PENDING' }}
                                                    </span>
                                                    <div style="font-size: 12px; color: #64748b; margin-top: 8px;">
                                                        Supervisor: <strong>{{ $reach->supervisor_first_name }} {{ $reach->supervisor_last_name }}</strong>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Key Metrics Section -->
                            @if($reach->kpi || $reach->actual_metric || $reach->goal_target)
                            <table class="card-interactive" border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 20px; background-color: #ffffff; border-radius: 8px;">
                                        <h3 style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">Performance Metrics</h3>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td class="col-stack" width="33%" style="padding: 8px; text-align: center; background-color: #f1f5f9; border-radius: 6px;">
                                                    <div style="font-size: 11px; color: #64748b; font-weight: 600;">KPI</div>
                                                    <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 4px;">{{ $reach->kpi ?? 'N/A' }}</div>
                                                </td>
                                                <td class="col-stack" width="33%" style="padding: 8px; text-align: center; background-color: #f1f5f9; border-radius: 6px;">
                                                    <div style="font-size: 11px; color: #64748b; font-weight: 600;">ACTUAL</div>
                                                    <div style="font-size: 14px; font-weight: 700; color: #2563eb; margin-top: 4px;">{{ $reach->actual_metric ?? 'N/A' }}</div>
                                                </td>
                                                <td class="col-stack" width="33%" style="padding: 8px; text-align: center; background-color: #f1f5f9; border-radius: 6px;">
                                                    <div style="font-size: 11px; color: #64748b; font-weight: 600;">TARGET</div>
                                                    <div style="font-size: 14px; font-weight: 700; color: #16a34a; margin-top: 4px;">{{ $reach->goal_target ?? 'N/A' }}</div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            @endif

                            <!-- Recognition Section -->
                            @if($reach->recognition_statement_1 || $reach->recognition_statement_2)
                            <div style="margin-bottom: 24px;">
                                <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #334155;">Recognitions</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.6;">
                                    @if($reach->recognition_statement_1) <li>{{ $reach->recognition_statement_1 }}</li> @endif
                                    @if($reach->recognition_statement_2) <li>{{ $reach->recognition_statement_2 }}</li> @endif
                                    @if($reach->recognition_statement_3) <li>{{ $reach->recognition_statement_3 }}</li> @endif
                                </ul>
                            </div>
                            @endif

                            <!-- Action Plan & Commitment -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 16px; background-color: #eef2ff; border-left: 4px solid #4f46e5; border-radius: 0 8px 8px 0;">
                                        <h4 style="margin: 0 0 6px 0; font-size: 14px; color: #312e81;">Action Item: {{ $reach->task_name ?? 'SMART Goal Action' }}</h4>
                                        <p style="margin: 0; font-size: 13px; color: #4338ca; line-height: 1.5;">
                                            {{ $reach->task_description ?? $reach->smart_goal }}
                                        </p>
                                        @if($reach->due_date)
                                        <div style="margin-top: 8px; font-size: 12px; font-weight: 600; color: #4f46e5;">
                                            Due Date: {{ \Carbon\Carbon::parse($reach->due_date)->format('M d, Y') }}
                                        </div>
                                        @endif
                                    </td>
                                </tr>
                            </table>

                            <!-- Interactive Call-To-Action Button -->
                            @if(!$isCc)
                            @php
                            $signedUrl = URL::signedRoute('pm-reaches.acknowledge', ['pmReach' => $reach->id]);
                            $publicUrl = str_replace(url('/'), config('app.url'), $signedUrl);
                            @endphp
                            <div style="text-align: center; margin-top: 32px; margin-bottom: 16px;">
                                <a href="{{ $publicUrl }}" class="btn-action">
                                    ACKNOWLEDGE COACHING SESSION &rarr;
                                </a>
                            </div>
                            @endif

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                            <p style="margin: 0 0 8px 0;">This email was automatically generated for {{ $reach->employee_email }}.</p>
                            <p style="margin: 0;">&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>

</html>