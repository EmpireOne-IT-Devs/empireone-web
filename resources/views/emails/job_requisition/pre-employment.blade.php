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
            background: #4f46e5;
            padding: 30px;
            text-align: center;
            color: white;
        }

        .content {
            padding: 40px;
            line-height: 1.6;
            color: #334155;
        }

        .requirements-box {
            background-color: #f1f5f9;
            padding: 25px;
            border-radius: 8px;
            margin-top: 30px;
            margin-bottom: 30px;
            border-left: 4px solid #4f46e5;
        }

        .requirements-box h3 {
            margin-top: 0;
            color: #1e293b;
            font-size: 18px;
        }

        .requirements-box h4 {
            margin-bottom: 5px;
            margin-top: 20px;
            color: #334155;
            text-decoration: underline;
            font-size: 15px;
        }

        .requirements-box ul {
            padding-left: 20px;
            margin-top: 5px;
        }

        .requirements-box li {
            margin-bottom: 4px;
        }

        .button-container {
            text-align: center;
            margin-top: 30px;
        }

        .btn-primary {
            background-color: #4f46e5;
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
                <h1 style="margin: 0;">Pre-Employment Checklist! 🎊</h1>
            </div>
            <div class="content">
                <p>Hi <strong>{{ $user['user']['name'] }}</strong>,</p>

                <p>Congratulations! This is an automated notification to let you know that your Pre-Employment Checklist for the <strong>{{ $user['job_application']['job_posting']['job_requisition']['title'] }}</strong> position is ready.</p>

                <div class="requirements-box">
                    <h3>Document Requirements</h3>
                    <p style="margin-top: 0; font-size: 14px;">Please prepare and submit the following documents:</p>

                    <h4>Add Signature</h4>
                    <li>✔ Signature</li>
                    <a href="{{ config('app.url') }}/applicant/my_profile/signature"
                        class="btn-primary" style="color: white !important;">Add Signature</a>

                    <h4>ORIGINAL COPY (has ✔ must be prioritized)</h4>
                    <ul>
                        <li>✔ Barangay Clearance</li>
                        <li>✔ Police Clearance</li>
                        <li>✔ NBI Clearance</li>
                    </ul>

                    <h4>Health Certificate with the ff tests:</h4>
                    <ul>
                        <li>✔ Chest X-ray</li>
                        <li>✔ Drug Test</li>
                    </ul>

                    <h4>Colored pictures</h4>
                    <ul>
                        <li>2x2 – 2 pcs</li>
                        <li>1x1 – 1 pc</li>
                    </ul>

                    <h4>PHOTOCOPY</h4>
                    <ul>
                        <li>Birth certificate (2 copies)</li>
                        <li>SSS Form E1/SSS ID</li>
                        <li>TIN ID/Number (1901 form)</li>
                        <li>Certificate of Employment from the previous employer (optional)</li>
                        <li>Phil Health MDR/ID</li>
                        <li>PAG-IBIG Number/ID</li>
                        <li>Photocopy of Driver's License (if applicable)</li>
                        <li>SSS & PAG-IBIG Loan Voucher (if applicable)</li>
                        <li>Marriage Contract (if married)</li>
                        <li>Birth Certificates of Dependents (1 copy each)<br>
                            <span style="font-size: 13px; color: #64748b;">(if Married - spouse & children; if Single - parents)</span>
                        </li>
                    </ul>
                </div>

                <p style="margin-top: 20px;">To review the full offer letter and signify your acceptance, please click the interactive portal link below:</p>
                <p style="margin-top: 10px;">Please click <strong>Submit Documents</strong> and upload all the requirements:</p>
                <div class="button-container">
                    <a href="{{ config('app.url') }}/accounts/applicant/my_documents"
                        class="btn-primary" style="color: white !important;">Submit Documents</a>
                </div>
            </div>
        </div>
        <div class="footer">
            Sent with ❤️ from the HR Team.
        </div>
    </div>
</body>

</html>