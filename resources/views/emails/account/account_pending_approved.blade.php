<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your account is approved</title>
</head>
<body style="margin:0; padding:24px; background:#f4f5f7; color:#1f2937; font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" style="width:100%; max-width:600px; margin:0 auto; border-collapse:collapse; background:#ffffff; border-radius:12px;">
        <tr>
            <td style="padding:32px;">
                <h1 style="margin:0 0 16px; color:#4f46e5; font-size:24px;">Your account is approved</h1>
                <p style="margin:0 0 16px;">Hello {{ $user->name }},</p>
                <p style="margin:0 0 24px;">Your employee account has been created. Sign in with the credentials below, then complete setup 1 and setup 2.</p>

                <table role="presentation" style="width:100%; margin:0 0 24px; border-collapse:collapse; background:#f9fafb;">
                    <tr>
                        <td style="padding:12px; font-weight:bold;">Employee ID</td>
                        <td style="padding:12px;">{{ $eid }}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px; font-weight:bold;">Email / username</td>
                        <td style="padding:12px;">{{ $user->email }}</td>
                    </tr>
                    <tr>
                        <td style="padding:12px; font-weight:bold;">Initial password</td>
                        <td style="padding:12px;"><code>{{ $initialPassword }}</code></td>
                    </tr>
                </table>

                <p style="margin:0 0 24px;">
                    <a href="{{ $loginUrl }}" style="display:inline-block; padding:12px 20px; border-radius:8px; background:#4f46e5; color:#ffffff; text-decoration:none; font-weight:bold;">Sign in to your account</a>
                </p>

                <p style="margin:0; color:#6b7280; font-size:13px;">For your security, change the initial password after signing in. If you did not expect this account, contact your administrator.</p>
            </td>
        </tr>
    </table>
</body>
</html>
