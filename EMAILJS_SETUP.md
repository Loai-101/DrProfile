# EmailJS Setup Guide for Direct Email Sending

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" as your email service
4. Connect your Gmail account (q9g8moh@gmail.com)
5. Note down the **Service ID** (e.g., `service_xxxxxxx`)

## Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

**Template ID:** `template_appointment`

**Subject:** `New Appointment Request - {{patient_name}}`

**Content:**
```
New Appointment Request - Dr. Alexis Jon

Patient Information:
- Name: {{patient_name}}
- Email: {{patient_email}}
- Phone: {{patient_phone}}

Appointment Details:
- Preferred Date: {{preferred_date}}
- Preferred Time: {{preferred_time}}
- Reason for Visit: {{reason}}
- Urgency Level: {{urgency}}

Please contact the patient to confirm the appointment.

---
This message was sent from Dr. Alexis Jon's website.
```

**To Email:** `q9g8moh@gmail.com`

## Step 4: Get Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key** (e.g., `user_xxxxxxxxxxxxx`)

## Step 5: Update Code
Replace in `src/components/DoctorProfile.js`:

```javascript
const serviceId = 'YOUR_SERVICE_ID'; // From Step 2
const templateId = 'template_appointment'; // From Step 3
const publicKey = 'YOUR_PUBLIC_KEY'; // From Step 4
```

## Step 6: Test
1. Run the application
2. Fill out the appointment form
3. Click "Send Request"
4. Check q9g8moh@gmail.com for the email

## Free Plan Limits
- 200 emails per month
- Perfect for a doctor's practice

## Security Note
- Public key is safe to use in frontend code
- EmailJS handles the actual email sending securely
- No backend server required
