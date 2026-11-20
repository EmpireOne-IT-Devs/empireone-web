<!DOCTYPE html>
<html lang="en">

<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <meta http-equiv="X-UA-Compatible" content="IE=edge">
 <title>Welcome to EmpireOne – HRIS Account Creation</title>
 <style>
  /* Reset & Base */
  body,
  table,
  td,
  p,
  a {
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

  /* Interactive Hover States */
  .cta-btn {
   display: inline-block;
   background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%);
   background-color: #2563eb;
   color: #ffffff !important;
   text-decoration: none;
   font-weight: 600;
   font-size: 15px;
   padding: 14px 30px;
   border-radius: 8px;
   box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
   transition: all 0.25s ease;
  }

  .cta-btn:hover {
   background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%);
   background-color: #1d4ed8;
   box-shadow: 0 6px 18px rgba(37, 99, 235, 0.38);
   transform: translateY(-1px);
  }

  .qr-card {
   border: 2px dashed #c084fc;
   background-color: #faf5ff;
   border-radius: 12px;
   padding: 18px;
   display: inline-block;
   transition: all 0.25s ease;
  }

  .qr-card:hover {
   border-style: solid;
   border-color: #7e22ce;
   background-color: #f3e8ff;
   box-shadow: 0 6px 16px rgba(126, 34, 206, 0.14);
  }

  .step-card {
   background-color: #f8fafc;
   border: 1px solid #e2e8f0;
   border-radius: 10px;
   padding: 14px 16px;
   transition: border-color 0.2s ease, background-color 0.2s ease;
  }

  .step-card:hover {
   border-color: #93c5fd;
   background-color: #eff6ff;
  }

  /* CSS-Only Interactive Accordion */
  .faq-toggle {
   display: none;
  }

  .faq-label {
   display: block;
   cursor: pointer;
   padding: 12px 16px;
   background-color: #f8fafc;
   border: 1px solid #e2e8f0;
   border-radius: 8px;
   font-weight: 600;
   font-size: 13px;
   color: #1e293b;
   transition: background-color 0.2s ease;
  }

  .faq-label:hover {
   background-color: #f1f5f9;
  }

  .faq-content {
   max-height: 0;
   overflow: hidden;
   transition: max-height 0.3s ease, padding 0.3s ease;
   font-size: 13px;
   color: #475569;
   padding: 0 16px;
   background-color: #ffffff;
   border-left: 1px solid #e2e8f0;
   border-right: 1px solid #e2e8f0;
  }

  .faq-toggle:checked+.faq-label {
   border-bottom-left-radius: 0;
   border-bottom-right-radius: 0;
   background-color: #eff6ff;
   color: #1d4ed8;
   border-color: #bfdbfe;
  }

  .faq-toggle:checked+.faq-label+.faq-content {
   max-height: 220px;
   padding: 12px 16px;
   border-bottom: 1px solid #e2e8f0;
   border-bottom-left-radius: 8px;
   border-bottom-right-radius: 8px;
  }

  /* Mobile Responsive */
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

   .cta-btn {
    display: block !important;
    text-align: center !important;
   }
  }
 </style>
</head>

