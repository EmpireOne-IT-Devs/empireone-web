<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Action Required: Acknowledge Non-Disclosure Agreement NDA</title>
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
        .cta-btn-admin {
            display: inline-block;
            background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
            background-color: #ea580c;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 700;
            font-size: 14px;
            padding: 13px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(234, 88, 12, 0.28);
            transition: all 0.25s ease;
        }
        .cta-btn-admin:hover {
            background: linear-gradient(135deg, #c2410c 0%, #9a3412 100%);
            background-color: #c2410c;
            box-shadow: 0 6px 18px rgba(234, 88, 12, 0.4);
            transform: translateY(-1px);
        }

        .cta-btn-employee {
            display: inline-block;
            background: linear-gradient(135deg, #052659 0%, #1d4ed8 100%);
            background-color: #052659;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 700;
            font-size: 14px;
            padding: 13px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(5, 38, 89, 0.25);
            transition: all 0.25s ease;
        }
        .cta-btn-employee:hover {
            background: linear-gradient(135deg, #031738 0%, #1e40af 100%);
            background-color: #031738;
            box-shadow: 0 6px 18px rgba(5, 38, 89, 0.38);
            transform: translateY(-1px);
        }

        .link-pill {
            display: inline-block;
            color: #2563eb;
            font-size: 12px;
            font-weight: 600;
            text-decoration: none;
            padding: 6px 12px;
            margin: 3px 4px;
            background-color: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 6px;
            transition: all 0.2s ease;
        }
        .link-pill:hover {
            background-color: #dbeafe;
            border-color: #60a5fa;
            text-decoration: underline;
        }

        .portal-card {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 16px;
            transition: all 0.2s ease;
        }
        .portal-card:hover {
            border-color: #93c5fd;
            box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
        }

        .pillar-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-top: 3px solid #ea580c;
            border-radius: 8px;
            padding: 14px 16px;
            transition: all 0.2s ease;
        }
        .pillar-card:hover {
            background-color: #fff7ed;
            border-color: #fdba74;
            border-top-color: #c2410c;
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
            background-color: #fff7ed;
            color: #c2410c;
            border-color: #fed7aa;
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
            .hero-padding {
                padding: 28px 20px !important;
            }
            .stack-column {
                display: block !important;
                width: 100% !important;
                padding: 0 0 12px 0 !important;
            }
            .cta-btn-admin, .cta-btn-employee {
                display: block !important;
                text-align: center !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9;">

    @php
        $adminNdaUrl    = $adminNdaUrl ?? 'https://empireone-hris.com/admin/nda';
        $employeeNdaUrl = $employeeNdaUrl ?? 'https://empireone-hris.com/employee/nda';
        $portalMode     = $role ?? 'both'; // 'admin', 'employee', or 'both'
    @endphp

    <!-- Outer Wrapper -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 32px 12px;">
        <tr>
            <td align="center">

                <!-- Main Email Card -->
                <table role="presentation" class="wrapper-table" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">

                    <!-- Top Direct Link Bar -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 12px 20px; text-align: center; border-bottom: 1px solid #e2e8f0;">
                            @if($portalMode === 'admin' || $portalMode === 'both')
                                <a href="{{ $adminNdaUrl }}" class="link-pill" target="_blank">
                                    Admin: {{ $adminNdaUrl }}
                                </a>
                            @endif
                            @if($portalMode === 'employee' || $portalMode === 'both')
                                <a href="{{ $employeeNdaUrl }}" class="link-pill" target="_blank">
                                    Employee: {{ $employeeNdaUrl }}
                                </a>
                            @endif
                        </td>
                    </tr>

                    <!-- Hero Banner ("Acknowledgment of NDA") -->
                    <tr>
                        <td class="hero-padding" style="background: linear-gradient(135deg, #334155 0%, #1e293b 100%); background-color: #1e293b; padding: 36px 32px 28px 32px; border-bottom: 1px solid #0f172a;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td>
                                        <div style="display: inline-block; background-color: #f97316; color: #ffffff; font-size: 24px; font-weight: 800; line-height: 1.15; padding: 10px 18px; border-radius: 6px; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25); margin-bottom: 6px;">
                                            Acknowledgment
                                        </div>
                                        <br>
                                        <div style="display: inline-block; background-color: #ea580c; color: #ffffff; font-size: 24px; font-weight: 800; line-height: 1.15; padding: 10px 18px; border-radius: 6px; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);">
                                            of NDA &#9999;&#65039;
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Dark Navy NDA Statement Banner -->
                    <tr>
                        <td style="background-color: #052659; padding: 28px 32px; text-align: center; color: #ffffff;">
                            <p style="margin: 0 0 14px 0; font-size: 16px; font-weight: 600; line-height: 1.5; color: #ffffff;">
                                As part of our ongoing commitment to protecting our clients, employees, and the confidential information entrusted to <strong>EmpireOne BPO Solutions Inc.</strong>, all employees are required to review and acknowledge the Company's <strong>Non-Disclosure Agreement (NDA)</strong>.
                            </p>
                            <p style="margin: 0; font-size: 15px; font-weight: 500; line-height: 1.5; color: #cbd5e1;">
                                The NDA forms part of our Information Security, Data Privacy, and Compliance Program.
                            </p>
                        </td>
                    </tr>

                    <!-- Interactive Body Content -->
                    <tr>
                        <td class="content-padding" style="padding: 32px 36px; color: #334155; font-size: 15px; line-height: 1.65;">

                            <p style="margin: 0 0 16px 0; font-size: 16px; color: #0f172a;">
                                Dear <strong style="color: #ea580c;">{{ $recipientName ?? 'Colleague' }}</strong>,
                            </p>

                            <p style="margin: 0 0 20px 0;">
                                Please review and submit your acknowledgment of the Non-Disclosure Agreement in the HRIS portal no later than
                                <strong style="color: #052659;">
                                    {{ $deadline ?? now('Asia/Manila')->format('F j, Y, \a\t g:i A (\M\N\L).') }}
                                </strong>
                            </p>

                            <!-- 3 Compliance Pillars Interactive Row -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td class="stack-column" width="33.33%" valign="top" style="padding-right: 6px;">
                                        <div class="pillar-card">
                                            <div style="font-size: 12px; font-weight: 700; color: #ea580c;">&#128737;&#65039; InfoSec</div>
                                            <div style="font-size: 12px; color: #475569; margin-top: 2px;">Information Security</div>
                                        </div>
                                    </td>
                                    <td class="stack-column" width="33.33%" valign="top" style="padding: 0 3px;">
                                        <div class="pillar-card">
                                            <div style="font-size: 12px; font-weight: 700; color: #052659;">&#128274; Privacy</div>
                                            <div style="font-size: 12px; color: #475569; margin-top: 2px;">Data Privacy Act</div>
                                        </div>
                                    </td>
                                    <td class="stack-column" width="33.33%" valign="top" style="padding-left: 6px;">
                                        <div class="pillar-card">
                                            <div style="font-size: 12px; font-weight: 700; color: #1d4ed8;">&#9989; Compliance</div>
                                            <div style="font-size: 12px; color: #475569; margin-top: 2px;">Company Policy</div>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Admin & Employee Portal Action Hub -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 22px 20px;">
                                        <p style="margin: 0 0 14px 0; text-align: center; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #475569;">
                                            Select Your HRIS Portal to Acknowledge NDA
                                        </p>

                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                @if($portalMode === 'employee' || $portalMode === 'both')
                                                <td class="stack-column" width="{{ $portalMode === 'both' ? '50%' : '100%' }}" valign="top" style="{{ $portalMode === 'both' ? 'padding-right: 8px;' : '' }}">
                                                    <div class="portal-card" style="text-align: center;">
                                                        <div style="font-size: 12px; font-weight: 700; color: #052659; text-transform: uppercase; margin-bottom: 4px;">
                                                            Employee Portal
                                                        </div>
                                                        <p style="margin: 0 0 14px 0; font-size: 12px; color: #64748b;">
                                                            For regular staff &amp; agents
                                                        </p>
                                                        <a href="{{ $employeeNdaUrl }}" class="cta-btn-employee" target="_blank">
                                                            Employee NDA &rarr;
                                                        </a>
                                                        <p style="margin: 10px 0 0 0; font-size: 11px; word-break: break-all;">
                                                            <a href="{{ $employeeNdaUrl }}" style="color: #2563eb; text-decoration: none;" target="_blank">{{ $employeeNdaUrl }}</a>
                                                        </p>
                                                    </div>
                                                </td>
                                                @endif

                                                @if($portalMode === 'admin' || $portalMode === 'both')
                                                <td class="stack-column" width="{{ $portalMode === 'both' ? '50%' : '100%' }}" valign="top" style="{{ $portalMode === 'both' ? 'padding-left: 8px;' : '' }}">
                                                    <div class="portal-card" style="text-align: center;">
                                                        <div style="font-size: 12px; font-weight: 700; color: #ea580c; text-transform: uppercase; margin-bottom: 4px;">
                                                            Admin Portal
                                                        </div>
                                                        <p style="margin: 0 0 14px 0; font-size: 12px; color: #64748b;">
                                                            For supervisors &amp; administrators
                                                        </p>
                                                        <a href="{{ $adminNdaUrl }}" class="cta-btn-admin" target="_blank">
                                                            Admin NDA &rarr;
                                                        </a>
                                                        <p style="margin: 10px 0 0 0; font-size: 11px; word-break: break-all;">
                                                            <a href="{{ $adminNdaUrl }}" style="color: #ea580c; text-decoration: none;" target="_blank">{{ $adminNdaUrl }}</a>
                                                        </p>
                                                    </div>
                                                </td>
                                                @endif
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Interactive CSS Accordion for NDA Guidance -->
                            <div style="margin-bottom: 24px;">
                                <input type="checkbox" id="nda-help-toggle" class="faq-toggle">
                                <label for="nda-help-toggle" class="faq-label">
                                    &#9432; Which link should I use? (Click to expand)
                                </label>
                                <div class="faq-content">
                                    <p style="margin: 0 0 8px 0;"><strong>Employee Account:</strong> Use <a href="{{ $employeeNdaUrl }}" style="color: #052659; font-weight: 600;">{{ $employeeNdaUrl }}</a> if you log in via the standard employee dashboard.</p>
                                    <p style="margin: 0;"><strong>Admin Account:</strong> Use <a href="{{ $adminNdaUrl }}" style="color: #ea580c; font-weight: 600;">{{ $adminNdaUrl }}</a> if you have administrative or supervisory HRIS access.</p>
                                </div>
                            </div>

                            <!-- Signature Block -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e2e8f0; padding-top: 18px;">
                                <tr>
                                    <td>
                                        <p style="margin: 0; font-size: 14px; font-weight: 800; color: #052659; letter-spacing: 0.6px; text-transform: uppercase;">
                                            HUMAN RESOURCES DEPARTMENT
                                        </p>
                                        <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">
                                            EmpireOne BPO Solutions Inc. &bull; <a href="mailto:EmpireOne.HRD@empireonegroup.com" style="color: #64748b; text-decoration: none;">EmpireOne.HRD@empireonegroup.com</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Bottom Direct Link Bar -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 12px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                            @if($portalMode === 'admin' || $portalMode === 'both')
                                <a href="{{ $adminNdaUrl }}" class="link-pill" target="_blank">
                                    Admin: {{ $adminNdaUrl }}
                                </a>
                            @endif
                            @if($portalMode === 'employee' || $portalMode === 'both')
                                <a href="{{ $employeeNdaUrl }}" class="link-pill" target="_blank">
                                    Employee: {{ $employeeNdaUrl }}
                                </a>
                            @endif
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f1f5f9; padding: 14px 24px; text-align: center; font-size: 11px; color: #94a3b8;">
                            &copy; {{ date('Y') }} EmpireOne BPO Solutions Inc. All rights reserved.
                        </td>
                    </tr>

                </table>
                <!-- End Main Email Card -->

            </td>
        </tr>
    </table>

</body>
</html>