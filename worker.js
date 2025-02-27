export default {
  async fetch(request, env) {
    // CORS preflight handling
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Content-Type': 'application/json',
    };

    switch (pathname) {
      case '/send-otp':
        return await sendOTP(request, env, corsHeaders);
      case '/check':
        return await checkOTP(request, env, corsHeaders);
      default:
        return new Response(JSON.stringify({ error: "Not Found" }), {
          status: 404,
          headers: { ...corsHeaders },
        });
    }
  },
};

async function sendOTP(request, env, corsHeaders) {
  let phoneNumber = new URL(request.url).searchParams.get("phoneNumber");

  if (!phoneNumber) {
    return new Response(JSON.stringify({ error: "Phone number is required" }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  phoneNumber = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;

  const twilioUrl = `https://verify.twilio.com/v2/Services/${env.TWILIO_VERIFY_SERVICE_SID}/Verifications`;
  const authHeader = "Basic " + btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);

  try {
    const twilioResponse = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": authHeader,
      },
      body: `To=${encodeURIComponent(phoneNumber)}&Channel=sms`,
    });

    const twilioData = await twilioResponse.json();

    return new Response(
      JSON.stringify({ status: twilioData.status, sid: twilioData.sid }),
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

async function checkOTP(request, env, corsHeaders) {
  const url = new URL(request.url);
  const phoneNumber = url.searchParams.get("phoneNumber");
  const otpCode = url.searchParams.get("otpCode");

  if (!phoneNumber || !otpCode) {
    return new Response(JSON.stringify({ 
      error: "Phone number and OTP code are required" 
    }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const formattedPhoneNumber = phoneNumber.startsWith("+") 
    ? phoneNumber 
    : `+${phoneNumber}`;

  const twilioUrl = `https://verify.twilio.com/v2/Services/${env.TWILIO_VERIFY_SERVICE_SID}/VerificationCheck`;
  const authHeader = "Basic " + btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);

  try {
    const twilioResponse = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": authHeader,
      },
      body: `To=${encodeURIComponent(formattedPhoneNumber)}&Code=${otpCode}`,
    });

    const twilioData = await twilioResponse.json();

    return new Response(
      JSON.stringify({ 
        status: twilioData.status, 
        valid: twilioData.status === 'approved' 
      }),
      {
        headers: corsHeaders,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
