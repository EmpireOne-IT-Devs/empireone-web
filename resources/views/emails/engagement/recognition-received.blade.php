@php
    $appUrl = rtrim(config('app.url'), '/');
    $appName = config('app.name');

    $certNumber = 'CERT-' . ($recognition->created_at?->format('Y') ?? now()->format('Y')) . '-' . str_pad($recognition->id, 3, '0', STR_PAD_LEFT);
    $issuedDate = ($recognition->published_at ?? $recognition->created_at)?->format('M j, Y') ?? now()->format('M j, Y');
    $certUrl = $appUrl . '/accounts/employee/rnr/peer_recognition';
    $awardTitle = $recognition->award_category ?: 'Peer Recognition';

    /*
    |--------------------------------------------------------------------------
    | Logo resolution
    |--------------------------------------------------------------------------
    | 1. If the file exists on this server, EMBED it (CID attachment). This
    |    always displays: no public URL, no "images blocked", no localhost issue.
    | 2. Otherwise fall back to a public absolute URL.
    */
    $logoRelative = 'unified/engagement/posts/jKkPTNTYM7bjjQFgKCLU1pEMfUJ0Ict4SNhqphF3.jpg';
    $logoSrc = null;

    $logoCandidates = [
        // [absolute file path, public URL]
        [public_path($logoRelative),                 $appUrl . '/' . $logoRelative],
        [public_path('storage/' . $logoRelative),    $appUrl . '/storage/' . $logoRelative],
        [storage_path('app/public/' . $logoRelative), $appUrl . '/storage/' . $logoRelative],
    ];

    foreach ($logoCandidates as [$file, $url]) {
        if (is_file($file)) {
            try {
                $logoSrc = isset($message) ? $message->embed($file) : $url;
            } catch (\Throwable $e) {
                $logoSrc = $url;
            }
            break;
        }
    }

    // Last resort: original URL pattern (only works if publicly reachable over https)
    $logoSrc = $logoSrc ?: $appUrl . '/' . $logoRelative;

    $preheader = ($senderName ?? 'A colleague') . ' just recognized you' . ($recognition->award_category ? ' with the ' . $recognition->award_category : '') . '. Your certificate is ready.';
@endphp
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Congratulations, {{ $recipientName }}!</title>
   
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
        a { text-decoration: none; }

        @media only screen and (max-width: 620px) {
            .wrapper     { padding: 16px 8px !important; }
            .container   { width: 100% !important; border-radius: 0 !important; }
            .pad-hero    { padding: 28px 20px 0 !important; }
            .pad-cert    { padding: 20px 12px 4px !important; }
            .pad-cta     { padding: 16px 20px 24px !important; }
            .pad-footer  { padding: 16px 20px 24px !important; }
            .cert-inner  { padding: 24px 16px !important; }

            .h1          { font-size: 24px !important; }
            .award       { font-size: 17px !important; letter-spacing: 2px !important; }
            .recipient   { font-size: 24px !important; }
            .presented   { letter-spacing: 2px !important; }

            /* stack signatures */
            .sig-col     { display: block !important; width: 100% !important; padding: 0 0 22px !important; }
            .sig-line    { margin: 6px auto 0 !important; max-width: 200px !important; }
            .sig-seal    { padding-bottom: 22px !important; }

            /* stack footer */
            .foot-col    { display: block !important; width: 100% !important; text-align: center !important; padding: 0 0 10px !important; }

            .cta-link    { font-size: 15px !important; }
        }
    </style>
</head>

