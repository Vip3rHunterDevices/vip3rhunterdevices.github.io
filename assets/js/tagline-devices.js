const prefix = [
    "Unlock","Hack","Power Your","Arm","Command",
    "Level Up","Use","Explore","Own Your","Optimize"
];

const middle = [
    "Offensive Toolkit","Mobile Arsenal","Pentest Device","Hacking Machine",
    "Cyber Toolkit","Tactical Phone","Security Platform","Custom ROM",
    "NetHunter Rig","Linux Phone","Hacking Machine"
];

const suffix = [
    "Today","Like a Pro","Without Limits","for the Field",
    "with NetHunter","for Red Team Ops","Your Way",
    "Now","with Root","for Any Mission"
];

let previousTagline = "";
let currentTagline = "";
let letterIndex = 0;
let isDeleting = false;
const speed = 100;
const delay = 1000;
const textElement = document.querySelector(".dynamic-text-devices");

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