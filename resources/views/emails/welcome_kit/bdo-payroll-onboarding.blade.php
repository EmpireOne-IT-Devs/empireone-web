<!DOCTYPE html>
<html lang="en">

<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <meta http-equiv="X-UA-Compatible" content="IE=edge">
 <title>Onboarding Requirement – Payroll Account Opening with BDO Unibank</title>
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
   background: linear-gradient(135deg, #0033a0 0%, #1d4ed8 100%);
   background-color: #0033a0;
   color: #ffffff !important;
   text-decoration: none;
   font-weight: 700;
   font-size: 14px;
   padding: 13px 26px;
   border-radius: 8px;
   box-shadow: 0 4px 12px rgba(0, 51, 160, 0.25);
  }

  .step-card {
   background-color: #f8fafc;
   border: 1px solid #e2e8f0;
   border-left: 4px solid #0033a0;
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
 $branchName = $branchName ?? 'BDO San Carlos City Branch';
 $kasociusUrl = $kasociusUrl ?? 'https://empireone.kasocius.com/#/account/accountProfile';
 $guideFileName = $guideFileName ?? 'BDO ONLINE APPLICATION GUIDE.pdf';
 $guideFileSize = $guideFileSize ?? '1408K';
 $guidePdfUrl = $guidePdfUrl ?? asset('pdf/' . rawurlencode('BDO ONLINE APPLICATION GUIDE.pdf'));
 @endphp

 <!-- Outer Wrapper -->
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 32px 12px;">
  <tr>
   <td align="center">

    <!-- Main Email Card -->
    <table role="presentation" class="wrapper-table" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">

     <!-- BDO Navy & Gold Brand Header -->
     <tr>
      <td class="header-padding" style="background: linear-gradient(135deg, #002370 0%, #0033a0 75%, #1d4ed8 100%); background-color: #0033a0; padding: 32px 36px; text-align: left; border-bottom: 4px solid #facc15;">
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
         <td>
          <span style="display: inline-block; background-color: #facc15; color: #002370; font-size: 11px; font-weight: 800; letter-spacing: 1.1px; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; margin-bottom: 12px;">
           Payroll Onboarding Requirement
          </span>
          <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; line-height: 1.3;">
           Onboarding Requirement – Payroll Account Opening with BDO Unibank
          </h1>
          <p style="margin: 6px 0 0 0; color: #dbeafe; font-size: 13px;">
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
        <strong style="color: #3b0764;">BDO Unibank</strong>. This account will be used for the direct deposit of your salary and other payroll-related transactions.
       </p>

       <p style="margin: 0 0 24px 0; color: #581c87;">
        To ensure a smooth and timely setup, please carefully follow the attached instructions provided by BDO Unibank. These steps outline the requirements and process for opening your account. Once completed, kindly confirm with HR by submitting the necessary account details to your Kasocius account so we can update our records and guarantee your inclusion in the upcoming payroll cycle.
       </p>

       <!-- Section Heading -->
       <h2 style="margin: 0 0 14px 0; font-size: 16px; font-weight: 700; color: #581c87;">
        Important Steps to Follow:
       </h2>

       <!-- Step 1 with Document Checklist -->
       <div class="step-card">
        <p style="margin: 0; font-size: 14px; color: #4c1d95;">
         <span style="display: inline-block; background-color: #dbeafe; color: #0033a0; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 6px;">1</span>
         If you already have a <strong style="color: #3b0764;">Reference No.</strong>, immediately proceed to <strong>{{ $branchName }}</strong> and secure a Transaction Number. Please bring the following:
        </p>

        <div class="checklist-box">
         <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #4c1d95;">
          <li style="margin-bottom: 6px;">
           Two valid government-issued IDs and your company ID, along with photocopies and three specimen signatures
          </li>
          <li style="margin-bottom: 0;">
           HR endorsement letter (available from the guard on duty or at the HR office)
          </li>
         </ul>
        </div>
       </div>

       <!-- Step 2 -->
       <div class="step-card">
        <p style="margin: 0; font-size: 14px; color: #4c1d95;">
         <span style="display: inline-block; background-color: #dbeafe; color: #0033a0; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 6px;">2</span>
         Wait for your Transaction Number to be called so the Teller can pull up your details and provide further instructions.
        </p>
       </div>

       <!-- Step 3 -->
       <div class="step-card">
        <p style="margin: 0; font-size: 14px; color: #4c1d95;">
         <span style="display: inline-block; background-color: #dbeafe; color: #0033a0; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 6px;">3</span>
         Once you receive the Basic Account Data, submit one copy to HR.
        </p>
       </div>

       <!-- Step 4 -->
       <div class="step-card" style="margin-bottom: 24px;">
        <p style="margin: 0; font-size: 14px; color: #4c1d95;">
         <span style="display: inline-block; background-color: #dcfce7; color: #15803d; font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-right: 6px;">4</span>
         Immediately update your account number in <strong>Kasocius</strong>.
        </p>
       </div>

       <!-- Kasocius Update CTA Box -->
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
        <tr>
         <td align="center" style="padding: 20px;">
          <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #475569;">
           Already have your BDO account number? Log it now to avoid payroll delays:
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
           {{ $deadline ?? now('Asia/Manila')->format('F j, Y, \a\t g:i A (\M\N\L)') }}
          </strong>
          to avoid any delays in your salary crediting.
         </td>
        </tr>
       </table>

       <!-- Attached Guide Card (Matches PDF Attachment) -->
       <div style="margin-bottom: 24px;">
        <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">
         Attached Reference Guide
        </p>
        <a href="{{ $guidePdfUrl }}" class="attachment-card" target="_blank">
         <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
           <td width="42" valign="middle">
            <div style="width: 36px; height: 36px; background-color: #dc2626; color: #ffffff; font-size: 11px; font-weight: 800; border-radius: 6px; text-align: center; line-height: 36px;">
             PDF
            </div>
           </td>
           <td valign="middle" style="padding-left: 10px;">
            <div style="font-size: 14px; font-weight: 700; color: #0f172a;">{{ $guideFileName }}</div>
            <div style="font-size: 12px; color: #64748b;">{{ $guideFileSize }} &bull; Step-by-step online registration &amp; branch instructions</div>
           </td>
           <td align="right" valign="middle" style="font-size: 12px; font-weight: 700; color: #dc2626;">
            View &rarr;
           </td>
          </tr>
         </table>
        </a>
       </div>

       <!-- Branch & ID Tips -->
       <div style="margin-bottom: 24px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px;">
        <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #0033a0;">
         &#9432; Quick checklist before visiting {{ $branchName }}
        </p>
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #475569;">
         <strong>1. Online Pre-Application First:</strong> Follow the attached <em>{{ $guideFileName }}</em> to generate your BDO Reference Number before going to the branch.
        </p>
        <p style="margin: 0; font-size: 13px; color: #475569;">
         <strong>2. HR Endorsement Letter:</strong> Pick up your signed HR endorsement letter from the guard on duty or the HR office prior to visiting BDO.
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