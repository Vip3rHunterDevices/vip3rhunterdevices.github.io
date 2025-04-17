const prefix = [
    "Unleash", "Elevate", "Define", "Express", "Embrace", 
    "Revamp", "Transform", "Own", "Style Your", "Protect Your"
];

const middle = [
    "Personal", "Mobile", "Device", "Digital", "Everyday",
    "Signature", "Custom", "Tech", "Essential", "Core"
];

const suffix = [
    "Style", "Vibe", "Shield", "Aura", "Identity",
    "Look", "Edge", "Feel", "Layer", "Experience"
];

let previousTagline = "";
let currentTagline = "";
let letterIndex = 0;
let isDeleting = false;
const speed = 100;
const delay = 1000;
const textElement = document.querySelector(".dynamic-text-addon");

function generateTagline() {
    let tagline;
    do {
        const pre = prefix[Math.floor(Math.random() * prefix.length)];
        const mid = middle[Math.floor(Math.random() * middle.length)];
        const suf = suffix[Math.floor(Math.random() * suffix.length)];
        const hasYour = pre.endsWith("Your");
        tagline = hasYour ? `${pre} ${mid} ${suf}!` : `${pre} Your ${mid} ${suf}!`;
    } while (tagline === previousTagline); // avoid repeating
    previousTagline = tagline;
    return tagline;
}

function typeEffect() {
    if (!isDeleting && letterIndex < currentTagline.length) {
        textElement.textContent = currentTagline.substring(0, letterIndex + 1);
        letterIndex++;
    } else if (isDeleting && letterIndex > 0) {
        textElement.textContent = currentTagline.substring(0, letterIndex - 1);
        letterIndex--;
    }

    if (!isDeleting && letterIndex === currentTagline.length) {
        setTimeout(() => isDeleting = true, delay);
    } else if (isDeleting && letterIndex === 0) {
        isDeleting = false;
        currentTagline = generateTagline();
        setTimeout(typeEffect, delay);
        return;
    }

    setTimeout(typeEffect, isDeleting ? speed / 2 : speed);
}

// Start typing with initial tagline
currentTagline = generateTagline();
typeEffect();