<body style="margin: 0; padding: 0; background-color: #f1f5f9;">

 @php
 $targetUrl = $formUrl ?? 'https://empireone-hris.com/online_application';
 $defaultQrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' . urlencode($targetUrl);
 @endphp

 <!-- Outer Wrapper -->
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 32px 12px;">
  <tr>
   <td align="center">

    <!-- Main Email Card -->
    <table role="presentation" class="wrapper-table" width="620" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">

     <!-- Brand Top Banner -->
     <tr>
      <td class="header-padding" style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #4c1d95 100%); background-color: #1e3a8a; padding: 32px 36px; text-align: left;">
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
         <td>
          <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.14); color: #e0e7ff; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; margin-bottom: 12px;">
           Onboarding Action Required
          </span>
          <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; line-height: 1.3;">
           Welcome to EmpireOne – HRIS Account Creation
          </h1>
          <p style="margin: 6px 0 0 0; color: #cbd5e1; font-size: 13px;">
           Human Resources Department &bull; Employee 201 File Setup
          </p>
         </td>
        </tr>
       </table>
      </td>
     </tr>

     <!-- Body Content -->
     <tr>
      <td class="content-padding" style="padding: 32px 36px; color: #334155; font-size: 15px; line-height: 1.65;">

       <p style="margin: 0 0 16px 0; font-size: 16px; color: #0f172a;">
        Dear <strong style="color: #1d4ed8;">{{ $recipientName ?? 'Colleague' }}</strong>,
       </p>

       <p style="margin: 0 0 16px 0;">
        Congratulations and welcome to <strong>EmpireOne</strong>! We are delighted to have you onboard and we look forward to supporting your journey with us.
       </p>

       <p style="margin: 0 0 16px 0;">
        As part of your onboarding process, we will be creating your <strong>HRIS (Human Resource Information System)</strong> account, which will serve as the official electronic version of your 201 file or employee record.
       </p>

       <p style="margin: 0 0 22px 0;">
        This account will be your central hub for employment documentation, updates, and HR-related transactions throughout your tenure.
       </p>

       <!-- Deadline Highlight Callout Box -->
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eff6ff; border-left: 4px solid #2563eb; border-radius: 8px; margin-bottom: 24px;">
        <tr>
         <td style="padding: 16px 20px;">
          <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #1e40af;">
           &#9200; Submission Deadline (24-Hour Activation)
          </p>
          <p style="margin: 0; font-size: 14px; color: #1e293b;">
           Kindly accomplish and submit the HRIS Application Form no later than
           <strong style="color: #1d4ed8;">
            {{ $deadline ?? now('Asia/Manila')->format('F j, Y, \a\t g:i A (\M\N\L).') }}
           </strong>
          </p>
         </td>
        </tr>
       </table>

       <!-- 3-Step Visual Onboarding Progress -->
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 26px;">
        <tr>
         <td class="step-card">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
           <tr>
            <td width="33%" valign="top" style="padding-right: 8px;">
             <div style="font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase;">Step 1</div>
             <div style="font-size: 13px; font-weight: 600; color: #0f172a; margin-top: 2px;">Fill Out Form</div>
             <div style="font-size: 12px; color: #64748b;">Via link or QR code</div>
            </td>
            <td width="33%" valign="top" style="padding: 0 8px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
             <div style="font-size: 11px; font-weight: 700; color: #7e22ce; text-transform: uppercase;">Step 2</div>
             <div style="font-size: 13px; font-weight: 600; color: #0f172a; margin-top: 2px;">Reply to Email</div>
             <div style="font-size: 12px; color: #64748b;">Confirm completion</div>
            </td>
            <td width="33%" valign="top" style="padding-left: 8px;">
             <div style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase;">Step 3</div>
             <div style="font-size: 13px; font-weight: 600; color: #0f172a; margin-top: 2px;">HRIS Activated</div>
             <div style="font-size: 12px; color: #64748b;">Access within 24 hrs</div>
            </td>
           </tr>
          </table>
         </td>
        </tr>
       </table>

       <p style="margin: 0 0 24px 0;">
        Completing this step will allow us to finalize your employee record and provide you with seamless access to HR services and benefits.
       </p>

       <!-- Interactive Action Hub (CTA Button + Hover QR Card) -->
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 26px;">
        <tr>
         <td align="center" style="padding: 28px 20px;">
          <!-- Primary Interactive Button -->
          <a href="{{ $targetUrl }}" class="cta-btn" target="_blank">
           Open HRIS Application Form &rarr;
          </a>

          <p style="margin: 18px 0 12px 0; font-size: 13px; font-weight: 600; color: #6b21a8;">
           or scan the QR Code below with your mobile device:
          </p>

          <!-- Interactive Hover QR Box -->
          <a href="{{ $targetUrl }}" target="_blank" style="text-decoration: none;">
           <div class="qr-card">
            <div style="background-color: #ffffff; padding: 8px; border-radius: 8px; border: 2px solid #7e22ce;">
             <img src="{{ isset($message) && isset($qrCodePath) && !empty($qrCodePath) ? $message->embed($qrCodePath) : ($qrCodeUrl ?? $defaultQrUrl) }}"
              alt="HRIS Application Form QR Code"
              width="175"
              height="175"
              style="display: block; border: 0;">
            </div>
            <div style="margin-top: 8px; font-size: 11px; font-weight: 700; color: #6b21a8; letter-spacing: 0.4px;">
             CLICK OR SCAN TO LAUNCH
            </div>
           </div>
          </a>
         </td>
        </tr>
       </table>

       <!-- Reply Confirmation Reminder Banner -->
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fefce8; border: 1px solid #fde047; border-radius: 8px; margin-bottom: 24px;">
        <tr>
         <td style="padding: 14px 18px; font-size: 14px; color: #713f12;">
          <strong>Important:</strong> We appreciate your cooperation and commitment to completing this requirement promptly.
          <span style="text-decoration: underline; font-weight: 600;">Kindly reply to this email once the form has been accomplished.</span>
         </td>
        </tr>
       </table>

       <!-- Interactive CSS Accordion for Quick Onboarding Help -->
       <div style="margin-bottom: 24px;">
        <input type="checkbox" id="hris-help-toggle" class="faq-toggle">
        <label for="hris-help-toggle" class="faq-label">
         &#9432; Need help with the HRIS Application Form? (Click to view quick tips)
        </label>
        <div class="faq-content">
         <p style="margin: 0 0 8px 0;"><strong>1. Prepare your details:</strong> Have your government ID numbers (SSS, PhilHealth, Pag-IBIG, TIN) and emergency contact info ready.</p>
         <p style="margin: 0;"><strong>2. Direct Assistance:</strong> If you encounter any technical issues, simply reply directly to <a href="mailto:EmpireOne.HRD@empireonegroup.com" style="color: #1d4ed8; font-weight: 600;">EmpireOne.HRD@empireonegroup.com</a> for immediate guidance.</p>
        </div>
       </div>

       <p style="margin: 0 0 14px 0;">
        Should you have any questions or need assistance with the form, please reach out to the HR team for guidance.
       </p>

       <p style="margin: 0 0 24px 0;">
        Welcome once again to <strong>EmpireOne</strong>—we are excited to grow with you!
       </p>

       <!-- Signature Block -->
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
        <tr>
         <td>
          <p style="margin: 0; font-size: 14px; font-weight: 800; color: #1d4ed8; letter-spacing: 0.6px; text-transform: uppercase;">
           HUMAN RESOURCES DEPARTMENT
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
      <td style="background-color: #f8fafc; padding: 16px 36px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8;">
       &copy; {{ date('Y') }} EmpireOne. All rights reserved. This message contains confidential onboarding information.
      </td>
     </tr>

    </table>
    <!-- End Main Email Card -->

   </td>
  </tr>
 </table>

</body>

</html>