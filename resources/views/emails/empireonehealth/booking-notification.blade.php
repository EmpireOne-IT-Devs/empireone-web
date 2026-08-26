<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Notification</title>

    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: Arial, Helvetica, sans-serif;
            color: #333333;
        }

        .email-wrapper {
            width: 100%;
            padding: 24px 0;
            background-color: #f4f4f4;
        }

        .container {
            width: 600px;
            max-width: calc(100% - 40px);
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
        }

        .header {
            padding: 22px 20px;
            text-align: center;
            background-color: #5B5BF7;
        }

        .header h1 {
            margin: 0;
            color: #ffffff;
            font-size: 20px;
            line-height: 1.4;
            font-weight: 700;
        }

        /* Content */
        .content {
            padding: 42px 30px 20px;
        }

        .content p {
            margin: 0 0 22px;
            font-size: 15px;
            line-height: 1.6;
            color: #444444;
        }

        .greeting {
            margin-bottom: 18px !important;
        }

        .otp-intro {
            margin-bottom: 15px !important;
        }

        /* OTP Box */
        .otp-box {
            margin: 25px 0;
            padding: 18px 20px;
            background-color: #f7f7f7;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            text-align: center;
        }

        .otp-label {
            display: block;
            margin-bottom: 8px;
            font-size: 13px;
            color: #777777;
        }

        .otp-code {
            display: block;
            font-size: 30px;
            line-height: 1.2;
            font-weight: 700;
            letter-spacing: 6px;
            color: #333333;
        }

        .notice {
            margin-top: 20px;
            padding: 15px 18px;
            background-color: #fafafa;
            border-left: 3px solid #b346e9;
            border-radius: 4px;
        }

        .notice p {
            margin: 0;
            font-size: 13px;
            line-height: 1.6;
            color: #666666;
        }

        /* Details Table */
        .details-box {
            margin: 25px 0;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            overflow: hidden;
        }

        .details-box table {
            width: 100%;
            border-collapse: collapse;
        }

        .details-box td {
            padding: 12px 18px;
            font-size: 14px;
            line-height: 1.5;
            border-bottom: 1px solid #eeeeee;
            vertical-align: top;
        }

        .details-box tr:last-child td {
            border-bottom: none;
        }

        .details-box td.label {
            width: 120px;
            color: #777777;
            font-weight: 700;
            background-color: #f7f7f7;
        }

        .details-box td.value {
            color: #333333;
        }

        /* Signature */
        .signature {
            margin-top: 35px;
        }

        .signature p {
            margin-bottom: 3px;
        }

        .signature .company {
            font-weight: 700;
            color: #333333;
        }

        /* Footer */
        .footer {
            padding: 28px 20px 18px;
            text-align: center;
            background-color: #ffffff;
        }

        .footer p {
            margin: 0;
            font-size: 12px;
            line-height: 1.6;
            color: #777777;
        }

        /* Mobile */
        @media only screen and (max-width: 600px) {
            .email-wrapper {
                padding: 15px 0;
            }

            .container {
                max-width: calc(100% - 24px);
            }

            .content {
                padding: 30px 22px 15px;
            }

            .header h1 {
                font-size: 18px;
            }

            .otp-code {
                font-size: 26px;
                letter-spacing: 5px;
            }
        }
    </style>
</head>

<body>

    <div class="email-wrapper">

        <div class="container">

            <!-- Header -->
            <div class="header">
                <h1>New Booking Received</h1>
            </div>

            <!-- Content -->
            <div class="content">

                <p class="greeting">
                    Hi Admin,
                </p>

                <p class="otp-intro">
                    A new booking has been submitted on the EmpireOne Health website. Details below:
                </p>

                <!-- Details -->
                <div class="details-box">
                    <table role="presentation">
                        <tr>
                            <td class="label">Name</td>
                            <td class="value">{{ $name ?? 'N/A' }}</td>
                        </tr>
                        <tr>
                            <td class="label">Company Name</td>
                            <td class="value">{{ $company_name ?? 'N/A' }}</td>
                        </tr>
                        <tr>
                            <td class="label">Email</td>
                            <td class="value">{{ $email ?? 'N/A' }}</td>
                        </tr>
                        <tr>
                            <td class="label">Phone</td>
                            <td class="value">{{ $phone ?? 'N/A' }}</td>
                        </tr>
                        <tr>
                            <td class="label">Looking For</td>
                            <td class="value">{{ $looking_for ?? 'A callback' }}</td>
                        </tr>
                        <tr>
                            <td class="label">Notes</td>
                            <td class="value">{{ $notes ?? 'N/A' }}</td>
                        </tr>
                    </table>
                </div>

                <p>
                    Please follow up with the client as soon as possible.
                </p>

                <!-- Signature -->
                <div class="signature">
                    <p>Best Regards,</p>
                    <p class="company">
                        <b>
                            EmpireOne Health System
                        </b>
                    </p>
                    <p>
                        <img
                            src="https://careers.empireonecx.com/images/empireone-health.png"
                            alt="EmpireOne Health Logo"
                            style="width: 155px; height: auto;">

                    </p>
                </div>

            </div>

            <!-- Footer -->
            <div class="footer">
                <p>
                    &copy; {{ date('Y') }} EmpireOne Health
                    All rights reserved.
                </p>
            </div>

        </div>

    </div>

</body>

</html>