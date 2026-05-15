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
            /* Ensures border-radius works even with the colored header */
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
        }

        .header {
            background: #4f46e5;
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

        .button-container {
            text-align: center;
            margin-top: 30px;
        }

        .btn-primary {
            background-color: #4f46e5;
            color: white !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            display: inline-block;
        }

        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #94a3b8;
        }

        /* Mobile Optimization */
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
                <h1>Congratulations! 🎊</h1>
            </div>
            <div class="content">
                <p>Hi <strong>HR Team</strong>,</p>

                <p>This is an automated notification to inform you that <strong>{{ $user['name'] }}</strong> has officially submitted a <strong>Position Change Form</strong>.</p>

                <p>The details were submitted via the internal portal. Please review the request and proceed with the necessary administrative steps.</p>

                <p style="margin-top: 20px;">You can access the full details and the employee's submission via the link below:</p>

                <div class="button-container">
                    <a href="{{ $url }}"
                        class="btn-primary">Review Submission</a>
                </div>
            </div>
        </div>
        <div class="footer">
            Sent with ❤️ from the HR Department.
        </div>
    </div>
</body>

</html>