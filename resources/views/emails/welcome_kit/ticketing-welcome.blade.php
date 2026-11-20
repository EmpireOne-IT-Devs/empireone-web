<!DOCTYPE html>
<html lang="en">

<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <meta http-equiv="X-UA-Compatible" content="IE=edge">
 <title>Welcome to EmpireOne – Unified Ticketing System Account Creation</title>
 <style>
  /* Reset & Base */
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

  /* Interactive Hover States */
  .cta-btn {
   display: inline-block;
   background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
   background-color: #2563eb;
   color: #ffffff !important;
   text-decoration: none;
   font-weight: 700;
   font-size: 15px;
   padding: 14px 30px;
   border-radius: 8px;
   box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
   transition: all 0.25s ease;
  }

  .cta-btn:hover {
   background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%);
   background-color: #1d4ed8;
   box-shadow: 0 6px 18px rgba(37, 99, 235, 0.38);
   transform: translateY(-1px);
  }

  .step-card {
   background-color: #f8fafc;
   border: 1px solid #e2e8f0;
   border-left: 4px solid #2563eb;
   border-radius: 10px;
   padding: 16px 20px;
   margin-bottom: 14px;
   transition: all 0.2s ease;
  }

  .step-card:hover {
   border-color: #93c5fd;
   border-left-color: #4f46e5;
   background-color: #eff6ff;
   box-shadow: 0 4px 12px rgba(37, 99, 235, 0.06);
  }

  .mockup-frame {
   border: 1px solid #cbd5e1;
   border-radius: 12px;
   overflow: hidden;
   box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
   margin: 14px 0 6px 0;
  }

  .benefit-item {
   background-color: #f8fafc;
   border: 1px solid #e2e8f0;
   border-radius: 8px;
   padding: 10px 14px;
   margin-bottom: 8px;
   font-size: 14px;
   color: #334155;
   transition: border-color 0.2s ease, background-color 0.2s ease;
  }

  .benefit-item:hover {
   border-color: #a5b4fc;
   background-color: #eef2ff;
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
   max-height: 240px;
   padding: 12px 16px;
   border-bottom: 1px solid #e2e8f0;
   border-bottom-left-radius: 8px;
   border-bottom-right-radius: 8px;
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

   .cta-btn {
    display: block !important;
    text-align: center !important;
   }
  }
 </style>
</head>

