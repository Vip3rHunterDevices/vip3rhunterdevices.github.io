let correctAnswer = 0;

function generateMathCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  correctAnswer = num1 + num2;
  document.getElementById("mathQuestion").value = `${num1} + ${num2} = ?`;
}

function validateMathCaptcha() {
  const userAnswer = parseInt(document.getElementById("mathAnswer").value);
  if (userAnswer !== correctAnswer) {
    alert("Incorrect CAPTCHA. Please solve the math problem correctly.");
    generateMathCaptcha();
    return false;
  }

  // IP limit logic
  //checkIPAndSubmit();
  //return false;

  // If CAPTCHA is correct, submit the form programmatically
  document.getElementById("reviewForm").submit();

  // After submission, reset the form and regenerate CAPTCHA
  document.getElementById("reviewForm").reset();
  generateMathCaptcha();
  return true;

}

function checkIPAndSubmit() {
  fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(data => {
      const ip = data.ip;
      const storedData = JSON.parse(localStorage.getItem('reviewSubmissions') || "{}");
      const currentTime = Date.now();
      const ONE_DAY = 24 * 60 * 60 * 1000;

      let submissionData = storedData[ip] || { count: 0, timestamp: currentTime };

      // If more than 24 hours have passed, reset count and timestamp
      if (currentTime - submissionData.timestamp > ONE_DAY) {
        submissionData.count = 0;
        submissionData.timestamp = currentTime;
      }

      if (submissionData.count >= 2) {
        alert("You've reached the 2 review submissions limit for today.");
        return;
      }

      submissionData.count += 1;
      storedData[ip] = submissionData;
      localStorage.setItem('reviewSubmissions', JSON.stringify(storedData));

      // Submit form silently
      document.querySelector(".email-form").submit();

      alert("Thanks for your feedback!");
    });
}

document.addEventListener("DOMContentLoaded", generateMathCaptcha);