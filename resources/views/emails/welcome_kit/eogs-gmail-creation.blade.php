<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>EOGS Gmail Account Creation</title>
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
        .cta-btn {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
            background-color: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: 700;
            font-size: 15px;
            padding: 14px 30px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
            transition: all 0.25s ease;
        }
        .cta-btn:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%);
            background-color: #1d4ed8;
            box-shadow: 0 6px 18px rgba(37, 99, 235, 0.38);
            transform: translateY(-1px);
        }

        .format-card {
            background-color: #faf5ff;
            border: 2px dashed #c084fc;
            border-radius: 12px;
            padding: 18px 20px;
            margin-bottom: 24px;
            transition: all 0.25s ease;
        }
        .format-card:hover {
            border-style: solid;
            border-color: #7e22ce;
            background-color: #f3e8ff;
            box-shadow: 0 6px 16px rgba(126, 34, 206, 0.12);
        }

        .step-row {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 10px;
            transition: border-color 0.2s ease, background-color 0.2s ease;
        }
        .step-row:hover {
            border-color: #93c5fd;
            background-color: #eff6ff;
        }

        .reminder-card {
            background-color: #fdf4ff;
            border: 1px solid #f0abfc;
            border-left: 4px solid #7e22ce;
            border-radius: 8px;
            padding: 18px 20px;
            margin-bottom: 24px;
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
            background-color: #eff6ff;
            color: #1d4ed8;
            border-color: #bfdbfe;
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
            .cta-btn {
                display: block !important;
                text-align: center !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9;">

    @php
        $gmailSignupUrl = $gmailSignupUrl ?? 'https://accounts.google.com/signup';
        $suggestedEmail = $suggestedEmail ?? 'eogs.jdelacruz@gmail.com';
        $exampleName    = $exampleName ?? 'Juan Dela Cruz';
    @endphp

    <!-- Outer Wrapper -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 32px 12px;">
        <tr>
            <td align="center">

                <!-- Main Email Card -->
                <table role="presentation" class="wrapper-table" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">

                    <!-- Brand Header -->
                    <tr>
                        <td class="header-padding" style="background: linear-gradient(135deg, #1e1b4b 0%, #1d4ed8 60%, #6d28d9 100%); background-color: #1d4ed8; padding: 32px 36px; text-align: left;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td>
                                        <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.16); color: #e0e7ff; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; margin-bottom: 12px;">
                                            Onboarding Account Setup
                                        </span>
                                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; line-height: 1.3;">
                                            EOGS Gmail Account Creation
                                        </h1>
                                        <p style="margin: 6px 0 0 0; color: #cbd5e1; font-size: 13px;">
                                            Human Resources Department &bull; EmpireOne Standardized Communication
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

                            <p style="margin: 0 0 16px 0;">
                                Good day.
                            </p>

                            <p style="margin: 0 0 22px 0;">
                                As part of our standardization of company-related communication and account management, all new hires are required to create an <strong>EOGS Gmail account</strong> using the prescribed email naming convention below.
                            </p>

                            <!-- Interactive Naming Convention & Example Card -->
                            <div class="format-card">
                                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #581c87;">
                                    Required Email Format:
                                    <span style="font-family: monospace; font-size: 14px; background-color: #ffffff; padding: 3px 8px; border-radius: 6px; border: 1px solid #e9d5ff; color: #581c87;">
                                        eogs.[first initial][lastname]@<span style="color: #2563eb;">gmail.com</span>
                                    </span>
                                </p>
                                <p style="margin: 12px 0 0 0; font-size: 14px; color: #334155;">
                                    <strong style="color: #581c87;">Example:</strong><br>
                                    For an employee named <strong style="color: #581c87;">{{ $exampleName }}</strong>, the prescribed email address would be:
                                    <strong style="color: #2563eb; font-family: monospace; font-size: 14px;">{{ $suggestedEmail }}</strong>
                                </p>
                            </div>

                            <!-- Quick Launch Gmail CTA -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 26px;">
                                <tr>
                                    <td align="center" style="padding: 20px;">
                                        <a href="{{ $gmailSignupUrl }}" class="cta-btn" target="_blank">
                                            Create Your EOGS Gmail Account &rarr;
                                        </a>
                                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b;">
                                            Opens Google Account Registration in a new tab
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Account Creation Instructions -->
                            <h2 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #581c87; text-decoration: underline;">
                                Account Creation Instructions
                            </h2>
                            <p style="margin: 0 0 14px 0; font-size: 14px; color: #475569;">
                                Please follow the steps below:
                            </p>

                            <div class="step-row">
                                <span style="display: inline-block; background-color: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 8px;">1</span>
                                Access <a href="{{ $gmailSignupUrl }}" style="color: #2563eb; font-weight: 600; text-decoration: none;" target="_blank">Gmail</a> and select <strong>Create Account</strong>.
                            </div>

                            <div class="step-row">
                                <span style="display: inline-block; background-color: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 8px;">2</span>
                                Register the account using your correct first and last name.
                            </div>

                            <div class="step-row">
                                <span style="display: inline-block; background-color: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 8px;">3</span>
                                Follow the prescribed EOGS email format: <strong style="color: #581c87;">eogs.[first initial][lastname]@<span style="color: #2563eb;">gmail.com</span></strong>.
                            </div>

                            <div class="step-row">
                                <span style="display: inline-block; background-color: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 8px;">4</span>
                                Create a strong and unique password for the account.
                            </div>

                            <div class="step-row">
                                <span style="display: inline-block; background-color: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 8px;">5</span>
                                Complete Google's required account verification and security setup.
                            </div>

                            <div class="step-row">
                                <span style="display: inline-block; background-color: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 8px;">6</span>
                                Ensure that the account can successfully send and receive emails.
                            </div>

                            <div class="step-row" style="margin-bottom: 26px;">
                                <span style="display: inline-block; background-color: #dcfce7; color: #15803d; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 8px;">7</span>
                                Once the account has been created, provide your EOGS Gmail address to HR/IT for documentation and validation.
                            </div>

                            <!-- Important Reminders -->
                            <div class="reminder-card">
                                <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 700; color: #581c87;">
                                    Important Reminders
                                </h3>
                                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #4c1d95;">
                                    <li style="margin-bottom: 6px;">The EOGS Gmail account shall be used primarily for authorized company-related communications and transactions.</li>
                                    <li style="margin-bottom: 6px;">Employees are responsible for maintaining the confidentiality and security of their account credentials.</li>
                                    <li style="margin-bottom: 6px;">Passwords must not be shared with other employees or unauthorized individuals.</li>
                                    <li style="margin-bottom: 6px;">Please ensure that the email address follows the prescribed naming convention for consistency and proper identification.</li>
                                    <li style="margin-bottom: 0;">If the preferred email address is already unavailable, please coordinate with HR/IT for the appropriate alternative format rather than creating an unrelated email address.</li>
                                </ul>
                            </div>

                            <!-- Interactive CSS Accordion for Username Conflicts -->
                            <div style="margin-bottom: 24px;">
                                <input type="checkbox" id="eogs-help-toggle" class="faq-toggle">
                                <label for="eogs-help-toggle" class="faq-label">
                                    &#9432; What if my prescribed EOGS username is already taken on Gmail? (Click to expand)
                                </label>
                                <div class="faq-content">
                                    <p style="margin: 0 0 8px 0;"><strong>Do not pick a random handle:</strong> Reply directly to <a href="mailto:EmpireOne.HRD@empireonegroup.com" style="color: #2563eb; font-weight: 600;">EmpireOne.HRD@empireonegroup.com</a> or message HR/IT so we can approve a standardized variation (such as including your second initial).</p>
                                    <p style="margin: 0;"><strong>Validation:</strong> Once created, reply to this email with your new <code>eogs.*@gmail.com</code> address for logging in your employee record.</p>
                                </div>
                            </div>

                            <p style="margin: 0 0 16px 0; font-size: 14px; color: #334155;">
                                Your cooperation in completing this requirement is highly appreciated and will help ensure consistent and professional management of EOGS-related communications.
                            </p>

                            <p style="margin: 0 0 24px 0; font-size: 13px; color: #64748b;">
                                Sent on: <strong style="color: #1e293b;">{{ $sentAt ?? now('Asia/Manila')->format('F j, Y, \a\t g:i A (\M\N\L).') }}</strong>
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
                            &copy; {{ date('Y') }} EmpireOne. All rights reserved.
                        </td>
                    </tr>

                </table>
                <!-- End Main Email Card -->

            </td>
        </tr>
    </table>

</body>
</html>