<body style="margin: 0; padding: 0; background-color: #f1f5f9;">

 @php
 $ticketingUrl = $ticketingUrl ?? 'https://empireone-ticketing.com';
 @endphp

 <!-- Outer Wrapper -->
 <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 32px 12px;">
  <tr>
   <td align="center">

    <!-- Main Email Card -->
    <table role="presentation" class="wrapper-table" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width: 640px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0;">

     <!-- Brand Header -->
     <tr>
      <td class="header-padding" style="background: linear-gradient(135deg, #1e1b4b 0%, #2563eb 60%, #7c3aed 100%); background-color: #2563eb; padding: 32px 36px; text-align: left;">
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
         <td>
          <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.16); color: #e0e7ff; font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; padding: 5px 12px; border-radius: 999px; margin-bottom: 12px;">
           IT &amp; Onboarding Setup
          </span>
          <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; line-height: 1.3;">
           Welcome to EmpireOne – Unified Ticketing System Account Creation
          </h1>
          <p style="margin: 6px 0 0 0; color: #cbd5e1; font-size: 13px;">
           Information and Technology Department &bull; EmpireOneCX Support Portal
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

       <p style="margin: 0 0 14px 0;">
        Congratulations and welcome to <strong style="color: #581c87;">EmpireOne!</strong> &#127881;
       </p>

       <p style="margin: 0 0 16px 0;">
        We are delighted to have you onboard and look forward to supporting you throughout your journey with us.
       </p>

       <p style="margin: 0 0 24px 0;">
        As part of your onboarding process, we will be creating your <strong style="color: #581c87;">Unified Ticketing System account</strong>. This platform will serve as a centralized channel for raising and monitoring your concerns, requests, and service-related inquiries. Once a ticket is submitted, it will be automatically directed to the appropriate department or support team for proper action and resolution.
       </p>

       <!-- Primary CTA Box -->
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 28px;">
        <tr>
         <td align="center" style="padding: 22px 20px;">
          <a href="{{ $ticketingUrl }}" class="cta-btn" target="_blank">
           Access EmpireOne Unified Ticketing System &rarr;
          </a>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b;">
           Direct Link: <a href="{{ $ticketingUrl }}" style="color: #2563eb; font-weight: 600; text-decoration: none;" target="_blank">{{ $ticketingUrl }}</a>
          </p>
         </td>
        </tr>
       </table>

       <!-- Section Heading -->
       <h2 style="margin: 0 0 6px 0; font-size: 17px; font-weight: 700; color: #581c87;">
        How to Create Your Unified Ticketing Account
       </h2>
       <p style="margin: 0 0 16px 0; font-size: 14px; color: #475569;">
        Please follow the steps below:
       </p>

       <!-- Step 1 -->
       <div class="step-card">
        <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: #581c87;">
         1. Access the EmpireOne Unified Ticketing System
        </p>
        <p style="margin: 0; font-size: 14px; color: #334155;">
         Click the link: &ndash; <a href="{{ $ticketingUrl }}" style="color: #2563eb; font-weight: 600; text-decoration: underline;" target="_blank">EmpireOne Ticketing System</a>
        </p>
       </div>

       <!-- Step 2 + Login Page Visual Guide -->
       <div class="step-card">
        <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: #581c87;">
         2. Click &ldquo;Create an Account&rdquo;
        </p>
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #334155;">
         On the login page, select <strong>&ldquo;Create an Account&rdquo;</strong> to begin the registration process.
        </p>

        @if(isset($message) && !empty($loginScreenshotPath))
        <div class="mockup-frame">
         <img src="{{ $message->embed($loginScreenshotPath) }}" alt="EmpireOneCX Sign In Page" style="display: block; width: 100%; height: auto;">
        </div>
        @elseif(!empty($loginScreenshotUrl))
        <div class="mockup-frame">
         <img src="{{ $loginScreenshotUrl }}" alt="EmpireOneCX Sign In Page" style="display: block; width: 100%; height: auto;">
        </div>
        @else
        <!-- Pure HTML/CSS Interactive Login Preview Card (No external image required) -->
        <div class="mockup-frame" style="background: linear-gradient(135deg, #4338ca 0%, #1d4ed8 55%, #0f172a 100%); background-color: #1e3a8a; padding: 24px 20px; text-align: center; color: #ffffff;">
         <div style="display: inline-block; border: 1px solid rgba(255,255,255,0.45); border-radius: 10px; padding: 8px 18px; margin-bottom: 14px;">
          <span style="font-size: 20px; font-weight: 900; color: #a5b4fc;">E1</span>
          <span style="font-size: 16px; font-weight: 700; color: #ffffff; margin-left: 4px;">EmpireOneCX</span>
          <div style="font-size: 10px; color: #cbd5e1; letter-spacing: 0.5px;">Unified Ticketing System</div>
         </div>
         <div style="font-size: 15px; font-weight: 600; margin-bottom: 12px;">Sign in to your account</div>
         <div style="max-width: 280px; margin: 0 auto 8px auto; background-color: #ffffff; color: #94a3b8; text-align: left; padding: 8px 12px; border-radius: 6px; font-size: 12px;">Email</div>
         <div style="max-width: 280px; margin: 0 auto 10px auto; background-color: #ffffff; color: #94a3b8; text-align: left; padding: 8px 12px; border-radius: 6px; font-size: 12px;">Password</div>
         <div style="max-width: 280px; margin: 0 auto 10px auto; text-align: left;">
          <a href="{{ $ticketingUrl }}" target="_blank" style="display: inline-block; border: 2px solid #ef4444; background-color: rgba(239, 68, 68, 0.22); color: #ffffff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-decoration: underline;">
           Create an account
          </a>
          <span style="float: right; font-size: 11px; color: #cbd5e1; padding-top: 6px;">Forgot password?</span>
         </div>
         <div style="max-width: 280px; margin: 0 auto; background-color: #2563eb; color: #ffffff; font-size: 12px; font-weight: 700; padding: 9px; border-radius: 6px;">SIGN IN</div>
        </div>
        @endif
       </div>

       <!-- Step 3 + Create Account Form Visual Guide -->
       <div class="step-card">
        <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: #581c87;">
         3. Provide the Required Information
        </p>
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #334155;">
         Complete all the required fields accurately.
        </p>

        @if(isset($message) && !empty($registerScreenshotPath))
        <div class="mockup-frame">
         <img src="{{ $message->embed($registerScreenshotPath) }}" alt="Create a New Account Modal" style="display: block; width: 100%; height: auto;">
        </div>
        @elseif(!empty($registerScreenshotUrl))
        <div class="mockup-frame">
         <img src="{{ $registerScreenshotUrl }}" alt="Create a New Account Modal" style="display: block; width: 100%; height: auto;">
        </div>
        @else
        <!-- Pure HTML/CSS Registration Modal Preview -->
        <div class="mockup-frame" style="background-color: #ffffff; padding: 20px; text-align: center;">
         <div style="margin-bottom: 10px;">
          <span style="font-size: 20px; font-weight: 900; color: #4f46e5;">E1</span>
          <span style="font-size: 16px; font-weight: 700; color: #1e293b; margin-left: 4px;">EmpireOneCX</span>
         </div>
         <div style="font-size: 13px; font-weight: 700; letter-spacing: 0.8px; color: #0f172a; margin-bottom: 12px;">TICKETING SYSTEM</div>
         <div style="max-width: 300px; margin: 0 auto; text-align: left;">
          <div style="font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 8px;">Create a New Account</div>
          <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 7px 10px; font-size: 11px; color: #64748b; margin-bottom: 8px;">Location &#9662;</div>
          <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 7px 10px; font-size: 11px; color: #94a3b8; margin-bottom: 8px;">Fullname</div>
          <div style="border: 1px solid #2563eb; background-color: #eff6ff; border-radius: 6px; padding: 7px 10px; font-size: 11px; color: #1d4ed8; font-weight: 600; margin-bottom: 8px;">Email (Official EOGS or EmpireOneCX)</div>
          <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 7px 10px; font-size: 11px; color: #94a3b8; margin-bottom: 10px;">Position</div>
          <div style="background-color: #2563eb; color: #ffffff; text-align: center; font-size: 11px; font-weight: 700; padding: 8px; border-radius: 6px;">SUBMIT</div>
         </div>
        </div>
        @endif

        <!-- Important Email Policy Callout -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fefce8; border: 1px solid #fde047; border-left: 4px solid #eab308; border-radius: 8px; margin-top: 14px;">
         <tr>
          <td style="padding: 12px 14px; font-size: 13px; color: #713f12;">
           <strong>Important:</strong> For your email address, please use your official <strong>EOGS email address</strong> or <strong>EmpireOneCX email address</strong>. Personal email addresses should not be used for registration.
          </td>
         </tr>
        </table>
       </div>

       <!-- Step 4 -->
       <div class="step-card" style="margin-bottom: 26px;">
        <p style="margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: #581c87;">
         4. Submit Your Registration
        </p>
        <p style="margin: 0; font-size: 14px; color: #334155;">
         After reviewing the information you provided, click <strong>&ldquo;Submit&rdquo;</strong> to complete the account creation process.
        </p>
       </div>

       <!-- Why Use the Ticketing System? -->
       <h2 style="margin: 0 0 8px 0; font-size: 17px; font-weight: 700; color: #581c87;">
        Why Use the Ticketing System?
       </h2>
       <p style="margin: 0 0 12px 0; font-size: 14px; color: #334155;">
        The Ticketing System helps ensure that your concerns are:
       </p>

       <div class="benefit-item">
        &bull; <strong>Properly documented</strong> for tracking and reference;
       </div>
       <div class="benefit-item">
        &bull; <strong>Automatically routed</strong> to the appropriate department or support team;
       </div>
       <div class="benefit-item">
        &bull; <strong>Monitored until resolution</strong> to help ensure timely action; and
       </div>
       <div class="benefit-item" style="margin-bottom: 22px;">
        &bull; <strong>Easily tracked</strong> so you can check the status and progress of your request.
       </div>

       <p style="margin: 0 0 14px 0; font-size: 14px; color: #334155;">
        Moving forward, we encourage everyone to use the Ticketing System for concerns that require assistance from the appropriate support departments.
       </p>

       <p style="margin: 0 0 14px 0; font-size: 14px; color: #334155;">
        Should you encounter any issues while creating your account, please coordinate with local <strong>IT Support</strong> for assistance.
       </p>

       <p style="margin: 0 0 22px 0; font-size: 14px; color: #334155;">
        Once again, welcome to <strong style="color: #581c87;">EmpireOne!</strong> We are excited to have you as part of the team and wish you a successful and fulfilling journey with us.
       </p>

       <!-- Interactive CSS Accordion for Registration Help -->
       <div style="margin-bottom: 22px;">
        <input type="checkbox" id="ticketing-help-toggle" class="faq-toggle">
        <label for="ticketing-help-toggle" class="faq-label">
         &#9432; Need help registering your Ticketing System account? (Click to expand)
        </label>
        <div class="faq-content">
         <p style="margin: 0 0 8px 0;"><strong>1. Official Email Required:</strong> Make sure you have already set up your <code>eogs.*@gmail.com</code> or <code>@empireonecx.com</code> email address before clicking <strong>Submit</strong>.</p>
         <p style="margin: 0;"><strong>2. IT Support Assistance:</strong> If your location or position is missing from the dropdown, reach out to local IT Support or reply to <a href="mailto:EmpireOne.HRD@empireonegroup.com" style="color: #2563eb; font-weight: 600;">EmpireOne.HRD@empireonegroup.com</a>.</p>
        </div>
       </div>

       <p style="margin: 0 0 20px 0; font-size: 12px; color: #64748b;">
        Issued on: <strong style="color: #1e293b;">{{ $sentAt ?? now('Asia/Manila')->format('F j, Y, \a\t g:i A (\M\N\L).') }}</strong>
       </p>

       <!-- Signature Block -->
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e2e8f0; padding-top: 18px;">
        <tr>
         <td>
          <p style="margin: 0; font-size: 14px; font-weight: 800; color: #0000ff; letter-spacing: 0.6px; text-transform: uppercase;">
           INFORMATION AND TECHNOLOGY DEPARTMENT
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