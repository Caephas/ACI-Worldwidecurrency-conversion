"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetchRates_1 = require("./utils/fetchRates");
const processCSV_1 = require("./utils/processCSV");
function calculateTotalInUSD(transactions, rates) {
    return __awaiter(this, void 0, void 0, function* () {
        let total = 0;
        transactions.forEach((transaction) => {
            const rate = rates[transaction.currency];
            if (rate) {
                total += transaction.amount / rate; // Convert to USD
            }
            else {
                console.warn(`No rate found for ${transaction.currency}`);
            }
        });
        return total;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const rates = yield (0, fetchRates_1.fetchConversionRates)();
            const transactions = yield (0, processCSV_1.processCSV)('./subTask1.csv');
            const totalInUSD = yield calculateTotalInUSD(transactions, rates);
            console.log(`Total amount in USD: ${totalInUSD.toFixed(2)}`);
        }
        catch (error) {
            console.error('Error processing currency transactions:');
        }
    });
}
main();
