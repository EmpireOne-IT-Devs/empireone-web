<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .wrapper {
            background-color: #f8fafc;
            padding: 40px 20px;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }

        .card {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
        }

        .header {
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 60%, #fb923c 100%);
            padding: 30px;
            text-align: center;
            color: white;
        }

        .header h1 {
            margin: 0;
            font-size: 24px;
        }

        .content {
            padding: 40px;
            line-height: 1.6;
            color: #334155;
        }

        .award-box {
            background: #f5f3ff;
            border: 1px solid #ddd6fe;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
            text-align: center;
        }

        .award-title {
            font-size: 18px;
            font-weight: bold;
            color: #6d28d9;
            margin: 0 0 6px;
        }

        .company-value {
            display: inline-block;
            background: #eef2ff;
            border: 1px solid #c7d2fe;
            color: #4338ca;
            border-radius: 9999px;
            padding: 4px 14px;
            font-size: 12px;
            font-weight: 600;
        }

        .message-quote {
            font-style: italic;
            color: #475569;
            border-left: 3px solid #fb923c;
            padding-left: 16px;
            margin: 24px 0;
        }

        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #94a3b8;
        }

        @media only screen and (max-width: 480px) {
            .wrapper {
                padding: 20px 10px;
            }

            .content {
                padding: 20px;
            }
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <h1>🎉 You've Been Recognized!</h1>
            </div>
            <div class="content">
                <p>Hi <strong>{{ $recipientName }}</strong>,</p>

                <p>
                    Great news — <strong>{{ $senderName }}</strong> just recognized you for your
                    outstanding contribution!
                </p>

                <div class="award-box">
                    @if ($recognition->award_category)
                        <p class="award-title">{{ $recognition->award_category }}</p>
                    @endif
                    @if ($recognition->company_value)
                        <span class="company-value">{{ $recognition->company_value }}</span>
                    @endif
                </div>

                <div class="message-quote">
                    "{{ $recognition->message }}"
                </div>

                <p>
                    Keep up the amazing work — your efforts don't go unnoticed. You can view your
                    recognition on the Peer Recognition wall.
                </p>

                <p>
                    Cheers,<br>
                    <strong>{{ config('app.name') }} Team</strong>
                </p>
            </div>
            <div class="footer">
                This is an automated message from {{ config('app.name') }}. Please do not reply to this email.
            </div>
        </div>
    </div>
</body>

</html>
