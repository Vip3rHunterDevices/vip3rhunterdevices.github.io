let device = null;

document.addEventListener("DOMContentLoaded", async () => {
    /* load info */

    const urlParams = new URLSearchParams(window.location.search);
    const deviceId = urlParams.get("device");

    if (!deviceId) return;

    try {
        const res = await fetch("../assets/json/devices.json");
        const data = await res.json();
        device = data[deviceId];

        if (!device) {
        console.error("Device not found in JSON:", deviceId);
        return;
        }

        console.log("Loaded device:", device);
        // Set Device Info

        document.querySelectorAll(".device-name").forEach(el => {el.textContent = device.name;});
        document.getElementById("device-condition").textContent = `Condition : ${device.condition}`;
        document.getElementById("device-price").textContent = `₹${device.basePriceINR}`;

        // Image Slider
        const slider = document.getElementById("image-slider");
        slider.innerHTML = device.images.map(img => `<img src="${img}" class="img-slide">`).join("");

        // Variant selectors
        const ramRomSelect = document.getElementById("ramRomSelect");
        const androidSelect = document.getElementById("androidSelect");

        const ramRomOptions = [...new Set(device.variants.map(v => `${v.ram} / ${v.rom}`))];
        const androidOptions = [...new Set(device.variants.map(v => v.android))];

        ramRomSelect.innerHTML = ramRomOptions.map(opt => `<option value="${opt}">${opt}</option>`).join('');
        androidSelect.innerHTML = androidOptions.map(opt => `<option value="${opt}">Android ${opt}</option>`).join('');

        const featureList = document.getElementById("supported-features");
        featureList.innerHTML = "";

        function renderSupport(support, parent) {
        for (const category in support) {
            const value = support[category];
            
            const categoryItem = document.createElement("li");
            categoryItem.textContent = category;

            // Create a nested list
            const subList = document.createElement("ul");

            if (Array.isArray(value)) {
            value.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                subList.appendChild(li);
            });
            } else if (typeof value === "object") {
            // Recursively render nested categories
            renderSupport(value, subList);
            }

            categoryItem.appendChild(subList);
            parent.appendChild(categoryItem);
        }
        }
        renderSupport(device.support, featureList);

        // Accessories (if provided)
        const accessoriesDiv = document.getElementById("accessory-options");
        accessoriesDiv.innerHTML = (device.accessories || [
        ]).map(acc =>
        `<div class="form-check">
            <input class="form-check-input accessory" type="checkbox" value="${acc.name}" data-price="${acc.price}" id="${acc.name.replace(/\s+/g, '')}">
            <label class="form-check-label" for="${acc.name.replace(/\s+/g, '')}">
            ${acc.name} (₹${acc.price})
            </label>
        </div>`
        ).join("");

    // Events for price update
    ramRomSelect.addEventListener("change", updateTotalPrice);
    androidSelect.addEventListener("change", updateTotalPrice);
    accessoriesDiv.addEventListener("change", updateTotalPrice);

    // Initial price calculation
    updateTotalPrice();

    } catch (err) {
        console.error("Error loading device info:", err);
    }

        // Get dropdown elements
    const ramRomSelect = document.getElementById("ramRomSelect");
    const androidSelect = document.getElementById("androidSelect");
    const customROMSelect = document.getElementById("customROM");

    // Clear existing options
    ramRomSelect.innerHTML = "";
    androidSelect.innerHTML = "";
    customROMSelect.innerHTML = "";

    // RAM + ROM Options (grouped unique by RAM/ROM)
    const ramRomSet = new Set();
    device.variants.forEach(v => {
    const key = `${v.ram}:${v.rom}`;
    if (!ramRomSet.has(key)) {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = `${v.ram} + ${v.rom}`;
        opt.dataset.multiplier = v.multiplier || 1;
        ramRomSelect.appendChild(opt);
        ramRomSet.add(key);
    }
    });

    // Android Version Options (unique)
    const androidSet = new Set();
    device.variants.forEach(v => {
    if (!androidSet.has(v.android)) {
        const opt = document.createElement("option");
        opt.value = v.android;
        opt.textContent = `Android ${v.android}`;
        opt.dataset.multiplier = v.androidMultiplier || 1 + (parseInt(v.android) - 11) * 0.05;
        androidSelect.appendChild(opt);
        androidSet.add(v.android);
    }
    });

    // Custom ROMs
    device.customROMs?.forEach(rom => {
    const opt = document.createElement("option");
    opt.value = rom;
    opt.textContent = rom;
    customROMSelect.appendChild(opt);
    });

    document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);

    document.querySelector('meta[property="og:title"]').setAttribute('content', "DEVICE DETAILS : " + deviceId);

    if (deviceId) {
      document.title = "DEVICE DETAILS : " + deviceId.toUpperCase();
    }

});

