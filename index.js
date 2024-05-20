#! /usr/bin/env node
import inquirer from "inquirer";
import axios from "axios";
const API_URL = "https://api.exchangerate-api.com/v4/latest/";
async function getExchangeRates(baseCurrency) {
    try {
        const response = await axios.get(`${API_URL}${baseCurrency}`);
        return response.data.rates;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Error fetching exchange rates: ${error.message}`);
        }
        else {
            throw new Error("Unknown error occurred while fetching exchange rates.");
        }
    }
}
async function main() {
    try {
        const { amount, fromCurrency, toCurrency } = await inquirer.prompt([
            {
                type: "input",
                name: "amount",
                message: "Enter the amount of money:",
                validate: (input) => !isNaN(parseFloat(input)) || "Please enter a valid number.",
            },
            {
                type: "input",
                name: "fromCurrency",
                message: "Enter the currency code you are converting from (e.g., USD):",
                validate: (input) => input.length === 3 || "Please enter a valid 3-letter currency code.",
            },
            {
                type: "input",
                name: "toCurrency",
                message: "Enter the currency code you are converting to (e.g., EUR):",
                validate: (input) => input.length === 3 || "Please enter a valid 3-letter currency code.",
            },
        ]);
        const rates = await getExchangeRates(fromCurrency.toUpperCase());
        const conversionRate = rates[toCurrency.toUpperCase()];
        if (!conversionRate) {
            console.error("Unable to find conversion rate for the specified currency.");
            return;
        }
        const convertedAmount = parseFloat(amount) * conversionRate;
        console.log(`${amount} ${fromCurrency.toUpperCase()} is equal to ${convertedAmount.toFixed(2)} ${toCurrency.toUpperCase()}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log("An error occurred:", error.message);
        }
        else {
            console.log("An unknown error occurred.");
        }
    }
}
main();
