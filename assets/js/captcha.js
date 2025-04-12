let generatedCaptcha = ""; // Store CAPTCHA globally

function generateCaptcha() {
    generatedCaptcha = Math.floor(100000 + Math.random() * 900000).toString(); // Generate new 6-digit CAPTCHA
    document.getElementById("captchaCode").value = generatedCaptcha; // Display in field
}

function validateCaptcha(event) {
    let userCaptcha = document.getElementById("captchaInput").value;

    if (userCaptcha !== generatedCaptcha) {
        alert("CAPTCHA is incorrect. Please try again.");
        generateCaptcha(); // Refresh CAPTCHA on failure
        return false; // Stop form submission
    }

    // If CAPTCHA is correct, submit the form programmatically
    document.getElementById("contactForm").submit();

    document.getElementById("contactForm").reset();
    generateCaptcha(); // Refresh CAPTCHA after successful submission
    return true; // Allow form submission
}

window.onload = generateCaptcha; // Generate CAPTCHA on page load