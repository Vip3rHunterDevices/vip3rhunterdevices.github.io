document.addEventListener("DOMContentLoaded", async function () {
  const priceEls = document.querySelectorAll(".price");
  const currencySymbols = {
    USD: "$", EUR: "€", GBP: "£", CAD: "CA$", AUD: "A$", JPY: "¥",
    INR: "₹", CNY: "¥", RUB: "₽", KRW: "₩", AED: "د.إ"
  };

  // Currency Conversion
  try {
    const geo = await fetch("https://ipapi.co/json/").then(r => r.json());
    const currency = geo.currency || "INR";
    if (currency !== "INR") {
      const rateRes = await fetch(`https://api.exchangerate.host/latest?base=INR&symbols=${currency}`);
      const rate = (await rateRes.json()).rates[currency];
      const symbol = currencySymbols[currency] || currency + " ";

      priceEls.forEach(el => {
        const inr = parseFloat(el.dataset.inr);
        if (!isNaN(inr)) {
          const converted = (inr * rate).toFixed(2);
          el.textContent = `${symbol}${converted}`;
          el.dataset.converted = converted; // Save for sorting
        }
      });
    } else {
      priceEls.forEach(el => el.dataset.converted = el.dataset.inr);
    }
  } catch (err) {
    console.warn("Currency conversion failed:", err);
    priceEls.forEach(el => el.dataset.converted = el.dataset.inr);
  }

  // Sorting Logic
  const sortSelect = document.getElementById("sortSelect");
  sortSelect.addEventListener("change", () => {
    const cardsContainer = document.querySelector("#devices-section .row");
    const cards = Array.from(cardsContainer.children);

    const sortType = sortSelect.value;
    if (sortType === "low-to-high" || sortType === "high-to-low") {
      cards.sort((a, b) => {
        const aPrice = parseFloat(a.querySelector(".price").dataset.converted);
        const bPrice = parseFloat(b.querySelector(".price").dataset.converted);
        return sortType === "low-to-high" ? aPrice - bPrice : bPrice - aPrice;
      });
    }

    // Remove all and re-add
    cards.forEach(card => cardsContainer.appendChild(card));
  });

  // View Details Event (placeholder action)
  document.querySelectorAll(".view-details").forEach(btn => {
    btn.addEventListener("click", () => {
      const device = btn.dataset.device;
      redirect: window.location.href = `device-details.html?device=${encodeURIComponent(device)}`;
    });
  });
});