const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromcurr = document.querySelector(".from select");
const tocurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapBtn = document.querySelector(".fa-arrow-right-arrow-left");

// Populate currency dropdowns
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");

        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        }

        if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
        updateExchangeRate();
    });
}

// Update country flag
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];

    let img = element.parentElement.querySelector("img");

    if (countryCode) {
        img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    }
};

// Fetch exchange rate
const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal <= 0) {
        amtVal = 1;
        amount.value = 1;
    }

    try {
        const URL = `${BASE_URL}/${fromcurr.value}`;

        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error("Failed to fetch exchange rate");
        }

        const data = await response.json();

        const rate = data.rates[tocurr.value];

        if (!rate) {
            throw new Error("Currency rate not found");
        }

        const finalAmount = amtVal * rate;

        msg.innerText =
            `${amtVal} ${fromcurr.value} = ${finalAmount.toFixed(2)} ${tocurr.value}`;

    } catch (error) {
        console.error(error);
        msg.innerText = "Unable to fetch exchange rate.";
    }
};

// Button click
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

// Swap currencies
if (swapBtn) {
    swapBtn.addEventListener("click", () => {
        let temp = fromcurr.value;
        fromcurr.value = tocurr.value;
        tocurr.value = temp;

        updateFlag(fromcurr);
        updateFlag(tocurr);
        updateExchangeRate();
    });
}

// Load default values
window.addEventListener("load", () => {
    updateFlag(fromcurr);
    updateFlag(tocurr);
    updateExchangeRate();
});