<!DOCTYPE html>
<html>

<head>
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
        }

        .header {
            background: #4f46e5;
            padding: 30px;
            text-align: center;
            color: white;
        }

        .content {
            padding: 40px;
            line-height: 1.6;
            color: #334155;
        }

        .button-container {
            text-align: center;
            margin-top: 30px;
        }

        .btn-primary {
            background-color: #4f46e5;
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
        }

        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="card">
            <div class="header">
                <h1>Job Offer Accepted! 🎊</h1>
            </div>
            <div class="content">
                <p>Hi <strong>HR Team</strong>,</p>

                <p>This is an automated notification to let you know that <strong>{{ $user['user']['name'] }}</strong> has officially accepted the job offer for the <strong>{{ $user['job_application']['job_posting']['job_requisition']['title'] }}</strong> position.</p>
                <p>The applicant submitted this response via the email portal. Please review the job order and take the necessary next steps to move forward with other candidates.</p>
                <p><strong>Package Details:</strong></p>
                <ul style="padding-left: 20px; margin: 0;">
                    <li><strong>Monthly Salary:</strong> ₱{{ number_format($user['salary'], 2) }}</li>

                    @php
                    $allowanceList = $allowances ?? $user['allowances'] ?? [];
                    @endphp

                    @foreach($allowanceList as $item)
                    @if(!empty($item['allowance']) && $item['allowance'] > 0)
                    <li style="margin-top: 5px; color: #334155;">
                        <strong>{{ $item['allowance_type'] }}:</strong>
                        ₱{{ number_format($item['allowance'], 2) }}
                    </li>
                    @endif
                    @endforeach
                </ul>

                <p style="margin-top: 20px;">To review the full offer letter and signify your acceptance, please click the interactive portal link below:</p>

                <div class="button-container">
                    <a href="{{ config('app.url') }}/administrator/job_posting/job_offers?job_order_id={{$user['id']}}"
                        class="btn-primary" style="color: white !important;">Visit More</a>
                </div>

            </div>
        </div>
        <div class="footer">
            Sent with ❤️ from the{{ $user['user']['name'] }}.
        </div>
    </div>
</body>

</html>