# Twilio SMS Verification Integration Guide

This guide provides step-by-step instructions for implementing Twilio SMS verification in your HeyFlow form using a Cloudflare Worker as a secure middleware.

## Step 1: Cloudflare Worker Setup

1. Log into your Cloudflare dashboard
2. Navigate to "Workers & Pages" in the sidebar
3. Click "Create Worker"
4. Name your worker (e.g., "twilio-verification-worker")
5. Paste the provided worker.js code into the editor
6. Click "Save and Deploy"

### Environment Variables Setup

1. In your deployed worker page, go to the "Settings" tab
2. Click on "Variables"
3. Add the following environment variables: ( refer .env  file)
   - `TWILIO_ACCOUNT_SID`: Your Twilio account SID
   - `TWILIO_AUTH_TOKEN`: Your Twilio auth token
   - `TWILIO_VERIFY_SERVICE_SID`: Your Twilio Verify service SID (starting with "VA")

## Step 2: Test the API Endpoints

Before implementing in HeyFlow, test the worker endpoints using Postman or cURL.

### Send OTP Endpoint Test

```bash
curl -X GET "https://your-worker-url.workers.dev/send-otp?phoneNumber=+15551234567"
```

Expected response:
```json
{
  "status": "pending",
  "sid": "VExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### Verify OTP Endpoint Test

```bash
curl -X GET "https://your-worker-url.workers.dev/check?phoneNumber=+15551234567&otpCode=1234"
```

Expected response:
```json
{
  "status": "approved",
  "valid": true
}
```

## Step 3: Implement in HeyFlow

1. Navigate to your HeyFlow form dashboard
2. Go to "Settings" > "General" > "Header/Footer Code"
3. In the Header section, paste the provided HeyFlow header script
4. **Important**: Update the `WORKER_URL` constant with your actual Cloudflare worker URL
5. Save your changes
6. Test the form to ensure verification is working properly
