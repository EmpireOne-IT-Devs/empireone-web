<!DOCTYPE html>
<html lang="en">

<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <meta http-equiv="X-UA-Compatible" content="IE=edge">
 <title>Onboarding Requirement – Payroll Account Opening with BPI</title>
 <style>
  body,
  table,
  td,
  p,
  a,
  li {
   -webkit-text-size-adjust: 100%;
   -ms-text-size-adjust: 100%;
   font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }

  body {
   margin: 0;
   padding: 0;
   background-color: #f1f5f9;
   color: #1e293b;
   line-height: 1.6;
  }

  table {
   border-collapse: collapse !important;
  }

  .cta-btn-kasocius {
   display: inline-block;
   background: linear-gradient(135deg, #991b1b 0%, #b91c1c 100%);
   background-color: #991b1b;
   color: #ffffff !important;
   text-decoration: none;
   font-weight: 700;
   font-size: 14px;
   padding: 13px 26px;
   border-radius: 8px;
   box-shadow: 0 4px 12px rgba(153, 27, 27, 0.25);
  }

  .step-card {
   background-color: #f8fafc;
   border: 1px solid #e2e8f0;
   border-left: 4px solid #b11116;
   border-radius: 10px;
   padding: 14px 18px;
   margin-bottom: 12px;
  }

  .checklist-box {
   background-color: #ffffff;
   border: 1px dashed #cbd5e1;
   border-radius: 8px;
   padding: 12px 16px;
   margin-top: 10px;
  }

  .attachment-card {
   display: block;
   background-color: #fef2f2;
   border: 1px solid #fecaca;
   border-radius: 10px;
   padding: 14px 18px;
   text-decoration: none;
  }

  @media only screen and (max-width: 600px) {
   .wrapper-table {
    width: 100% !important;
   }

   .content-padding {
    padding: 24px 20px !important;
   }

   .header-padding {
    padding: 28px 20px !important;
   }

   .cta-btn-kasocius {
    display: block !important;
    text-align: center !important;
   }
  }
 </style>
</head>

<body style="margin: 0; padding: 0; background-color: #f1f5f9;">

 @php
 $branchName = $branchName ?? 'Any BPI Branch Nearest Your Location';
 $kasociusUrl = $kasociusUrl ?? 'https://empireone.kasocius.com/#/account/accountProfile';
 $endorsementFileName = $endorsementFileName ?? 'BPI ENDORSEMENT LETTER.pdf';
 $endorsementFileSize = $endorsementFileSize ?? '450K';
 $endorsementPdfUrl = $endorsementPdfUrl ?? asset('pdf/' . rawurlencode('BPI ENDORSEMENT LETTER.pdf'));
 @endphp

 <!-- Outer Wrapper -->
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 32px 12px;">
  <tr>
   <td align="center">

    <!-- Main Email Card -->
    <table role="presentation" class="wrapper-table" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">

     <!-- BPI Crimson & Gold Brand Header -->
     <tr>
      <td class="header-padding" style="background: linear-gradient(135deg, #7f1d1d 0%, #b11116 75%, #dc2626 100%); background-color: #b11116; padding: 32px 36px; text-align: left; border-bottom: 4px solid #facc15;">
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
         <td>
          <span style="display: inline-block; background-color: #facc15; color: #7f1d1d; font-size: 11px; font-weight: 800; letter-spacing: 1.1px; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; margin-bottom: 12px;">
           Payroll Onboarding Requirement
          </span>
          <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; line-height: 1.3;">
           Onboarding Requirement – Payroll Account Opening with BPI
          </h1>
          <p style="margin: 6px 0 0 0; color: #fee2e2; font-size: 13px;">
           Finance &amp; Accounting Department &bull; {{ $branchName }}
          </p>
         </td>
        </tr>
       </table>
      </td>
     </tr>

     <!-- Body Content -->
     <tr>
      <td class="content-padding" style="padding: 32px 36px; color: #334155; font-size: 15px; line-height: 1.65;">

       <p style="margin: 0 0 14px 0; font-size: 16px; color: #0f172a;">
        Dear <strong style="color: #0000ff;">{{ $recipientName ?? 'Colleague' }}</strong>,
       </p>

       <p style="margin: 0 0 16px 0; color: #581c87;">
        Welcome to EmpireOne! As part of your onboarding process, all employees are required to open a payroll account with
        <strong style="color: #3b0764;">BPI (Bank of the Philippine Islands)</strong>. This account will be used for the direct deposit of your salary and other payroll-related transactions.
       </p>

       <p style="margin: 0 0 24px 0; color: #581c87;">
        To facilitate the processing of your payroll account, please follow the instructions below:
       </p>

       <!-- Section Heading -->
       <h2 style="margin: 0 0 14px 0; font-size: 16px; font-weight: 700; color: #581c87;">
        Important Steps to Follow:
       </h2>

       <!-- Step 1 -->
       <div class="step-card">
        <p style="margin: 0; font-size: 14px; color: #4c1d95;">
         <span style="display: inline-block; background-color: #fee2e2; color: #b11116; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 6px;">1</span>
         Print the attached <strong style="color: #3b0764;">BPI Endorsement Letter</strong> provided by HR. Please ensure that the endorsement is complete and clearly printed.
        </p>
       </div>

       <!-- Step 2 -->
       <div class="step-card">
        <p style="margin: 0; font-size: 14px; color: #4c1d95;">
         <span style="display: inline-block; background-color: #fee2e2; color: #b11116; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 6px;">2</span>
         Visit <strong>{{ $branchName }}</strong> at your convenience.
        </p>
       </div>

       <!-- Step 3 with Document Checklist -->
       <div class="step-card">
        <p style="margin: 0; font-size: 14px; color: #4c1d95;">
         <span style="display: inline-block; background-color: #fee2e2; color: #b11116; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 6px;">3</span>
         Bring the following requirements:
        </p>

        <div class="checklist-box">
         <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #4c1d95;">
          <li style="margin-bottom: 6px;">
           Printed copy of the attached BPI Endorsement Letter
          </li>
          <li style="margin-bottom: 6px;">
           Two (2) valid government-issued IDs
          </li>
          <li style="margin-bottom: 0;">
           3 pcs. 1x1 ID picture
          </li>
         </ul>
        </div>
       </div>

       <!-- Step 4 -->
       <div class="step-card">
        <p style="margin: 0; font-size: 14px; color: #4c1d95;">
         <span style="display: inline-block; background-color: #fee2e2; color: #b11116; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 6px;">4</span>
         Inform the BPI representative that you are opening a payroll account endorsed by <strong style="color: #3b0764;">EmpireOne</strong> and present the required documents for verification and account opening.
        </p>
       </div>

       <!-- Step 5 -->
       <div class="step-card">
        <p style="margin: 0; font-size: 14px; color: #4c1d95;">
         <span style="display: inline-block; background-color: #fee2e2; color: #b11116; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 6px;">5</span>
         Complete the account opening requirements and forms as instructed by the BPI branch personnel.
        </p>
       </div>

       <!-- Step 6 -->
       <div class="step-card" style="margin-bottom: 24px;">
        <p style="margin: 0; font-size: 14px; color: #4c1d95;">
         <span style="display: inline-block; background-color: #dcfce7; color: #15803d; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 6px;">6</span>
         Once your BPI payroll account has been successfully opened, submit your account details to HR/Payroll through the prescribed process (and update your <strong>Kasocius</strong> profile). Ensure that the account information provided is accurate to avoid any delay or issue with your salary crediting.
        </p>
       </div>

       <!-- Kasocius Update CTA Box -->
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
        <tr>
         <td align="center" style="padding: 20px;">
          <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #475569;">
           Already opened your BPI account? Log your account number now to avoid payroll delays:
          </p>
          <a href="{{ $kasociusUrl }}" class="cta-btn-kasocius" target="_blank">
           Update Account Number in Kasocius &rarr;
          </a>
         </td>
        </tr>
       </table>

       <!-- Deadline Highlight Banner -->
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fefce8; border: 1px solid #fde047; border-left: 4px solid #eab308; border-radius: 8px; margin-bottom: 24px;">
        <tr>
         <td style="padding: 16px 18px; font-size: 14px; color: #4c1d95;">
          We encourage you to complete this requirement on or before
          <strong style="color: #0f172a; text-decoration: underline;">
           {{ $deadline ?? 'November 21, 2026' }}
          </strong>
          to avoid any delays in your salary crediting.
         </td>
        </tr>
       </table>

       <!-- Attached Endorsement Letter Card -->
       <div style="margin-bottom: 24px;">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">
         Attached Endorsement Document
        </p>
        <a href="{{ $endorsementPdfUrl }}" class="attachment-card" target="_blank">
         <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
           <td width="42" valign="middle">
            <div style="width: 36px; height: 36px; background-color: #b11116; color: #ffffff; font-size: 11px; font-weight: 800; border-radius: 6px; text-align: center; line-height: 36px;">
             PDF
            </div>
           </td>
           <td valign="middle" style="padding-left: 10px;">
            <div style="font-size: 14px; font-weight: 700; color: #0f172a;">{{ $endorsementFileName }}</div>
            <div style="font-size: 12px; color: #64748b;">{{ $endorsementFileSize }} &bull; Print clearly and bring to the BPI branch</div>
           </td>
           <td align="right" valign="middle" style="font-size: 12px; font-weight: 700; color: #b11116;">
            View &rarr;
           </td>
          </tr>
         </table>
        </a>
       </div>

       <!-- Important Note Box -->
       <div style="margin-bottom: 24px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px;">
        <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #b11116;">
         &#9432; Important Reminder Before Visiting BPI
        </p>
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #475569;">
         <strong>1. Bring Original Copies:</strong> Please bring the original copies of your two (2) valid government-issued IDs for bank verification.
        </p>
        <p style="margin: 0; font-size: 13px; color: #475569;">
         <strong>2. Bank Verification Procedures:</strong> Account opening remains subject to BPI&rsquo;s standard requirements and verification procedures. If additional documents or information are requested by the bank, please comply accordingly.
        </p>
       </div>

       <!-- Signature Block -->
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e2e8f0; padding-top: 18px;">
        <tr>
         <td>
          <p style="margin: 0; font-size: 14px; font-weight: 800; color: #0000ff; letter-spacing: 0.6px; text-transform: uppercase;">
           FINANCE &amp; ACCOUNTING DEPARTMENT
          </p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">
           EmpireOne &bull; <a href="mailto:EmpireOne.HRD@empireonegroup.com" style="color: #64748b; text-decoration: none;">EmpireOne.HRD@empireonegroup.com</a>
          </p>
         </td>
        </tr>
       </table>

      </td>
     </tr>

     <!-- Footer -->
     <tr>
      <td style="background-color: #f8fafc; padding: 14px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
       &copy; {{ date('Y') }} EmpireOne. All rights reserved.
      </td>
     </tr>

    </table>
    <!-- End Main Email Card -->

   </td>
  </tr>
 </table>

</body>

</html>