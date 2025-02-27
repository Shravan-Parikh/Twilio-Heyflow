// Configuration - Replace with your actual worker URL
const WORKER_URL = "https://your-worker-url.workers.dev";

function sendVerification() {
    const phoneInput = document.querySelector('input[name="phone-input-phone-6cf0c5d5"]');
    if (phoneInput) {
        const phone = phoneInput.value.replace(/\s/g, ''); // Remove spaces
        if (phone.length) {
            // Use the worker API instead of direct Twilio API
            fetch(`${WORKER_URL}/send-otp?phoneNumber=${encodeURIComponent(phone)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(responseData => {
                console.log("SMS sent:", responseData);
                // You can add user feedback here if needed
            })
            .catch(error => {
                console.error("Error sending SMS:", error.message);
                // Handle errors
            });
        } else {
            console.log("Invalid phone number");
        }
    }
}

function verifyOTP() {
    const phoneInput = document.querySelector('input[name="phone-input-phone-6cf0c5d5"]');
    const otpInput = document.querySelector('input[name="input-fd363631"]');
    if (phoneInput && otpInput) {
        const phone = phoneInput.value.replace(/\s/g, ''); // Remove spaces
        const otp = otpInput.value.replace(/\s/g, ''); // Remove spaces
        if (phone.length && otp.length) {
            // Use the worker API instead of direct Twilio API
            fetch(`${WORKER_URL}/check?phoneNumber=${encodeURIComponent(phone)}&otpCode=${encodeURIComponent(otp)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(responseData => {
                console.log("OTP verification:", responseData);
                if (responseData.valid) {
                    document.getElementById('id-b2956bcb').disabled = false;
                    // Optional: Add success message
                    // alert("OTP validated successfully!");
                    // window.location.href = "https://cactus-cumbersome-brave.heyflow.site/law-seekr-hw-texas-mva#thank-you";
                } else {
                    // Optional: Add error message
                    // alert(otp + " is an invalid OTP. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error verifying OTP:", error.message);
                // Handle errors
            });
        } else {
            // alert("Invalid phone number or OTP");
        }
    }
}

function navigateToContactInfo() {
    window.location.href = "https://cactus-cumbersome-brave.heyflow.site/law-seekr-hw-texas-mva#contact-info";
}

// Attach event listeners to buttons
document.addEventListener('DOMContentLoaded', function () {
    // Attach event listeners to buttons
    const sendButton1 = document.getElementById('id-21d2134c');
    const sendButton2 = document.getElementById('button-23f13655');
    const verifyButton = document.getElementById('id-b2956bcb');
    const contactButton = document.getElementById('button-a1738320');

    if (sendButton1) {
        sendButton1.addEventListener('click', sendVerification);
    }
    if (sendButton2) {
        sendButton2.addEventListener('click', sendVerification);
    }
    if (verifyButton) {
        console.log("verify before btn", verifyButton.disabled);
        // verifyButton.addEventListener('click', verifyOTP);
        
        verifyButton.addEventListener('click', function() {
            console.log("Please enter a valid OTP.");
        });
        
        verifyButton.setAttribute('disabled', 'disabled');
        console.log("verify after btn", verifyButton.disabled);
    }
    
    if (contactButton) {
        // contactButton.addEventListener('click', navigateToContactInfo);
    }
    
    // Auto-verify OTP when length is correct
    const otpInput = document.querySelector('input[name="input-fd363631"]');
    if (otpInput) {
        // otpInput.setAttribute('autocomplete', 'off');
        // Add an event listener for the 'input' event
        otpInput.addEventListener('input', function () {
            const otp = otpInput.value.trim();
            if (otp.length === 4) {
                verifyOTP();
            }
        });
    }
});
