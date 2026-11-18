<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $subject }}</title>
</head>
<body style="margin:0; background-color:#f5f3ff; color:#1f2937; font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" style="padding:24px 12px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px; background-color:#ffffff; border:1px solid #e5e7eb; border-radius:12px;">
                    <tr>
                        <td style="padding:24px;">
                            <p style="margin:0 0 8px; color:#6d28d9; font-size:14px; font-weight:bold;">EmpireOneCX &middot; Purchase Requests</p>
                            <h1 style="margin:0 0 16px; font-size:24px; line-height:1.3;">{{ $subject }}</h1>
                            <p style="margin:0 0 24px; font-size:16px; line-height:1.5;">{{ $body }}</p>
                            <a href="{{ $url }}" style="display:inline-block; padding:12px 18px; border-radius:6px; background-color:#6d28d9; color:#ffffff; font-size:16px; font-weight:bold; text-decoration:none;">View Purchase Request</a>
                            <p style="margin:16px 0 0; color:#4b5563; font-size:14px; line-height:1.5;">Sign in to view the request details.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
