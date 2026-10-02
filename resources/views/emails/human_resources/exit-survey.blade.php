<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Exit Survey</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #334155;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        .wrapper {
            background-color: #f1f5f9;
            padding: 40px 16px;
        }

        .card {
            max-width: 620px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }

        .header-bar {
            height: 4px;
            background: linear-gradient(90deg, #0b2567 0%, #4f46e5 100%);
        }

        .header {
            background: #ffffff;
            padding: 36px 40px 20px 40px;
            text-align: center;
        }

        .logo {
            width: 170px;
            height: auto;
            display: block;
            margin: 0 auto 24px;
        }

        .title {
            margin: 0;
            color: #0f172a;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: -0.3px;
        }

        .content {
            padding: 10px 40px 40px 40px;
            line-height: 1.65;
            font-size: 15px;
            color: #334155;
        }

        .greeting {
            font-size: 16px;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 16px;
        }

        .bullet-list {
            padding-left: 20px;
            margin: 16px 0 24px 0;
        }

        .bullet-list li {
            margin-bottom: 8px;
            color: #475569;
        }

        .highlight-box {
            background-color: #f8fafc;
            border-left: 4px solid #4f46e5;
            padding: 16px 20px;
            border-radius: 0 6px 6px 0;
            margin: 24px 0;
            font-size: 14px;
            color: #1e293b;
        }

        .button-container {
            text-align: center;
            margin: 32px 0;
        }

        .btn-primary {
            background-color: #4f46e5;
            color: #ffffff !important;
            padding: 14px 32px;
            text-decoration: none !important;
            border-radius: 6px;
            font-weight: 600;
            display: inline-block;
            font-size: 15px;
            box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
        }

        .footer {
            text-align: center;
            padding: 24px 40px;
            background-color: #f8fafc;
            border-top: 1px solid #f1f5f9;
            font-size: 12px;
            color: #64748b;
            letter-spacing: 0.5px;
            font-weight: 600;
        }

        @media only screen and (max-width: 600px) {
            .wrapper {
                padding: 16px 8px;
            }

            .header,
            .content {
                padding-left: 20px !important;
                padding-right: 20px !important;
            }

            .title {
                font-size: 19px !important;
            }
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="card">
            <div class="header-bar"></div>
            <div class="header">
                <img
                    src="{{ asset('images/E1CXlogo.png') }}"
                    alt="EmpireOne Logo"
                    style="width: 180px; height: auto; display: block; margin: 0 auto 20px;">
                <h1 class="title">Employee Exit Survey</h1>
            </div>

            <div class="content">
                <div class="greeting">Dear {{ $name }},</div>

                <p>Greetings.</p>

                <p>As part of Empire One’s employee separation and exit process, you are required to accomplish the Employee Exit Survey as part of your clearance and offboarding requirements.</p>

                <p>The Exit Survey is an important component of our employee experience and continuous improvement program. It provides you with an opportunity to share your feedback regarding your employment experience, including your role, leadership and management, work environment, compensation and benefits, policies and procedures, career opportunities, training and development, and other factors that may have influenced your decision to leave the organization.</p>

                <p>Your honest and constructive feedback is highly encouraged. The information gathered through the survey will be reviewed by the appropriate HR stakeholders and may be used to:</p>

                <ul class="bullet-list">
                    <li>Identify recurring employee concerns and workplace issues;</li>
                    <li>Assess employee experience across teams, accounts, and sites;</li>
                    <li>Identify opportunities to improve HR policies, programs, benefits, and workplace practices;</li>
                    <li>Strengthen employee engagement, retention, and overall workplace experience; and</li>
                    <li>Develop appropriate corrective or improvement initiatives based on employee feedback.</li>
                </ul>

                <p>Please accomplish the Exit Survey through the button below:</p>

                <div class="button-container">
                    <a href="{{ config('app.url') }}/accounts/off_boarding_documents/{{ $id }}/exit-survey"
                        class="btn-primary"
                        style="background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block; margin: 6px 4px; font-size: 14px;">
                        <span style="color: #ffffff !important; text-decoration: none;">Complete Exit Survey</span>
                    </a>
                </div>

                <div class="highlight-box">
                    <strong>Deadline:</strong> Kindly complete the survey on or before <strong>{{ \Carbon\Carbon::now()->addDays(2)->format('F d, Y') }}</strong>. Please ensure all required fields are completed and your responses accurately reflect your experience during your employment with Empire One.
                </div>

                <p>We value the time and effort you have invested in the organization and appreciate your participation in this final step of the separation process. While your employment with the company has concluded, your feedback remains valuable in helping us improve our processes and employee experience for our current and future employees.</p>

                <p>Thank you for your cooperation, and we wish you success in your future endeavors.</p>

                <p style="margin-top: 28px; margin-bottom: 0;">
                    Regards,<br>
                    <strong>Human Resources Department</strong>
                </p>
            </div>

            <div class="footer">
                EMPIRE ONE &bull; HUMAN RESOURCES DEPARTMENT
            </div>
        </div>
    </div>
</body>

</html>