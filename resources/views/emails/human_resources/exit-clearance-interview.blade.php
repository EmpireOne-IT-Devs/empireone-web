<!DOCTYPE html>
<html>

<head>
    <style>
        .wrapper {
            background-color: #f8fafc;
            padding: 40px 20px;
            font-family: Arial, Helvetica, sans-serif;
        }

        .card {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
        }

        .header {
            background: #ffffff;
            padding: 30px 30px 10px 30px;
            text-align: center;
        }

        .content {
            padding: 20px 30px 30px 30px;
            line-height: 1.6;
            color: #334155;
        }

        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 14px;
        }

        .details-table th {
            background-color: #0b2567;
            color: #ffffff;
            text-align: center;
            padding: 10px;
            font-weight: bold;
            letter-spacing: 0.5px;
            border: 1px solid #0b2567;
        }

        .details-table td {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            color: #1e293b;
        }

        .details-table tr td:first-child {
            width: 40%;
        }

        .button-container {
            text-align: center;
            margin-top: 30px;
        }

        .btn-primary {
            background-color: #4f46e5;
            color: #ffffff !important;
            padding: 12px 24px;
            text-decoration: none !important;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
            margin: 6px 4px;
            font-size: 14px;
        }

        .btn-secondary {
            background-color: #0f172a;
            color: white !important;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
            margin: 6px 4px;
            font-size: 14px;
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
                <img src="https://careers.empireonecx.com/images/E1CXlogo.png" alt="EmpireOne Logo"
                    style="width: 180px; height: auto; display: block; margin: 0 auto 20px;">
                <h2 style="margin: 0; color: #0f172a;">Offboarding Request - {{ $name }} ({{ $eid }})</h2>
            </div>
            <div class="content">
                <p>Team,</p>
                <p>Please process offboarding for the employee below:</p>

                <table class="details-table">
                    <thead>
                        <tr>
                            <th colspan="2">EMPLOYEE DETAILS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>EID</strong></td>
                            <td><strong>{{ $eid }}</strong></td>
                        </tr>
                        <tr>
                            <td><strong>Employee Name</strong></td>
                            <td><strong>{{ $name }}</strong></td>
                        </tr>
                        <tr>
                            <td>Designation</td>
                            <td>{{ $position }}</td>
                        </tr>
                        <tr>
                            <td>Account</td>
                            <td>{{ $account }}</td>
                        </tr>
                        <tr>
                            <td>Date of Joining</td>
                            <td>{{ $date_of_joining }}</td>
                        </tr>
                        <tr>
                            <td>Last Working Date</td>
                            <td>{{ $last_working_date }}</td>
                        </tr>
                        <tr>
                            <td><strong>Separation Date</strong></td>
                            <td><strong>{{ $separation_date }}</strong></td>
                        </tr>
                        <tr>
                            <td>Type of Separation</td>
                            <td>{{ $type_of_separation }}</td>
                        </tr>
                        <tr>
                            <td>Eligibility for Rehire</td>
                            <td>{{ $eligibility_for_rehire }}</td>
                        </tr>
                        <tr>
                            <td>Notice Period</td>
                            <td>{{ $notice_period }}</td>
                        </tr>
                        <tr>
                            <td>Clawback/Liquidated Damages</td>
                            <td>{{ $clawback }}</td>
                        </tr>
                    </tbody>
                </table>

                <div class="button-container">
                    <a href="{{ config('app.url') }}/accounts/off_boarding_documents/{{ $id }}/exit-clearance"
                        class="btn-primary"
                        style="background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block; margin: 6px 4px; font-size: 14px;">
                        <span style="color: #ffffff !important; text-decoration: none;">Complete Exit Clearance</span>
                    </a>
                </div>
            </div>
        </div>
        <div class="footer">
            HUMAN RESOURCES DEPARTMENT
        </div>
    </div>
</body>

</html>