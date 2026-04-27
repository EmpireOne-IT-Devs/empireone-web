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
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            transition: box-shadow 0.3s ease;
        }

        .card:hover {
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);
            padding: 30px;
            text-align: center;
            color: #ffffff;
        }

        .content {
            padding: 40px;
            text-align: center;
            color: #374151;
        }

        .action-buttons {
            margin-top: 25px;
            text-align: center;
        }

        /* Primary Button with Interactive Hover */
        .button {
            display: inline-block;
            background-color: #4f46e5;
            color: #ffffff !important;
            padding: 14px 24px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: bold;
            margin: 10px 5px;
            box-shadow: 0 4px 6px rgba(79, 70, 229, 0.25);
            transition: all 0.3s ease;
            border: 2px solid #4f46e5;
        }

        .button:hover {
            background-color: #3730a3;
            border-color: #3730a3;
            box-shadow: 0 6px 12px rgba(79, 70, 229, 0.4);
            transform: translateY(-2px);
        }

        /* Secondary Button Style */
        .button-secondary {
            background-color: #ffffff;
            color: #4f46e5 !important;
            box-shadow: none;
        }

        .button-secondary:hover {
            background-color: #f5f3ff;
            box-shadow: 0 4px 10px rgba(79, 70, 229, 0.15);
        }

        /* Disabled State */
        .button.disabled {
            background-color: #9ca3af !important;
            border-color: #9ca3af !important;
            color: #ffffff !important;
            cursor: not-allowed;
            box-shadow: none !important;
            transform: none !important;
        }

        .info-box {
            background-color: #f9fafb;
            border: 1px dashed #d1d5db;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
            transition: border-color 0.3s ease;
        }

        .info-box:hover {
            border-color: #4f46e5;
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
            transition: transform 0.3s ease;
        }

        .logo:hover {
            transform: scale(1.05);
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
            <p>Your journey starts here. We've set up everything for you. Click the interactive buttons below to jump into your dashboard or meeting.</p>

            @php
            // Safely grab the date whether $schedule is an array or an object
            $dateString = is_array($schedule)
            ? ($schedule['start_time'] ?? $schedule['start']['dateTime'] ?? now())
            : ($schedule->start_time ?? now());

            $scheduleDate = \Carbon\Carbon::parse($dateString);
            $isPast = $scheduleDate->isPast();
            @endphp

            <div class="info-box">
                <p style="margin: 0; font-size: 14px;"><strong>Username:</strong> {{ $user->email }}</p>
                <p style="margin: 5px 0 0; font-size: 14px;"><strong>Password:</strong> <code style="background: #eee; padding: 2px 6px; border-radius: 4px; color: #111827;">Business12</code></p>
                <p style="margin: 5px 0 0; font-size: 14px;"><strong>Initial Interview On:</strong> <span style="color: #4f46e5; font-weight: 500;">{{ $scheduleDate->format('F j, Y, g:i A') }}</span></p>
            </div>

            <div class="action-buttons">
                {{-- Conditional Button Logic --}}
                @if($isPast)
                <span class="button disabled">
                    Link Expired
                </span>
                @else
                <a href="{{ is_array($schedule) ? ($schedule['meet_link'] ?? '#') : ($schedule->meeting_link ?? '#') }}" class="button">
                    Join Meet Link
                </a>
                @endif

                <a href="{{ $url }}" class="button button-secondary">
                    Get Started →
                </a>
            </div>

            @if($isPast)
            <p style="margin-top: 5px; font-size: 12px; color: #ef4444; font-weight: bold;">Your scheduled time has passed.</p>
            @endif

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