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
            /* Neutral slate color */
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
            background-color: #64748b;
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
                <img
                    src="{{ $message->embed(public_path('images/E1CXlogo.png')) }}"
                    alt="EmpireOne Logo"
                    style="width: 180px; height: auto; display: block; margin: 0 auto 20px;">
                <h1>Application Update</h1>
            </div>
            <div class="content">
                <p>Hi <strong>{{ $user['applicant']['name'] }}</strong>,</p>

                <p>Thank you for taking the time to apply and interview for the <strong>{{ $user['position'] }}</strong> position at EmpireOne.</p>

                <p>While we enjoyed getting to know you and were impressed by your background, we are writing to let you know that we have decided to move forward with another candidate whose qualifications more closely align with the specific needs of this role at this time.</p>

                <p>We truly appreciate the time and effort you put into the application process. We will keep your resume on file and may reach out if a future opening aligns with your skills and experience.</p>

                <p style="margin-top: 20px;">We wish you the absolute best in your job search and future professional endeavors.</p>

            </div>
        </div>
        <div class="footer">
            Sent with respect from the Talent Acquisition Team at EmpireOne.
        </div>
    </div>
</body>

</html>