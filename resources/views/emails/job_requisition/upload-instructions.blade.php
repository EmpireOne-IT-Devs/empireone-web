<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .body {
            background-color: #f4f7fa;
            padding: 40px 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
        }

        .card {
            max-width: 550px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        }


        .header {
            background: #4f46e5;
            padding: 30px;
            text-align: center;
            color: #ffffff;
        }

        .content {
            padding: 40px;
            color: #374151;
            line-height: 1.6;
        }

        .step-box {
            background-color: #f9fafb;
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 12px;
            text-align: left;
            display: flex;
            align-items: center;
            border: 1px solid #e5e7eb;
        }

        .step-number {
            background: #5170ff;
            /* Brand Electric Blue */
            color: white;
            width: 28px;
            height: 28px;
            display: inline-block;
            border-radius: 50%;
            text-align: center;
            line-height: 28px;
            font-weight: bold;
            margin-right: 15px;
            flex-shrink: 0;
        }

        .button {
            display: inline-block;
            background-color: #5170ff;
            /* Brand Electric Blue */
            color: #ffffff !important;
            padding: 14px 35px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 25px;
            text-align: center;
        }

        .footer {
            padding: 25px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
        }

        .logo {
            max-width: 140px;
            margin-bottom: 15px;
        }
    </style>
</head>

<body class="body">
    <div class="card">
        <div class="header">
            <img src="https://empireone-bpo.com/images/logo.png" alt="Empire One BPO" class="logo">
            <h2 style="margin:0; font-size: 20px; letter-spacing: 1px; color: #ffffff; font-weight: bold;">
                201 FILE UPLOAD
            </h2>
        </div>

        <div class="content">
            <h1 style="font-size: 22px; margin-top: 0; text-align: center;">Hi, {{ $user->name }}!</h1>
            <p style="text-align: center; color: #6b7280;">To complete your requirements, please follow these steps to upload your 201 File documents:</p>

            <div style="margin-top: 30px;">
                <div class="step-box">
                    <span class="step-number">1</span>
                    <span style="font-size: 15px;"><strong>Login</strong> to your Empire One account.</span>
                </div>

                <div class="step-box">
                    <span class="step-number" style="background: #4b0082;">2</span>
                    <span style="font-size: 15px;">Navigate to the <strong>201 File</strong> section.</span>
                </div>

                <div class="step-box">
                    <span class="step-number" style="background: #7348a2;">3</span>
                    <span style="font-size: 15px;"><strong>Upload</strong> a clear image of the file.</span>
                </div>

                <div class="step-box" style="border-left: 4px solid #4ed1f4;">
                    <span class="step-number" style="background: #4ed1f4;">4</span>
                    <span style="font-size: 15px;">Wait for <strong>documents approval</strong>.</span>
                </div>
            </div>

            <div style="text-align: center;">
                <a href="{{ config('app.url') }}/auth/login" class="button">Access Portal Now →</a>

            </div>

            <p style="margin-top: 30px; font-size: 13px; color: #9ca3af; text-align: center;">
                Need help? Contact the HR Department if you encounter any issues during the upload process.
            </p>
        </div>
    </div>

    <div class="footer">
        © {{ date('Y') }} Empire One BPO. All rights reserved.<br>
        Providing Excellence in Business Process Outsourcing.
    </div>
</body>

</html>