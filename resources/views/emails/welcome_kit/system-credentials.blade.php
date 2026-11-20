<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>System Tools &amp; Access Credentials</title>
    <style>
        /* Reset & Base */
        body, table, td, p, a, li {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        body {
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            color: #1e293b;
            line-height: 1.6;
        }
        table {
            border-collapse: collapse !important;
        }

        /* Interactive Hover States */
        .cta-btn-hris {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 700;
            font-size: 13px;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(37, 99, 235, 0.25);
            transition: all 0.25s ease;
        }
        .cta-btn-hris:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
            background-color: #1d4ed8;
            box-shadow: 0 5px 14px rgba(37, 99, 235, 0.38);
            transform: translateY(-1px);
        }

        .cta-btn-kasocius {
            display: inline-block;
            background: linear-gradient(135deg, #7e22ce 0%, #581c87 100%);
            background-color: #7e22ce;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 700;
            font-size: 13px;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(126, 34, 206, 0.25);
            transition: all 0.25s ease;
        }
        .cta-btn-kasocius:hover {
            background: linear-gradient(135deg, #6b21a8 0%, #3b0764 100%);
            background-color: #6b21a8;
            box-shadow: 0 5px 14px rgba(126, 34, 206, 0.38);
            transform: translateY(-1px);
        }

        .credential-card {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-left: 4px solid #7e22ce;
            border-radius: 12px;
            padding: 20px 22px;
            margin-bottom: 18px;
            transition: all 0.25s ease;
        }
        .credential-card:hover {
            border-color: #c084fc;
            box-shadow: 0 8px 20px rgba(88, 28, 135, 0.08);
            transform: translateY(-1px);
        }

        .credential-box {
            background-color: #f8fafc;
            border: 1px dashed #cbd5e1;
            border-radius: 8px;
            padding: 12px 16px;
            margin-top: 12px;
        }

        .capability-item {
            background-color: #faf5ff;
            border: 1px solid #f3e8ff;
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 8px;
            font-size: 14px;
            color: #4c1d95;
            transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .capability-item:hover {
            background-color: #f3e8ff;
            border-color: #d8b4fe;
        }

        /* CSS-Only Interactive Accordion */
        .faq-toggle {
            display: none;
        }
        .faq-label {
            display: block;
            cursor: pointer;
            padding: 12px 16px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            font-weight: 600;
            font-size: 13px;
            color: #1e293b;
            transition: background-color 0.2s ease;
        }
        .faq-label:hover {
            background-color: #f1f5f9;
        }
        .faq-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
            font-size: 13px;
            color: #475569;
            padding: 0 16px;
            background-color: #ffffff;
            border-left: 1px solid #e2e8f0;
            border-right: 1px solid #e2e8f0;
        }
        .faq-toggle:checked + .faq-label {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            background-color: #fef2f2;
            color: #b91c1c;
            border-color: #fecaca;
        }
        .faq-toggle:checked + .faq-label + .faq-content {
            max-height: 240px;
            padding: 12px 16px;
            border-bottom: 1px solid #e2e8f0;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }

        @media only screen and (max-width: 600px) {
            .wrapper-table {
                width: 100% !important;
            }
            .content-padding {
                padding: 24px 20px !important;
            }
            .header-padding {
                padding: 28px 20px !important;
            }
            .cta-btn-hris, .cta-btn-kasocius {
                display: block !important;
                text-align: center !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9;">

    @php
        $employeeId       = $employeeId ?? '26111616';
        $hrisUrl          = $hrisUrl ?? 'https://empireonegroup.com/hris';
        $hrisUsername     = $hrisUsername ?? $employeeId;
        $hrisPassword     = $hrisPassword ?? 'Business12';
        $kasociusUrl      = $kasociusUrl ?? 'https://empireonegroup.com/kasocius';
        $kasociusUsername = $kasociusUsername ?? $employeeId;
        $kasociusPassword = $kasociusPassword ?? $employeeId;
    @endphp

    <!-- Outer Wrapper -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 32px 12px;">
        <tr>
            <td align="center">

                <!-- Main Email Card -->
                <table role="presentation" class="wrapper-table" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">

                    <!-- Brand Header -->
                    <tr>
                        <td class="header-padding" style="background: linear-gradient(135deg, #3b0764 0%, #6b21a8 55%, #1d4ed8 100%); background-color: #581c87; padding: 32px 36px; text-align: left;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td>
                                        <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.16); color: #f3e8ff; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; margin-bottom: 12px;">
                                            Confidential Account Provisioning
                                        </span>
                                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; line-height: 1.3;">
                                            System Tools &amp; Access Credentials
                                        </h1>
                                        <p style="margin: 6px 0 0 0; color: #e9d5ff; font-size: 13px;">
                                            Human Resources Department &bull; EmpireOne Systems Onboarding
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td class="content-padding" style="padding: 32px 36px; color: #334155; font-size: 15px; line-height: 1.65;">

                            <p style="margin: 0 0 14px 0; font-size: 16px; color: #0f172a;">
                                Dear <strong style="color: #0000ff;">{{ $recipientName ?? 'Colleague' }}</strong>,
                            </p>

                            <p style="margin: 0 0 14px 0; color: #581c87; font-weight: 500;">
                                Congratulations and welcome to EmpireOne! We are excited to have you onboard!
                            </p>

                            <p style="margin: 0 0 16px 0; color: #581c87;">
                                To support you in successfully carrying out your responsibilities, we've provided you with the necessary HR and systems access.
                            </p>

                            <p style="margin: 0 0 10px 0; font-weight: 600; color: #581c87;">
                                These tools will enable you to:
                            </p>

                            <div class="capability-item">
                                &bull; Manage your team's schedules, performance, and compliance requirements
                            </div>
                            <div class="capability-item">
                                &bull; Access HR policies, employee records, and reporting dashboards
                            </div>
                            <div class="capability-item">
                                &bull; Utilize operational systems for monitoring productivity and workflow execution
                            </div>
                            <div class="capability-item" style="margin-bottom: 24px;">
                                &bull; Coordinate with other departments through integrated communication platforms
                            </div>

                            <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 700; color: #581c87;">
                                Below are your assigned access credentials and system tools:
                            </p>

                            <!-- Credential Card 1: HRIS -->
                            <div class="credential-card" style="border-left-color: #2563eb;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td valign="middle">
                                            <span style="font-size: 17px; font-weight: 800; color: #4c1d95;">HRIS</span>
                                            <span style="color: #64748b;"> &ndash; </span>
                                            <a href="{{ $hrisUrl }}" style="color: #2563eb; font-weight: 700; text-decoration: none;" target="_blank">EmpireOne HRIS</a>
                                        </td>
                                        <td align="right" valign="middle">
                                            <a href="{{ $hrisUrl }}" class="cta-btn-hris" target="_blank">Launch HRIS &rarr;</a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 10px 0 0 0; font-size: 14px; color: #4c1d95;">
                                    For employee records, policy acknowledgement, and compliance tracking. Please create your HRIS account first to gain access. Refer to the separate email containing the account creation instructions and follow the steps provided.
                                </p>

                                <div class="credential-box">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px;">
                                        <tr>
                                            <td width="110" style="padding: 3px 0; font-weight: 700; color: #0f172a;">Username:</td>
                                            <td style="padding: 3px 0; font-family: monospace; font-size: 15px; font-weight: 700; color: #1e293b;">{{ $hrisUsername }}</td>
                                        </tr>
                                        <tr>
                                            <td width="110" style="padding: 3px 0; font-weight: 700; color: #581c87;">Password:</td>
                                            <td style="padding: 3px 0; font-family: monospace; font-size: 15px; font-weight: 700; color: #581c87;">{{ $hrisPassword }}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>

                            <!-- Credential Card 2: Kasocius -->
                            <div class="credential-card" style="border-left-color: #7e22ce; margin-bottom: 24px;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td valign="middle">
                                            <span style="font-size: 17px; font-weight: 800; color: #4c1d95;">Kasocius</span>
                                            <span style="color: #64748b;"> &ndash; </span>
                                            <a href="{{ $kasociusUrl }}" style="color: #2563eb; font-weight: 700; text-decoration: none;" target="_blank">EmpireOne</a>
                                        </td>
                                        <td align="right" valign="middle">
                                            <a href="{{ $kasociusUrl }}" class="cta-btn-kasocius" target="_blank">Launch Kasocius &rarr;</a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 10px 0 0 0; font-size: 14px; color: #4c1d95;">
                                    For payroll, shift management and task allocation.
                                </p>

                                <div class="credential-box">
                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px;">
                                        <tr>
                                            <td width="110" style="padding: 3px 0; font-weight: 700; color: #0f172a;">Username:</td>
                                            <td style="padding: 3px 0; font-family: monospace; font-size: 15px; font-weight: 700; color: #1e293b;">
                                                {{ $kasociusUsername }}
                                                <span style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; font-weight: 500; color: #64748b;">(This will be your Employee ID #)</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="110" style="padding: 3px 0; font-weight: 700; color: #0f172a;">Password:</td>
                                            <td style="padding: 3px 0; font-family: monospace; font-size: 15px; font-weight: 700; color: #1e293b;">{{ $kasociusPassword }}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>

                            <!-- Security Note Callout Box -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #dc2626; border-radius: 8px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 16px 18px; font-size: 14px; color: #581c87;">
                                        <strong style="color: #dc2626; text-decoration: underline;">Note:</strong>
                                        Once you have successfully accessed the account, please immediately change the password to a secure password that you can easily remember. Kindly keep your password confidential and do not share it with anyone.
                                    </td>
                                </tr>
                            </table>

                            <!-- Interactive CSS Accordion for Password & Login Help -->
                            <div style="margin-bottom: 24px;">
                                <input type="checkbox" id="credentials-help-toggle" class="faq-toggle">
                                <label for="credentials-help-toggle" class="faq-label">
                                    &#9432; Security &amp; First-Time Login Tips (Click to expand)
                                </label>
                                <div class="faq-content">
                                    <p style="margin: 0 0 8px 0;"><strong>1. Password Best Practices:</strong> Use at least 8 characters combining uppercase, lowercase, numbers, and symbols when updating your default credentials.</p>
                                    <p style="margin: 0;"><strong>2. Locked Out or Invalid Credentials?</strong> Reply directly to <a href="mailto:EmpireOne.HRD@empireonegroup.com" style="color: #2563eb; font-weight: 600;">EmpireOne.HRD@empireonegroup.com</a> with your Employee ID # (<strong>{{ $employeeId }}</strong>) for immediate reset assistance.</p>
                                </div>
                            </div>

                            <p style="margin: 0 0 20px 0; font-size: 12px; color: #64748b;">
                                Issued on: <strong style="color: #1e293b;">{{ $issuedAt ?? now('Asia/Manila')->format('F j, Y, \a\t g:i A (\M\N\L).') }}</strong>
                            </p>

                            <!-- Signature Block -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e2e8f0; padding-top: 18px;">
                                <tr>
                                    <td>
                                        <p style="margin: 0; font-size: 14px; font-weight: 800; color: #0000ff; letter-spacing: 0.6px; text-transform: uppercase;">
                                            HUMAN RESOURCES DEPARTMENT
                                        </p>
                                        <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">
                                            EmpireOne &bull; <a href="mailto:EmpireOne.HRD@empireonegroup.com" style="color: #64748b; text-decoration: none;">EmpireOne.HRD@empireonegroup.com</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 14px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
                            &copy; {{ date('Y') }} EmpireOne. All rights reserved. Keep your system credentials confidential.
                        </td>
                    </tr>

                </table>
                <!-- End Main Email Card -->

            </td>
        </tr>
    </table>

</body>
</html>