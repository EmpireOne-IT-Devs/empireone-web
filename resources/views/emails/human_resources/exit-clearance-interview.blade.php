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
            background: #7222B5;
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
            margin-top: 25px;
        }

        .btn-primary {
            background-color: #4f46e5;
            color: white !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
            margin: 8px 4px;
        }

        .btn-secondary {
            background-color: #0f172a;
            color: white !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
            margin: 8px 4px;
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
                <!-- Using config('app.url') avoids reliance on Laravel Mailer $message -->
                <img
                    src="https://careers.empireonecx.com/images/E1CXlogo.png"
                    alt="EmpireOne Logo"
                    style="width: 180px; height: auto; display: block; margin: 0 auto 20px;">
                <h1>Exit Clearance & Interview</h1>
            </div>
            <div class="content">
                <p>
                    This is an automated notification to inform you that
                    <strong>{{ $name }}</strong> has initiated the exit process for the position of
                    <strong>{{ $position }}</strong>.
                </p>

                <p>
                    Please complete your exit clearance form and submit your exit interview response using the respective links below to finalize your offboarding.
                </p>

                <div class="button-container">
                    <a href="{{ config('app.url') }}/accounts/documents/{{ $id }}/exit-clearance"
                        class="btn-primary">Complete Exit Clearance</a>

                    <a href="{{ config('app.url') }}/accounts/documents/{{ $id }}/exit-interview"
                        class="btn-secondary">Take Exit Interview</a>
                </div>
            </div>
        </div>
        <div class="footer">
            Sent with ❤️ from the HR Department
        </div>
    </div>
</body>

</html>