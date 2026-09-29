
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f1f5f9;
            font-family: Arial, Helvetica, sans-serif;
            color: #334155;
        }

        .wrapper {
            width: 100%;
            padding: 40px 20px;
            box-sizing: border-box;
            background-color: #f1f5f9;
        }

        .card {
            max-width: 620px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
        }

        .header {
            background: #4f46e5;
            padding: 32px 30px;
            text-align: center;
            color: #ffffff;
        }

        .header h1 {
            margin: 0;
            font-size: 26px;
            line-height: 1.3;
            font-weight: 700;
        }

        .header p {
            margin: 8px 0 0;
            font-size: 14px;
            line-height: 1.5;
            color: #e0e7ff;
        }

        .content {
            padding: 40px;
        }

        .greeting {
            margin: 0 0 18px;
            font-size: 16px;
            line-height: 1.6;
            color: #1e293b;
        }

        .intro {
            margin: 0 0 24px;
            font-size: 15px;
            line-height: 1.7;
            color: #475569;
        }

        .anniversary-box {
            margin: 28px 0;
            padding: 26px 20px;
            text-align: center;
            background-color: #eef2ff;
            border: 1px solid #c7d2fe;
            border-radius: 10px;
        }

        .anniversary-icon {
            font-size: 30px;
            margin-bottom: 10px;
        }

        .anniversary-title {
            margin: 0 0 8px;
            font-size: 20px;
            line-height: 1.4;
            font-weight: 700;
            color: #3730a3;
        }

        .anniversary-years {
            margin: 0;
            font-size: 15px;
            line-height: 1.6;
            color: #475569;
        }

        .message-section {
            margin: 28px 0;
        }

        .message-label {
            margin: 0 0 10px;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
        }

        .message-quote {
            margin: 0;
            padding: 18px 20px;
            background-color: #f8fafc;
            border-left: 4px solid #f97316;
            border-radius: 0 8px 8px 0;
            font-size: 15px;
            line-height: 1.7;
            font-style: italic;
            color: #475569;
        }

        .closing {
            margin: 28px 0 0;
            font-size: 15px;
            line-height: 1.7;
            color: #475569;
        }

        .signature {
            margin-top: 22px;
            font-size: 15px;
            line-height: 1.6;
            color: #334155;
        }

        .signature strong {
            color: #1e293b;
        }

        .footer {
            padding: 22px 30px;
            text-align: center;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
        }

        .footer p {
            margin: 0 0 5px;
            font-size: 12px;
            line-height: 1.6;
            color: #94a3b8;
        }

        @media only screen and (max-width: 600px) {
            .wrapper {
                padding: 20px 10px;
            }

            .content {
                padding: 30px 24px;
            }

            .header {
                padding: 28px 20px;
            }

            .header h1 {
                font-size: 22px;
            }

            .anniversary-box {
                padding: 22px 16px;
            }
        }
    </style>
</head>

<body>

    <div class="wrapper">

        <div class="card">

            <!-- =========================
                 HEADER
            ========================== -->
            <div class="header">

                <!--
                    COMPANY LOGO

                    IMPORTANT:
                    Use a PUBLIC HTTPS URL for email images.

                    Example:

                    src="https://your-domain.com/images/E1CXlogo.png"

                    DO NOT use:
                    - localhost
                    - 127.0.0.1
                    - C:\...
                    - storage paths that are not publicly accessible

                    If your Laravel application is publicly accessible,
                    you can also use:

                    src="{{ asset('images/E1CXlogo.png') }}"
                -->

                <img
                    src="https://curtis-crm.s3.amazonaws.com/unified/engagement/posts/jKkPTNTYM7bjjQFgKCLU1pEMfUJ0Ict4SNhqphF3.jpg"
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

                <h1>
                    🎉 Happy Work Anniversary!
                </h1>

                <p>
                    Celebrating your dedication, contribution, and continued growth.
                </p>

            </div>


            <!-- =========================
                 EMAIL CONTENT
            ========================== -->
            <div class="content">

                <p class="greeting">
                    Dear <strong>{{ $employee['name'] }}</strong>,
                </p>

                <p class="intro">
                    Today, we celebrate an important milestone in your journey
                    with <strong>{{ config('app.name') }}</strong>.
                    Thank you for the dedication, commitment, and valuable
                    contributions you have made throughout your time with the company.
                </p>


                <!-- =========================
                     ANNIVERSARY HIGHLIGHT
                ========================== -->
                <div class="anniversary-box">

                    <div class="anniversary-icon">
                        🏆
                    </div>

                    <p class="anniversary-title">
                        {{ $employee['anniversary_label'] }}
                    </p>

                    <p class="anniversary-years">
                        Celebrating
                        <strong>
                            {{ $employee['anniversary_years'] }}
                            {{ Str::plural('year', $employee['anniversary_years']) }}
                        </strong>
                        of dedication and service.
                    </p>

                </div>


                <!-- =========================
                     PERSONAL MESSAGE
                ========================== -->
                <div class="message-section">

                    <p class="message-label">
                        A Message for You
                    </p>

                    <div class="message-quote">
                        {!! nl2br(e($customMessage)) !!}
                    </div>

                </div>


                <p class="closing">
                    We sincerely appreciate the time, effort, and expertise you
                    continue to bring to the team. Your contributions are an
                    important part of our continued growth and success.
                </p>


                <div class="signature">
                    Warm regards,<br>
                    <strong>{{ config('app.name') }}</strong>
                </div>

            </div>


            <!-- =========================
                 FOOTER
            ========================== -->
            <div class="footer">

                <p>
                    &copy; {{ date('Y') }} {{ config('app.name') }}.
                    All rights reserved.
                </p>

                <p>
                    This is an automated work anniversary notification.
                </p>

            </div>

        </div>

    </div>

</body>

</html>