<!DOCTYPE html>

<html>

<head>
    <meta charset="UTF-8">
    <title>Notice to Explain (NTE)</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }

        .container {
            max-width: 800px;
            margin: 30px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 6px;
        }

        .header {
            text-align: center;
            padding: 20px;
            background-color: #f8f9fa;
            border-bottom: 3px solid #0000FF;
        }

        .header img {
            height: 60px;
            margin-bottom: 10px;
        }

        .header h1 {
            color: #0000FF;
            font-size: 24px;
            margin: 10px 0;
        }

        .header p {
            color: #666;
            font-size: 12px;
            margin: 5px 0;
        }

        .alert-box {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin-bottom: 25px;
            border-radius: 4px;
        }

        .alert-box strong {
            color: #856404;
        }

        .otp-box {
            background-color: #0000FF;
            color: #fff;
            font-size: 24px;
            text-align: center;
            padding: 15px;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
            letter-spacing: 4px;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #dee2e6;
        }

        a.btn {
            display: inline-block;
            padding: 12px 30px;
            margin: 10px 5px;
            border-radius: 5px;
            color: #fff !important;
            text-decoration: none;
            font-weight: bold;
            text-align: center;
        }

        a.btn-primary {
            background-color: #007bff;
        }

        a.btn-primary:hover {
            background-color: #0056b3;
        }

        ul {
            margin: 0;
            padding-left: 20px;
        }
    </style>
    ```

</head>

<body>
    <div class="container">
        <div class="header">
            <img
                src="{{ $message->embed(public_path('images/E1CXlogo.png')) }}"
                alt="EmpireOne Logo"
                style="width: 180px; height: auto; display: block; margin: 0 auto 20px;">
            <h1>ONE-TIME Password (OTP)</h1>
            <p><strong>EMPIREONE BPO SOLUTIONS INC.</strong></p>
            <p>IT Department</p>
        </div>

        <div class="content">
            <div class="alert-box">
                <strong>Important Notice:</strong>
                <ul>
                    <li>This OTP is confidential. Never share it with anyone, including our staff.</li>
                    <li>It is valid for only 10 minutes. After that, you will need a new OTP.</li>
                    <li>If you did not request this OTP, please ignore this email or contact support immediately.</li>
                    <li>Do not enter this OTP on any website other than EmpireOne BPO Inc.</li>
                </ul>
            </div>

            <div class="otp-box">
                {{ $otp }}
            </div>
        </div>

        <div class="footer">
            <p><strong>EMPIREONE BPO SOLUTIONS INC.</strong></p>
            <p>This is an automated message from the Human Resources Department. Please do not reply.</p>
            <p>&copy; {{ date('Y') }} EmpireOne BPO Solutions Inc. All rights reserved.</p>
        </div>
    </div>


</body>

</html>