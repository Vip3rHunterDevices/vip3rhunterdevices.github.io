document.addEventListener("DOMContentLoaded", async function () {
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
      redirect: window.location.href = `../devices/device-details.html?device=${encodeURIComponent(device)}`;
    });
  });
});