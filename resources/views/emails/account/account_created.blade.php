<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        .body {
            background-color: #f4f7fa;
            padding: 40px 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }

        .card {
            max-width: 500px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: #4f46e5;
            padding: 30px;
            text-align: center;
            color: #ffffff;
        }

        .content {
            padding: 40px;
            text-align: center;
            color: #374151;
        }

        .button {
            display: inline-block;
            background-color: #4f46e5;
            color: #ffffff !important;
            padding: 14px 30px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 20px;
        }

        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
        }

        .logo {
            max-width: 120px;
            margin-bottom: 20px;
        }
    </style>
</head>

<body class="body">
    <div class="card">
        <div class="header">
            <img src="https://empireone-bpo.com/images/logo.png" alt="{{ config('app.name') }}" class="logo">
            <h2 style="margin:0;">Account Created!</h2>
        </div>

        <div class="content">
            <h1 style="font-size: 24px;">Hi, {{ $user->name }}!</h1>
            <p>Your journey starts here. We've set up everything for you. Click the interactive button below to jump into your dashboard.</p>

            <div style="background-color: #f9fafb; border: 1px dashed #d1d5db; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: left;">
                <p style="margin: 0; font-size: 14px;"><strong>Username:</strong> {{ $user->email }}</p>
                <p style="margin: 5px 0 0; font-size: 14px;"><strong>Password:</strong> <code style="background: #eee; padding: 2px 4px; border-radius: 4px;">Business12</code></p>
            </div>

            <a href="{{ $url }}" class="button">
                Get Started Now →
            </a>

            <p style="margin-top: 30px; font-size: 13px; color: #6b7280;">
                For your security, please change your password after logging in.
            </p>
        </div>
    </div>
    <div class="footer">
        © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
    </div>
</body>

</html>