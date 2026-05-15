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
                <h1>Congratulations! 🎊</h1>
            </div>
            <div class="content">
                <p>Hi <strong>{{ $user['applicant']['name'] }}</strong>,</p>
                <p>We were incredibly impressed with your interview performance. We are thrilled to officially offer you the position of <strong>{{ $user['position'] }}</strong> at our team!</p>

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
                    <a href="{{ config('app.url') }}/accounts/{{ $user['user_role'] == 1 ? 'administrator' : ($user['user_role'] == 2 ? 'employee' : 'applicant') }}/job_offers/{{$user['job_offer_id']}}"
                        class="btn-primary" style="color: white !important;">View & Sign Offer</a>
                </div>
            </div>
        </div>
        <div class="footer">
            Sent with ❤️ from the HR Team at EmpireOne.
        </div>
    </div>
</body>

</html>