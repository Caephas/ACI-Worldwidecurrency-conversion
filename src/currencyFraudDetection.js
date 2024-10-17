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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const fraudCurrencies = ['BTC', 'RUB', 'IRR', 'XAU'];
function processTransactionsCSV(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const transactions = [];
        return new Promise((resolve, reject) => {
            fs_1.default.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)())
                .on('data', (row) => {
                const transaction = {
                    origin: row['origin_account'],
                    destination: row['destination_account'],
                    originCurrency: row['origin_currency'],
                    destinationCurrency: row['destination_currency'],
                    amount: parseFloat(row['amount']),
                    unixTime: parseInt(row['unix_time'], 10),
                };
                transactions.push(transaction);
            })
                .on('end', () => resolve(transactions))
                .on('error', (error) => reject(error));
        });
    });
}
function updateAccountScore(account, transaction) {
    const amountUSD = transaction.amount;
    // Rule: Add base score for amounts over 5000 USD
    if (amountUSD > 5000) {
        account.score += 5; // For the destination
        account.score += 10; // For the origin
        account.score += (amountUSD - 5000) * 0.5; // Penalty for excess amount
    }
    // Rule: Add large penalty for fraud currencies
    if (fraudCurrencies.includes(transaction.originCurrency) || fraudCurrencies.includes(transaction.destinationCurrency)) {
        account.score += 10000;
    }
    // Convert Unix time to a human-readable date (YYYY-MM-DD)
    const date = new Date(transaction.unixTime * 1000).toISOString().split('T')[0];
    // Update total transaction amount for that day
    account.transactionsByDate[date] = (account.transactionsByDate[date] || 0) + amountUSD;
    account.totalAmount += amountUSD;
}
function isBlacklisted(account) {
    // Rule: Blacklist accounts with a score greater than 5000
    if (account.score > 5000) {
        return true;
    }
    // Rule: Blacklist if score > 2000 and daily transactions exceed 85,000 USD
    const highTransactionDays = Object.values(account.transactionsByDate).filter(total => total > 85000);
    if (account.score > 2000 && highTransactionDays.length > 0) {
        return true;
    }
    return false;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transactions = yield processTransactionsCSV('./subTask3.csv');
            const accounts = {};
            transactions.forEach(transaction => {
                // Initialize accounts if not existing
                const originAccount = accounts[transaction.origin] || { score: 0, totalAmount: 0, transactionsByDate: {} };
                const destinationAccount = accounts[transaction.destination] || { score: 0, totalAmount: 0, transactionsByDate: {} };
                // Update both origin and destination accounts
                updateAccountScore(originAccount, transaction);
                updateAccountScore(destinationAccount, transaction);
                accounts[transaction.origin] = originAccount;
                accounts[transaction.destination] = destinationAccount;
            });
            // Determine blacklisted accounts
            const blacklistedAccounts = Object.keys(accounts).filter(accountId => isBlacklisted(accounts[accountId]));
            // Find transactions involving blacklisted accounts
            const blacklistedTransactions = transactions.filter(transaction => blacklistedAccounts.includes(transaction.origin) || blacklistedAccounts.includes(transaction.destination));
            console.log(`Number of transactions involving blacklisted accounts: ${blacklistedTransactions.length}`);
        }
        catch (error) {
            console.error('Error processing transactions:');
        }
    });
}
main();
