
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject }}</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f5f9; font-family:Arial, Helvetica, sans-serif; color:#1f2937;">

    <!-- Preheader -->
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
        {{ $subject }}
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
        border="0" style="background-color:#f4f5f9;">

        <tr>
            <td align="center" style="padding:40px 16px;">

                <!-- Main Container -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                    border="0"
                    style="max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e5e7eb;">

                    <!-- Header -->
                    <tr>
                        <td style="background-color:#5b21b6; padding:25px 32px;">

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td>
                                        <p style="margin:0; color:#ffffff; font-size:19px; font-weight:bold; letter-spacing:0.5px;">
                                            EMPIREONE<span style="color:#ddd6fe;">CX</span>
                                        </p>

                                        <p style="margin:6px 0 0; color:#ddd6fe; font-size:11px; letter-spacing:1.5px; text-transform:uppercase;">
                                            Purchase Request Management
                                        </p>
                                    </td>

                                    <td align="right" valign="middle">
                                        <span style="display:inline-block; padding:7px 12px; background-color:#7c3aed; border:1px solid #a78bfa; border-radius:20px; color:#ffffff; font-size:11px; font-weight:bold;">
                                            ACTION REQUIRED
                                        </span>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:32px;">

                            <!-- Greeting / Title -->
                            <p style="margin:0 0 10px; color:#7c3aed; font-size:12px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">
                                Purchase Request Notification
                            </p>

                            <h1 style="margin:0 0 14px; color:#111827; font-size:25px; line-height:1.3; font-weight:700;">
                                {{ $subject }}
                            </h1>

                            <p style="margin:0 0 28px; color:#4b5563; font-size:15px; line-height:1.7;">
                                {{ $body }}
                            </p>

                            <!-- Request Summary -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                border="0" style="margin-bottom:24px;">

                                <tr>
                                    <td style="padding-bottom:12px;">
                                        <h2 style="margin:0; color:#111827; font-size:16px; font-weight:bold;">
                                            Request Summary
                                        </h2>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">

                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                            border="0" style="border-collapse:collapse;">

                                            @foreach ($summary as $label => $value)
                                                <tr>
                                                    <td width="38%" valign="top"
                                                        style="padding:13px 14px; background-color:#f9fafb; border-bottom:1px solid #e5e7eb; color:#6b7280; font-size:13px; font-weight:600;">
                                                        {{ $label }}
                                                    </td>

                                                    <td valign="top"
                                                        style="padding:13px 14px; background-color:#ffffff; border-bottom:1px solid #e5e7eb; color:#111827; font-size:13px; line-height:1.5; overflow-wrap:anywhere; {{ ! isset($itemRows) && $loop->last ? 'font-weight:700; color:#5b21b6;' : '' }}">
                                                        {{ $value }}
                                                    </td>
                                                </tr>
                                            @endforeach

                                        </table>
                                    </td>
                                </tr>
                            </table>

                            @isset($itemRows)
                                <h2 id="requested-items" style="margin:0 0 12px; color:#111827; font-size:16px; font-weight:bold;">
                                    Requested Items
                                </h2>
                                <table aria-labelledby="requested-items" width="100%" cellspacing="0" cellpadding="0" border="0"
                                    style="margin-bottom:24px; border-collapse:collapse; border:1px solid #e5e7eb; font-size:12px; line-height:1.5;">
                                    <thead>
                                        <tr style="background-color:#f5f3ff; color:#5b21b6;">
                                            <th scope="col" align="left" style="padding:8px 6px;">Item Name</th>
                                            <th scope="col" align="right" style="padding:8px 6px;">Quantity</th>
                                            <th scope="col" align="right" style="padding:8px 6px;">Unit Cost</th>
                                            <th scope="col" align="right" style="padding:8px 6px;">Total Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        @foreach ($itemRows as $item)
                                            <tr>
                                                <th scope="row" align="left" valign="top" style="padding:8px 6px; border-top:1px solid #e5e7eb; font-weight:normal; overflow-wrap:anywhere;">{{ $item['description'] }}</th>
                                                <td align="right" valign="top" style="padding:8px 6px; border-top:1px solid #e5e7eb;">{{ $item['quantity'] }}</td>
                                                <td align="right" valign="top" style="padding:8px 6px; border-top:1px solid #e5e7eb; overflow-wrap:anywhere;">{{ $item['unitCost'] }}</td>
                                                <td align="right" valign="top" style="padding:8px 6px; border-top:1px solid #e5e7eb; overflow-wrap:anywhere;">{{ $item['lineTotal'] }}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                    <tfoot>
                                        <tr style="background-color:#f5f3ff; color:#5b21b6; font-weight:bold;">
                                            <th scope="row" colspan="3" align="left" style="padding:8px 6px; border-top:1px solid #e5e7eb;">Grand Total</th>
                                            <td align="right" style="padding:8px 6px; border-top:1px solid #e5e7eb; overflow-wrap:anywhere;">{{ $grandTotal }}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            @endisset

                            <!-- CTA -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                border="0">
                                <tr>
                                    <td align="center" style="padding:8px 0 12px;">

                                        <a href="{{ $url }}"
                                            style="display:inline-block; padding:15px 30px; background-color:#6d28d9; border-radius:7px; color:#ffffff; font-size:15px; font-weight:bold; text-decoration:none; text-align:center;">
                                            View Purchase Request &nbsp; &#8594;
                                        </a>

                                    </td>
                                </tr>
                            </table>

                            <p style="margin:12px 0 0; color:#6b7280; font-size:12px; line-height:1.6; text-align:center;">
                                Please sign in to your EmpireOneCX account to review the complete request details and take the necessary action.
                            </p>

                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding:0 32px;">
                            <div style="border-top:1px solid #e5e7eb;"></div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding:24px 32px 28px; background-color:#ffffff;">

                            <p style="margin:0 0 6px; color:#374151; font-size:12px; font-weight:bold;">
                                EmpireOneCX
                            </p>

                            <p style="margin:0 0 12px; color:#9ca3af; font-size:11px; line-height:1.6;">
                                Customer Experience &amp; Global Outsourcing Services
                            </p>

                            <p style="margin:0; color:#9ca3af; font-size:11px; line-height:1.6;">
                                This is an automated notification. Please do not reply directly to this email.
                            </p>

                            <p style="margin:14px 0 0; color:#d1d5db; font-size:10px;">
                                &copy; {{ date('Y') }} EmpireOneCX. All rights reserved.
                            </p>

                        </td>
                    </tr>

                </table>

                <!-- Outside Footer -->
                <p style="margin:20px 0 0; color:#9ca3af; font-size:11px; text-align:center;">
                    Official Purchase Request Notification
                </p>

            </td>
        </tr>
    </table>

</body>
</html>
