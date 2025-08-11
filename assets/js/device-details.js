let device = null;
let priceInfo = { symbol: "₹", rate: 1, converted: 0 };

document.addEventListener("DOMContentLoaded", async () => {
  /* load info */
    async function convertINRToLocalCurrency(inrAmount) {
      try {
        console.log("🌍 Detecting location...");
        const geo = await fetch("https://ipapi.co/json/").then(r => r.json());
        const countryCode = (geo.country_code || "IN").toUpperCase();
        console.log("📍 Detected country:", geo.country_name, geo.country_code);

        const currencyMap = {
          "US": "USD", "CA": "CAD", "IN": "INR", "GB": "GBP", "AU": "AUD",
          "DE": "EUR", "FR": "EUR", "JP": "JPY", "AE": "AED", "CN": "CNY",
          "NL": "EUR", "CH": "CHF", "BR": "BRL", "ZA": "ZAR", "RU": "RUB",
          "KR": "KRW", "SG": "SGD", "MX": "MXN", "SE": "SEK", "NO": "NOK",
          "DK": "DKK", "PL": "PLN", "TR": "TRY", "NZ": "NZD", "HK": "HKD",
          "IL": "ILS", "AR": "ARS", "CL": "CLP", "CO": "COP", "TH": "THB",
          "MY": "MYR", "ID": "IDR", "PH": "PHP", "EG": "EGP", "NG": "NGN",
          "PK": "PKR", "BD": "BDT", "LK": "LKR", "UA": "UAH", "RO": "RON",
          "HU": "HUF", "CZ": "CZK", "AT": "EUR", "BE": "EUR", "IE": "EUR",
          "PT": "EUR", "GR": "EUR", "FI": "EUR", "IS": "ISK", "BG": "BGN",
          "HR": "HRK", "SI": "EUR", "EE": "EUR", "LV": "EUR", "LT": "EUR",
          "SK": "EUR", "LU": "EUR", "MT": "EUR", "CY": "EUR", "QA": "QAR",
          "KW": "KWD", "OM": "OMR", "BH": "BHD", "SA": "SAR", "DZ": "DZD",
          "MA": "MAD", "TN": "TND", "KE": "KES", "GH": "GHS", "TZ": "TZS",
          "UG": "UGX", "ZM": "ZMW", "ZW": "ZWL", "ET": "ETB", "SN": "XOF",
          "CI": "XOF", "BF": "XOF", "ML": "XOF", "NE": "XOF", "TG": "XOF",
          "BJ": "XOF", "GN": "GNF", "LR": "LRD", "MW": "MWK", "MZ": "MZN",
          "NA": "NAD", "BW": "BWP", "LS": "LSL", "SZ": "SZL", "CM": "XAF",
          "GA": "XAF", "CG": "XAF", "CD": "CDF", "AO": "AOA", "MW": "MWK",
          "PY": "PYG", "UY": "UYU", "VE": "VES"
        };

        const currencySymbols = {
          USD: "$", EUR: "€", GBP: "£", CAD: "CA$", AUD: "A$", JPY: "¥",
          INR: "₹", CNY: "¥", RUB: "₽", KRW: "₩", AED: "د.إ", CHF: "CHF", BRL: "R$",
          ZAR: "R", SGD: "S$", MXN: "$", SEK: "kr", NOK: "kr", DKK: "kr", PLN: "zł",
          TRY: "₺", NZD: "NZ$", HKD: "HK$", ILS: "₪", ARS: "$", CLP: "$", COP: "$",
          THB: "฿", MYR: "RM", IDR: "Rp", PHP: "₱", EGP: "£", NGN: "₦", PKR: "₨",
          BDT: "৳", LKR: "රු", UAH: "₴", RON: "lei", HUF: "Ft", CZK: "Kč", ISK: "kr",
          BHD: ".د.ب", QAR: "ر.ق", KWD: "د.ك", OMR: "ر.ع.", SAR: "﷼", MAD: "د.م.",
          TND: "د.ت", KES: "KSh", GHS: "₵", TZS: "TSh", UGX: "USh", ZMW: "ZK",
          ZWL: "Z$", ETB: "Br", XOF: "CFA", XAF: "FCFA", GNF: "FG", LRD: "$",
          MWK: "MK", MZN: "MTn", NAD: "N$", BWP: "P", LSL: "L", CDF: "FC",
          AOA: "Kz", PYG: "₲", UYU: "$U", VES: "Bs.",
        };

        const currency = currencyMap[countryCode] || "INR";
        const symbol = currencySymbols[currency] || `${currency} `;

        console.log("💱 Target currency:", currency);

        if (currency === "INR") {
          return { symbol: currencySymbols.INR, rate: 1, converted: inrAmount };
        }

        console.log("🔁 Fetching conversion rate...");
        const res = await fetch(`https://open.er-api.com/v6/latest/INR`);
        const json = await res.json();

        let rate = 1;
        if (json.result === "success" && json.rates && json.rates[currency]) {
          rate = json.rates[currency];
        } else {
          throw new Error("Conversion rate unavailable or API error.");
        }

        const converted = (inrAmount * rate).toFixed(2);

        console.log(`💰 Conversion rate: 1 INR = ${rate} ${currency}`);
        console.log(`💵 Converted amount: ${converted} ${currencySymbols[currency] || currency}`);

        return {
          symbol: currencySymbols[currency] || currency + " ",
          rate,
          converted
        };

      } catch (err) {
        console.warn("⚠️ Currency conversion failed:", err);
        return { symbol: "₹", rate: 1, converted: inrAmount };
      }
    }

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

        priceInfo = await convertINRToLocalCurrency(device.basePriceINR);
        const priceEl = document.getElementById("device-price");
        priceEl.textContent = `${priceInfo.symbol}${priceInfo.converted}`;
        priceEl.dataset.currencySymbol = priceInfo.symbol;
        priceEl.dataset.conversionRate = priceInfo.rate;

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

        // Supported Features
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

  const converted = (total * priceInfo.rate).toFixed(2);
  const totalEl = document.getElementById("totalPrice");
  totalEl.textContent = `${priceInfo.symbol}${converted}`;
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

let correctAnswer = 0;

function generateCaptcha() {
  correctAnswer = Math.floor(100000 + Math.random() * 900000);
  document.getElementById("mathQuestion").textContent = `${correctAnswer}`;
}

window.onload = generateCaptcha;


async function submitOrder() {
  emailjs.init("Q3G4KXCFoIETcKR5v");
  if (!device) return;

  const name = document.getElementById("userName").value.trim();
  const phone = document.getElementById("userPhone").value.trim();
  const address = document.getElementById("userAddress").value.trim();
  let rawTelegram = document.getElementById("userTelegram").value.trim();
  if (rawTelegram.startsWith("@")) rawTelegram = rawTelegram.slice(1);
  const telegram = `https://t.me/${rawTelegram}`;
  const email = document.getElementById("userEmail").value.trim();
  const customROM = document.getElementById("customROM").value;
  const ramRom = document.getElementById("ramRomSelect").value;
  const android = document.getElementById("androidSelect").value.replace("Android ", "");
  const variant = `${ramRom} · Android ${android}`;
  const accessories = Array.from(document.querySelectorAll("#accessory-options input:checked"))
    .map(input => input.value);

  let totalRaw = document.getElementById("totalPrice")?.textContent || "0";
  totalRaw = totalRaw.replace(/[^\d.]/g, ""); // remove ₹, commas, spaces
  const total = parseFloat(totalRaw || "0").toFixed(2);

  // ✅ Email Validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Telegram validation
  if (!/^@?[a-zA-Z0-9_]{5,32}$/.test(rawTelegram)) {
    alert("Please enter a valid Telegram username (5–32 letters, numbers, or _ only).");
    return;
  }

  const time = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour12: true,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const templateParams = {
    name: name,
    time: time,
    short_device_info: `${device.name}`,
    device_info: `${device.name} · ${variant}`,
    custom_rom: customROM,
    accessories: accessories.join(", ") || "None",
    total_price: total,
    phone: phone,
    telegram: telegram,
    email: email,
    address: address
  };

  // Captcha check
  const userAnswer = document.getElementById("mathCaptcha").value.trim();
  if (userAnswer !== String(correctAnswer)) {
    alert("Captcha incorrect. Try again.");
    generateCaptcha();
    return;
  }

  const submitBtn = document.getElementById("submitOrderButton");
  submitBtn.disabled = true;
  submitBtn.textContent = "Processing...";

  try {
    // Step 1: Send email via EmailJS
    await emailjs.send("service_nethunterdevices", "template_8xam1cc", templateParams);

    // Step 2: Get PayU hash from Cloudflare Worker
    const txnid = "TXN" + Date.now();
    let safeProductInfo = `${device.name} - ${variant}`
      .replace(/·/g, "-") // Replace middle dot with dash
      .replace(/[^\x20-\x7E]/g, "") // Remove non-ASCII chars
      .trim();
    console.log("🛒 Safe Product Info for PayU:", safeProductInfo);
    
    const res = await fetch("https://payment.viperkernels.workers.dev", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        txnid,
        amount: total,
        productinfo: safeProductInfo,
        firstname: name,
        email: email
      })
    });

    const data = await res.json();

    // Step 3: Create and submit PayU form
    const payuForm = document.createElement("form");
    payuForm.action = "https://test.payu.in/_payment";
    payuForm.method = "post";

    const fields = {
      key: data.key,
      txnid: txnid,
      amount: total,
      productinfo: safeProductInfo,
      firstname: name,
      email: email,
      phone: phone,
      surl: "https://payment-result.viperkernels.workers.dev",
      furl: "https://payment-result.viperkernels.workers.dev",
      hash: data.hash
    };
    
    for (const key in fields) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = fields[key];
      payuForm.appendChild(input);
    }

    document.body.appendChild(payuForm);
    payuForm.submit();

  } catch (err) {
    console.error("Order submission error:", err);
    alert("Something went wrong. Please try again.");
    generateCaptcha();
    submitBtn.disabled = false;
    submitBtn.textContent = "Buy Now!";
  }
}