function updateTotalPrice() {
  if (!device) return;

  const basePrice = device.basePriceINR;
  const ramRom = document.getElementById("ramRomSelect").value;
  const android = document.getElementById("androidSelect").value.replace("Android ", "");

  let multiplier = 1;

  const baseVariant = device.variants[0];
  const selectedVariant = device.variants.find(v =>
    `${v.ram} / ${v.rom}` === ramRom && v.android === android
  ) || baseVariant;

  const baseRamRom = `${baseVariant.ram} / ${baseVariant.rom}`;
  const selectedRamRom = `${selectedVariant.ram} / ${selectedVariant.rom}`;

  if (selectedRamRom !== baseRamRom) multiplier += 0.10;  // +10% for RAM/ROM
  if (selectedVariant.android !== baseVariant.android) multiplier += 0.05;  // +5% for newer Android

  let total = Math.round(basePrice * multiplier);

  // Add accessory prices
  document.querySelectorAll("#accessory-options input:checked").forEach(input => {
    const accPrice = parseFloat(input.dataset.price || 0);
    total += accPrice;
  });

  document.getElementById("totalPrice").textContent = total.toString();
}

const urlParams = new URLSearchParams(window.location.search);
const deviceId = urlParams.get("device");

const sliderWrapper = document.getElementById("slider-wrapper");

// Dynamically inject 5 images with deviceId
for (let i = 1; i <= 5; i++) {
  const slide = document.createElement("div");
  slide.className = "swiper-slide";
  slide.innerHTML = `
    <img src="../assets/img/devices/${deviceId}/${deviceId}${i === 1 ? '' : `_${i}`}.png"
         class="img-fluid"
         alt="Device Image ${i}">
  `;
  sliderWrapper.appendChild(slide);
}

function submitOrder() {
  if (!device) return;

  const name = document.getElementById("userName").value.trim();
  const phone = document.getElementById("userPhone").value.trim();
  const address = document.getElementById("userAddress").value.trim();
  const customROM = document.getElementById("customROM").value;

  const ramRom = document.getElementById("ramRomSelect").value;
  const android = document.getElementById("androidSelect").value.replace("Android ", "");
  const variant = `${ramRom} · Android ${android}`;

  const accessories = Array.from(document.querySelectorAll("#accessory-options input:checked"))
    .map(input => input.value);

  const total = document.getElementById("totalPrice")?.textContent || "Unknown";

  const subject = encodeURIComponent(`New Order: ${device.name}`);
  const body = encodeURIComponent(
    `Device: ${device.name}\n` +
    `Variant: ${variant}\n` +
    `Custom ROM: ${customROM}\n` +
    `Accessories: ${accessories.join(", ") || "None"}\n` +
    `Total Price: ₹${total}\n\n` +
    `Customer Details:\nName: ${name}\nPhone: ${phone}\nAddress: ${address}`
  );

  window.location.href = `mailto:vip3rorder@gmail.com?subject=${subject}&body=${body}`;
}