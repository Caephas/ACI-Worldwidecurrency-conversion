"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCSV = processCSV;
exports.processFeesCSV = processFeesCSV;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
function processCSV(filePath) {
    const transactions = [];
    return new Promise((resolve, reject) => {
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => {
            const transaction = {
                currency: row['currency'],
                amount: parseFloat(row['amount']),
            };
            transactions.push(transaction);
        })
            .on('end', () => {
            resolve(transactions);
        })
            .on('error', (error) => {
            reject(error);
        });
    });
}
function processFeesCSV(filePath) {
    const fees = [];
    return new Promise((resolve, reject) => {
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on('data', (row) => {
            const fee = {
                currency: row['currency'],
                feeRate: parseFloat(row['fee']),
            };
            fees.push(fee);
        })
            .on('end', () => {
            resolve(fees);
        })
            .on('error', (error) => {
            reject(error);
        });
    });
}
