const words = ["Customizable !", "Powerful  !", "Secure  !", "Efficient  !", "Reliable  !", "Unstoppable  !", "Optimized  !", "Cyber-Ready  !", "Unique  !"];
let previousWordIndex = -1;
let wordIndex = 0;
let letterIndex = 0;
let currentWord = "";
let isDeleting = false;
const speed = 100;
const delay = 1000; // Delay after word completion
const textElement = document.querySelector(".dynamic-text");

function getNextWordIndex() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * words.length);
    } while (newIndex === previousWordIndex); // Prevent repeating the same word
    previousWordIndex = newIndex;
    return newIndex;
}

function typeEffect() {
    if (!isDeleting && letterIndex < words[wordIndex].length) {
        currentWord += words[wordIndex][letterIndex];
        letterIndex++;
    } else if (isDeleting && letterIndex > 0) {
        currentWord = currentWord.slice(0, -1);
        letterIndex--;
    }

    textElement.innerHTML = currentWord;

    if (!isDeleting && letterIndex === words[wordIndex].length) {
        setTimeout(() => isDeleting = true, delay); // Delay before deleting
    } else if (isDeleting && letterIndex === 0) {
        isDeleting = false;
        wordIndex = getNextWordIndex();
        setTimeout(typeEffect, delay); // Delay before typing new word
        return;
    }

    setTimeout(typeEffect, isDeleting ? speed / 2 : speed);
}

typeEffect();