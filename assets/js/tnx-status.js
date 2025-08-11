document.addEventListener("DOMContentLoaded", () => {
    // --- Read PayU URL parameters ---
    const params = new URLSearchParams(window.location.search);
    const txnid = params.get("txnid");
    const amount = params.get("amount");
    const productinfo = params.get("productinfo");
    const statusFromUrl = params.get("status");
    const sig = params.get("sig");

    const heading = document.getElementById("status-heading");
    const subtitle = document.getElementById("status-subtitle");
    const message = document.getElementById("status-message");

    if (!txnid || !sig) {
        heading.textContent = "⚠️ Missing Parameters";
        subtitle.textContent = "Required details are missing.";
        message.textContent = "Please contact support.";
        return;
    }

    // Show initial loading
    heading.textContent = "🔄 Verifying Payment...";
    subtitle.textContent = `Transaction ID: ${txnid}`;
    message.textContent = "Please wait while we confirm the payment.";

    // Verify with backend
    fetch(`https://payment-result.viperkernels.workers.dev/verify?txnid=${encodeURIComponent(txnid)}&sig=${encodeURIComponent(sig)}`)
        .then(res => res.json())
        .then(data => {
            console.log("Worker verification response:", data);
            if (!data.verified) {
                heading.innerHTML = "⚠️ Verification Failed";
                subtitle.innerHTML = "<b>Payment details could not be verified.</b>";
                message.innerHTML = `
                    Please contact support.`;
                return;
            }
            document.addEventListener("currencyReady", function (e) {
                const { symbol, code } = e.detail;
                console.log("Currency Symbol in txn-status.js:", symbol);
                console.log("Currency Code in txn-status.js:", code);

                // Now you can use it anywhere in your payment status logic
                if (data.status === "success") {
                    heading.innerHTML = "✅ Payment Successful";
                    subtitle.innerHTML = `<b>Transaction ID:</b> ${txnid}`;
                    message.innerHTML = `<b>Amount:</b> ${symbol}${amount} for ${productinfo}`;
                } else {
                    heading.innerHTML = "❌ Payment Failed";
                    subtitle.innerHTML = `<b>Transaction ID:</b> ${txnid}`;
                    message.innerHTML = `<b>Amount:</b> ${symbol}${amount}<br>
                        <b>Device Details:</b> ${productinfo}<br>
                        <br>
                        If amount was deducted, it will be refunded.<br>
                        Please contact support with payment details and receipts.`;
                }
            });
        })
        .catch((err) => {
            heading.innerHTML = "⚠️ Server Error";
            subtitle.innerHTML = "Unable to verify payment.";
            message.innerHTML = `Please try again later.`;
            console.log("Error:",err)
        });

    // Typing effect words
    const successWords = ["Customizable!", "Powerful!", "Secure!", "Efficient!", "Reliable!", "Optimized!", "Cyber-Ready!"];
    const failureWords = ["Try Again!", "Check Details!", "Payment Failed!", "Order Not Completed!", "Error Occurred!", "Invalid Info!", "Please Retry!"];
    const words = status.toLowerCase() === "success" ? successWords : failureWords;

    let previousWordIndex = -1, wordIndex = 0, letterIndex = 0, currentWord = "", isDeleting = false;
    const speed = 100, delay = 1000;
    const textElement = document.querySelector(".dynamic-text");

    function getNextWordIndex() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * words.length);
        } while (newIndex === previousWordIndex);
        previousWordIndex = newIndex;
        return newIndex;
    }

    function typeEffect() {
        if (!isDeleting && letterIndex < words[wordIndex].length) {
            currentWord += words[wordIndex][letterIndex++];
        } else if (isDeleting && letterIndex > 0) {
            currentWord = currentWord.slice(0, -1);
            letterIndex--;
        }

        textElement.innerHTML = currentWord;

        if (!isDeleting && letterIndex === words[wordIndex].length) {
            setTimeout(() => isDeleting = true, delay);
        } else if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            wordIndex = getNextWordIndex();
            setTimeout(typeEffect, delay);
            return;
        }

        setTimeout(typeEffect, isDeleting ? speed / 2 : speed);
    }

    wordIndex = getNextWordIndex();
    typeEffect();
});
