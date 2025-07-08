document.addEventListener("DOMContentLoaded", async function () {
    const priceEls = document.querySelectorAll(".price");
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

    try {
        console.log("🌍 Detecting location...");
        const geo = await fetch("https://ipapi.co/json/").then(r => r.json());
        const countryCode = (geo.country_code || "IN").toUpperCase();
        console.log("📍 Detected country:", geo.country_name, countryCode);      

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

        const currency = currencyMap[countryCode] || "INR";
        const symbol = currencySymbols[currency] || `${currency} `;

        let rate = 1;
        if (currency !== "INR") {
            console.log("🔁 Fetching conversion rate...");
            const res = await fetch(`https://open.er-api.com/v6/latest/INR`);
            const json = await res.json();

            if (json.result === "success" && json.rates && json.rates[currency]) {
                rate = json.rates[currency];
            } else {
                throw new Error("Conversion rate unavailable or API error.");
            }
        }

        console.log(`💰 Conversion rate: 1 INR = ${rate} ${currency}`);
        console.log(`🌐 Displaying prices in ${currency} (${symbol})`);

        // Convert and apply prices
        priceEls.forEach(el => {
            const inr = parseFloat(el.dataset.inr);
            if (!isNaN(inr)) {
                const rawConverted = inr * rate;
                const rounded = Math.round(rawConverted); // Round to nearest whole number
                el.textContent = `${symbol}${rounded}`;
                el.dataset.converted = rounded;
                el.dataset.currencySymbol = symbol;
                el.dataset.conversionRate = rate;

                console.log(`💵 ${inr} INR → ${symbol}${rounded} (raw: ${rawConverted})`);
            }
        });

    } catch (err) {
        console.warn("⚠️ Currency conversion failed:", err);
        console.log("💸 Falling back to INR");

        priceEls.forEach(el => {
            const inr = parseFloat(el.dataset.inr);
            if (!isNaN(inr)) {
                el.textContent = `₹${inr}`;
                el.dataset.converted = inr;
                el.dataset.currencySymbol = "₹";
                el.dataset.conversionRate = "1";
            }
        });
    }
});
