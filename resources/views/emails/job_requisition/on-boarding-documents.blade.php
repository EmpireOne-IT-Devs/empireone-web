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
                <h1>Onboarding Documents! 🎊</h1>
            </div>
            <div class="content">
                <p>
                    This is an automated notification to inform you that
                    <strong>{{ $user['user']['name'] }}</strong> has a onboarding documents ready to be signed
                    for the position of
                    <strong>{{ $user['job_application']['job_posting']['job_requisition']['title'] }}</strong>.
                </p>

                <p>
                    The applicant submitted this response via the email portal. Please review the job order
                    and take the necessary next steps to proceed.
                </p>

                <p style="margin-top: 20px;">
                    To review the full offer letter and sign the contract, please click the link below:
                </p>
                <div class="button-container">
                    <a href="{{ config('app.url') }}/applicant/my_documents/{{$user['user']['id']}}/onboarding"
                        class="btn-primary" style="color: white !important;">Click to Sign Onboarding Documents</a>
                </div>
            </div>
        </div>
        <div class="footer">
            Sent with ❤️ from the HR Department
        </div>
    </div>
</body>

</html>