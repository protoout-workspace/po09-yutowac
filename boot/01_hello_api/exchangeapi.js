// main();
const main = async () => {
    // Fetch the latest exchange rates
    const res = await fetch('https://api.exchangeratesapi.io/latest', {
        method: 'GET'
    });
    const data = await res.json();

    // Define a list of fiat currency codes
    const fiatCurrencies = ['USD', 'JPY', 'EUR', 'GBP', 'AUD'];

    // Randomly select one fiat currency from the list
    const selectedCurrency = fiatCurrencies[Math.floor(Math.random() * fiatCurrencies.length)];

    // Display the name and current rate of the selected currency
    // Assuming EUR is the base currency for the API
    if (data && data.rates && data.rates[selectedCurrency]) {
        console.log(`Currency: ${selectedCurrency}, Current Rate (against EUR): ${data.rates[selectedCurrency]}`);
    } else {
        console.log(`Current rate for '${selectedCurrency}' not found.`);
    }
}

main();