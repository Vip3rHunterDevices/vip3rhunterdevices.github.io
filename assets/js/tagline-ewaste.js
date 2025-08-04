const prefix = [
    "Recycle", "Dispose", "Handle", "Respect", "Safeguard", 
    "Preserve", "Manage", "Return", "Revive", "Protect"
];

const middle = [
    "E-Waste", "Devices", "Electronics", "Tech Waste", "Digital Scrap",
    "Used Gadgets", "Obsolete Devices", "Outdated Tech", "Eco Gear", "E-Goods"
];

const suffix = [
    "Responsibly", "Safely", "Sustainably", "Smartly", "Efficiently",
    "Properly", "Today", "Correctly", "Consciously", "With Care"
];

let previousTagline = "";
let currentTagline = "";
let letterIndex = 0;
let isDeleting = false;
const speed = 100;
const delay = 1000;
const textElement = document.querySelector(".dynamic-text-ewaste");

function generateTagline() {
    let tagline;
    do {
        const pre = prefix[Math.floor(Math.random() * prefix.length)];
        const mid = middle[Math.floor(Math.random() * middle.length)];
        const suf = suffix[Math.floor(Math.random() * suffix.length)];
        tagline = `${pre} ${mid} ${suf}!`;
    } while (tagline === previousTagline);
    previousTagline = tagline;
    return tagline;
}

function typeEffect() {
    if (!isDeleting && letterIndex < currentTagline.length) {
        textElement.innerHTML = currentTagline.substring(0, letterIndex + 1);
        letterIndex++;
    } else if (isDeleting && letterIndex > 0) {
        // Ensure at least one non-empty character (non-breaking space) remains
        const visibleText = letterIndex > 1 
            ? currentTagline.substring(0, letterIndex - 1) 
            : "&nbsp;";
        textElement.innerHTML = visibleText;
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

// Start with first generated tagline
currentTagline = generateTagline();
typeEffect();