<body style="margin:0; padding:0; background-color:#f6f4fb; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">

    <!-- Preheader (inbox preview text) -->
    <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">
        {{ $preheader }}
        &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp; &#847; &zwnj; &nbsp;
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f4fb" style="background-color:#f6f4fb;">
        <tr>
            <td align="center" class="wrapper" style="padding:32px 16px;">

                <!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
                <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0"
                       style="width:100%; max-width:600px; background-color:#ffffff; border-radius:14px; overflow:hidden; border:1px solid #ece8f6;">

                    <!-- Top accent bar -->
                    <tr>
                        <td height="6" bgcolor="#7c3aed" style="height:6px; line-height:6px; font-size:0; background-color:#7c3aed; background-image:linear-gradient(90deg, #7c3aed, #a855f7, #f59e0b);">&nbsp;</td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td class="pad-hero" style="padding:36px 40px 0;">
                            <p style="margin:0; font-size:15px; line-height:1.5; color:#334155;">
                               <span style="color:#7c3aed; font-size:18px; font-weight:700;">E1</span>
                                &nbsp;Hi {{ $recipientName }},
                            </p>
                            <h1 class="h1" style="margin:10px 0 0; font-size:28px; line-height:1.2; color:#7c3aed; font-weight:800;">
                                Congratulations! &#127881;
                            </h1>
                            <p style="margin:16px 0 0; font-size:15px; line-height:1.6; color:#475569;">
                                <strong style="color:#0f172a;">{{ $senderName }}</strong> just recognized you
                                @if ($recognition->award_category)
                                    with the <strong style="color:#4c1d95;">{{ $recognition->award_category }}</strong>.
                                @else
                                    for your outstanding contribution.
                                @endif
                                <br>Your certificate is ready.
                            </p>
                            <p style="margin:16px 0 0; font-size:13px; line-height:1.6; color:#64748b;">
                                Keep up the amazing work!<br>
                                &mdash; The {{ $appName }} Team
                            </p>
                        </td>
                    </tr>

                    <!-- Certificate -->
                    <tr>
                        <td class="pad-cert" style="padding:28px 28px 8px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                                   bgcolor="#fdfcff" style="background-color:#fdfcff; border:3px solid #6d28d9; border-radius:4px;">
                                <tr>
                                    <td style="padding:6px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                                               style="border:1px solid #f5c26b;">
                                            <tr>
                                                <td align="center" class="cert-inner" style="padding:28px 32px;">

                                                    <!-- Logo (white background so the JPG blends in) -->
                                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="#fdfcff" style="margin:0 auto;">
                                                        <tr>
                                                            <td align="center" bgcolor="#fdfcff" style="background-color:#fdfcff;">
                                                                <img
                    src="https://curtis-crm.s3.amazonaws.com/unified/engagement/posts/TunMznlomltslVRHaoeeEI9D2GWrYbUCZNEpWSbZ.png"
                    alt="{{ config('app.name') }} Logo"
                    width="120"
                    style="
                        display: block;
                        width: 120px;
                        max-width: 120px;
                        height: auto;
                        max-height: 80px;
                        margin: 0 auto 20px auto;
                        border: 0;
                        outline: none;
                        text-decoration: none;
                    "
                >
                                                            </td>
                                                        </tr>
                                                    </table>

                                                    <!-- Ornament divider -->
                                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:12px auto 0;">
                                                        <tr>
                                                            <td width="40" height="1" style="width:40px; height:1px; line-height:1px; font-size:0; background-color:#f59e0b;">&nbsp;</td>
                                                            <td style="padding:0 8px; font-size:10px; color:#f59e0b; line-height:1;">&#9670;</td>
                                                            <td width="40" height="1" style="width:40px; height:1px; line-height:1px; font-size:0; background-color:#f59e0b;">&nbsp;</td>
                                                        </tr>
                                                    </table>

                                                    <!-- Award title -->
                                                    <p class="award" style="margin:22px 0 0; font-family:Georgia, 'Times New Roman', serif; font-size:22px; line-height:1.3; font-weight:bold; color:#4c1d95; text-transform:uppercase; letter-spacing:4px;">
                                                        {{ $awardTitle }}
                                                    </p>

                                                    <!-- Presented to -->
                                                    <p class="presented" style="margin:12px 0 0; font-size:10px; line-height:1.5; font-weight:500; color:#64748b; text-transform:uppercase; letter-spacing:4px;">
                                                        @if ($awardMessage)
                                                            Presented with Distinction to
                                                        @else
                                                            This Certificate is Proudly Presented to
                                                        @endif
                                                    </p>

                                                    <!-- Recipient -->
                                                    <p class="recipient" style="margin:10px 0 0; font-family:Georgia, 'Times New Roman', serif; font-size:30px; line-height:1.2; font-weight:800; color:#0f172a; letter-spacing:1px;">
                                                        {{ $recipientName }}
                                                    </p>

                                                    <!-- Amber divider -->
                                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:10px auto 0;">
                                                        <tr>
                                                            <td width="200" height="2" style="width:200px; height:2px; line-height:2px; font-size:0; background-color:#f59e0b;">&nbsp;</td>
                                                        </tr>
                                                    </table>

                                                    <!-- Citation -->
                                                    @if ($awardMessage)
                                                        @foreach ($awardMessage as $paragraph)
                                                            <p style="margin:10px auto 0; max-width:440px; font-size:12px; line-height:1.6; color:#1e293b;">
                                                                {{ $paragraph }}
                                                            </p>
                                                        @endforeach
                                                    @else
                                                        <p style="margin:10px auto 0; max-width:420px; font-size:12px; line-height:1.6; color:#1e293b;">
                                                            {{ $recognition->message }}
                                                        </p>
                                                    @endif

                                                    <!-- Date issued -->
                                                    <p style="margin:14px 0 0; font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:2px;">
                                                        Issued {{ $issuedDate }}
                                                    </p>

                                                    <!-- Signatures -->
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
                                                        <tr>
                                                            <td class="sig-col" width="33%" align="center" valign="bottom" style="vertical-align:bottom;">
                                                                <p style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:13px; font-weight:bold; color:#0f172a;">Giovanni Yap</p>
                                                                <div class="sig-line" style="height:1px; max-width:160px; background-color:#94a3b8; margin:6px auto 0; line-height:1px; font-size:0;">&nbsp;</div>
                                                                <p style="margin:6px 0 0; font-size:9px; color:#64748b; text-transform:uppercase; letter-spacing:2px;">Executive Director</p>
                                                            </td>
                                                            <td class="sig-col sig-seal" width="34%" align="center" valign="bottom" style="vertical-align:bottom;">
                                                                <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                                                                    <tr>
                                                                        <td width="44" height="44" align="center" valign="middle" bgcolor="#f59e0b"
                                                                            style="width:44px; height:44px; border-radius:50%; background-color:#f59e0b; background-image:linear-gradient(135deg, #fcd34d, #f59e0b, #d97706); text-align:center; font-size:18px; line-height:44px; color:#ffffff; border:2px solid #ffffff;">
                                                                            &#127941;
                                                                        </td>
                                                                    </tr>
                                                                </table>
                                                                <p style="margin:8px 0 0; font-size:8px; color:#94a3b8; text-transform:uppercase; letter-spacing:2px;">Certificate No.</p>
                                                                <p style="margin:3px 0 0; font-family:'Courier New', monospace; font-size:9px; font-weight:600; letter-spacing:2px; color:#64748b;">{{ $certNumber }}</p>
                                                            </td>
                                                            <td class="sig-col" width="33%" align="center" valign="bottom" style="vertical-align:bottom;">
                                                                <p style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:13px; font-weight:bold; color:#0f172a;">Fawad Nasir</p>
                                                                <div class="sig-line" style="height:1px; max-width:160px; background-color:#94a3b8; margin:6px auto 0; line-height:1px; font-size:0;">&nbsp;</div>
                                                                <p style="margin:6px 0 0; font-size:9px; color:#64748b; text-transform:uppercase; letter-spacing:2px;">Chief Executive Officer</p>
                                                            </td>
                                                        </tr>
                                                    </table>

                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- CTA (bulletproof button) -->
                    <tr>
                        <td class="pad-cta" align="center" style="padding:20px 28px 28px;">
                            <!--[if mso]>
                            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="{{ $certUrl }}" style="height:52px; v-text-anchor:middle; width:544px;" arcsize="20%" stroke="f" fillcolor="#7c3aed">
                                <w:anchorlock/>
                                <center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px; font-weight:bold; letter-spacing:1px;">GET CERTIFICATE</center>
                            </v:roundrect>
                            <![endif]-->
                            <!--[if !mso]><!-- -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" bgcolor="#7c3aed" style="border-radius:10px; background-color:#7c3aed; background-image:linear-gradient(135deg, #7c3aed, #a855f7);">
                                        <a href="{{ $certUrl }}" target="_blank" class="cta-link"
                                           style="display:block; padding:16px 20px; font-size:16px; font-weight:800; color:#ffffff; text-decoration:none; letter-spacing:1px; border-radius:10px;">
                                            GET CERTIFICATE
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <!--<![endif]-->

                            <p style="margin:14px 0 0; font-size:12px; line-height:1.5; color:#94a3b8;">
                                Button not working? Copy this link into your browser:<br>
                                <a href="{{ $certUrl }}" target="_blank" style="color:#7c3aed; word-break:break-all;">{{ $certUrl }}</a>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="pad-footer" style="padding:16px 28px 24px; border-top:1px solid #f1eefb;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td class="foot-col" align="right" valign="top" style="font-size:11px; color:#94a3b8; line-height:1.5;">
                                        &copy; {{ now()->year }} {{ $appName }}. All rights reserved.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
                <!--[if mso]></td></tr></table><![endif]-->

            </td>
        </tr>
    </table>
</body>

</html>